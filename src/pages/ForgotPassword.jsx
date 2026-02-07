import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { validateEmail } from '../utils/helpers';
import { toast } from 'react-toastify';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.data.success) {
        setSuccess(true);
        toast.success('Reset link has been sent to your email');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="success-icon">
            <FaEnvelope size={64} />
          </div>
          <div className="forgot-password-header">
            <h1>Check Your Email</h1>
            <p>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="success-note">
              Please check your email and click the link to reset your password.
              If you don't see the email, check your spam folder.
            </p>
          </div>
          
          <Link to="/login" className="back-to-login-btn">
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>🔒 Forgot Password</h1>
          <p>
            Enter your email address and we will send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
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

          <button 
            type="submit" 
            className="forgot-password-btn" 
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <Link to="/login" className="back-to-login-link">
          <FaArrowLeft /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
