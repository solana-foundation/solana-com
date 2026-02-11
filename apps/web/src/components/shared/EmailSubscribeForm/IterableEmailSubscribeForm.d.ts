import { ComponentType, RefObject } from "react";
import { ObjectSchema } from "yup";

interface EmailSubscribeFormProps {
  formId: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  schema?: ObjectSchema<{ email: string }>;
  initialValues?: { email: string };
  placeholderTextID?: string;
  ctaTextID?: string;
}

declare const IterableEmailSubscribeForm: ComponentType<EmailSubscribeFormProps>;
export default IterableEmailSubscribeForm;
