import {
  useCallback,
  useState,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import type { AnySchema } from "yup";

const ITERABLE_BASE_URL =
  "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=";

async function sendFormRequest(
  actionUrl: string,
  dataObject: Record<string, string>,
): Promise<void> {
  const data = new FormData();

  Object.keys(dataObject).map((key) => {
    data.append(key, dataObject[key]);
  });

  const request = new Request(actionUrl, {
    method: "POST",
    body: data,
  });

  const response = await fetch(request);

  if (!response.ok) {
    await Promise.reject(response);
  }
}

type ActionFormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
  action?: string;
};

export function ActionForm({
  children,
  action,
  target = "_blank",
  method = "post",
  ...props
}: ActionFormProps) {
  return (
    <form action={action} method={method} target={target} {...props}>
      {children}
    </form>
  );
}

type UseIterableSignUpArgs = {
  formId: string;
  schema: AnySchema;
  initialValues: Record<string, string>;
};

export default function useIterableSignUp({
  formId,
  schema,
  initialValues,
}: UseIterableSignUpArgs) {
  const [state, setState] = useState<Record<string, string>>(initialValues);

  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const actionUrl = `${ITERABLE_BASE_URL}${formId}`;

  const onValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      setIsDirty(!!value);
      setIsSubmitting(false);
      setError(null);
      setIsSuccess(false);
    },
    [],
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent | React.MouseEvent) => {
      e.preventDefault();

      setIsDirty(true);
      setIsSubmitting(true);
      setError(null);
      setIsSuccess(false);

      if (!schema.isValidSync(state)) {
        return;
      }

      try {
        setIsLoading(true);
        await sendFormRequest(actionUrl, state);
        setIsSuccess(true);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [state, actionUrl, schema],
  );

  return {
    actionUrl,
    values: state,
    onValueChange,
    onSubmit,
    error,
    isSuccess,
    isLoading,
    isDirty,
    isSubmitting,
  };
}
