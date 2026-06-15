import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 * See the documentation for `defineConfig`:
 * https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 *
 * DictionaryService in-process memory cache is disabled: it is separate from Next.js Cache Components
 * (`use cache` / `cacheTag`) and is not cleared by `revalidateTag`. This template relies on tag-based
 * dictionary caching in `getSitecoreDictionary` instead.
 */
export default defineConfig({
  defaultSite: process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || 'redirect',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  dictionary: {
    caching: {
      enabled: false,
    },
  },
});
