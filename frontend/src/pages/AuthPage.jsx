import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ mode }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload =
        mode === 'register'
          ? form
          : {
              email: form.email,
              password: form.password
            };
      const data = mode === 'register' ? await apiClient.register(payload) : await apiClient.login(payload);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <form className="card auth" onSubmit={handleSubmit}>
        <h2>{mode === 'register' ? 'Create account' : 'Login'}</h2>
        {mode === 'register' && (
          <input required name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        )}
        <input required type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input
          required
          minLength={6}
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'register' ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  );
};
