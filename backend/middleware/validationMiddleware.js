const { body, validationResult } = require('express-validator');

// Registration validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian mobile number')
];

// Login validation rules
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Profile update validation
const profileUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian mobile number')
];

// Course creation validation (for admin/instructor)
const courseValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Course name is required')
    .isLength({ min: 5, max: 100 }).withMessage('Course name must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 500 }).withMessage('Description must be between 20 and 500 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Programming', 'DSA', 'Web Development', 'Mobile Development', 'AI/ML', 'DevOps', 'Database'])
    .withMessage('Invalid category'),
  
  body('language')
    .notEmpty().withMessage('Language is required')
    .isIn(['C', 'C++', 'Python', 'JavaScript', 'Java', 'Go', 'Rust', 'SQL'])
    .withMessage('Invalid language'),
  
  body('level')
    .notEmpty().withMessage('Level is required')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid level'),
  
  body('duration')
    .isNumeric().withMessage('Duration must be a number')
    .isInt({ min: 1, max: 200 }).withMessage('Duration must be between 1 and 200 hours')
];

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  courseValidation,
  handleValidationErrors
};
