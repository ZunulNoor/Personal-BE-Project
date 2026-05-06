const { isValidEmail, isValidOTP, isEmpty, hasInvisibleCharacters, isValidPassword } = require("../utils/validationHelpers");

const INVISIBLE_MSG = "Your input contains invisible or unsupported Unicode characters. Please remove them and try again.";

const validateLogin = (data) => {
  const { email, password } = data;
  const errors = {};

  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string' && hasInvisibleCharacters(data[key])) {
      errors[key] = INVISIBLE_MSG;
      console.warn(`[Audit] Invisible characters detected in field: ${key}`);
    }
  });

  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (isEmpty(password)) {
    errors.password = "Password is required";
  } else {
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const validateOTP = (data) => {
  const { otp } = data;
  const errors = {};

  if (hasInvisibleCharacters(otp)) {
    errors.otp = INVISIBLE_MSG;
    console.warn(`[Audit] Invisible characters detected in field: otp`);
  }

  if (isEmpty(otp)) {
    errors.otp = "OTP is required";
  } else if (!isValidOTP(otp)) {
    errors.otp = "OTP must be a 6-digit number";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  validateLogin,
  validateOTP,
};
