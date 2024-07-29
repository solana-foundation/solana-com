import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { memo, useMemo } from "react";
import * as Yup from "yup";
import Button from "../Button";
import useIterableSignUp, { ActionForm } from "../Iterable/useIterableSignUp";

import styles from "./IterableEmailSubscribeForm.module.scss";

const Status = {
  Sending: "sending",
  Error: "error",
  Success: "success",
};

const StatusMessage = memo(function StatusMessage({ status }) {
  const { t } = useTranslation("common");

  if (!Object.values(Status).includes(status)) {
    return null;
  }

  const color = status === Status.Error ? "red" : "inherit";

  let message = t("shared.mail-signup.form.signup-success");

  if (status !== Status.Success) {
    message =
      status === Status.Sending
        ? t("shared.mail-signup.form.sending")
        : t("shared.mail-signup.form.unexpected-error");
  }

  return <small style={{ color }}>{message}</small>;
});

const defaultSchema = Yup.object().shape({
  email: Yup.string().email().required(),
});

const defaultValues = {
  email: "",
};

export default function IterableEmailSubscribeForm({
  inputRef,
  formId,
  schema = defaultSchema,
  initialValues = defaultValues,
  placeholderTextID,
  ctaTextID,
}) {
  const { t } = useTranslation("common");

  const {
    actionUrl,
    values,
    onValueChange,
    onSubmit,
    isSuccess,
    isLoading,
    isDirty,
    isSubmitting,
    error,
  } = useIterableSignUp({
    formId,
    schema,
    initialValues,
  });

  const isInvalid = useMemo(() => {
    return isDirty && isSubmitting && !schema.isValidSync(values);
  }, [schema, isDirty, isSubmitting, values]);

  const status = useMemo(() => {
    if (error) {
      return Status.Error;
    }

    if (isSuccess) {
      return Status.Success;
    }

    if (isLoading) {
      return Status.Sending;
    }

    return null;
  }, [error, isSuccess, isLoading]);

  return (
    <div className={styles["iterable-email-subscribe-form"]}>
      <ActionForm action={actionUrl} onSubmit={onSubmit}>
        <div className={styles["iterable-email-subscribe-form__content"]}>
          <div className="w-100">
            <input
              ref={inputRef}
              name="email"
              type="email"
              className={classNames(
                styles["iterable-email-subscribe-form__input"],
                "form-control rounded-pill w-100 d-inline-block",
              )}
              placeholder={
                placeholderTextID
                  ? t(placeholderTextID)
                  : t("shared.mail-signup.form.placeholder")
              }
              onChange={onValueChange}
            />
          </div>
          <div
            className={
              styles["iterable-email-subscribe-form__button-container"]
            }
          >
            <Button
              variant="secondary"
              className={classNames(
                styles["iterable-email-subscribe-form__button"],
                "rounded-pill",
              )}
              disabled={isLoading}
              onClick={onSubmit}
            >
              {ctaTextID
                ? t({ ctaTextID })
                : t("shared.mail-signup.form.signup")}
            </Button>
          </div>
        </div>

        {status && (
          <div className="mt-4 w-100 m-auto text-center">
            <StatusMessage status={status} />
          </div>
        )}

        {!error && isInvalid && (
          <div className="mt-4 w-100 m-auto text-center">
            <p
              id="email-error"
              className={styles["iterable-email-subscribe-form__input-error"]}
              role="alert"
            >
              {t("shared.mail-signup.form.email-error")}
            </p>
          </div>
        )}
      </ActionForm>
    </div>
  );
}
