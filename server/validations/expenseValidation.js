const { check, validationResult } = require('express-validator');

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

const validateExpense = [
  check('title', 'Title is required').notEmpty().trim(),
  check('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
  check('category', `Category must be one of: ${categories.join(', ')}`).isIn(categories),
  check('paymentMethod', `Payment method must be one of: ${paymentMethods.join(', ')}`).isIn(paymentMethods),
  check('expenseDate', 'A valid date is required').isISO8601(),
  check('notes', 'Notes cannot exceed 500 characters').optional().isLength({ max: 500 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateExpense
};
