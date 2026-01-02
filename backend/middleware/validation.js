const { body, validationResult } = require('express-validator');

/**
 * Input Validation Middleware
 * Validates request data and returns formatted errors
 */

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }

  next();
};

// User registration validation
const validateSignup = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),

  handleValidationErrors
];

// Email validation
const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  handleValidationErrors
];

// Project validation
const validateProjectCreate = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),

  body('pitch')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Project pitch must be between 1 and 2000 characters'),

  body('industry')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Industry name cannot exceed 50 characters'),

  body('stage')
    .optional()
    .isIn(['IDEA', 'VALIDATION', 'BUILDING', 'LAUNCH', 'GROWTH', 'EXIT'])
    .withMessage('Invalid project stage'),

  body('userGoal')
    .optional()
    .isLength({ max: 500 })
    .withMessage('User goal cannot exceed 500 characters'),

  body('constraints')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Constraints cannot exceed 500 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters'),

  body('revenue')
    .optional()
    .matches(/^[\$]?[\d,]+(\.\d{2})?$/)
    .withMessage('Invalid revenue format'),

  body('validationScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Validation score must be between 0 and 100'),

  handleValidationErrors
];

const validateProjectUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),

  body('pitch')
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Project pitch must be between 1 and 2000 characters'),

  body('industry')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Industry name cannot exceed 50 characters'),

  body('stage')
    .optional()
    .isIn(['IDEA', 'VALIDATION', 'BUILDING', 'LAUNCH', 'GROWTH', 'EXIT'])
    .withMessage('Invalid project stage'),

  body('userGoal')
    .optional()
    .isLength({ max: 500 })
    .withMessage('User goal cannot exceed 500 characters'),

  body('constraints')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Constraints cannot exceed 500 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters'),

  body('revenue')
    .optional()
    .matches(/^[\$]?[\d,]+(\.\d{2})?$/)
    .withMessage('Invalid revenue format'),

  body('validationScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Validation score must be between 0 and 100'),

  body('isArchived')
    .optional()
    .isBoolean()
    .withMessage('isArchived must be a boolean'),

  handleValidationErrors
];

module.exports = {
  validateSignup,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateEmail,
  validatePasswordReset,
  validateProjectCreate,
  validateProjectUpdate,
  handleValidationErrors
};
