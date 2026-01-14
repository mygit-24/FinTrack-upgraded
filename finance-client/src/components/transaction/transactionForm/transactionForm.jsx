import React, { useEffect, useState } from 'react';
import { getExpenseCategories } from 'api/transactionApi';
import { useAuth } from 'context/AuthContext';
import FinanceSelect from "components/common/FinanceSelect/FinanceSelect";
import FinanceDatePicker from "components/common/FinanceDatePicker/FinanceDatePicker";
import './transactionForm.scss';
import { useTranslation } from 'react-i18next';

const TransactionForm = ({ mode = 'create', initialData = null, type = 'income', onSubmit, onCancel }) => {
  const isEdit = mode === 'edit';
  const { user } = useAuth();
  const [form, setForm] = useState({
    type: 'income',
    sum: '',
    date: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const { t } = useTranslation();

  const typeOptions = [
    { value: 'income', label: t('transactions.form.typeOptions.income') },
    { value: 'expense', label: t('transactions.form.typeOptions.expense') },
  ];

  useEffect(() => {
    setForm(prev => ({ ...prev, type }));
  }, [type]);

  useEffect(() => {
    if (form.type === 'expense' && !form.category && categories.length > 0) {
      setForm(prev => ({ ...prev, category: categories[0].value }));
    }
  }, [categories, form.type]);



  useEffect(() => {
    getExpenseCategories()
      .then(res => {
        const formatted = res.data.map(cat => ({
          value: cat.value || cat,
          label: cat.label || cat
        }));
        setCategories(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        sum: initialData.sum,
        date: initialData.date?.slice(0, 10),
        type: initialData.type,
        category: initialData.category || '',
      });
    }
  }, [isEdit, initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    // debugger
    e.preventDefault();
    if (form.type === 'expense' && !form.category) {
      alert(t('transactions.form.categoryRequired'));
      return;
    }
    const transactionData = {
      user: user._id,
      type: form.type,
      sum: Number(form.sum),
      date: new Date(form.date),
      category: form.type === 'expense' ? form.category : undefined,
    };
    if (onSubmit) onSubmit(transactionData);
  };


  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h2>{isEdit
        ? t('transactions.form.titleEdit')
        : t('transactions.form.titleCreate')}
      </h2>
      {/* סוג טרנזקציה */}
      <div className="form-group">
        <label>{t('transactions.form.typeLabel')}</label>
        <FinanceSelect
          value={form.type}
          onChange={(val) => setForm(prev => ({ ...prev, type: val }))}
          options={typeOptions}
          placeholder={t('transactions.form.typePlaceholder')}
        />
      </div>
      {/* סכום */}
      <div className="form-group">
        <label>{t('transactions.form.amountLabel')}</label>
        <input
          type="number"
          name="sum"
          value={form.sum}
          onChange={handleChange}
          required
        />
      </div>
      {/* תאריך */}
      <div className="form-group">
        <label>{t('transactions.form.dateLabel')}</label>
        <FinanceDatePicker
          value={form.date}
          onChange={(val) => setForm(prev => ({ ...prev, date: val }))}
          placeholder={t('datePicker.placeholder')}
        />
      </div>

      {/* קטגוריה - רק להוצאה */}
      {form.type === 'expense' && (
        <div className="form-group">
          <label>{t('transactions.form.categoryLabel')}</label>
          <FinanceSelect
            value={form.category}
            options={categories}
            onChange={(val) => setForm(prev => ({ ...prev, category: val.value || val }))}
            placeholder={t('transactions.form.categoryPlaceholder')}
          />

        </div>
      )}
      {/* כפתורים */}
      <div className="form-buttons">
        {onCancel && <button type="button" className='btn btn-ghost' onClick={onCancel}>{t('common.cancel')}</button>}
        <button type="submit" className='btn btn-primary'>
          {isEdit
            ? t('transactions.form.submitEdit')
            : t('transactions.form.submitCreate')}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
