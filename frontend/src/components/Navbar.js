import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>📝 Task Manager</h1>
        {token && (
          <div className="navbar-links">
            <div className="navbar-user">
              Welcome, <strong>{user?.username}</strong>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
