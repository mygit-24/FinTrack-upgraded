import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Pencil, Trash2, Sliders, Download, ChevronLeft, ChevronRight } from 'lucide-react'; // אייקונים
import FinanceSelect from "components/common/FinanceSelect/FinanceSelect";
import './transactionsTable.scss';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 10;

const exportToExcel = (transactions) => {
  const filteredData = transactions.map(({ _id, type, sum, date, categoryLabel }) => ({
    Type: type,
    Sum: sum,
    Date: date ? date.slice(0, 10) : '',
    Category: categoryLabel || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'transactions.xlsx');
};

const TransactionsTable = ({ transactions, onDelete, onEdit }) => {
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const { t } = useTranslation();

  const typeLabels = {
    income: t('transactions.table.typeLabel.income'),
    expense: t('transactions.table.typeLabel.expense'),
  };

  // בניית רשימת קטגוריות להוצאות
  useEffect(() => {
    if (typeFilter === 'expense') {
      const categoriesWithValue = Array.from(
        new Set(transactions.filter(tx => tx.type === 'expense').map(tx => tx.category))
      ).map(value => {
        const txExample = transactions.find(tx => tx.category === value);
        return { value, label: txExample.categoryLabel || value };
      });
      setExpenseCategories(categoriesWithValue);
    } else {
      setExpenseCategories([]);
      setCategoryFilter('');
    }
  }, [typeFilter, transactions]);

   // סינון לפי סוג + קטגוריה
  const filteredTransactions = transactions.filter(tx => {
    if (typeFilter && tx.type !== typeFilter) return false;
    if (typeFilter === 'expense' && categoryFilter && tx.category !== categoryFilter) return false;
    return true;
  });

  useEffect(() => {
    setPage(1);
  }, [typeFilter, categoryFilter, transactions.length]);

  // חישוב מספר העמודים והעמודה הנוכחית
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageTransactions = filteredTransactions.slice(startIndex, startIndex + PAGE_SIZE);


  return (

    <div className="transactions-table-container">
      {/* טבלת טרנזקציות */}
      <h2 className="title mt-4">{t('transactions.table.title')}</h2>

      {/* כפתור להציג/להסתיר פילטר */}
      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Sliders size={20} /> {t('transactions.table.filters.toggle')}
      </button>
      {showFilters && (
        <div className="filters-panel">
          {/* סינון לפי סוג */}
          <div className="filter-group">
            <label htmlFor="sort">{t('transactions.table.filters.typeLabel')}</label>
            <FinanceSelect
              id="sort"
              value={typeFilter}
              onChange={(val) => setTypeFilter(val)}
              options={[
                // היו: 'הכל','הכנסות','הוצאות'
                { value: '', label: t('transactions.table.filters.typeAll') },
                { value: 'income', label: t('transactions.table.filters.typeIncome') },
                { value: 'expense', label: t('transactions.table.filters.typeExpense') },
              ]}
              placeholder={t('transactions.form.typePlaceholder')}
            />
          </div>

          {/* סינון לפי קטגוריה רק להוצאות */}
          {typeFilter === 'expense' && (
            <div className="filter-group">
              <label htmlFor="categorySort">{t('transactions.form.categoryLabel')}:</label>
              <FinanceSelect
                id="categorySort"
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val)}
                options={expenseCategories} // כאן {value, label}
                placeholder={t('transactions.table.filters.categoryAll')}
              />
            </div>
          )}
        </div>
      )}
      {filteredTransactions.length === 0 ? (
        <div className="no-data-message">
          <p>{t('transactions.table.noData')}</p>
        </div>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>{t('transactions.table.headers.type')}</th>
              <th>{t('transactions.table.headers.amount')}</th>
              <th>{t('transactions.table.headers.date')}</th>
              <th>{t('transactions.table.headers.category')}</th>
              <th>{t('transactions.table.headers.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {pageTransactions.map(tx => (
              <tr key={tx._id}>
                <td>
                  <span className={`tag ${tx.type}`}>
                    {typeLabels[tx.type] || tx.type}
                  </span>
                </td>
                <td>₪{tx.sum}</td>
                <td>
                  {tx.date
                    ? new Date(tx.date).toLocaleDateString('he-IL') // יום/חודש/שנה
                    : ''}
                </td>
                <td>{tx.categoryLabel}</td>
                <td className="actions">
                  <button
                    onClick={() => onEdit(tx)}
                    className="icon-btn edit-btn"
                    title={t('transactions.table.actions.edit')}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(tx._id)}
                    className="icon-btn delete-btn"
                    title={t('transactions.table.actions.delete')}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="table-pagination">
        <button
          type="button"
          className="table-pagination__btn"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          aria-label= {t('pagination.next')}
        >
               <ChevronLeft className="table-pagination__icon" />
            </button>
        <span className="table-pagination__info">
          {page}/{totalPages}
        </span>
        
<button
        type="button"
        className="table-pagination__btn"
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
        aria-label={t('pagination.prev')}
        >
           <ChevronRight className="table-pagination__icon" />
        </button>
        
      </div>
      <div className='export-container'>
        <button
          onClick={() => exportToExcel(filteredTransactions)}
          className="btn btn-primary export-btn">
          <Download size={16} />
          {t('transactions.table.exportExcel')}
        </button>
      </div>

    </div>
  );
};

export default TransactionsTable;
