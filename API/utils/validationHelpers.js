const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  if (typeof password !== 'string') return { isValid: false, errors: ["Password must be a string"] };
  
  const errors = [];
  if (password.length < 6) errors.push("Password must be at least 6 characters long");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Password must contain at least one special character");

  return {
    isValid: errors.length === 0,
    errors
  };
};

const isValidOTP = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

const isValidContact = (contact) => {
  // Matches optional + followed by 92 and 10 digits
  const contactRegex = /^\+?92\d{10}$/;
  return contactRegex.test(contact);
};
const parseContact = (contact) => {
  if (!contact) return null;

  // Remove spaces and +
  let cleaned = contact.replace(/\s/g, "").replace(/\+/g, "");

  return cleaned;
};

const validateAndParseContact = (contact) => {
  const parsed = parseContact(contact);

  if (!parsed || !isValidContact(parsed)) {
    return {
      valid: false,
      contact: null,
    };
  }

  return {
    valid: true,
    contact: parsed,
  };
};

const isEmpty = (value) => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string' && value.trim().length === 0) return true;
  return false;
};

const hasInvisibleCharacters = (value) => {
  if (typeof value !== 'string') return false;
  // Regex for U+200E, U+200F, U+200B, U+200C, U+200D, U+00A0
  const invisibleCharsRegex = /[\u200E\u200F\u200B\u200C\u200D\u00A0]/;
  return invisibleCharsRegex.test(value);
};

const sanitizeInvisibleCharacters = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/[\u200E\u200F\u200B\u200C\u200D\u00A0]/g, '');
};

const countries = require("./countries.json");

const validateDynamicContact = (contact, shortCode) => {
  const country = countries.find(c => c.short_code === shortCode);
  if (!country) return { isValid: false, message: "Invalid or unsupported country code" };

  const phoneCode = country.phone_code; // e.g., "+92"
  
  if (!contact.startsWith(phoneCode)) {
    return { isValid: false, message: `Phone number must start with ${phoneCode} for ${country.name}` };
  }

  // Remove the phone code to get the national number
  const nationalNumber = contact.slice(phoneCode.length);
  
  // Ensure only digits remain
  if (!/^\d+$/.test(nationalNumber)) {
    return { isValid: false, message: "Phone number must contain only digits after the country code" };
  }

  const isValidLength = country.phone_number_length.includes(nationalNumber.length);
  
  if (!isValidLength) {
    return { 
      isValid: false, 
      message: `${country.name} phone number must be ${country.phone_number_length.join(' or ')} digits long (excluding country code)` 
    };
  }

  return { isValid: true };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidOTP,
  isValidContact,
  parseContact,
  validateAndParseContact,
  validateDynamicContact,
  isEmpty,
  hasInvisibleCharacters,
  sanitizeInvisibleCharacters,
};
