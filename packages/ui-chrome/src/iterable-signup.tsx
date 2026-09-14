"use client";

import {
  useCallback,
  useState,
  type FormEvent,
  type FormHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { getIterableActionUrl, sendIterableFormRequest } from "./iterable";

export interface IterableSchema {
  isValidSync: (values: unknown) => boolean;
}

export interface IterableActionFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  action: string;
  target?: string;
  method?: string;
}

export function IterableActionForm({
  children,
  action,
  target = "_blank",
  method = "post",
  ...props
}: IterableActionFormProps) {
  return (
    <form action={action} method={method} target={target} {...props}>
      {children}
    </form>
  );
}

export interface UseIterableSignUpOptions {
  formId: string;
  schema: IterableSchema;
  initialValues: Record<string, string>;
}

export function useIterableSignUp({
  formId,
  schema,
  initialValues,
}: UseIterableSignUpOptions) {
  const [state, setState] = useState<Record<string, string>>(initialValues);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const actionUrl = getIterableActionUrl(formId);

  const onValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      setState((previousState) => ({
        ...previousState,
        [name]: value,
      }));
      setIsDirty(Boolean(value));
      setIsSubmitting(false);
      setError(null);
      setIsSuccess(false);
    },
    [],
  );

  const onSubmit = useCallback(
    async (event: FormEvent | MouseEvent) => {
      event.preventDefault();

      setIsDirty(true);
      setIsSubmitting(true);
      setError(null);
      setIsSuccess(false);

      if (!schema.isValidSync(state)) {
        return;
      }

      try {
        setIsLoading(true);
        await sendIterableFormRequest(actionUrl, state);
        setIsSuccess(true);
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError
            : new Error("Iterable form submission failed"),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [actionUrl, schema, state],
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
