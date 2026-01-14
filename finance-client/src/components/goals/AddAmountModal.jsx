import React from "react";
import "./AddAmountModal.scss";
import { useTranslation } from "react-i18next";

export default function AddAmountModal({ goalId, extraAmount, setExtraAmount, onConfirm, onClose }) {
  const { t } = useTranslation();
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{t("goals.addAmount.title")}</h3>
        <input type="number" placeholder={t("goals.addAmount.placeholder")} value={extraAmount} onChange={e => setExtraAmount(e.target.value)} />
        <div className="form-actions">
          <button className="btn btn-primary" onClick={() => onConfirm(goalId)}>💾 {t("goals.addAmount.confirm")}</button>
          <button className="btn btn-ghost" onClick={onClose}>❌ {t("goals.addAmount.cancel")}</button>
        </div>
      </div>
    </div>
  );
}
