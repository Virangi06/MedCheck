import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
} from 'lucide-react';
import MedCheckLogo from '../components/MedCheckLogo';

// ─────────────────────────────────────────────
// Register Page
// ─────────────────────────────────────────────
function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [showMockModal, setShowMockModal] = useState(false);

  const isRealGoogleConfigured =
    process.env.REACT_APP_GOOGLE_CLIENT_ID &&
    process.env.REACT_APP_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  useEffect(() => {
    if (isRealGoogleConfigured && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', width: '340px', shape: 'pill' }
        );
      } catch (err) {
        console.error('Error initializing Google login:', err);
      }
    }
  }, [isRealGoogleConfigured]);

  const handleGoogleCallback = async (response) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || 'Google login failed');
        return;
      }

      login(data.user, data.token);
      navigate('/symptom-checker');
    } catch (err) {
      setServerError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleMockGoogleLogin = async (email, name) => {
    setShowMockModal(false);
    setLoading(true);
    try {
      const mockToken = `mock_${email}_${name}`;
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: mockToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || 'Google login failed');
        return;
      }

      login(data.user, data.token);
      navigate('/symptom-checker');
    } catch (err) {
      setServerError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Handle Change
  // ─────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // ─────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = 'Enter valid email';
    }

    if (form.phone && !/^[+]?[0-9]{7,15}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid phone number';
    }

    if (form.password.length < 6) {
      newErrors.password =
        'Password must be at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword =
        'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms of Service to continue';
    }

    return newErrors;
  };

  // ─────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: 'patient',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setServerError(
          data.message ||
            'Registration failed'
        );
        return;
      }

      login(data.user, data.token);

      navigate('/symptom-checker');
    } catch (err) {
      setServerError(
        'Unable to connect to server'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        
        .split-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          overflow-x: hidden;
          background: #ffffff;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
        }

        .brand-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0c1f35 0%, #0a2a4a 40%, #0d3b6e 70%, #0ea5e9 100%);
          position: relative;
          overflow: hidden;
          padding: 40px;
          color: white;
          text-align: center;
        }
        
        .brand-pane::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(14,165,233,0.18) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(56,189,248,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .brand-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .brand-content {
          position: relative;
          z-index: 1;
          max-width: 520px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .brand-logo-pill {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 16px 28px;
          backdrop-filter: blur(8px);
          margin-bottom: 40px;
          animation: floatCard 6s ease-in-out infinite;
        }

        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .brand-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 4vw, 54px);
          font-weight: 500;
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -1.5px;
          color: white;
        }

        .brand-subtitle {
          font-size: clamp(14px, 1.5vw, 17px);
          color: rgba(186, 230, 253, 0.85);
          line-height: 1.7;
          max-width: 440px;
          margin: 0 auto;
        }

        .form-pane {
          width: 100%;
          max-width: 550px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: #ffffff;
          flex-shrink: 0;
        }

        .form-logo-wrapper {
          display: none;
        }

        @media (max-width: 1024px) {
          .brand-pane {
            display: none;
          }
          .form-pane {
            max-width: 100%;
            flex: 1;
            padding: 20px;
          }
          .form-logo-wrapper {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }
        }
      `}</style>

      {/* LEFT SIDE - BRANDING */}
      <div className="brand-pane">
        <div className="brand-grid" />
        <div className="brand-content">
          <div className="brand-logo-pill">
            <MedCheckLogo size="sm" showSubtitle={false} darkTheme={true} />
          </div>
          <h2 className="brand-title">
            Your Health,<br />
            <span style={{ color: '#38BDF8' }}>Understood</span> Instantly
          </h2>
          <p className="brand-subtitle">
            AI-powered symptom analysis that helps you better understand your health instantly.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="form-pane">
        <div
          style={{
            width: '100%',
            maxWidth: '390px',
            background: '#ffffff',
            borderRadius: '18px',
            padding: '28px 24px',
            boxShadow: '0 8px 28px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Logo on mobile only */}
          <div className="form-logo-wrapper">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <MedCheckLogo size="md" showSubtitle={true} />
            </Link>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '500',
                color: '#0f172a',
                marginBottom: '6px',
              }}
            >
              Create Account
            </h1>
            <p
              style={{
                fontSize: '13px',
                color: '#64748b',
                textAlign: 'center',
              }}
            >
              Start your smarter healthcare journey
            </p>
          </div>

          {/* ERROR */}
          {serverError && (
            <div
              style={{
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                marginBottom: '14px',
              }}
            >
              {serverError}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* NAME */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#334155',
                }}
              >
                Full Name
              </label>

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                  }}
                >
                  <User size={15} color="#64748b" />
                </div>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 38px',
                    borderRadius: '10px',
                    border: errors.name
                      ? '1.5px solid #ef4444'
                      : '1.5px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {errors.name && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '11px',
                    marginTop: '5px',
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#334155',
                }}
              >
                Email Address
              </label>

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                  }}
                >
                  <Mail size={15} color="#64748b" />
                </div>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 38px',
                    borderRadius: '10px',
                    border: errors.email
                      ? '1.5px solid #ef4444'
                      : '1.5px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {errors.email && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '11px',
                    marginTop: '5px',
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#334155',
                }}
              >
                Password
              </label>

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                  }}
                >
                  <Lock size={15} color="#64748b" />
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  style={{
                    width: '100%',
                    padding: '11px 38px 11px 38px',
                    borderRadius: '10px',
                    border: errors.password
                      ? '1.5px solid #ef4444'
                      : '1.5px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={15} color="#64748b" />
                  ) : (
                    <Eye size={15} color="#64748b" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '11px',
                    marginTop: '5px',
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#334155',
                }}
              >
                Confirm Password
              </label>

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                  }}
                >
                  <Lock size={15} color="#64748b" />
                </div>

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 38px',
                    borderRadius: '10px',
                    border: errors.confirmPassword
                      ? '1.5px solid #ef4444'
                      : '1.5px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {errors.confirmPassword && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '11px',
                    marginTop: '5px',
                  }}
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#334155',
                }}
              >
                Phone Number <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
              </label>

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                  }}
                >
                  <Phone size={15} color="#64748b" />
                </div>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 38px',
                    borderRadius: '10px',
                    border: errors.phone
                      ? '1.5px solid #ef4444'
                      : '1.5px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {errors.phone && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '11px',
                    marginTop: '5px',
                  }}
                >
                  {errors.phone}
                </p>
              )}
            </div>

            {/* DISCLAIMER CHECKBOX */}
            <div
              style={{
                background: agreedToTerms ? '#EFF9FF' : errors.agreedToTerms ? '#FEF2F2' : '#f8fafc',
                border: `1.5px solid ${agreedToTerms ? '#BAE6FD' : errors.agreedToTerms ? '#FECACA' : '#e2e8f0'}`,
                borderRadius: '12px',
                padding: '14px 16px',
                transition: 'all 0.2s',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0, marginTop: '1px' }}>
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (errors.agreedToTerms) {
                        setErrors({ ...errors, agreedToTerms: '' });
                      }
                    }}
                    style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
                  />
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '5px',
                      border: agreedToTerms ? '2px solid #0EA5E9' : '2px solid #cbd5e1',
                      background: agreedToTerms ? '#0EA5E9' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    {agreedToTerms && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                  I have read and agree to the{' '}
                  <Link
                    to="/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0EA5E9', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    Terms of Service
                  </Link>
                  {' '}and understand that this is an educational tool only, not a substitute for professional medical advice.
                </span>
              </label>
              {errors.agreedToTerms && (
                <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '8px', marginLeft: '28px' }}>
                  {errors.agreedToTerms}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #0EA5E9, #0284c7)',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(14,165,233,0.25)',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* DIVIDER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '18px 0',
              color: '#94a3b8',
              fontSize: '12px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ padding: '0 10px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* GOOGLE SIGN IN BUTTON */}
          {isRealGoogleConfigured ? (
            <div
              id="google-signin-btn"
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginTop: '10px',
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowMockModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          )}

          {/* LOGIN */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '18px',
              fontSize: '13px',
              color: '#64748b',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#0EA5E9',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* MOCK GOOGLE SELECTOR MODAL */}
      {showMockModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            width: '100%',
            maxWidth: '360px',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            fontFamily: "'Roboto', 'Segoe UI', sans-serif"
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: '10px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 4px 0', color: '#202124' }}>Choose an account</h3>
              <p style={{ fontSize: '12px', color: '#5f6368', margin: 0 }}>to continue to <span style={{ color: '#0EA5E9', fontWeight: '600' }}>MedCheck</span></p>
            </div>

            {/* Account List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {[
                { name: 'Virangi Tank', email: 'tankvirangik006@gmail.com', avatar: 'VT' },
                { name: 'Demo User', email: 'demo.user@gmail.com', avatar: 'DU' },
                { name: 'Test Account', email: 'test.account@gmail.com', avatar: 'TA' }
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleMockGoogleLogin(acc.email, acc.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 8px',
                    border: 'none',
                    background: 'transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f3f4'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#0EA5E9',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {acc.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#3c4043' }}>{acc.name}</div>
                    <div style={{ fontSize: '11px', color: '#5f6368' }}>{acc.email}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e8eaed', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => setShowMockModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#1a73e8',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f4f8fe'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Cancel
              </button>
              <span style={{ fontSize: '10px', color: '#70757a' }}>Developer Sandbox</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;