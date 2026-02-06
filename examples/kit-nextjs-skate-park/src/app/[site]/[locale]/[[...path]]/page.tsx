import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { Suspense } from 'react';
import client from 'src/lib/sitecore-client';
import Layout, { RouteFields } from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import 'assets/main.css';

type PageProps = {
  params: Promise<{ site: string; locale: string; path?: string[]; [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Part of page component that handles dynamic data, like the `draftMode()` call and data fetching.
// This component is wrapped in Suspense to enable Next.js 16 Partial Prerendering (PPR),
// which allows streaming dynamic content while keeping static parts prerendered.
// This pattern also works seamlessly when Cache Components is enabled.
async function DynamicPageContent({ site, locale, path, searchParams }: { site: string; locale: string; path?: string[]; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const draft = await draftMode();

  // Fetch the page data from Sitecore
  let page;
  if (draft.isEnabled) {
    const editingParams = await searchParams;
    if (isDesignLibraryPreviewData(editingParams)) {
      page = await client.getDesignLibraryData(editingParams);
    } else {
      page = await client.getPreview(editingParams);
    }
  } else {
    page = await client.getPage(path ?? [], { site, locale });
  }

  // If the page is not found, return a 404
  if (!page) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <Providers page={page}>
        <Layout page={page} />
      </Providers>
    </NextIntlClientProvider>
  );
}

export default async function Page({ params, searchParams }: PageProps) {
  const { site, locale, path } = await params;

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  // Wrap dynamic content in Suspense to enable Next.js 16 Partial Prerendering (PPR).
  // PPR allows streaming dynamic content while keeping static parts prerendered for better performance.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicPageContent site={site} locale={locale} path={path} searchParams={searchParams} />
    </Suspense>
  );
}

// Metadata fields for the page.
export const generateMetadata = async ({ params }: PageProps) => {
  const { path, site, locale } = await params;

  // The same call as for rendering the page. Should be cached by default react behavior
  const page = await client.getPage(path ?? [], { site, locale });
  return {
    title: (page?.layout.sitecore.route?.fields as RouteFields)?.Title?.value?.toString() || 'Page',
  };
};
