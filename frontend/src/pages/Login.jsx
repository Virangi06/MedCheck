import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

import MedCheckLogo from '../components/MedCheckLogo';

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  // HANDLE CHANGE
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

    if (serverError) {
      setServerError('');
    }
  };

  // VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email =
        'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        'Enter a valid email';
    }

    if (!form.password) {
      newErrors.password =
        'Password is required';
    }

    return newErrors;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors =
      validate();

    if (
      Object.keys(validationErrors).length >
      0
    ) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setServerError(
          data.message ||
            'Invalid email or password'
        );

        return;
      }

      login(data.user, data.token);

      navigate('/patient/dashboard');
    } catch (err) {
      setServerError(
        'Unable to connect to server'
      );
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
          "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* LOGIN CARD */}
      <div
        style={{
          width: '100%',
          maxWidth: '390px',
          background: '#ffffff',
          borderRadius: '18px',
          padding: '28px 24px',
          boxShadow:
            '0 8px 28px rgba(15, 23, 42, 0.08)',

          border: '1px solid #e2e8f0',
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
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'center',
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
            Welcome Back
          </h1>

          <p
            style={{
              fontSize: '13px',
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            Sign in to continue your
            healthcare journey
          </p>
        </div>

        {/* SERVER ERROR */}
        {serverError && (
          <div
            style={{
              background: '#FEF2F2',
              color: '#DC2626',
              border:
                '1px solid #FECACA',

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

            <div
              style={{
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '12px',
                  transform:
                    'translateY(-50%)',
                }}
              >
                <Mail
                  size={15}
                  color="#64748b"
                />
              </div>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding:
                    '11px 12px 11px 38px',

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
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',

                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#334155',
                }}
              >
                Password
              </label>

              {/* FORGOT PASSWORD LINK */}
              <Link
                to="/forgot-password"
                style={{
                  fontSize: '12px',
                  color: '#0EA5E9',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <div
              style={{
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '12px',
                  transform:
                    'translateY(-50%)',
                }}
              >
                <Lock
                  size={15}
                  color="#64748b"
                />
              </div>

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding:
                    '11px 40px 11px 38px',

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
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',

                  border: 'none',
                  background:
                    'transparent',

                  cursor: 'pointer',
                }}
              >
                {showPassword ? (
                  <EyeOff
                    size={15}
                    color="#64748b"
                  />
                ) : (
                  <Eye
                    size={15}
                    color="#64748b"
                  />
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

              background:
                'linear-gradient(135deg, #0EA5E9, #0284c7)',

              color: 'white',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',

              boxShadow:
                '0 4px 14px rgba(14,165,233,0.25)',
            }}
          >
            {loading
              ? 'Signing In...'
              : 'Sign In'}
          </button>
        </form>

        {/* REGISTER */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '18px',
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#0EA5E9',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;