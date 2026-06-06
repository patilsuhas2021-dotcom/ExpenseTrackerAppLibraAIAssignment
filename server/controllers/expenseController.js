const Expense = require('../models/Expense');

// @desc    Get all user expenses with filter, search, sorting, and pagination
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { search, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Base query linked to the logged-in user
    const query = { userId: req.user._id };

    // Search by title or category (case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by exact category matches
    if (category) {
      query.category = category;
    }

    // Filter by date range (inclusive)
    if (startDate || endDate) {
      query.expenseDate = {};
      if (startDate) {
        query.expenseDate.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to the end of the specified day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.expenseDate.$lte = end;
      }
    }

    // Setup pagination parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skipNum = (pageNum - 1) * limitNum;

    // Retrieve count and records concurrently
    const [totalRecords, expenses] = await Promise.all([
      Expense.countDocuments(query),
      Expense.find(query)
        .sort({ expenseDate: -1, createdAt: -1 })
        .skip(skipNum)
        .limit(limitNum)
    ]);

    const totalPages = Math.ceil(totalRecords / limitNum);

    res.json({
      success: true,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
      },
      expenses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error retrieving expenses' });
  }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense record not found' });
    }

    res.json({ success: true, expense });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Expense record not found' });
    }
    res.status(500).json({ success: false, error: 'Server error retrieving expense details' });
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, notes, expenseDate } = req.body;

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount,
      category,
      paymentMethod,
      notes,
      expenseDate: expenseDate || new Date()
    });

    res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error creating expense' });
  }
};

// @desc    Update an existing expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, notes, expenseDate } = req.body;

    let expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense record not found' });
    }

    expense.title = title || expense.title;
    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.category = category || expense.category;
    expense.paymentMethod = paymentMethod || expense.paymentMethod;
    expense.notes = notes !== undefined ? notes : expense.notes;
    expense.expenseDate = expenseDate || expense.expenseDate;

    await expense.save();

    res.json({ success: true, expense });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Expense record not found' });
    }
    res.status(500).json({ success: false, error: 'Server error updating expense' });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense record not found' });
    }

    res.json({ success: true, message: 'Expense record successfully removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Expense record not found' });
    }
    res.status(500).json({ success: false, error: 'Server error deleting expense' });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
