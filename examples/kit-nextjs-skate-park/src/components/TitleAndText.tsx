import React from 'react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';

interface Fields {
  Title: Field<string>;
  Text: Field<string>;
}

type TitleAndTextProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: TitleAndTextProps): React.ReactElement => {
  return (
    <>
      <Text field={props.fields.Title} />
      <Text field={props.fields.Text} />
    </>
  );
};
