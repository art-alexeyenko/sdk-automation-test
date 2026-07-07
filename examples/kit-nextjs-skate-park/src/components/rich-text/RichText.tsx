import { JSX } from 'react';
import { Field, RichText as ContentSdkRichText, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Text: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  return (
    <div className={`component rich-text ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {fields ? (
          <ContentSdkRichText field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
      </div>
    </div>
  );
};

/**
 * Test variant for verifying the Text component encode={false} + newline fix.
 * TC-1: multiline with HTML after newline — should render a <br> and a clickable link, NOT [object Object]
 * TC-3: multiline plain text — newlines should become <br> tags
 */
export const TextEncodeTest = ({ params }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  const tc1Field = { value: 'Line one\n<a href="#"> Hola </a>' };
  const tc3Field = { value: 'xxx\n\naa\nbbb\ndd' };

  return (
    <div className={`component rich-text ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        <p>TC-1: multiline with HTML — expect link on second line, no [object Object]</p>
        <Text field={tc1Field} encode={false} />
        <hr />
        <p>TC-3: multiline plain text — expect each newline to become a &lt;br&gt;</p>
        <Text field={tc3Field} encode={false} />
      </div>
    </div>
  );
};

export const Red = ({ params, fields }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  return (
    <div className={`component rich-text ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {fields ? (
          <ContentSdkRichText className="text-red-600" field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
      </div>
    </div>
  );
};
