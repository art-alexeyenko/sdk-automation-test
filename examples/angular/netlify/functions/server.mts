import serverless from 'serverless-http';
import type { Context } from '@netlify/functions';
import { default as app } from '../../dist/content-sdk-angular/server/server.mjs';

const handler = serverless(app);
const FUNCTION_BASE = '/.netlify/functions/server';

/** serverless-http's result for a Lambda Function URL ("2.0") event. */
interface LambdaResult {
  statusCode: number;
  headers: Record<string, string>;
  cookies: string[];
  body: string;
  isBase64Encoded: boolean;
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  // Strip the function base path for direct invocations; rewrites arrive with the original path.
  const path = url.pathname.startsWith(FUNCTION_BASE)
    ? url.pathname.slice(FUNCTION_BASE.length) || '/'
    : url.pathname;

  const lambdaRequest = {
    version: '2.0',
    rawPath: path,
    rawQueryString: url.searchParams.toString(),
    headers: Object.fromEntries(request.headers),
    requestContext: { http: { method: request.method } },
    body: Buffer.from(await request.arrayBuffer()),
  };

  const result = (await handler(lambdaRequest, context)) as LambdaResult;

  const headers = new Headers(result.headers);
  for (const cookie of result.cookies) headers.append('set-cookie', cookie);

  return new Response(
    result.isBase64Encoded ? Buffer.from(result.body, 'base64') : result.body || null,
    { status: result.statusCode, headers }
  );
};
