import { useCallback, useState, useEffect } from "react";
import { Input, Button, sendFormRequest } from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";

const ArtistsAndCreatorsNewsletter = ({
  modalCloseHandler = null,
  modalActionCompleted,
}) => {
  const actionUrl =
    "//links.iterable.com/lists/publicAddSubscriberForm?publicIdString=94b90b1b-b29a-4ad7-9b3b-87331601d030";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(false);
  const t = useTranslations();

  const [values, setValues] = useState({
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
    const veryBasicEmailCheck = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

    Object.keys(values).forEach((key) => {
      if (key === "email" && !veryBasicEmailCheck.test(values.email.value)) {
        updatedValues.email.error = true;
        isValid = false;
      } else if (key === "Country" && values.Country.value === "default") {
        updatedValues.Country.error = true;
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
    (e) => {
      const updatedValues = { ...values };
      updatedValues[e.target.name].error = false;
      updatedValues[e.target.name].value = e.target.value;

      setValues(updatedValues);
    },
    [values],
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const formIsValid = await validate();

    if (formIsValid) {
      const formState = Object.keys(values).reduce((acc, key) => {
        acc[key] = values[key].value;
        return acc;
      }, {});

      try {
        setIsSubmitting(true);
        await sendFormRequest(actionUrl, formState);
        setIsSuccess(true);
        modalActionCompleted.current = true;

        // track form submission
        if (typeof window.gtag !== "undefined") {
          window.gtag("event", "newsletter_sign_up", {
            event_category: "engagement",
            event_action: "Submitted",
            event_label: "artistsAndCreatorsNewsletter",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong, please try again.");
      } finally {
        setIsSuccess(true);
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    let timeoutId;
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
                  size={`md`}
                  hierarchy={"secondary"}
                  className="mt-4 mx-auto block"
                  onClick={() => modalCloseHandler()}
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
                  <Input
                    size={"md"}
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
                  <Input
                    size={"md"}
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
                  <Input
                    size={"md"}
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
                    size={`md`}
                    hierarchy={"secondary"}
                    className="mt-4 w-full"
                  >
                    {isSubmitting
                      ? t("artistsAndCreatorsNewsletter.form.submitting")
                      : t("artistsAndCreatorsNewsletter.form.submit")}
                  </Button>
                  {error && (
                    <p className="text-sm font-light mb-0 text-error-500 text-center mt-6">
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
