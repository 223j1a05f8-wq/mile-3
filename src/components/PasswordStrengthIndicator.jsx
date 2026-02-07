import React from 'react';
import { getPasswordStrength } from '../utils/passwordValidation';
import './PasswordStrengthIndicator.css';

const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;
  
  const { level, color } = getPasswordStrength(password);
  
  return (
    <div className="password-strength-indicator">
      <div className="strength-bar-container">
        <div 
          className={`strength-bar strength-${level}`}
          style={{ 
            width: level === 'weak' ? '33%' : level === 'medium' ? '66%' : '100%' 
          }}
        />
      </div>
      <span className={`strength-text strength-${level}`}>
        Password strength: {level}
      </span>
    </div>
  );
};

export default PasswordStrengthIndicator;
