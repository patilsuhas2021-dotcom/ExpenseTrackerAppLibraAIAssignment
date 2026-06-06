const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const { validateExpense } = require('../validations/expenseValidation');
const { protect } = require('../middleware/auth');

// Protect all routes in this file
router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(validateExpense, createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(validateExpense, updateExpense)
  .delete(deleteExpense);

module.exports = router;
