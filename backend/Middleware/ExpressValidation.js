const { body, validationResult } = require("express-validator");

const signUpValidation = [
  body("name")
    .notEmpty()
    .withMessage("name cannot be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("name minimum length should be 3 and max 10"),

  body("email")
    .notEmpty()
    .withMessage("email cannot be empty")
    .isEmail()
    .withMessage("invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "manager", "employee", "finance", "hr"])
    .withMessage("Invalid role"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

const signInValidation = [

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    next();

  }

];


module.exports = {
    signInValidation,
    signUpValidation
}


