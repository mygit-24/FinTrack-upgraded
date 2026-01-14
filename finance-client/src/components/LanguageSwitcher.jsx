import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "he";

  const toggleLanguage = () => {
    const next = currentLang === "he" ? "en" : "he";
    i18n.changeLanguage(next);
    document.documentElement.dir = next === "he" ? "rtl" : "ltr";
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`btn btn-ghost ${className}`} // 👈 אותה התנהגות כמו כפתור "כניסה"
    >
      {currentLang === "he" ? "En" : "עב"}
    </button>
  );
}
