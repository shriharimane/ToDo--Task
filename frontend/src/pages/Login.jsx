import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  // Quick demo login
  const quickLogin = (email, password) => {
    setFormData({ email, password });
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
            <div className="welcome-icon">📋</div>
            <h1 className="welcome-title">Task Master</h1>
            <p className="welcome-subtitle">Manage your team's tasks efficiently</p>
            
            <ul className="features-list">
              <li>✅ Create & assign tasks</li>
              <li>✅ Track progress in real-time</li>
              <li>✅ Role-based permissions</li>
              <li>✅ Beautiful dashboard</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-container">
          <div className="auth-form-card">
            <div className="form-header">
              <h2>Welcome Back!</h2>
              <p>Sign in to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-alert" role="alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
                <button className="error-close" onClick={() => setError('')}>✕</button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="field-icon">📧</span>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="form-input"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span className="field-icon">🔒</span>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="btn-icon">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="form-divider">
              <span>or try demo accounts</span>
            </div>

            {/* Demo Credentials */}
            <div className="demo-section">
              <div className="demo-user demo-user-1">
                <div className="demo-avatar john">J</div>
                <div className="demo-info">
                  <p className="demo-name">John (Creator)</p>
                  <p className="demo-email">john@example.com</p>
                </div>
                <button
                  type="button"
                  className="btn-quick-login"
                  onClick={() => quickLogin('john@example.com', 'password123')}
                  disabled={loading}
                >
                  Try
                </button>
              </div>

              <div className="demo-user demo-user-2">
                <div className="demo-avatar jane">J</div>
                <div className="demo-info">
                  <p className="demo-name">Jane (Assignee)</p>
                  <p className="demo-email">jane@example.com</p>
                </div>
                <button
                  type="button"
                  className="btn-quick-login"
                  onClick={() => quickLogin('jane@example.com', 'password456')}
                  disabled={loading}
                >
                  Try
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
