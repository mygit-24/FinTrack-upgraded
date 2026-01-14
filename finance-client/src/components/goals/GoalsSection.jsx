import React from "react";
import GoalsTable from "./GoalsTable";
import { useTranslation } from "react-i18next";

function GoalsSection({ goals, openCreateGoalModal }) {
  const { t } = useTranslation();
  const hasGoals = goals && goals.length > 0;

  return (
    <section className="goals-section">
      <h2 className="goals-section__title">
        {t("goals.section.title")}
      </h2>

      {hasGoals ? (
        <GoalsTable goals={goals} />
      ) : (
        <div className="goals-section__empty">
          <p className="goals-section__empty-text">
            {t("goals.section.emptyText")}
          </p>

          <button
            type="button"
            className="goals-section__empty-cta"
            onClick={openCreateGoalModal}
          >
            {t("goals.section.emptyCta")}
          </button>
        </div>
      )}
    </section>
  );
}

export default GoalsSection;
