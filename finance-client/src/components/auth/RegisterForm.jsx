
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { RegisterSchema } from "validations/authSchemas";
import { register as registerApi } from "api/authApi";
import { messages } from "constants/messages";
import { useTranslation } from "react-i18next";
import Logo from '../ui/Logo';

export default function RegisterForm() {
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await registerApi(data);
      setMessage({ text: messages.register.success, type: "success" });
      setTimeout(() => navigate("/transactions"), 1500);
    } catch (err) {
      let msg = messages.register.serverError;
      if (err.response?.status === 409) msg = messages.register.emailExists;
      setMessage({ text: msg, type: "error" });
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="form-wrapper">
      <div className="form-container card">
        <Link to="/" className="brand">
          <Logo />
          <span>FinTrack</span>
        </Link>
        <h2>{t("auth.register.subtitle")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="input-wrapper">

            <label>{t("auth.register.firstNameLabel")}</label>
            <input
              type="text"
              placeholder={t("auth.register.firstNamePlaceholder")}
              {...register("firstName")}
              className={errors.firstName ? "error" : ""}
            />
            {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
          </div>

          <div className="input-wrapper">
            <label>{t("auth.register.lastNameLabel")}</label>
            <input
              type="text"
              placeholder={t("auth.register.lastNamePlaceholder")}
              {...register("lastName")}
              className={errors.lastName ? "error" : ""}
            />
            {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
          </div>

          <div className="input-wrapper">
            <label>{t("auth.register.emailLabel")}</label>
            <input
              type="text"
              placeholder={t("auth.register.emailPlaceholder")}
              {...register("email")}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="input-wrapper">
            <label>{t("auth.register.passwordLabel")}</label>
            <input
              type="password"
              placeholder={t("auth.register.passwordPlaceholder")}
              {...register("password")}
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting 
            ? t("auth.register.submitting")
              : t("auth.register.submit")}
          </button>
        </form>

        {message.text && (
          <div className={`server-message ${message.type}`}>
            {message.text}
          </div>
        )}
        <Link to="/login" className="link">{t("auth.register.haveAccount")}</Link>
      </div>
    </div>
  );
}
