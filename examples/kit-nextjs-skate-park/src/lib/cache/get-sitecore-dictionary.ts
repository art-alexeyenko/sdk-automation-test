import { buildSitecoreDictionaryCacheTag, DictionaryPhrases } from '@sitecore-content-sdk/nextjs';
import { cacheTag } from 'next/cache';
import client from 'src/lib/sitecore-client';

type GetSitecoreDictionaryParams = {
  site: string;
  locale: string;
};

/**
 * Fetches dictionary phrases using Next.js Cache Components and a deterministic dictionary tag.
 */
export async function getSitecoreDictionary(params: GetSitecoreDictionaryParams): Promise<DictionaryPhrases> {
  'use cache';

  const { site, locale } = params;
  cacheTag(buildSitecoreDictionaryCacheTag({ site, locale }));

  // client.getDictionary throws (rather than returning an empty result) when the Edge platform
  // returns an HTTP 404 "sitecoreContextId does not contain an edge resource". This happens on
  // fresh XM Cloud projects where content hasn't been published to Edge yet.
  try {
    return client.getDictionary({ site, locale });
  } catch {
    return {};
  }
}
