import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#64748b'  // Slate
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg">
        {label && <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">{label}</p>}
        <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardCharts = ({ categoryBreakdown, monthlyTrend }) => {
  const isDark = window.document.documentElement.classList.contains('dark');
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Line Chart - Monthly Trend */}
      <div className="glass-panel p-6 lg:col-span-3 flex flex-col h-[380px]">
        <div className="mb-4">
          <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-white">
            Monthly Expense Trend
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Overview of spending over the last 6 months
          </p>
        </div>
        <div className="flex-grow w-full h-full">
          {monthlyTrend && monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f1f5f9'} vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: '#8b5cf6', strokeWidth: 2, fill: isDark ? '#0b0f19' : '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              No trend data available
            </div>
          )}
        </div>
      </div>

      {/* Pie Chart - Category Breakdown */}
      <div className="glass-panel p-6 lg:col-span-2 flex flex-col h-[380px]">
        <div className="mb-2">
          <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-white">
            Category Breakdown
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Distribution of expenses by category
          </p>
        </div>
        <div className="flex-grow w-full h-full relative flex items-center justify-center">
          {categoryBreakdown && categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="amount"
                  nameKey="category"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value, entry, index) => (
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              No category breakdown available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
