import { TextField } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { Text } from "@sitecore-content-sdk/nextjs";

interface RichTextProps extends ComponentProps {
  fields: {
    Quote: TextField;
  };
}

export default function Default({ fields }: RichTextProps) {
  const { Quote } = fields;

  return (
    <>
      <Text field={Quote} />
    </>
  );
}