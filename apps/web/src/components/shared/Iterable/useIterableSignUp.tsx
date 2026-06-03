import { useCallback, useState } from "react";

const ITERABLE_BASE_URL =
  "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=";

async function sendFormRequest(
  actionUrl: string,
  dataObject: Record<string, string>,
) {
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

interface ActionFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  action: string;
  target?: string;
  method?: string;
}

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

interface IterableSchema {
  isValidSync: (_values: unknown) => boolean;
}

interface UseIterableSignUpOptions {
  formId: string;
  schema: IterableSchema;
  initialValues: Record<string, string>;
}

export default function useIterableSignUp({
  formId,
  schema,
  initialValues,
}: UseIterableSignUpOptions) {
  const [state, setState] = useState<Record<string, string>>(initialValues);

  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
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
        setError(error as Error);
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
