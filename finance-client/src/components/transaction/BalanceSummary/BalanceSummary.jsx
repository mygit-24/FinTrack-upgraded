
import React, { useEffect, useState } from 'react';
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from 'api/transactionApi';
// import TransactionForm from 'components/transaction/transactionForm';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const BalanceSummary = () => {
  const [transactions, setTransactions] = useState([]);
  const [editTx, setEditTx] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const { t } = useTranslation();

  const fetchTransactions = async () => {
    const res = await getAllTransactions();
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter(
      (tx) => new Date(tx.date) <= new Date(selectedDate)
    );

    const income = filtered
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + Number(tx.sum), 0);

    const expense = filtered
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.sum), 0);

    setTotalIncome(income);
    setTotalExpense(expense);
  }, [transactions, selectedDate]);

  const handleCreate = async (data) => {
    await createTransaction(data);
    fetchTransactions();
  };

  const handleUpdate = async (data) => {
    await updateTransaction(editTx._id, data);
    setEditTx(null);
    fetchTransactions();
  };



  const balance = totalIncome - totalExpense;
  const isPositive = balance >= 0;

  return (
    <div className="p-4">
      <div className="my-4">
        <label htmlFor="date" className="mr-2"> {t('balance.dateLabel')}</label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-1"
        />
      </div>
      <div
        className="mt-6 p-4 rounded font-bold text-center"
        style={{
          width: '10rem',
          backgroundColor: isPositive ? '#e6ffed' : '#ffe6e6',
          color: isPositive ? '#006400' : '#b30000',
          border: `2px solid ${isPositive ? '#006400' : '#b30000'}`,
        }}
      >
        {isPositive ? t('balance.positiveLabel') : t('balance.negativeLabel')}{' '}
        ₪{balance.toLocaleString('he-IL')}
      </div>
    </div>
  );
};

export default BalanceSummary;