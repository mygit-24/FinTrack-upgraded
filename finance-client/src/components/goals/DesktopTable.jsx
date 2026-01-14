import React, { useEffect, useState } from "react";
import GoalProgressBar from "components/GoalProgressBar/GoalProgressBar";
import "./DesktopTable.scss";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";


const PAGE_SIZE = 10;

export default function DesktopTable({ goals, onEdit, onDelete, onAddAmount, calculateProgress }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const hasGoals = goals && goals.length > 0;

 useEffect(() => {
  // אם כמות היעדים משתנה - חוזרים לעמוד 1
  setPage(1);
 }, [goals?.length]);

  if (!hasGoals) {
    return (
      <div className="goals-empty-state">
        <p>
            {t("goals.section.emptyText")}
        </p>
      </div>
    );
  }

  const items = goals;

  const totalPages = Math.max(1, Math.ceil(goals.length / PAGE_SIZE));
  const startIndex = (page -1) * PAGE_SIZE;
  const pageGoals = goals.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <>
    <div className="desktop-view">
      <div style={{ overflowX: "auto" }}>
        <table className="savings-table">
          <thead>
            <tr>
              <th>{t("goals.table.headers.name")}</th>
              <th>{t("goals.table.headers.targetAmount")}</th>
              <th>{t("goals.table.headers.autoSaving")}</th>
              <th>{t("goals.table.headers.currentAmount")}</th>
              <th>{t("goals.table.headers.progress")}</th>
              <th>{t("goals.table.headers.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {pageGoals.map(goal => (
              <tr key={goal._id}>
                <td>{goal.title}</td>
                <td>{goal.targetAmount}</td>
                <td>{goal.autoSaving && goal.autoSaving.frequency !== "none" ? t(`autoSaving.${goal.autoSaving.frequency}`) : "❌"}</td>
                <td>{goal.currentAmount}</td>
                <td><GoalProgressBar progress={calculateProgress(goal)} /></td>
                <td>
                  <button className="btn btn-ghost" onClick={() => onEdit(goal)}>✏️ {t("goals.table.actions.edit")}</button>
                  <button className="btn" onClick={() => onDelete(goal._id)}>🗑️ {t("goals.table.actions.delete")}</button>
                  <button className="btn btn-ghost" onClick={() => onAddAmount(goal._id)}>➕  {t("goals.table.actions.addAmount")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="table-pagination">
      <button 
        type="button" 
        className="table-pagination__btn" 
        disabled={page === totalPages}
        onClick={() => setPage(p => p + 1)}
        aria-label={t("pagination.next")}
      >
        {/* <span className="table-pagination__icon">{"<"}</span> */}
        <ChevronLeft className="table-pagination__icon"/>
      </button>

      <span className="table-pagination__icon">
        {page}/{totalPages}
      </span>

          <button 
          type="button"
          className="table-pagination__btn"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          aria-label={t("pagination.next")}
          >
            {/* <span className="table-pagination__icon">{">"}</span> */}
            <ChevronRight className="table-pagination__icon"/>
      </button>

      
    </div>
    </>

  );
}

