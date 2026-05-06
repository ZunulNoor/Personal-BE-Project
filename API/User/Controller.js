const User = require("./Model");
const { connect } = require("mongoose");
const { hash, compare } = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { validateRegister } = require("../validation/userValidation");
const { validateLogin, validateOTP } = require("../validation/authValidation");
const {
  isValidEmail,
  isValidContact,
  parseContact,
  validateAndParseContact,
} = require("../utils/validationHelpers");
require("dotenv").config();

// Note: In a production app, database connection should ideally be handled at the application level
// (e.g., in index.js) rather than connecting inside every controller function.

const accCreation = async (req, res) => {
  const { errors, isValid } = validateRegister(req.body);

  if (!isValid) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const { username, password, email, address, contact, country } = req.body;

  try {
    await connect(process.env.MONGO_URI);

    const checkExisting = await User.exists({ email: email });

    if (checkExisting) {
      return res.status(409).json({
        message: "User Already Exists",
      });
    }

    await User.create({
      username,
      email,
      address,
      contact,
      country,
      password: await hash(password, 11),
    });

    return res.status(201).json({
      message: "Account Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Creating User",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const { email, password } = req.body;

  try {
    await connect(process.env.MONGO_URI);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    const tempToken = sign(
      { id: user._id, email: user.email, stage: "otp-pending" },
      process.env.SECRET_KEY,
      { expiresIn: "5m" },
    );

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP Verification!",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    return res.status(200).json({
      message: "OTP sent to email",
      tempToken,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Login error", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { errors, isValid } = validateOTP(req.body);

  if (!isValid) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const { otp } = req.body;
  const tempToken = req.headers.authorization?.split(" ")[1];

  if (!tempToken) {
    return res.status(401).json({ message: "Temp token missing" });
  }

  try {
    const decoded = verify(tempToken, process.env.SECRET_KEY);

    if (decoded.stage !== "otp-pending") {
      return res.status(403).json({ message: "Invalid token stage" });
    }

    await connect(process.env.MONGO_URI);
    const user = await User.findOne({ _id: decoded.id, email: decoded.email });

    if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const finalToken = sign(
      {
        id: user._id,
        email: user.email,
        contact: user.contact,
        role: user.role,
        username: user.username,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
    );

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      token: finalToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    await connect(process.env.MONGO_URI);
    const allusers = await User.find();
    return res.status(200).json({
      users: allusers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  try {
    await connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getUserByContact = async (req, res) => {
  let { contact } = req.params;

  if (!contact) {
    return res.status(400).json({
      message: "Contact is required",
    });
  }

  // ✅ normalize input ONLY (do not change DB)
  if (!contact.startsWith("+")) {
    contact = "+" + contact;
  }

  try {
    await connect(process.env.MONGO_URI);

    const user = await User.findOne({ contact });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  accCreation,
  login,
  verifyOTP,
  getAllUsers,
  getUserByEmail,
  getUserByContact,
};
