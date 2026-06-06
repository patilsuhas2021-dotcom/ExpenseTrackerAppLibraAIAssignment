import React from 'react';
import { Edit2, Trash2, Search, Filter, Calendar, ChevronLeft, ChevronRight, RefreshCw, XCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

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

const ExpenseTable = ({
  expenses,
  pagination,
  search,
  setSearch,
  category,
  setCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  page,
  setPage,
  onEdit,
  onDelete,
  onResetFilters,
  loading
}) => {
  const { totalRecords, totalPages, currentPage, limit } = pagination;

  const handlePrevPage = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setPage(currentPage + 1);
  };

  const showingStart = totalRecords === 0 ? 0 : (currentPage - 1) * limit + 1;
  const showingEnd = Math.min(currentPage * limit, totalRecords);

  return (
    <div className="glass-panel p-6 flex flex-col gap-6">
      {/* Search and Filters bar */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-white">
              Expense Transactions
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Manage, search, and filter your logged expenses
            </p>
          </div>
          {(search || category || startDate || endDate) && (
            <button
              onClick={onResetFilters}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset page on filter
              }}
              className="w-full pl-9 pr-4 py-2 glass-input text-xs"
              placeholder="Search description..."
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Filter size={16} />
            </span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1); // Reset page on filter
              }}
              className="w-full pl-9 pr-4 py-2 glass-input text-xs appearance-none bg-no-repeat bg-[right_12px_center]"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundSize: '14px' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Calendar size={16} />
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1); // Reset page on filter
              }}
              className="w-full pl-9 pr-4 py-2 glass-input text-xs"
              placeholder="Start Date"
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Calendar size={16} />
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1); // Reset page on filter
              }}
              className="w-full pl-9 pr-4 py-2 glass-input text-xs"
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {/* Table & Cards Layout */}
      <div className="flex-grow relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
            <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm">
              <RefreshCw className="animate-spin" size={18} />
              Loading expenses...
            </div>
          </div>
        ) : null}

        {expenses.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 gap-2">
            <XCircle size={40} className="text-slate-350 dark:text-slate-700" />
            <p className="text-sm font-medium">No expenses logged matching criteria</p>
            <p className="text-xs text-slate-500">Try creating a new record or resetting filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                  {expenses.map((exp) => (
                    <tr
                      key={exp._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-[180px] truncate">
                        {exp.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-lg text-[10px] font-bold">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {formatDate(exp.expenseDate)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {exp.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 dark:text-slate-500 max-w-[200px] truncate" title={exp.notes}>
                        {exp.notes || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(exp.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(exp)}
                            className="p-1 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => onDelete(exp._id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Stack View */}
            <div className="md:hidden space-y-3">
              {expenses.map((exp) => (
                <div
                  key={exp._id}
                  className="p-4 border border-slate-150 dark:border-slate-800 rounded-xl space-y-3 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {exp.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(exp.expenseDate)}</p>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-lg text-[9px] font-bold">
                      {exp.category}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg text-[9px] font-semibold">
                      {exp.paymentMethod}
                    </span>
                  </div>

                  {exp.notes && (
                    <p className="text-slate-400 dark:text-slate-500 italic text-[11px] truncate">
                      "{exp.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onEdit(exp)}
                      className="px-2.5 py-1 text-slate-500 dark:text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(exp._id)}
                      className="px-2.5 py-1 text-slate-550 dark:text-slate-450 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Showing {showingStart} to {showingEnd} of {totalRecords} transactions
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || loading}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, idx, arr) => {
                    const showDots = idx > 0 && p - arr[idx - 1] > 1;
                    return (
                      <React.Fragment key={p}>
                        {showDots && (
                          <span className="text-slate-400 px-1 text-xs">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                            currentPage === p
                              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                              : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                  aria-label="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseTable;
