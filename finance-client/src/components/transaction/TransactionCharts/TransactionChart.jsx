import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getAllTransactions } from 'api/transactionApi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';
import FinanceSelect from "components/common/FinanceSelect/FinanceSelect";
import './Charts.scss';
import { useTranslation } from 'react-i18next';

const TransactionChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { t } = useTranslation();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    prepareCharts();
  }, [selectedYear, transactions]);

  const fetchData = async () => {
    try {
      const res = await getAllTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.error(t('charts.transactions.loadError'), err);
    }
  };

  const prepareCharts = () => {
    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getFullYear() === parseInt(selectedYear);
    });

    // Monthly data
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: `${String(i + 1).padStart(2, '0')}/${String(selectedYear).slice(2)}`,
      income: 0,
      expense: 0
    }));

    let totalIncome = 0;
    let totalExpense = 0;

    filtered.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthIndex = txDate.getMonth();
      const sum = Number(tx.sum);

      if (tx.type === 'income') {
        months[monthIndex].income += sum;
        totalIncome += sum;
      } else if (tx.type === 'expense') {
        months[monthIndex].expense += sum;
        totalExpense += sum;
      }
    });

    setMonthlyData(months);
    setYearlyData([
      {
        name: t('charts.transactions.yearlyTotalLabel'),
        income: totalIncome,
        expense: totalExpense
      }
    ]);
  };
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(t('charts.transactions.pdfTitle', { year: selectedYear }), 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [[
        t('charts.transactions.monthHeader'),
        t('charts.transactions.incomeHeader'),
        t('charts.transactions.expenseHeader')
      ]], body: monthlyData.map(row => [
        row.name,
        row.income,
        row.expense
      ]),
      styles: { font: 'helvetica', fontSize: 12, halign: 'right' },
      headStyles: { fillColor: [63, 81, 181] }
    });

    doc.save(`${t('charts.transactions.pdfFileName', { year: selectedYear })}.pdf`);
  };
  const exportToExcel = () => {
    const data = [
      [
        t('charts.transactions.monthHeader'),
        t('charts.transactions.incomeHeader'),
        t('charts.transactions.expenseHeader')
      ],
      ...monthlyData.map((row) => [
        row.name,
        row.income,
        row.expense
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t('charts.transactions.excelSheetName'));

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${t('charts.transactions.excelFileName', { year: selectedYear })}.xlsx`);
  };

  return (
    <div>
      <div className='year-select'>
        <label>{t('charts.transactions.yearLabel')}</label>
        <FinanceSelect
          value={selectedYear}
          onChange={(val) => setSelectedYear(val)}
          options={[
            { value: 2023, label: "2023" },
            { value: 2024, label: "2024" },
            { value: 2025, label: "2025" }
          ]}
          placeholder={t('charts.transactions.yearPlaceholder')}
        />
      </div>

      <div className='charts-container'>
        <div className='chart'>
          <h3>{t('charts.transactions.monthlyTitle', { year: selectedYear })}</h3>
          {/* גרף חודשי */}
          <div style={{ width: '100%', height: 300, marginBottom: '3rem' }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="var(--brand)" name={t('charts.transactions.income')} radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#ff4d4d" name={t('charts.transactions.expense')} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='export-container'>
            <button onClick={exportToExcel} className='btn btn-primary export-btn'>
              <Download size={16} />
              {t('charts.transactions.exportExcel')}
            </button>
            <button onClick={exportToPDF} className='btn btn-primary export-btn'>
              <Download size={16} />
              {t('charts.transactions.exportPDF')}
            </button>
          </div>
        </div>
        <div className='chart'>
          {/* גרף שנתי */}
          <h3>{t('charts.transactions.yearlyTitle', { year: selectedYear })}</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={yearlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="var(--brand)" name={t('charts.transactions.income')}  radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#ff4d4d" name={t('charts.transactions.expense')} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>


    </div>


  );
};

export default TransactionChart;
