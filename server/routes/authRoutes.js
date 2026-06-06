const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateTheme } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validations/authValidation');
const { protect } = require('../middleware/auth');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.put('/theme', protect, updateTheme);

module.exports = router;
