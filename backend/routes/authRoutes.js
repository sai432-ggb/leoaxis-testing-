const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMyProfile,
  updateProfile,
  changePassword,
  getUserStats
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  handleValidationErrors
} = require('../middleware/validationMiddleware');

// Public routes
router.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  registerUser
);

router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  loginUser
);

// Protected routes (require authentication)
router.get('/me', protect, getMyProfile);
router.put('/profile', protect, profileUpdateValidation, handleValidationErrors, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/stats', protect, getUserStats);

module.exports = router;
