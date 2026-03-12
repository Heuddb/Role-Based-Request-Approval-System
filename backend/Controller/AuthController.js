const UserModel = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let sign_in = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const userDoc = await UserModel.findOne({ email });

    if (!userDoc) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let isMatched = await bcrypt.compare(password, userDoc.password);

    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: userDoc._id,
        role: userDoc.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

let sign_up = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const userDoc = await UserModel.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    const token = jwt.sign(
      {
        id: userDoc._id,
        role: userDoc.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user:userDoc.role
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

let forgot_password = async (req, res, next) => {};

let sign_out = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  sign_in,
  sign_up,
  forgot_password,
  sign_out,
};


