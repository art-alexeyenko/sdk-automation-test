import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Vercel Node function entry for the Angular SSR server.
 *
 * TEMPORARY DIAGNOSTIC BUILD: emits `x-ssr-*` response headers so the runtime state on
 * Vercel (cwd, resolved bundle path, the URL Angular actually sees) can be read with a
 * plain `curl -I`. Remove the header block once the 404-status issue is resolved.
 *
 * Background: the Angular server bundle (`server.mjs`) resolves its render assets relative
 * to its own `import.meta` dir, so it must run as a real file (not inlined by Vercel's
 * bundler). It is loaded via a computed specifier and shipped via `functions.includeFiles`.
 */
const SERVER_REL = 'dist/content-sdk-angular/server/server.mjs';
const here = dirname(fileURLToPath(import.meta.url));

const candidatePaths = [
  join(process.cwd(), SERVER_REL),
  join(process.cwd(), 'examples/angular', SERVER_REL),
  join(here, '..', SERVER_REL),
  join(here, SERVER_REL),
];

/**
 * Resolve the absolute path to the built Angular server bundle, or `null` if none of the
 * candidate locations exist (reported via diagnostic header instead of throwing).
 * @returns {string | null} Absolute path to `server.mjs`, or null.
 */
function resolveServerEntry() {
  return candidatePaths.find((candidate) => existsSync(candidate)) ?? null;
}

let handlerPromise;
/**
 * @param {string} entry - Absolute path to the server bundle.
 * @returns {Promise<Function>} The Express-backed request handler.
 */
function loadHandler(entry) {
  if (!handlerPromise) {
    handlerPromise = import(pathToFileURL(entry).href).then((module) => module.default);
  }
  return handlerPromise;
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export default async function handler(req, res) {
  const entry = resolveServerEntry();

  // Diagnostic headers — safe to read with `curl -I`, removed after the fix is confirmed.
  res.setHeader('x-ssr-cwd', process.cwd());
  res.setHeader('x-ssr-entry-here', here);
  res.setHeader('x-ssr-entry', entry ?? 'NOT_FOUND');
  res.setHeader('x-ssr-url', req.url ?? '');

  if (!entry) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end(
      `Angular server bundle not found. cwd=${process.cwd()} here=${here}\nTried:\n` +
        candidatePaths.map((candidate) => `  - ${candidate}`).join('\n')
    );
    return;
  }

  const reqHandler = await loadHandler(entry);
  return reqHandler(req, res);
}
