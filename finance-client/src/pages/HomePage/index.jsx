import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Wallet, ArrowDownCircle, PiggyBank } from "lucide-react";
import { KpiCard } from 'components/common/KpiCard/KpiCard';
import "./HomePage.scss";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

// נתוני דוגמה
const monthlyData = [
  { name: "jan", income: 9200, expense: 6500, savings: 2700 },
  { name: "feb", income: 8800, expense: 6100, savings: 2700 },
  { name: "mar", income: 10000, expense: 6900, savings: 3100 },
  { name: "apr", income: 9800, expense: 6400, savings: 3400 },
  { name: "may", income: 10200, expense: 7200, savings: 3000 },
  { name: "jun", income: 10500, expense: 7600, savings: 2900 },
];

const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);

export default function HomePage() {

  const { t } = useTranslation();

  const totals = monthlyData.reduce(
    (acc, m) => {
      acc.income += m.income;
      acc.expense += m.expense;
      acc.savings += m.savings;
      return acc;
    },
    { income: 0, expense: 0, savings: 0 }
  );

  return (
       <div>
      {/* HERO */}
      <section className="hero">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* השליטה על הכסף – במקום אחד */}
          {t("home.hero.title")}
        </motion.h1>
        {/* <p className="hero-sub">עקוב אחרי הכנסות, הוצאות וחסכונות בלוח מחוונים נוח.</p> */}
        <p className="hero-sub">{t("home.hero.subtitle")}</p>
        <div className="hero-cta">
          <Link className="btn btn-primary" to="/register">{t("home.hero.ctaRegister")}</Link>
          <Link className="btn btn-ghost"  to="/login">{t("home.hero.ctaLogin")}</Link>
        </div>
      </section>

      {/* KPI CARDS */}
      <section className="grid kpis">
        <KpiCard
          title={t("home.kpi.totalIncome")}
          value={formatCurrency(totals.income)}
          icon={<Wallet />}
          caption={t("home.kpi.halfYearAccum")}
        />
        <KpiCard
          title={t("home.kpi.totalExpense")}
          value={formatCurrency(totals.expense)}
          icon={<ArrowDownCircle />}
          caption={t("home.kpi.halfYearAccum")}
        />
        <KpiCard
          title={t("home.kpi.totalSavings")}
          value={formatCurrency(totals.savings)}
          icon={<PiggyBank />}
          caption={t("home.kpi.halfYearAccum")}
        />
      </section>

      {/* CHARTS */}
      <section className="grid charts">
        <div className="card">
          <div className="card-header">
            <h3>{t("home.charts.incomeVsExpenseTitle")}</h3>
            <p>{t("home.charts.incomeVsExpenseSubtitle")}</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    tickFormatter={(value) => t(`home.months.${value}`)}
                />
                <YAxis />
                <ChartTooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar
                   dataKey="income" 
                   name={t("home.charts.incomeLegend")}
                   radius={[6, 6, 0, 0]} 
                   fill="var(--brand)"
                />
                <Bar 
                  dataKey="expense" 
                  name={t("home.charts.expenseLegend")} 
                  radius={[6, 6, 0, 0]} 
                  fill="#ff4d4d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>{t("home.charts.savingsTrendTitle")}</h3>
            <p>{t("home.charts.savingsTrendSubtitle")}</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(value) => t(`home.months.${value}`)}
                />
                <YAxis />
                <ChartTooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="income" name="הכנסות" radius={[6, 6, 0, 0]} fill="var(--brand)"/>
                <Bar dataKey="expense" name="הוצאות" radius={[6, 6, 0, 0]} fill="#ff4d4d"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Michal Elhadad </p>
      </footer>
    </div>
  );
}

