const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// @desc    Get dashboard metrics and charts aggregation
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Calculate Total Expenses
    const totalResult = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const totalExpenses = totalResult.length > 0 ? totalResult[0].totalAmount : 0;

    // 2. Calculate Current Month Expenses
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyResult = await Expense.aggregate([
      {
        $match: {
          userId,
          expenseDate: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const monthlyExpenses = monthlyResult.length > 0 ? monthlyResult[0].totalAmount : 0;

    // 3. Get 5 Recent Transactions
    const recentTransactions = await Expense.find({ userId })
      .sort({ expenseDate: -1, createdAt: -1 })
      .limit(5);

    // 4. Category-Wise Breakdown (for Pie Chart)
    const categoryBreakdown = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { amount: -1 } }
    ]);
    const formattedCategoryData = categoryBreakdown.map((item) => ({
      category: item._id,
      amount: Math.round(item.amount * 100) / 100
    }));

    // 5. Monthly Trend for the Last 6 Months (for Line Chart)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const trendResult = await Expense.aggregate([
      {
        $match: {
          userId,
          expenseDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$expenseDate' },
            month: { $month: '$expenseDate' }
          },
          amount: { $sum: '$amount' }
        }
      }
    ]);

    // Build the ordered array of last 6 months with 0 defaults
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1; // 1-indexed

      // Find if we have aggregate data for this month
      const match = trendResult.find(
        (item) => item._id.year === year && item._id.month === monthNum
      );

      monthlyTrend.push({
        month: `${monthLabel} ${year}`,
        amount: match ? Math.round(match.amount * 100) / 100 : 0
      });
    }

    res.json({
      success: true,
      data: {
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
        recentTransactions,
        categoryBreakdown: formattedCategoryData,
        monthlyTrend
      }
    });
  } catch (error) {
    console.error('Dashboard aggregation error:', error);
    res.status(500).json({ success: false, error: 'Server error retrieving dashboard metrics' });
  }
};

module.exports = {
  getDashboardData
};
