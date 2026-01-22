import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Label
} from 'recharts';
import { getAllTransactions } from 'api/transactionApi';
// import { getAllTransactions, getExpenseCategories } from 'api/transactionApi';
import FinanceSelect from "components/common/FinanceSelect/FinanceSelect";
import './Charts.scss';
import { useTranslation } from 'react-i18next';




const COLORS = [
  '#00C49F', '#FF6384', '#36A2EB', '#FFCE56',
  '#7E57C2', '#4CAF50', '#FF9800', '#F06292',
];

function getCurrentMonth() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthDateRange(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  return {
    startDate: getFirstDayOfMonth(year, month),
    endDate: getLastDayOfMonth(year, month)
  };
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1).toISOString().split('T')[0];
}

function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).toISOString().split('T')[0];
}

function getHebrewMonthName(monthStr, t) {
  const [year, month] = monthStr.split('-').map(Number);
  const monthName = t(`datePicker.months.${month - 1}`);
  return `${monthName} ${year}`;
}

function generatePastMonths(count) {
  const now = new Date();
  return Array.from({ length: count }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }).reverse();
}

const ExpenseCategoryChart = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  // const [categoriesMap, setCategoriesMap] = useState({}); // map value -> label
  const { t, i18n } = useTranslation();
 


  // useEffect(() => {
  //   // מביא את רשימת הקטגוריות עם label
  //   getExpenseCategories().then(res => {
  //     const map = res.data.reduce((acc, cat) => {
  //       acc[cat.value] = cat.label;
  //       return acc;
  //     }, {});
  //     setCategoriesMap(map);
  //   }).catch(err => console.error(t('charts.categoriesError'),err));
  // }, []);

  useEffect(() => {
    fetchCategoryData();
  }, [selectedMonth, i18n.language]);

  const fetchCategoryData = async () => {
    try {
      const { startDate, endDate } = getMonthDateRange(selectedMonth);
      const res = await getAllTransactions();
      const transactions = res.data;

      const expenses = transactions.filter(tx => {
        const date = new Date(tx.date);
        return (
          tx.type === 'expense' &&
          date >= new Date(startDate) &&
          date <= new Date(endDate)
        );
      });

      // const grouped = expenses.reduce((acc, tx) => {
      //   const label = categoriesMap[tx.category] || t('charts.uncategorized');
      //   acc[label] = (acc[label] || 0) + Number(tx.sum);
      //   return acc;
      // }, {});

 const grouped = expenses.reduce((acc, tx) => {
      const key = tx.category || 'uncategorized';
      acc[key] = (acc[key] || 0) + Number(tx.sum);
      return acc;
    }, {});

      const chartData = Object.keys(grouped).map(key => ({
        name: t(`transactions.categories.${key}`),
        value: grouped[key],
      }));

      setData(chartData);
    } catch (err) {
      console.error('שגיאה בטעינת גרף קטגוריות:', err);
    }
  };

  const months = generatePastMonths(12);

  function CenterLabel({ month }) {
    return (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize="16"
        fontWeight="400"
      >
        {month}
      </text>
    );
  }

  function formatMonthYear(value) {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}$/.test(value)) {
      const [year, month] = value.split("-");
      return `${month}/${year}`;
    }
    return value.toString();
  }

  return (
    <>
      <div>
        <div className='year-select'>
          <label style={{ display: "block", marginBottom: "1rem" }}>
            {t('charts.monthLabel')}
            <FinanceSelect
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val)}
              options={months.map(month => ({
                value: month,
                label: getHebrewMonthName(month,t)
              }))}
              placeholder={t('charts.monthPlaceholder')}
            />
          </label>
        </div>
      </div>

      <div className='chart expense-category-chart'>
        <h3 style={{ textAlign: 'center' }}> {t('charts.expenseByCategoryTitle')}</h3>
        {data.length === 0 ? (
          <div className='no-data'>
            <label>{t('charts.noDataForMonth', {month: getHebrewMonthName(selectedMonth, t),})}</label>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <Label className='currenet-month' content={<CenterLabel month={formatMonthYear(selectedMonth)} />} position="center" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginInlineStart: 24,
              flexWrap: 'wrap',
              maxHeight: 300
            }}>
              {data.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    backgroundColor: COLORS[index % COLORS.length],
                    borderRadius: '50%',
                    marginInlineEnd: 8
                  }} />
                  <span>
                    {entry.value.toLocaleString('he-IL')} ₪ {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExpenseCategoryChart;

