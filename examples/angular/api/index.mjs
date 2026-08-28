import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Vercel Node function entry for the Angular SSR server.
 *
 * The Angular server bundle (`server.mjs`) locates its render assets — `index.server.html`
 * and the sibling `../browser` folder — relative to its own `import.meta` directory. If
 * Vercel's `@vercel/node` (esbuild) bundler inlines the bundle into this entry file, that
 * relative base shifts and Angular can no longer find those assets; it then silently
 * degrades to serving the empty client shell (`index.csr.html`) with HTTP 200 for every
 * route (so `/404` returns 200 and 404s resolve only client-side).
 *
 * The fix loads the bundle dynamically from its real on-disk path so it runs as its own
 * file with `import.meta` intact. The specifier is computed (not a literal) so the bundler
 * won't inline it; the files ship via the `functions.includeFiles` glob in `vercel.json`.
 *
 * `includeFiles` preserves paths relative to the Vercel *project root*, which at runtime is
 * `process.cwd()` (`/var/task` on Vercel). But the sub-path under it depends on the project's
 * Root Directory setting (repo root vs. `examples/angular`) and on whether the bundler kept
 * this entry at `/api`. Rather than assume, probe the known candidate locations and use the
 * first that exists — mirroring the resolution strategy in `src/load-env.ts`.
 */
const SERVER_REL = 'dist/content-sdk-angular/server/server.mjs';
const here = dirname(fileURLToPath(import.meta.url));

const candidatePaths = [
  join(process.cwd(), SERVER_REL), // Root Directory = examples/angular  -> /var/task/dist/...
  join(process.cwd(), 'examples/angular', SERVER_REL), // Root Directory = repo root -> /var/task/examples/angular/dist/...
  join(here, '..', SERVER_REL), // relative to this entry at /api/
  join(here, SERVER_REL), // entry colocated with dist
];

/**
 * Resolve the absolute path to the built Angular server bundle, failing fast with the
 * probed locations if it cannot be found (so a packaging regression is obvious in logs).
 * @returns {string} Absolute path to `server.mjs`.
 */
function resolveServerEntry() {
  const found = candidatePaths.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      `Angular server bundle not found. cwd=${process.cwd()} entry=${here}. Tried:\n` +
        candidatePaths.map((candidate) => `  - ${candidate}`).join('\n')
    );
  }
  return found;
}

let handlerPromise;
function loadHandler() {
  if (!handlerPromise) {
    handlerPromise = import(pathToFileURL(resolveServerEntry()).href).then((module) => module.default);
  }
  return handlerPromise;
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export default async function handler(req, res) {
  const reqHandler = await loadHandler();
  return reqHandler(req, res);
}
