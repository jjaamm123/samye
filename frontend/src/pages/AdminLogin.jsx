// src/pages/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/admin';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );

      // Store token — key used consistently across the app
      localStorage.setItem('samye_admin_token', data.token);

      // Redirect to the originally requested page (or /admin)
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', 'Lato', sans-serif",
    }}>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
      }}>

        {/* Header stripe */}
        <div style={{
          background: '#1a5c9e',
          padding: '28px 36px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px', height: '48px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.15)',
            marginBottom: '14px',
          }}>
            {/* Shield icon (inline SVG — no external dep) */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '1.35rem',
            fontWeight: '700',
            color: '#ffffff',
            fontFamily: "'Playfair Display', serif",
            letterSpacing: '-0.3px',
          }}>
            Admin Portal
          </h1>
          <p style={{
            margin: '6px 0 0',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.2px',
          }}>
            Samye Travels — Restricted Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '32px 36px' }}>

          {/* Error message */}
          {error && (
            <div style={{
              background: 'rgba(230,57,70,0.08)',
              border: '1px solid rgba(230,57,70,0.25)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#c0392b',
              fontSize: '0.88rem',
              fontWeight: '500',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: '7px',
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              placeholder="admin@samyetravels.com"
              style={{
                width: '100%',
                padding: '11px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                color: '#0f172a',
                background: '#f8fafc',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box',
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={e => {
                e.target.style.borderColor = '#1a5c9e';
                e.target.style.boxShadow   = '0 0 0 3px rgba(26,92,158,0.12)';
                e.target.style.background  = '#ffffff';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow   = 'none';
                e.target.style.background  = '#f8fafc';
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '26px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: '7px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '11px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                color: '#0f172a',
                background: '#f8fafc',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box',
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={e => {
                e.target.style.borderColor = '#1a5c9e';
                e.target.style.boxShadow   = '0 0 0 3px rgba(26,92,158,0.12)';
                e.target.style.background  = '#ffffff';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow   = 'none';
                e.target.style.background  = '#f8fafc';
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: loading ? '#93c5fd' : '#1a5c9e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '700',
              letterSpacing: '0.3px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseOver={e => { if (!loading) { e.currentTarget.style.background = '#246ab5'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,92,158,0.4)'; }}}
            onMouseOut={e  => { e.currentTarget.style.background = loading ? '#93c5fd' : '#1a5c9e'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Authenticating…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Sign In to Admin Panel
              </>
            )}
          </button>

        </form>

        {/* Footer */}
        <div style={{
          padding: '0 36px 24px',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: '#94a3b8',
          lineHeight: '1.5',
        }}>
          This area is restricted to authorised personnel only.
          <br />Samye Travels &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default AdminLogin;
