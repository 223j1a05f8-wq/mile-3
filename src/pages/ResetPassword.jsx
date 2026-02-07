import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { isPasswordValid, getPasswordRequirements, calculatePasswordStrength } from '../utils/helpers';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import './ResetPassword.css';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  const navigate = useNavigate();
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Extract token from URL params or query string
    const urlToken = paramToken || searchParams.get('token');
    
    if (!urlToken) {
      toast.error('Invalid reset link. Please request a new password reset.');
      navigate('/forgot-password');
      return;
    }
    
    setToken(urlToken);
    verifyToken(urlToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramToken, searchParams]);

  const verifyToken = async (token) => {
    try {
      const response = await authAPI.verifyResetToken(token);
      if (response.data.success && response.data.valid) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        toast.error('This reset link has expired or is invalid. Please request a new one.');
      }
    } catch (error) {
      setTokenValid(false);
      toast.error('This reset link has expired or is invalid. Please request a new one.');
    }
  };

  useEffect(() => {
    if (newPassword) {
      const reqs = getPasswordRequirements(newPassword);
      setRequirements(reqs);
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setRequirements({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
      });
      setPasswordStrength('');
    }
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newPassword) {
      toast.error('Password is required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!isPasswordValid(newPassword)) {
      toast.error('Password does not meet requirements');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authAPI.resetPassword({
        token,
        newPassword,
        confirmPassword
      });
      
      if (response.data.success) {
        toast.success('Password reset successful! Redirecting to login...');
        
        // Clear form
        setNewPassword('');
        setConfirmPassword('');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="loading">Verifying reset link...</div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <h1>⚠️ Invalid Reset Link</h1>
            <p>
              This password reset link has expired or is invalid.
              Please request a new password reset link.
            </p>
          </div>
          
          <Link to="/forgot-password" className="forgot-password-btn-link">
            Request New Reset Link
          </Link>
          
          <Link to="/login" className="back-to-login-link">
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const getStrengthColor = () => {
    if (passwordStrength === 'weak') return '#e53e3e';
    if (passwordStrength === 'medium') return '#ed8936';
    return '#38a169';
  };

  const getStrengthWidth = () => {
    if (passwordStrength === 'weak') return '33%';
    if (passwordStrength === 'medium') return '66%';
    return '100%';
  };

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;
  const passwordsDontMatch = confirmPassword && newPassword !== confirmPassword;

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>🔑 Reset Password</h1>
          <p>Enter your new password below</p>
        </div>

        <div className="password-requirements">
          <p className="requirements-title">Password Requirements:</p>
          <ul className="requirements-list">
            <li className={requirements.minLength ? 'met' : ''}>
              {requirements.minLength ? <FaCheck /> : <FaTimes />}
              At least 8 characters
            </li>
            <li className={requirements.hasUpperCase ? 'met' : ''}>
              {requirements.hasUpperCase ? <FaCheck /> : <FaTimes />}
              One uppercase letter
            </li>
            <li className={requirements.hasLowerCase ? 'met' : ''}>
              {requirements.hasLowerCase ? <FaCheck /> : <FaTimes />}
              One lowercase letter
            </li>
            <li className={requirements.hasNumber ? 'met' : ''}>
              {requirements.hasNumber ? <FaCheck /> : <FaTimes />}
              One number
            </li>
            <li className={requirements.hasSpecialChar ? 'met' : ''}>
              {requirements.hasSpecialChar ? <FaCheck /> : <FaTimes />}
              One special character
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-bar-fill" 
                    style={{ 
                      width: getStrengthWidth(), 
                      backgroundColor: getStrengthColor() 
                    }}
                  />
                </div>
                <span 
                  className="strength-text"
                  style={{ color: getStrengthColor(), textTransform: 'capitalize' }}
                >
                  {passwordStrength}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {passwordsMatch && (
              <div className="password-match success">
                <FaCheck /> Passwords match
              </div>
            )}
            
            {passwordsDontMatch && (
              <div className="password-match error">
                <FaTimes /> Passwords do not match
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="reset-password-btn" 
            disabled={loading || !passwordsMatch || !isPasswordValid(newPassword)}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <Link to="/login" className="back-to-login-link">
          <FaArrowLeft /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
