import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
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
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

    if (form.password.length < 6) {
      newErrors.password =
        'Password must be at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword =
        'Passwords do not match';
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
        'http://localhost:5000/api/auth/register',
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
      {/* REGISTER CARD */}
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
            <MedCheckLogo size="md" showSubtitle={true} />
          </Link>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
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
                <User
                  size={15}
                  color="#64748b"
                />
              </div>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter you full name"
                style={{
                  width: '100%',
                  padding:
                    '11px 12px 11px 38px',
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
                placeholder="Minimum 6 characters"
                style={{
                  width: '100%',
                  padding:
                    '11px 38px 11px 38px',
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
                  background: 'transparent',
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
                <Lock
                  size={15}
                  color="#64748b"
                />
              </div>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                style={{
                  width: '100%',
                  padding:
                    '11px 12px 11px 38px',
                  borderRadius: '10px',
                  border:
                    errors.confirmPassword
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
              ? 'Creating Account...'
              : 'Create Account'}
          </button>
        </form>

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
  );
}

export default Register;