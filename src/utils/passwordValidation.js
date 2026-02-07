// Password validation utilities

/**
 * Validates password against requirements
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isValid = 
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber;
  
  return {
    isValid,
    errors: {
      minLength: password.length < minLength,
      hasUpperCase: !hasUpperCase,
      hasLowerCase: !hasLowerCase,
      hasNumber: !hasNumber,
      hasSpecialChar: !hasSpecialChar
    }
  };
};

/**
 * Determines password strength
 * @param {string} password - Password to check
 * @returns {Object} - { level: string, color: string }
 */
export const getPasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  if (strength <= 2) return { level: 'weak', color: 'red' };
  if (strength <= 3) return { level: 'medium', color: 'orange' };
  return { level: 'strong', color: 'green' };
};
