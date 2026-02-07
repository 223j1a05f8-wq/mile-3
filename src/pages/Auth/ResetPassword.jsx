import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { validatePassword } from '../../utils/passwordValidation';
import { toast } from 'react-toastify';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get('token');
  
  // Get token from URL (either parameter or query)
  const token = paramToken || queryToken;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  // Verify token on mount (optional)
  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link. Token is missing.');
      setTokenValid(false);
      return;
    }

    // Optional: Verify token before user enters password
    const verifyToken = async () => {
      try {
        await authAPI.verifyResetToken(token);
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        toast.error('This reset link is invalid or has expired.');
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Real-time validation for new password
    if (e.target.name === 'newPassword') {
      const validation = validatePassword(e.target.value);
      if (!validation.isValid) {
        const errors = [];
        if (validation.errors.minLength) errors.push('At least 8 characters');
        if (validation.errors.hasUpperCase) errors.push('At least one uppercase letter');
        if (validation.errors.hasLowerCase) errors.push('At least one lowercase letter');
        if (validation.errors.hasNumber) errors.push('At least one number');
        setValidationErrors(errors);
      } else {
        setValidationErrors([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const validation = validatePassword(formData.newPassword);
    if (!validation.isValid) {
      toast.error('Password does not meet the requirements');
      return;
    }

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword(token, formData.newPassword);
      
      // Clear sensitive data from memory
      setFormData({ newPassword: '', confirmPassword: '' });
      
      setSuccess(true);
      toast.success(response.data.message || 'Password has been reset successfully');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.';
      toast.error(errorMessage);
      
      // If token is expired/invalid, redirect to forgot password after showing error
      if (error.response?.status === 400 || error.response?.status === 404) {
        setTimeout(() => {
          navigate('/forgot-password');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>
          <div className="reset-password-header">
            <h1>Invalid Reset Link</h1>
            <p>This password reset link is invalid or has expired</p>
          </div>
          
          <div className="error-message">
            <p>Password reset links expire after 1 hour for security reasons.</p>
            <p>Please request a new password reset link.</p>
          </div>

          <button 
            onClick={() => navigate('/forgot-password')}
            className="submit-btn"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  // Show success state
  if (success) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <div className="reset-password-header">
            <h1>Password Reset Successful!</h1>
            <p>Your password has been changed successfully</p>
          </div>
          
          <div className="success-message">
            <p>You can now log in with your new password.</p>
            <p>Redirecting to login page in 3 seconds...</p>
          </div>

          <button 
            onClick={() => navigate('/login')}
            className="submit-btn"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">
              <FaLock className="input-icon" />
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <PasswordStrengthIndicator password={formData.newPassword} />
            {validationErrors.length > 0 && (
              <div className="validation-errors">
                <p>Password must contain:</p>
                <ul>
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <FaLock className="input-icon" />
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm new password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <div className="password-mismatch">
                Passwords do not match
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading || validationErrors.length > 0}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="password-requirements">
          <p><strong>Password Requirements:</strong></p>
          <ul>
            <li>At least 8 characters long</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
