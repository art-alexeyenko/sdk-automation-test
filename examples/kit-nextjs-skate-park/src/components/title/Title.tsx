import { TextField } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { Text } from "@sitecore-content-sdk/nextjs";

interface TitleProps extends ComponentProps {
  fields: {
    Quote: TextField;
  };
}

export default function Default({ fields }: TitleProps) {
  const { Quote } = fields;

  return (
    <>
      <Text field={Quote} />
    </>
  );
}