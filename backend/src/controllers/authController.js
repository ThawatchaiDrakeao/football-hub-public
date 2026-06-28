const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const passwordMinLength = 8;

const buildAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  token: generateToken(user._id),
});

const validateRegisterInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are required");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < passwordMinLength) {
    const error = new Error("Password must be at least 8 characters");
    error.statusCode = 400;
    throw error;
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar, phone } = req.body;

    validateRegisterInput({ name, email, password });

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("Email is already registered");
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar,
      phone,
    });

    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }

    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.status(200).json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  buildAuthResponse,
  registerUser,
  loginUser,
  getMe,
  validateRegisterInput,
};
