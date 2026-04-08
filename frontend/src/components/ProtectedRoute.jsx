import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <p>Loading session...</p>;
  if (!token) return <Navigate to="/login" replace />;

  return children;
};
