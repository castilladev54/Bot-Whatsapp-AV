// src/utils/validationUtils.js
function validateField(value) {
  return value && typeof value === 'string' && value.trim().length > 0;
}

module.exports = { validateField };