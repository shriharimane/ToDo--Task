import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [validations, setValidations] = useState({
    username: false,
    email: false,
    password: false,
    match: false,
  });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');

    // Real-time validation
    const newValidations = { ...validations };
    if (name === 'username') {
      newValidations.username = value.length >= 3;
    } else if (name === 'email') {
      newValidations.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (name === 'password') {
      newValidations.password = value.length >= 6;
      newValidations.match = value === formData.confirmPassword && value.length > 0;
    } else if (name === 'confirmPassword') {
      newValidations.match = value === formData.password && value.length > 0;
    }
    setValidations(newValidations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-shape shape-1"></div>
        <div className="auth-shape shape-2"></div>
        <div className="auth-shape shape-3"></div>
      </div>

      <div className="auth-container">
        {/* Left Side - Welcome Message */}
        <div className="auth-welcome">
          <div className="welcome-content">
            <div className="welcome-icon">🚀</div>
            <h1 className="welcome-title">Join Us Today!</h1>
            <p className="welcome-subtitle">Start managing tasks like a pro</p>

            <ul className="features-list">
              <li>✅ Free account creation</li>
              <li>✅ Start managing immediately</li>
              <li>✅ Collaborate with your team</li>
              <li>✅ No credit card required</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="auth-form-container">
          <div className="auth-form-card">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Join the task management revolution</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-alert" role="alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
                <button className="error-close" onClick={() => setError('')}>✕</button>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <span className="field-icon">👤</span>
                  Username
                  {validations.username && <span className="validation-icon">✓</span>}
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a unique username"
                  className="form-input"
                  minLength="3"
                  required
                />
                {formData.username && !validations.username && (
                  <span className="field-hint error">Min 3 characters required</span>
                )}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="field-icon">📧</span>
                  Email Address
                  {validations.email && <span className="validation-icon">✓</span>}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="form-input"
                  required
                />
                {formData.email && !validations.email && (
                  <span className="field-hint error">Please enter a valid email</span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span className="field-icon">🔒</span>
                  Password
                  {validations.password && <span className="validation-icon">✓</span>}
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  minLength="6"
                  required
                />
                {formData.password && !validations.password && (
                  <span className="field-hint error">Min 6 characters required</span>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span className="field-icon">🔒</span>
                  Confirm Password
                  {validations.match && <span className="validation-icon">✓</span>}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
                {formData.confirmPassword && !validations.match && (
                  <span className="field-hint error">Passwords don't match</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-login"
                disabled={loading || !validations.username || !validations.email || !validations.password || !validations.match}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="btn-icon">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
