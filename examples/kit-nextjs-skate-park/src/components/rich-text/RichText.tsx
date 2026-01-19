import React, { JSX } from 'react';
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Text: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ fields }: RichTextProps): JSX.Element => {
  return (
    <>
      {fields ? (
        <ContentSdkRichText field={fields.Text} />
      ) : (
        <span className="is-empty-hint">Rich text</span>
      )}
    </>
  );
};
