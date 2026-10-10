import { useCallback, useState, useEffect } from "react";
import { Input, Button } from "@workspace/ui";
import {
  getIterableActionUrl,
  sendIterableFormRequest,
} from "@solana-com/ui-chrome/iterable";
import { trackLead } from "@solana-com/ui-chrome/analytics";
import { useTranslations } from "next-intl";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";

interface FormField {
  value: string;
  error?: boolean;
  required?: boolean;
}

type FormValues = Record<string, FormField>;

interface ArtistsAndCreatorsNewsletterProps {
  modalCloseHandler?: (() => void) | null;
  modalActionCompleted: React.MutableRefObject<boolean>;
}

function NewsletterField({
  label,
  name,
  placeholder,
  helperText,
  error,
  onChange,
  className,
}: {
  label: string;
  name: string;
  placeholder: string;
  helperText: string;
  error?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm text-white">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type={name === "email" ? "email" : "text"}
        autoComplete={
          name === "email"
            ? "email"
            : name === "firstName"
              ? "given-name"
              : "family-name"
        }
        placeholder={placeholder}
        aria-invalid={error}
        aria-describedby={helperText ? `${name}-error` : undefined}
        className="h-11 rounded-full border-white/20 bg-[#111114] px-4 text-white placeholder:text-[#ABABBA]"
        onChange={onChange}
      />
      {helperText && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

const ArtistsAndCreatorsNewsletter = ({
  modalCloseHandler = null,
  modalActionCompleted,
}: ArtistsAndCreatorsNewsletterProps) => {
  const actionUrl = getIterableActionUrl(
    "94b90b1b-b29a-4ad7-9b3b-87331601d030",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | false>(false);
  const t = useTranslations();

  const [values, setValues] = useState<FormValues>({
    email: {
      value: "",
      error: false,
      required: true,
    },
    firstName: {
      value: "",
      error: false,
      required: true,
    },
    lastName: {
      value: "",
      error: false,
      required: true,
    },
    source: {
      value: "",
    },
  });

  const validate = async () => {
    let isValid = true;
    const updatedValues = { ...values };
    const veryBasicEmailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    Object.keys(values).forEach((key) => {
      if (key === "email" && !veryBasicEmailCheck.test(values.email.value)) {
        updatedValues.email.error = true;
        isValid = false;
      } else if (
        values[key].required &&
        (!values[key].value || values[key].value === "")
      ) {
        updatedValues[key].error = true;
        isValid = false;
      }
    });

    setValues(updatedValues);
    return isValid;
  };

  const onValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({
        ...current,
        [e.target.name]: {
          ...current[e.target.name],
          value: e.target.value,
          error: false,
        },
      }));
      setError(false);
    },
    [],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formIsValid = await validate();

    if (formIsValid) {
      const formState = Object.keys(values).reduce<Record<string, string>>(
        (acc, key) => {
          acc[key] = values[key].value;
          return acc;
        },
        {},
      );

      try {
        setIsSubmitting(true);
        await sendIterableFormRequest(actionUrl, formState);
        setIsSuccess(true);
        modalActionCompleted.current = true;

        trackLead({
          appName: "web",
          leadType: "newsletter",
          formId: "artists_and_creators_newsletter",
          placement: "modal",
        });
      } catch {
        setError("Something went wrong, please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (isSuccess && modalCloseHandler) {
      timeoutId = setTimeout(() => {
        modalCloseHandler();
      }, 5000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isSuccess, modalCloseHandler]);

  useEffect(() => {
    const source = `${window.location.protocol}//${window.location.hostname}${window.location.pathname}`;
    setValues((prevValues) => ({
      ...prevValues,
      source: {
        ...prevValues.source,
        value: source,
      },
    }));
  }, []);

  return (
    <section className="relative pb-6">
      <div className="container-xl pt-12 pb-4 md:pb-20 px-8 md:px-12 mx-auto relative">
        {isSuccess ? (
          <>
            <div className="flex justify-center">
              <div className="w-full lg:w-2/3">
                <DialogTitle asChild>
                  <h3 className="h3 font-normal text-center mb-6">
                    {t("artistsAndCreatorsNewsletter.form.success.title")}
                  </h3>
                </DialogTitle>
                <DialogDescription asChild>
                  <p className="text-xl font-light text-center mb-10">
                    {t("artistsAndCreatorsNewsletter.form.success.description")}
                  </p>
                </DialogDescription>
                <Button
                  size="lg"
                  className="mt-4 mx-auto flex rounded-full bg-[#14F195] font-brand-mono text-xs uppercase tracking-wide text-black hover:bg-[#14F195]/80"
                  onClick={() => modalCloseHandler?.()}
                >
                  {t("artistsAndCreatorsNewsletter.form.success.cta")}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="w-full lg:w-2/3 md:mb-6">
                <DialogTitle asChild>
                  <h3 className="h3 font-normal mb-6 text-center">
                    {t("artistsAndCreatorsNewsletter.title")}
                  </h3>
                </DialogTitle>
                <DialogDescription asChild>
                  <p className="text-xl font-light text-center mb-12">
                    {t("artistsAndCreatorsNewsletter.description")}
                  </p>
                </DialogDescription>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full lg:w-1/2">
                <form onSubmit={onSubmit}>
                  <NewsletterField
                    label={t("artistsAndCreatorsNewsletter.form.email.label")}
                    name="email"
                    placeholder={t(
                      "artistsAndCreatorsNewsletter.form.email.placeholder",
                    )}
                    className="w-full mb-4"
                    helperText={
                      values.email.error
                        ? t("artistsAndCreatorsNewsletter.form.email.error")
                        : ""
                    }
                    error={values.email.error}
                    onChange={onValueChange}
                  />
                  <NewsletterField
                    label={t(
                      "artistsAndCreatorsNewsletter.form.firstName.label",
                    )}
                    name="firstName"
                    className="w-full mb-6"
                    placeholder={t(
                      "artistsAndCreatorsNewsletter.form.firstName.placeholder",
                    )}
                    helperText={
                      values.firstName.error
                        ? t("artistsAndCreatorsNewsletter.form.firstName.error")
                        : ""
                    }
                    error={values.firstName.error}
                    onChange={onValueChange}
                  />
                  <NewsletterField
                    label={t(
                      "artistsAndCreatorsNewsletter.form.lastName.label",
                    )}
                    name="lastName"
                    placeholder={t(
                      "artistsAndCreatorsNewsletter.form.lastName.placeholder",
                    )}
                    className="w-full mb-6"
                    helperText={
                      values.lastName.error
                        ? t("artistsAndCreatorsNewsletter.form.lastName.error")
                        : ""
                    }
                    error={values.lastName.error}
                    onChange={onValueChange}
                  />

                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    size="lg"
                    className="mt-4 w-full rounded-full bg-[#14F195] font-brand-mono text-xs uppercase tracking-wide text-black hover:bg-[#14F195]/80"
                  >
                    {isSubmitting
                      ? t("artistsAndCreatorsNewsletter.form.submitting")
                      : t("artistsAndCreatorsNewsletter.form.submit")}
                  </Button>
                  {error && (
                    <p
                      role="alert"
                      className="mt-6 mb-0 text-center text-sm font-light text-red-400"
                    >
                      {error}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ArtistsAndCreatorsNewsletter;
