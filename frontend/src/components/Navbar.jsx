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
} from 'lucide-react';

import MedCheckLogo from './MedCheckLogo';

function Navbar({ user, onLogout }) {

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const profileRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();

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

  // Active Nav
  const isActive = (path) =>
    location.pathname === path;

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
          {navLink('/', 'Home')}

          {user ? (
            <>
              {navLink(
                '/symptom-checker',
                'Check Symptoms'
              )}

              {navLink(
                '/patient/dashboard',
                'Dashboard'
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
          <Link
            to="/"
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
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/symptom-checker"
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
                Check Symptoms
              </Link>

              <Link
                to="/patient/dashboard"
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
                Dashboard
              </Link>

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
    </nav>
  );
}

export default Navbar;