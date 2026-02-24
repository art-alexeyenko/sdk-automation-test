import { JSX } from 'react';
import React from 'react';
import {
  Image as ContentSdkImage,
  RichText as ContentSdkRichText,
  Link as ContentSdkLink,
  ImageField,
  Field,
  LinkField,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  PromoIcon?: ImageField;
  PromoText?: Field<string>;
  PromoLink?: LinkField;
  PromoText2?: Field<string>;
  PromoText3?: Field<string>;
  PromoIcon2?: ImageField;
}

interface SquareImageProps {
  fields?: Fields;
  params?: {
    styles?: string;
    RenderingIdentifier?: string;
    [key: string]: string | undefined;
  };
  rendering?: unknown;
}

const PromoWrapper = ({
  children,
  styles,
  id,
}: {
  children: React.ReactNode;
  styles: string;
  id?: string;
}): JSX.Element => (
  <div className={`component promo ${styles} flex flex-col items-center`} id={id}>
    <div className="component-content flex flex-col items-center gap-4">
      {children}
    </div>
  </div>
);

export const SquareImage = ({
  fields,
  params = {},
}: SquareImageProps = {
  fields: undefined,
  params: {},
}): JSX.Element => {
  const styles = params.styles ?? '';
  const id = params.RenderingIdentifier;

  if (!fields) {
    return (
      <PromoWrapper styles={styles} id={id}>
        <span className="is-empty-hint">Promo</span>
      </PromoWrapper>
    );
  }

  return (
    <PromoWrapper styles={styles} id={id}>
      <>
        <div className="field-promoicon rounded-full overflow-hidden">
          {fields.PromoIcon ? (
            <ContentSdkImage
              field={fields.PromoIcon}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="promo-text flex w-full flex-col items-center gap-2 text-blue-600">
          <div className="field-promotext w-full">
            {fields.PromoText ? (
              <ContentSdkRichText className="text-blue-600" field={fields.PromoText} />
            ) : null}
          </div>
          <div className="field-promolink">
            {fields.PromoLink ? (
              <ContentSdkLink className="text-red-600 underline" field={fields.PromoLink} />
            ) : null}
          </div>
        </div>
      </>
    </PromoWrapper>
  );
};
