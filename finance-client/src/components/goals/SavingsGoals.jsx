import React, { useState, useEffect } from "react";
import SavingsGoalForm from "./SavingsGoalForm";
import GoalCard from "./GoalCard";
import DesktopTable from "./DesktopTable";
import AddAmountModal from "./AddAmountModal";
import { getAllGoals, deleteGoal, addAmountToGoal } from "api/goalApi";
import "./SavingsGoals.scss";
import { useTranslation } from "react-i18next";

export default function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [showAddAmount, setShowAddAmount] = useState(null);
  const [extraAmount, setExtraAmount] = useState("");
  const { t } = useTranslation();

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      const response = await getAllGoals();
      setGoals(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || t("goals.page.errorFallback"));
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("goals.page.deleteConfirm"))) return;
    try { await deleteGoal(id); fetchGoals(); }
    catch { t("goals.page.deleteError"); }
  };

  const handleEdit = (goal) => { setSelectedGoal(goal); setShowForm(true); };
  const handleAddNew = () => { setSelectedGoal(null); setShowForm(true); };
  const handleAddAmount = (goalId) => { setShowAddAmount(goalId); };
  const confirmAddAmount = async (goalId) => {
    if (!extraAmount || Number(extraAmount) <= 0) { alert(t("goals.page.addAmountInvalid")); return; }
    try {
      await addAmountToGoal(goalId, Number(extraAmount));
      setExtraAmount(""); setShowAddAmount(null); fetchGoals();
    } catch { t("goals.page.addAmountError"); }
  };

  const calculateProgress = (goal) => {
    if (!goal || !goal.targetAmount) return 0;
    return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  };

  return (
    <div className="app-root">
      <div className="hero">
        <h1>{t("goals.page.title")}</h1>
        <p className="hero-sub">
          {t("goals.page.subtitle")}        </p>
        <div className="hero-cta">
          <button className="btn btn-primary" onClick={handleAddNew}>➕  {t("goals.page.addNewButton")}</button>
        </div>
      </div>

      {loading && <p>{t("goals.page.loading")}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card">
        <div className="card-header"><h3>{t("goals.page.listTitle")}</h3></div>
        <div className="card-body">
          <DesktopTable goals={goals} onEdit={handleEdit} onDelete={handleDelete} onAddAmount={handleAddAmount} calculateProgress={calculateProgress} />
          <div className="mobile-view">
            <div className="cards-container">
              {goals.map(goal => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddAmount={handleAddAmount}
                  calculateProgress={calculateProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && <SavingsGoalForm goal={selectedGoal} onClose={() => setShowForm(false)} onSave={fetchGoals} />}
      {showAddAmount && <AddAmountModal goalId={showAddAmount} extraAmount={extraAmount} setExtraAmount={setExtraAmount} onConfirm={confirmAddAmount} onClose={() => setShowAddAmount(null)} />}
    </div>
  );
}
