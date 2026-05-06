const { isValidEmail, isValidPassword, validateDynamicContact, isEmpty, hasInvisibleCharacters } = require("../utils/validationHelpers");

const validateRegister = (data) => {
  const { username, password, email, address, contact, country } = data;
  const errors = {};

  const INVISIBLE_MSG = "Your input contains invisible or unsupported Unicode characters. Please remove them and try again.";

  // Check all fields for invisible characters
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string' && hasInvisibleCharacters(data[key])) {
      errors[key] = INVISIBLE_MSG;
      console.warn(`[Audit] Invisible characters detected in field: ${key}`);
    }
  });

  if (isEmpty(username)) errors.username = "Username is required";
  
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

  if (isEmpty(address)) errors.address = "Address is required";
  
  if (isEmpty(country)) {
    errors.country = "Country short code (e.g., PK, US) is required";
  }

  if (isEmpty(contact)) {
    errors.contact = "Contact is required";
  } else if (!isEmpty(country)) {
    // Dynamic validation based on country
    const contactValidation = validateDynamicContact(contact, country);
    if (!contactValidation.isValid) {
      errors.contact = contactValidation.message;
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  validateRegister,
};
