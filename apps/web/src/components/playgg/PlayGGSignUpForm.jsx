import classNames from "classnames";
import { useMemo } from "react";
import * as Yup from "yup";

import useIterableSignUp, {
  ActionForm,
} from "../shared/Iterable/useIterableSignUp";
import { useTranslations } from "next-intl";

import ArrowSubmit from "../../../assets/playgg/arrow-submit.inline.svg";
import EnterEmail from "../../../assets/playgg/_enter-email.inline.svg";

import styles from "./PlayGGSignUpForm.module.scss";

const schema = Yup.object().shape({
  email: Yup.string().email().required(),
});

function Message({ error, msgId }) {
  const t = useTranslations();
  return (
    <div className={error ? styles["sign-up-form__error"] : ""}>
      <small>{t(msgId)}</small>
    </div>
  );
}

export default function PlayGGSignUpForm() {
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
    formId: "344bb9cb-a49f-49e1-852f-2eaf8c77cb15",
    schema,
    initialValues: {
      email: "",
    },
  });

  const isInvalid = useMemo(() => {
    return isDirty && isSubmitting && !schema.isValidSync(values);
  }, [isDirty, isSubmitting, values]);

  return (
    <ActionForm
      action={actionUrl}
      onSubmit={onSubmit}
      className={styles["sign-up-form"]}
    >
      <div className="flex items-center">
        <div className={styles["sign-up-form__input-container"]}>
          <label htmlFor="playgg-email" className="sr-only">
            <span>Email</span>
          </label>
          <input
            id="playgg-email"
            name="email"
            type="email"
            value={values.email}
            onChange={onValueChange}
            placeholder=" "
            className={classNames(
              styles["sign-up-form__input"],
              "border-0 w-full",
            )}
          />

          <div className={classNames(styles["placeholder"], "absolute left-0")}>
            <EnterEmail />
          </div>
        </div>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={isLoading}
          aria-label="Submit"
        >
          <ArrowSubmit />
        </button>
      </div>
      {isSuccess && <Message msgId="shared.mail-signup.form.signup-success" />}
      {error && (
        <Message error msgId="shared.mail-signup.form.unexpected-error" />
      )}
      {!error && isInvalid && (
        <Message error msgId="shared.mail-signup.form.email-error" />
      )}
    </ActionForm>
  );
}
