import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import DashboardCharts from '../components/DashboardCharts';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseForm from '../components/ExpenseForm';
import { getDashboardData } from '../services/dashboardService';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../services/expenseService';
import { Plus, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  // Stats state
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Expense List & Filter states
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 1, currentPage: 1, limit: 10 });
  const [listLoading, setListLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeExpense, setActiveExpense] = useState(null);

  // Error State
  const [dashboardError, setDashboardError] = useState('');

  // Fetch dashboard summary metrics
  const fetchDashboardStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await getDashboardData();
      if (res.success) {
        const { totalExpenses, monthlyExpenses, categoryBreakdown, monthlyTrend } = res.data;
        setTotalExpenses(totalExpenses);
        setMonthlyExpenses(monthlyExpenses);
        setCategoryBreakdown(categoryBreakdown);
        setMonthlyTrend(monthlyTrend);
      }
    } catch (err) {
      console.error('Failed to load dashboard insights', err);
      setDashboardError('Could not fetch financial metrics.');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch paginated expenses table
  const fetchExpensesList = useCallback(async () => {
    setListLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await getExpenses(params);
      if (res.success) {
        setExpenses(res.expenses);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to load expenses list', err);
    } finally {
      setListLoading(false);
    }
  }, [search, category, startDate, endDate, page]);

  // Load initial data
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Sync expenses list with filter updates
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchExpensesList();
    }, 300); // Debounce search calls

    return () => clearTimeout(delayDebounceFn);
  }, [fetchExpensesList]);

  // Reset filter selections
  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  // Open Add modal
  const handleOpenAddModal = () => {
    setActiveExpense(null);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (expense) => {
    setActiveExpense(expense);
    setIsModalOpen(true);
  };

  // CRUD Operations handler
  const handleFormSubmit = async (payload) => {
    try {
      if (activeExpense) {
        // Edit Mode
        const res = await updateExpense(activeExpense._id, payload);
        if (res.success) {
          fetchExpensesList();
          fetchDashboardStats();
        }
      } else {
        // Create Mode
        const res = await createExpense(payload);
        if (res.success) {
          setPage(1); // Return to first page to see newest item
          fetchExpensesList();
          fetchDashboardStats();
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving expense:', err);
      alert(err.response?.data?.error || 'Failed to submit expense details.');
    }
  };

  // Delete transaction
  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        const res = await deleteExpense(id);
        if (res.success) {
          fetchExpensesList();
          fetchDashboardStats();
        }
      } catch (err) {
        console.error('Error deleting expense:', err);
        alert('Failed to delete expense record.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fade-in">
        {/* Header & New Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500/10 text-primary-600 dark:text-primary-400 p-2.5 rounded-2xl">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Dashboard Overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
                Track and manage your everyday financial activities
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto px-5 py-3 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white text-sm font-semibold rounded-2xl shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Plus size={18} />
            Log New Expense
          </button>
        </div>

        {/* Financial KPI Cards */}
        <SummaryCards
          totalExpenses={totalExpenses}
          monthlyExpenses={monthlyExpenses}
          categoryBreakdown={categoryBreakdown}
        />

        {/* Charts Section */}
        <DashboardCharts
          categoryBreakdown={categoryBreakdown}
          monthlyTrend={monthlyTrend}
        />

        {/* Table Transaction History */}
        <ExpenseTable
          expenses={expenses}
          pagination={pagination}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          page={page}
          setPage={setPage}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteExpense}
          onResetFilters={handleResetFilters}
          loading={listLoading}
        />
      </div>

      {/* Add/Edit Modal */}
      <ExpenseForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        expense={activeExpense}
      />
    </div>
  );
};

export default Dashboard;
