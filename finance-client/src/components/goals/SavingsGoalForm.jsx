
import React, { useState, useEffect } from "react";
import AutoSavingOption from "../autoSavingOption/AutoSavingOption";
import { createGoal, updateGoal } from "api/goalApi";
import "./SavingsGoalForm.scss";
import { useTranslation } from "react-i18next";

export default function SavingsGoalForm({ goal, onClose, onSave }) {
  const [title, setTitle] = useState(goal ? goal.title : "");
  const [targetAmount, setTargetAmount] = useState(goal ? goal.targetAmount : "");
  const [autoSaving, setAutoSaving] = useState(goal ? goal.autoSaving : null);
  const { t } = useTranslation();

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTargetAmount(goal.targetAmount);
      setAutoSaving(goal.autoSaving || null);
    } else {
      setTitle("");
      setTargetAmount("");
      setAutoSaving(null);
    }
  }, [goal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      autoSaving?.enabled &&
      (!autoSaving.amount ||
        !autoSaving.frequency ||
        (autoSaving.isUnlimited === false && !autoSaving.timesToRepeat))
    ) {
      alert(t("goals.form.autoSavingError"));
      return;
    }

    const validatedAutoSaving = autoSaving?.enabled
      ? {
        amount: Number(autoSaving.amount),
        frequency: autoSaving.frequency,
        isUnlimited: autoSaving.isUnlimited ?? true,
        timesToRepeat: autoSaving.isUnlimited ? null : Number(autoSaving.timesToRepeat),
      }
      : null;

    try {
      if (goal) {
        await updateGoal(goal._id, {
          title,
          targetAmount,
          autoSaving: validatedAutoSaving,
        });
      } else {
        await createGoal({ title, targetAmount, autoSaving: validatedAutoSaving });
      }

      onSave();
      onClose();
    } catch (err) {
      alert(t("goals.form.saveError"));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{goal ? t("goals.form.editTitle") : t("goals.form.createTitle")}</h3>

        <form onSubmit={handleSubmit} className="goal-form">
          <label>{t("goals.form.nameLabel")}</label>
          <input
            type="text"
            placeholder={t("goals.form.namePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>{t("goals.form.targetAmountLabel")}</label>
          <input
            type="number"
            placeholder={t("goals.form.targetAmountPlaceholder")}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            min="0"
          />

          <AutoSavingOption
            label={t("goals.form.autoSavingLabel")}
            onChange={setAutoSaving}
            initialValue={goal?.autoSaving}
          />

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              💾 {t("goals.form.saveButton")}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              ❌ {t("common.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
