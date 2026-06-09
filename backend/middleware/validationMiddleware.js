const Joi = require('joi');

// Joi validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().trim().min(1).required().messages({
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required'
    }),
    email: Joi.string().trim().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('patient').default('patient')
  }),

  login: Joi.object({
    email: Joi.string().trim().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),

  forgotPassword: Joi.object({
    email: Joi.string().trim().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    })
  }),

  verifyOtp: Joi.object({
    email: Joi.string().trim().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    otp: Joi.string().length(6).required().messages({
      'string.length': 'OTP must be exactly 6 digits',
      'any.required': 'OTP is required'
    })
  }),

  resetPassword: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Token is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    })
  })
};

// Middleware function
const validateBody = (schemaName) => (req, res, next) => {
  const schema = schemas[schemaName];
  if (!schema) {
    return res.status(500).json({ success: false, message: `Validation schema '${schemaName}' not found.` });
  }

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorDetails = error.details.map(d => d.message).join(', ');
    return res.status(400).json({ success: false, message: errorDetails });
  }

  next();
};

module.exports = {
  validateBody
};
