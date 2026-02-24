import React, { JSX } from 'react';
import { RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import type { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Text: Field<string>;
}

export type BlueRichTextProps = ComponentProps & {
  fields?: Fields;
};

export const BlueRichText = ({ params = {}, fields = undefined }: BlueRichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;
  const content = fields?.Text ? (
    <ContentSdkRichText field={fields.Text} />
  ) : (
    <span className="is-empty-hint">Rich text</span>
  );

  return (
    <div className={`component rich-text text-blue-500 ${styles || ''}`} id={RenderingIdentifier}>
      <div className="component-content">{content}</div>
    </div>
  );
};
