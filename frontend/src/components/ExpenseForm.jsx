import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, CreditCard, FileText } from 'lucide-react';
import { formatDateForInput } from '../utils/formatters';

const categories = [
  'Food',
  'Travel',
  'Bills & Utilities',
  'Shopping',
  'Entertainment',
  'Health & Medical',
  'Education',
  'House Keeping',
  'Others'
];

const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Other'];

const ExpenseForm = ({ isOpen, onClose, onSubmit, expense = null }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [notes, setNotes] = useState('');
  const [expenseDate, setExpenseDate] = useState(formatDateForInput(new Date()));
  const [errors, setErrors] = useState({});

  // Reset or prefill form when modal state or current expense changes
  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setPaymentMethod(expense.paymentMethod);
      setNotes(expense.notes || '');
      setExpenseDate(formatDateForInput(expense.expenseDate));
    } else {
      setTitle('');
      setAmount('');
      setCategory(categories[0]);
      setPaymentMethod(paymentMethods[0]);
      setNotes('');
      setExpenseDate(formatDateForInput(new Date()));
    }
    setErrors({});
  }, [expense, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    } else if (title.length > 100) {
      errs.title = 'Title cannot exceed 100 characters';
    }

    if (!amount) {
      errs.amount = 'Amount is required';
    } else {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        errs.amount = 'Amount must be a positive number';
      }
    }

    if (!expenseDate) {
      errs.expenseDate = 'Date is required';
    }

    if (notes && notes.length > 500) {
      errs.notes = 'Notes cannot exceed 500 characters';
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      paymentMethod,
      notes: notes.trim(),
      expenseDate: new Date(expenseDate).toISOString()
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-6 relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="mb-6">
          <h2 className="font-outfit text-xl font-extrabold text-slate-900 dark:text-white">
            {expense ? 'Edit Expense Record' : 'Add New Expense'}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {expense ? 'Modify the details of your recorded transaction' : 'Fill in the information to log a new purchase'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Title / Description
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FileText size={16} />
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 glass-input text-sm ${
                  errors.title ? 'border-rose-400 focus:ring-rose-500/20' : ''
                }`}
                placeholder="e.g. Weekly Groceries"
              />
            </div>
            {errors.title && <p className="text-[11px] text-rose-500 font-medium">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Amount ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <DollarSign size={16} />
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 glass-input text-sm ${
                    errors.amount ? 'border-rose-400 focus:ring-rose-500/20' : ''
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.amount}</p>
              )}
            </div>

            {/* Date input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Expense Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 glass-input text-sm ${
                    errors.expenseDate ? 'border-rose-400 focus:ring-rose-500/20' : ''
                  }`}
                />
              </div>
              {errors.expenseDate && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.expenseDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Category
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Tag size={16} />
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 glass-input text-sm appearance-none bg-no-repeat bg-[right_12px_center]"
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundSize: '16px' }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Method selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Payment Method
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <CreditCard size={16} />
                </span>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 glass-input text-sm appearance-none bg-no-repeat bg-[right_12px_center]"
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundSize: '16px' }}
                >
                  {paymentMethods.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Notes / Remarks (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full px-4 py-2 glass-input text-sm h-20 resize-none ${
                errors.notes ? 'border-rose-400 focus:ring-rose-500/20' : ''
              }`}
              placeholder="Provide any additional notes or details..."
            />
            {errors.notes && <p className="text-[11px] text-rose-500 font-medium">{errors.notes}</p>}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 active:scale-[0.98] rounded-xl transition-all shadow-md shadow-primary-500/20"
            >
              {expense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
