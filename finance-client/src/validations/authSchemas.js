import * as yup from "yup";
import i18n from "i18next";

const { t } = i18n;

// התחברות
export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .required(t("validation.emailRequired"))
    .email(t("validation.emailInvalid")),
  password: yup
    .string()
    .required(t("validation.passwordRequired"))
    .min(6, t("validation.passwordMin")),
});

//הרשמה
export const RegisterSchema = yup.object().shape({
  firstName: yup
    .string()
    .required(t("validation.firstNameRequired"))
    .min(2, t("validation.firstNameMin"))
    .matches(/^[א-ת]+$/, t("validation.firstNameHebrewOnly")),
  lastName: yup
    .string()
    .required(t("validation.lastNameRequired"))
    .min(2,t("validation.lastNameMin"))
    .matches(/^[א-ת]+$/, t("validation.lastNameHebrewOnly")),
  email: yup
    .string()
    .required(t("validation.emailRequired"))
    .email(t("validation.emailInvalid")),
  password: yup
    .string()
    .required(t("validation.passwordRequired"))
    .min(6, t("validation.passwordMin")),
});
