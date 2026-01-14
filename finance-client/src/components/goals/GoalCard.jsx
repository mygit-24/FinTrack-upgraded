import React, { useState } from "react";
import GoalProgressBar from "components/GoalProgressBar/GoalProgressBar";
import "./GoalCard.scss";
import { useTranslation } from "react-i18next";

export default function GoalCard({ goal, onEdit, onDelete, onAddAmount, calculateProgress }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const rawFreq = goal.autoSaving && goal.autoSaving.frequency !== "none"
    ? goal.autoSaving.frequency
    : null;
  const freq = rawFreq ? t(`autoSaving.${rawFreq}`) : "❌";

  return (
    <article className="goal-card" aria-labelledby={`goal-${goal._id}-title`}>
      <header className="card-head">
        <div className="card-title" id={`goal-${goal._id}-title`}>{goal.title}</div>
        <div className="card-summary">
          <div className="chip">
            <span className="chip-label">{t("goals.card.chips.target")}</span>
            <span className="chip-value">{goal.targetAmount ?? '-'}</span>            </div>
          <div className="chip">
            <span className="chip-label">{t("goals.card.chips.saved")}</span>
            <span className="chip-value">{goal.currentAmount ?? 0}</span>            </div>
          <div className="chip">
            <span className="chip-label">{t("goals.card.chips.auto")}</span>
            <span className="chip-value">{freq}</span>            </div>
        </div>

        <div className="card-controls">
          <button 
          className="btn btn-ghost" 
          onClick={() => onEdit(goal)}
            aria-label={t("goals.card.aria.edit", { title: goal.title })}
          >✏️
          </button>
          <button className="btn" onClick={() => onDelete(goal._id)} aria-label={t("goals.card.aria.delete", { title: goal.title })}>🗑️</button>
          <button className="btn btn-ghost" onClick={() => onAddAmount(goal._id)} aria-label={t("goals.card.aria.addAmount", { title: goal.title })}>➕</button>
          <button className={`expand-toggle ${expanded ? "open" : ""}`} onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>{expanded ? "▲" : "▼"}</button>
        </div>
      </header>

      <div className={`card-details ${expanded ? "expanded" : ""}`} id={`details-${goal._id}`}>
        <div className="progress-row">
          <div className="progress-label">{t("goals.table.headers.progress")}</div>
          <div className="progress-bar"><GoalProgressBar progress={calculateProgress(goal)} /></div>
        </div>
        <div className="details-grid">
          <div className="detail-item"><div className="detail-label">{t("goals.table.headers.targetAmount")}</div><div className="detail-value">{goal.targetAmount ?? "-"}</div></div>
          <div className="detail-item"><div className="detail-label"> {t("goals.table.headers.currentAmount")}</div><div className="detail-value">{goal.currentAmount ?? 0}</div></div>
          <div className="detail-item"><div className="detail-label">{t("goals.table.headers.autoSaving")} </div><div className="detail-value">{freq}</div></div>
        </div>
      </div>
    </article>
  );
}

