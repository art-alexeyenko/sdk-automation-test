import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

/**
 * Vercel Node function entry for the Angular SSR server.
 *
 * The Angular server bundle (`server.mjs`) locates its render assets — `index.server.html`
 * and the sibling `../browser` folder — relative to its own `import.meta` directory. If
 * Vercel's `@vercel/node` (esbuild) bundler inlines the bundle into this entry file, that
 * relative base shifts to the wrong depth, Angular can no longer find those assets, and it
 * silently degrades to serving the empty client shell (`index.csr.html`) with HTTP 200 for
 * every route (so `/404` returns 200 and 404s resolve only client-side).
 *
 * Loading the bundle dynamically from its real on-disk path (a computed, non-literal
 * specifier the bundler won't statically inline; the files are shipped via the
 * `functions.includeFiles` glob in `vercel.json`) keeps `import.meta` anchored to the
 * original location, so SSR renders server-side and emits correct status codes.
 *
 * @returns {Promise<import('@angular/ssr/node').NodeRequestHandlerFunction>} the Express-backed handler
 */
let handlerPromise;
function loadHandler() {
  if (!handlerPromise) {
    const serverEntry = join(process.cwd(), 'dist/content-sdk-angular/server/server.mjs');
    handlerPromise = import(pathToFileURL(serverEntry).href).then((module) => module.default);
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
