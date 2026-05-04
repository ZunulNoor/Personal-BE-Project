const User = require("./Model");
const { connect } = require("mongoose");
const { hash, compare } = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const accCreation = async (req, res) => {
  const { username, password, email, address, contact } = req.body;

  try {
    await connect(process.env.MONGO_URI);

    const checkExisting = await User.exists({ email: email });

    if (checkExisting) {
      res.status(208).json({
        message: "User Already Exists",
      });
    } else {
      await User.create({
        username,
        email,
        address,
        contact,
        password: await hash(password, 11),
      });
      res.status(201).json({
        message: "Account Created Successfully",
      });
    }
  } catch (error) {
    res.json({
      message: "Erorr Creating User",
      error: error,
    });
  }
};

const login = async (req, res) => {
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
    console.log(error);
    return res.status(500).json({ message: "Login error", error });
  }
};

const verifyOTP = async (req, res) => {
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
    return res.status(500).json({ message: "OTP verification failed", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    await connect(process.env.MONGO_URI);
    const allusers = await User.find();
    res.json({
      users: allusers,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    await connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: email });
    res.json({ user: user });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getUserByContact = async (req, res) => {
  const { contact } = req.params;
  try {
    await connect(process.env.MONGO_URI);
    const user = await User.findOne({ contact: contact });
    res.json({ user: user });
  } catch (error) {
    res.status(400).json({
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
