import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { validateEmail } from '../../utils/helpers';
import { toast } from 'react-toastify';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple rapid submissions (frontend rate limiting)
    // Note: This is a basic client-side protection and can be bypassed.
    // Backend should implement proper rate limiting for security.
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      toast.warning('Please wait a moment before trying again');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setLastSubmitTime(now);

    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(true);
      toast.success(response.data.message || 'Password reset link sent to your email');
    } catch (error) {
      // For security, show same message whether email exists or not
      const errorMessage = 'If an account exists with this email, a password reset link has been sent.';
      toast.info(errorMessage);
      // Still mark as success to prevent email enumeration
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <div className="forgot-password-header">
            <h1>Check Your Email</h1>
            <p>A password reset link has been sent to {email}</p>
          </div>
          
          <div className="success-message">
            <p>Please check your email inbox (and spam folder) for the password reset link.</p>
            <p>The link will expire in 1 hour.</p>
          </div>

          <Link to="/login" className="back-to-login-btn">
            <FaArrowLeft />
            Back to Login
          </Link>

          <button 
            onClick={() => {
              setSuccess(false);
              setEmail('');
            }} 
            className="resend-link"
          >
            Didn't receive the email? Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Forgot Password?</h1>
          <p>Enter your email address and we'll send you a link to reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <Link to="/login" className="back-link">
            <FaArrowLeft />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
