'use client';
import { JSX } from 'react';
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { useTranslations } from 'next-intl';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Text: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields: Fields;
};

const DictionaryPhrase = ({ siteName }: { siteName: string }) => {
  try {
    const t = useTranslations(siteName);
    return (
      <p className="dictionaryPhrase" style={{ marginTop: '1rem', fontStyle: 'italic' }}>
        Dictionary &quot;Welcome&quot;: {t('Welcome')}
      </p>
    );
  } catch {
    // Silently fail during prerender when dictionary isn't available
    return null;
  }
};

export const Default = ({ params, fields }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;
  const siteName = process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || 'redirect';

  return (
    <div className={`component rich-text ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {fields ? (
          <ContentSdkRichText field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
        {/* Dictionary phrase from Sitecore - for testing dictionary revalidation */}
        <DictionaryPhrase siteName={siteName} />
      </div>
    </div>
  );
};

export const Red = ({ params, fields }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;
  const siteName = process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || 'redirect';

  return (
    <div className={`component rich-text ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {fields ? (
          <ContentSdkRichText className="text-red-600" field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
        {/* Dictionary phrase from Sitecore - for testing dictionary revalidation */}
        <DictionaryPhrase siteName={siteName} />
      </div>
    </div>
  );
};
