import React from 'react';
import { DollarSign, Calendar, TrendingUp, Award } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const SummaryCards = ({ totalExpenses, monthlyExpenses, categoryBreakdown }) => {
  // Find the top category
  const topCategory = categoryBreakdown && categoryBreakdown.length > 0
    ? categoryBreakdown[0]
    : null;

  const topCategoryPercentage = topCategory && totalExpenses > 0
    ? Math.round((topCategory.amount / totalExpenses) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Total Expenses Card */}
      <div className="glass-panel p-6 relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-primary-500 pointer-events-none">
          <DollarSign size={80} />
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 p-3 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Expenses
            </span>
            <h3 className="font-outfit text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(totalExpenses)}
            </h3>
          </div>
        </div>
        <div className="mt-4 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <span className="text-emerald-500 flex items-center font-bold">All-time</span> recorded spendings
        </div>
      </div>

      {/* Monthly Expenses Card */}
      <div className="glass-panel p-6 relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-violet-500 pointer-events-none">
          <Calendar size={80} />
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 p-3 rounded-2xl">
            <Calendar size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              This Month's Spending
            </span>
            <h3 className="font-outfit text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(monthlyExpenses)}
            </h3>
          </div>
        </div>
        <div className="mt-4 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
          For the month of <span className="text-violet-500 font-semibold">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Top Spending Category Card */}
      <div className="glass-panel p-6 relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500 pointer-events-none">
          <Award size={80} />
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 p-3 rounded-2xl">
            <Award size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Top Category
            </span>
            <h3 className="font-outfit text-2xl font-extrabold text-slate-900 dark:text-white mt-1 truncate max-w-[200px]">
              {topCategory ? topCategory.category : 'N/A'}
            </h3>
          </div>
        </div>
        <div className="mt-4 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span>
            {topCategory
              ? `Spent ${formatCurrency(topCategory.amount)}`
              : 'No expenses logged'}
          </span>
          {topCategory && (
            <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              {topCategoryPercentage}% of total
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
