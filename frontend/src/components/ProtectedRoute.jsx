// src/components/ProtectedRoute.jsx
// Guards the /admin route.
//
// Auth strategy: JWT stored in localStorage.
// localStorage.getItem() is synchronous — there is no async token verification
// happening client-side (the actual JWT validation happens on the Express API).
// Therefore there is no race condition on the initial read.
//
// However, we add a one-tick `isChecking` phase (resolved via useEffect) to
// prevent a flash-of-redirect in edge cases where React 18's StrictMode
// double-invokes effects, and to leave a clean hook point for future async
// token validation (e.g., hitting a /api/auth/verify endpoint).
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Inline full-page spinner — no external CSS dependency needed here
function AuthSpinner() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
      gap: '16px',
    }}>
      <style>{`
        @keyframes pr-spin { to { transform: rotate(360deg); } }
        .pr-spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.12);
          border-top-color: #1a5c9e;
          border-radius: 50%;
          animation: pr-spin 0.75s linear infinite;
        }
      `}</style>
      <div className="pr-spinner" />
      <p style={{
        color: 'rgba(255,255,255,0.45)',
        fontSize: '0.85rem',
        fontFamily: "'Inter', sans-serif",
        margin: 0,
      }}>
        Verifying session…
      </p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const location = useLocation();

  // isChecking: true during the first tick while we read localStorage.
  // This prevents a premature redirect in React 18 StrictMode and provides
  // a clean extension point if you ever add async token validation.
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed,   setIsAuthed]   = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('samye_admin_token');
    setIsAuthed(Boolean(token));
    setIsChecking(false);
  }, []); // runs once on mount

  // Phase 1: Still reading — show spinner, not redirect, not null
  if (isChecking) return <AuthSpinner />;

  // Phase 2: Unauthenticated — redirect, preserve the attempted URL
  if (!isAuthed) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Phase 3: Authenticated — render the guarded content
  return children;
}

export default ProtectedRoute;
