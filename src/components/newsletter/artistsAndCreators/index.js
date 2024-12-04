import { useCallback, useState, useEffect } from "react";
import { Input, Button, sendFormRequest } from "@solana-foundation/solana-lib";
import { useTranslation } from "next-i18next";

const ArtistsAndCreatorsNewsletter = ({
  modalCloseHandler = null,
  modalActionCompleted,
}) => {
  const actionUrl =
    "//links.iterable.com/lists/publicAddSubscriberForm?publicIdString=94b90b1b-b29a-4ad7-9b3b-87331601d030";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

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
    <section className={`position-relative pb-5`}>
      <div
        className={`container-xl pt-8 pb-4 pb-md-10 px-6 px-md-8 mx-auto position-relative`}
      >
        {isSuccess ? (
          <>
            <div className={`row flex justify-content-center`}>
              <div className={`col col-lg-8`}>
                <h3 className={`h3 fw-normal mb-0 text-center mb-5`}>
                  {t("artistsAndCreatorsNewsletter.form.success.title")}
                </h3>
                <p className={`lead text-center mb-7`}>
                  {t("artistsAndCreatorsNewsletter.form.success.description")}
                </p>
                <Button
                  size={`md`}
                  hierarchy={"secondary"}
                  className="tw-mt-4 mx-auto d-block"
                  onClick={() => modalCloseHandler()}
                >
                  {t("artistsAndCreatorsNewsletter.form.success.cta")}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={`row flex justify-content-center`}>
              <div className={`col col-lg-8 mb-md-5`}>
                <h2 className={`h3 fw-normal mb-0 text-center mb-5`}>
                  {t("artistsAndCreatorsNewsletter.title")}
                </h2>
                <p className={`lead text-center mb-8`}>
                  {t("artistsAndCreatorsNewsletter.description")}
                </p>
              </div>
            </div>
            <div className={`row flex justify-content-center`}>
              <div className={`col col-lg-6`}>
                <form onSubmit={onSubmit}>
                  <Input
                    size={"md"}
                    label={t("artistsAndCreatorsNewsletter.form.email.label")}
                    name="email"
                    placeholder={t(
                      "artistsAndCreatorsNewsletter.form.email.placeholder",
                    )}
                    className={"tw-w-full mb-4"}
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
                    className={"tw-w-full mb-5"}
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
                    className={"tw-w-full mb-5"}
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
                    className="tw-mt-4 tw-w-full"
                  >
                    {isSubmitting
                      ? t("artistsAndCreatorsNewsletter.form.submitting")
                      : t("artistsAndCreatorsNewsletter.form.submit")}
                  </Button>
                  {error && (
                    <p
                      className={`tw-text-sm tw-font-light mb-0 tw-text-error-500 text-center mt-5`}
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
