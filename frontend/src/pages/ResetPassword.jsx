import { useState } from 'react';

import {
  useNavigate,
  Link,
} from 'react-router-dom';

import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';

import MedCheckLogo from '../components/MedCheckLogo';

function ResetPassword() {

  const navigate = useNavigate();

  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [showPassword,
    setShowPassword] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('');

  // Get stored email
  const email =
    localStorage.getItem(
      'resetEmail'
    );

  // ─────────────────────────────
  // Validation
  // ─────────────────────────────
  const validate = () => {

    const newErrors = {};

    if (!password.trim()) {

      newErrors.password =
        'Password is required';

    } else if (
      password.length < 6
    ) {

      newErrors.password =
        'Password must be at least 6 characters';
    }

    if (
      confirmPassword !== password
    ) {

      newErrors.confirmPassword =
        'Passwords do not match';
    }

    return newErrors;
  };

  // ─────────────────────────────
  // Submit
  // ─────────────────────────────
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    const newErrors =
      validate();

    if (
      Object.keys(newErrors)
        .length > 0
    ) {

      setErrors(newErrors);

      return;
    }

    const token = localStorage.getItem('resetToken');

    if (!token) {
      setErrors({
        password: 'Reset token is missing or expired. Please request a new OTP.',
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/reset-password`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            token,

            password,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        setErrors({
          password:
            data.message ||
            'Unable to reset password',
        });

        return;
      }

      // Success
      setSuccessMessage(
        'Password reset successful'
      );

      // Remove stored email and token
      localStorage.removeItem(
        'resetEmail'
      );
      localStorage.removeItem(
        'resetToken'
      );

      // Redirect login
      setTimeout(() => {

        navigate('/login');

      }, 1500);

    } catch (err) {

      setErrors({
        password:
          'Unable to connect. Please try again.',
      });

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',

        background: '#ffffff',

        display: 'flex',

        alignItems: 'center',

        justifyContent: 'center',

        padding: '20px',

        fontFamily:
          "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: '390px',

          background: '#fff',

          borderRadius: '18px',

          padding: '28px 24px',

          boxShadow:
            '0 8px 28px rgba(15,23,42,0.08)',

          border:
            '1px solid #e2e8f0',
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: 'flex',

            flexDirection: 'column',

            alignItems: 'center',

            marginBottom: '24px',
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration:
                'none',

              marginBottom: '16px',
            }}
          >
            <MedCheckLogo
              size="md"
              showSubtitle={true}
            />
          </Link>

          <h1
            style={{
              fontSize: '24px',

              fontWeight: '700',

              color: '#0f172a',

              marginBottom: '6px',
            }}
          >
            Reset Password
          </h1>

          <p
            style={{
              fontSize: '13px',

              color: '#64748b',
            }}
          >
            Create a new secure password
          </p>
        </div>

        {/* SUCCESS */}
        {successMessage && (
          <div
            style={{
              background:
                '#ECFDF5',

              color: '#059669',

              border:
                '1px solid #86EFAC',

              padding:
                '12px 14px',

              borderRadius:
                '10px',

              fontSize: '12px',

              marginBottom:
                '16px',

              textAlign:
                'center',
            }}
          >
            ✓ {successMessage}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          style={{
            display: 'flex',

            flexDirection:
              'column',

            gap: '14px',
          }}
        >
          {/* PASSWORD */}
          <div>
            <label
              style={{
                display: 'block',

                marginBottom:
                  '6px',

                fontSize:
                  '13px',

                fontWeight:
                  '500',

                color:
                  '#334155',
              }}
            >
              New Password
            </label>

            <div
              style={{
                position:
                  'relative',
              }}
            >
              <div
                style={{
                  position:
                    'absolute',

                  left: '12px',

                  top: '50%',

                  transform:
                    'translateY(-50%)',

                  color:
                    '#94a3b8',
                }}
              >
                <Lock size={18} />
              </div>

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }

                value={password}

                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }

                placeholder="Enter new password"

                style={{
                  width: '100%',

                  padding:
                    '10px 44px 10px 44px',

                  border:
                    errors.password
                      ? '1.5px solid #ef4444'
                      : '1.5px solid #e2e8f0',

                  borderRadius:
                    '10px',

                  fontSize:
                    '14px',

                  outline:
                    'none',

                  boxSizing:
                    'border-box',
                }}
              />

              <button
                type="button"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                style={{
                  position:
                    'absolute',

                  right: '12px',

                  top: '50%',

                  transform:
                    'translateY(-50%)',

                  border: 'none',

                  background:
                    'transparent',

                  cursor:
                    'pointer',

                  color:
                    '#94a3b8',
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p
                style={{
                  color:
                    '#ef4444',

                  fontSize:
                    '11px',

                  marginTop:
                    '4px',
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

                marginBottom:
                  '6px',

                fontSize:
                  '13px',

                fontWeight:
                  '500',

                color:
                  '#334155',
              }}
            >
              Confirm Password
            </label>

            <div
              style={{
                position:
                  'relative',
              }}
            >
              <div
                style={{
                  position:
                    'absolute',

                  left: '12px',

                  top: '50%',

                  transform:
                    'translateY(-50%)',

                  color:
                    '#94a3b8',
                }}
              >
                <Lock size={18} />
              </div>

              <input
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }

                value={
                  confirmPassword
                }

                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }

                placeholder="Confirm password"

                style={{
                  width: '100%',

                  padding:
                    '10px 44px 10px 44px',

                  border:
                    errors.confirmPassword
                      ? '1.5px solid #ef4444'
                      : '1.5px solid #e2e8f0',

                  borderRadius:
                    '10px',

                  fontSize:
                    '14px',

                  outline:
                    'none',

                  boxSizing:
                    'border-box',
                }}
              />

              <button
                type="button"

                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }

                style={{
                  position:
                    'absolute',

                  right: '12px',

                  top: '50%',

                  transform:
                    'translateY(-50%)',

                  border: 'none',

                  background:
                    'transparent',

                  cursor:
                    'pointer',

                  color:
                    '#94a3b8',
                }}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p
                style={{
                  color:
                    '#ef4444',

                  fontSize:
                    '11px',

                  marginTop:
                    '4px',
                }}
              >
                {
                  errors.confirmPassword
                }
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"

            disabled={loading}

            style={{
              width: '100%',

              padding: '11px',

              background:
                '#0EA5E9',

              color: 'white',

              border: 'none',

              borderRadius:
                '10px',

              fontSize:
                '14px',

              fontWeight:
                '600',

              cursor: loading
                ? 'not-allowed'
                : 'pointer',

              opacity: loading
                ? 0.7
                : 1,

              boxShadow:
                '0 4px 12px rgba(14,165,233,0.3)',
            }}
          >
            {loading
              ? 'Updating...'
              : 'Reset Password'}
          </button>
        </form>

        {/* BACK */}
        <Link
          to="/login"
          style={{
            display: 'flex',

            alignItems:
              'center',

            justifyContent:
              'center',

            gap: '8px',

            marginTop: '18px',

            color: '#0EA5E9',

            textDecoration:
              'none',

            fontSize: '13px',

            fontWeight: '500',
          }}
        >
          <ArrowLeft
            size={16}
          />

          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;