// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Wraps a route so it's only accessible when a valid token
 * exists in localStorage. On failure, redirects to /admin/login
 * and passes the attempted path as `state.from` so the login
 * page can redirect back after a successful login.
 */
function ProtectedRoute({ children }) {
  const token    = localStorage.getItem('samye_admin_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
