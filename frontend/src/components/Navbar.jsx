import { useState, useRef, useEffect } from 'react';

import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import {
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';

import MedCheckLogo from './MedCheckLogo';
import { authAPI } from '../services/api';

function Navbar({ user, onLogout }) {

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const profileRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();

  // Reset password modal states
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetErrors, setResetErrors] = useState({});
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Close profile dropdown on outside click
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };

  }, []);

  // Logout
  const handleLogout = () => {

    localStorage.removeItem('user');

    localStorage.removeItem('token');

    onLogout();

    navigate('/login');
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const errors = {};
    if (!currentPassword.trim()) {
      errors.currentPassword = 'Current password is required.';
    }
    if (!newPassword.trim()) {
      errors.newPassword = 'New password is required.';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters.';
    }
    if (confirmNewPassword !== newPassword) {
      errors.confirmNewPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setResetErrors(errors);
      return;
    }

    setResetLoading(true);
    setResetErrors({});

    try {
      await authAPI.changePassword({
        currentPassword,
        newPassword,
      });

      setResetSuccess(true);
      
      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      setTimeout(() => {
        setResetPasswordOpen(false);
        setResetSuccess(false);
      }, 1550);

    } catch (err) {
      setResetErrors({
        submit: err.message || 'Failed to change password. Please try again.',
      });
    } finally {
      setResetLoading(false);
    }
  };

  // Active Nav
  const isActive = (path) => {
    // parse the target path
    const url = new URL(path, window.location.origin);
    if (url.pathname !== location.pathname) {
      return false;
    }
    const targetTab = url.searchParams.get('tab');
    const currentParams = new URLSearchParams(location.search);
    const currentTab = currentParams.get('tab');
    
    if (!targetTab) {
      return !currentTab || currentTab === 'overview';
    }
    
    return currentTab === targetTab;
  };

  // Nav Link
  const navLink = (to, label) => (
    <Link
      to={to}
      style={{
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
        padding: '8px 14px',
        borderRadius: 10,
        transition: 'all 0.2s',
        color: isActive(to)
          ? '#0EA5E9'
          : '#475569',
        background: isActive(to)
          ? '#EFF9FF'
          : 'transparent',
      }}
      onMouseOver={(e) => {
        if (!isActive(to)) {
          e.currentTarget.style.color =
            '#0f172a';

          e.currentTarget.style.background =
            '#f8fafc';
        }
      }}
      onMouseOut={(e) => {
        if (!isActive(to)) {
          e.currentTarget.style.color =
            '#475569';

          e.currentTarget.style.background =
            'transparent';
        }
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav
      style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow:
          '0 1px 8px rgba(0,0,0,0.05)',
        fontFamily:
          "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');
      `}</style>

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 72,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <MedCheckLogo size="sm" />
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          className="desktop-nav"
        >
          {!user && (
            <>
              {navLink('/', 'Home')}
              {navLink('/about', 'About Us')}
              {navLink('/medical-disclaimer', 'Disclaimer')}
            </>
          )}

          {user ? (
            <>
              {navLink(
                '/patient/dashboard',
                'Dashboard'
              )}

              {navLink(
                '/symptom-checker',
                'Check Symptoms'
              )}

              {navLink(
                '/patient/dashboard?tab=statistics',
                'Health Statistics'
              )}

              {navLink(
                '/patient/dashboard?tab=medicine',
                'Medicine Checker'
              )}

              {navLink(
                '/patient/dashboard?tab=tips',
                'Daily AI Tips'
              )}

              {/* Divider */}
              <div
                style={{
                  width: 1,
                  height: 22,
                  background: '#e2e8f0',
                  margin: '0 10px',
                }}
              />

              {/* Profile Dropdown */}
              <div
                ref={profileRef}
                style={{
                  position: 'relative',
                }}
              >
                {/* Profile Button */}
                <button
                  onClick={() =>
                    setProfileOpen(
                      !profileOpen
                    )
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background:
                      'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding:
                      '6px 10px',
                    borderRadius: 12,
                    transition:
                      'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius:
                        '50%',
                      background:
                        'linear-gradient(135deg, #0EA5E9, #38BDF8)',
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      color: 'white',
                      boxShadow:
                        '0 4px 12px rgba(14,165,233,0.3)',
                    }}
                  >
                    <User size={18} />
                  </div>

                  <ChevronDown
                    size={16}
                    color="#64748b"
                  />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div
                    style={{
                      position:
                        'absolute',
                      top: 56,
                      right: 0,
                      width: 250,
                      background:
                        'white',
                      borderRadius: 18,
                      border:
                        '1px solid #e2e8f0',
                      boxShadow:
                        '0 14px 40px rgba(15,23,42,0.12)',
                      overflow:
                        'hidden',
                      zIndex: 100,
                    }}
                  >
                    {/* User Info */}
                    <div
                      style={{
                        padding: '18px',
                        borderBottom:
                          '1px solid #f1f5f9',
                        background:
                          '#f8fafc',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color:
                            '#0f172a',
                          marginBottom: 4,
                        }}
                      >
                        {user.name ||
                          'User'}
                      </div>

                      <div
                        style={{
                          fontSize: 13,
                          color:
                            '#64748b',
                          wordBreak:
                            'break-word',
                        }}
                      >
                        {user.email}
                      </div>
                    </div>

                    {/* Menu */}
                    <div
                      style={{
                        padding: 8,
                      }}
                    >
                      {/* Dashboard */}
                      <Link
                        to="/patient/dashboard"
                        onClick={() =>
                          setProfileOpen(
                            false
                          )
                        }
                        style={{
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap: 10,
                          padding:
                            '12px 14px',
                          borderRadius:
                            12,
                          textDecoration:
                            'none',
                          color:
                            '#334155',
                          fontSize: 14,
                          fontWeight: 500,
                          transition:
                            'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background =
                            '#EFF9FF';

                          e.currentTarget.style.color =
                            '#0EA5E9';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            'transparent';

                          e.currentTarget.style.color =
                            '#334155';
                        }}
                      >
                        <LayoutDashboard
                          size={18}
                        />
                        Dashboard
                      </Link>

                      {/* Reset Password */}
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          setResetPasswordOpen(true);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '12px 14px',
                          borderRadius: 12,
                          border: 'none',
                          background: 'transparent',
                          color: '#334155',
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: 'pointer',
                          marginTop: 4,
                          transition: 'all 0.2s',
                          textAlign: 'left',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#EFF9FF';
                          e.currentTarget.style.color = '#0EA5E9';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#334155';
                        }}
                      >
                        <Key size={18} />
                        Reset Password
                      </button>

                      {/* Logout */}
                      <button
                        onClick={
                          handleLogout
                        }
                        style={{
                          width: '100%',
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap: 10,
                          padding:
                            '12px 14px',
                          borderRadius:
                            12,
                          border:
                            'none',
                          background:
                            'transparent',
                          color:
                            '#DC2626',
                          fontSize: 14,
                          fontWeight: 500,
                          cursor:
                            'pointer',
                          marginTop: 4,
                          transition:
                            'all 0.2s',
                          fontFamily:
                            'DM Sans, sans-serif',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background =
                            '#FEF2F2';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            'transparent';
                        }}
                      >
                        <LogOut
                          size={18}
                        />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#475569',
                  textDecoration:
                    'none',
                  padding:
                    '8px 16px',
                  borderRadius: 10,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color =
                    '#0f172a';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color =
                    '#475569';
                }}
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'white',
                  textDecoration:
                    'none',
                  padding:
                    '10px 22px',
                  borderRadius: 50,
                  background:
                    '#0EA5E9',
                  boxShadow:
                    '0 4px 14px rgba(14,165,233,0.3)',
                  transition:
                    'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    '#0284c7';

                  e.currentTarget.style.boxShadow =
                    '0 6px 18px rgba(14,165,233,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    '#0EA5E9';

                  e.currentTarget.style.boxShadow =
                    '0 4px 14px rgba(14,165,233,0.3)';
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setMobileMenuOpen(
              !mobileMenuOpen
            )
          }
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <div
            style={{
              width: 24,
              height: 2,
              background: '#475569',
              borderRadius: 2,
              marginBottom: 5,
            }}
          />
          <div
            style={{
              width: 24,
              height: 2,
              background: '#475569',
              borderRadius: 2,
              marginBottom: 5,
            }}
          />
          <div
            style={{
              width: 24,
              height: 2,
              background: '#475569',
              borderRadius: 2,
            }}
          />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop:
              '1px solid #f1f5f9',
            background: 'white',
            padding:
              '12px 24px 20px',
          }}
        >
          {!user && (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                About Us
              </Link>
              <Link
                to="/medical-disclaimer"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                Disclaimer
              </Link>
            </>
          )}

          {user ? (
            <>
              {[
                { to: '/patient/dashboard', label: 'Dashboard' },
                { to: '/symptom-checker', label: 'Check Symptoms' },
                { to: '/patient/dashboard?tab=statistics', label: 'Health Statistics' },
                { to: '/patient/dashboard?tab=medicine', label: 'Medicine Checker' },
                { to: '/patient/dashboard?tab=tips', label: 'Daily AI Tips' }
              ].map((lnk) => (
                <Link
                  key={lnk.to}
                  to={lnk.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '10px 14px',
                    margin: '4px 0',
                    borderRadius: '8px',
                    color: isActive(lnk.to) ? '#0EA5E9' : '#475569',
                    background: isActive(lnk.to) ? '#EFF9FF' : 'transparent',
                    textDecoration: 'none',
                    fontSize: 15,
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  {lnk.label}
                </Link>
              ))}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setResetPasswordOpen(true);
                }}
                style={{
                  marginTop: 10,
                  width: '100%',
                  padding: '12px',
                  background: '#F0F9FF',
                  color: '#0EA5E9',
                  border: '1px solid #B9E6FE',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Reset Password
              </button>

              <button
                onClick={
                  handleLogout
                }
                style={{
                  marginTop: 10,
                  width: '100%',
                  padding: '12px',
                  background:
                    '#FEF2F2',
                  color: '#DC2626',
                  border:
                    '1px solid #FECACA',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily:
                    'DM Sans, sans-serif',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                style={{
                  display: 'block',
                  padding: '10px 0',
                  color: '#475569',
                  textDecoration:
                    'none',
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                style={{
                  display: 'block',
                  marginTop: 8,
                  padding: '12px',
                  background:
                    '#0EA5E9',
                  color: 'white',
                  textDecoration:
                    'none',
                  borderRadius: 10,
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      )}

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }

          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>

      {/* ── RESET PASSWORD MODAL ── */}
      {resetPasswordOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '24px',
              padding: '32px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} color="#0ea5e9" /> Reset Password
              </h2>
              <button 
                onClick={() => {
                  setResetPasswordOpen(false);
                  setResetErrors({});
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }} 
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = '#0f172a'}
                onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
              >
                ✕
              </button>
            </div>

            {resetSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                  ✓
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '500', color: '#0f172a' }}>Password Updated!</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Your password has been changed successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {resetErrors.submit && (
                  <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', fontSize: '13px', color: '#991b1b' }}>
                    {resetErrors.submit}
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      style={{
                        width: '100%',
                        padding: '12px 40px 12px 14px',
                        borderRadius: '12px',
                        border: resetErrors.currentPassword ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {resetErrors.currentPassword && (
                    <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{resetErrors.currentPassword}</span>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      style={{
                        width: '100%',
                        padding: '12px 40px 12px 14px',
                        borderRadius: '12px',
                        border: resetErrors.newPassword ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {resetErrors.newPassword && (
                    <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{resetErrors.newPassword}</span>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      style={{
                        width: '100%',
                        padding: '12px 40px 12px 14px',
                        borderRadius: '12px',
                        border: resetErrors.confirmNewPassword ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {resetErrors.confirmNewPassword && (
                    <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{resetErrors.confirmNewPassword}</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button 
                    type="button"
                    onClick={() => {
                      setResetPasswordOpen(false);
                      setResetErrors({});
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                    }} 
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: 'white', fontSize: '14px', fontWeight: '600', color: '#64748b', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => { e.target.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'white'; }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={resetLoading} 
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: resetLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 8px 25px rgba(14, 165, 233, 0.2)',
                      transition: 'all 0.3s ease',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onMouseEnter={(e) => { if (!resetLoading) e.target.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'none'; }}
                  >
                    {resetLoading ? 'Saving...' : 'Save Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;