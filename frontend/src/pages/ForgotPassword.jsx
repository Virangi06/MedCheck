import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import MedCheckLogo from '../components/MedCheckLogo';

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] =
    useState('');

  const [submitted, setSubmitted] =
    useState(false);

  // ─────────────────────────────────────────
  // HANDLE INPUT CHANGE
  // ─────────────────────────────────────────
  const handleChange = (e) => {
    setEmail(e.target.value);

    if (errors.email) {
      setErrors({
        ...errors,
        email: '',
      });
    }

    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // ─────────────────────────────────────────
  // VALIDATE EMAIL
  // ─────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email =
        'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      newErrors.email =
        'Enter a valid email address';
    }

    return newErrors;
  };

  // ─────────────────────────────────────────
  // HANDLE SUBMIT
  // ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (
      Object.keys(newErrors).length > 0
    ) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          email:
            data.message ||
            'Unable to process request',
        });

        return;
      }

      // Success Message
      setSuccessMessage(
        'OTP sent successfully'
      );

      setSubmitted(true);

      // Save email for OTP page
      localStorage.setItem(
        'resetEmail',
        email
      );

      // Redirect to Verify OTP page
      setTimeout(() => {
        navigate('/verify-otp');
      }, 1500);

    } catch (err) {

      setErrors({
        email:
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
          "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      {/* CARD */}
      <div
        style={{
          width: '100%',
          maxWidth: '390px',

          background: '#ffffff',

          borderRadius: '18px',

          padding: '28px 24px',

          boxShadow:
            '0 8px 28px rgba(15, 23, 42, 0.08)',

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
            Reset Password
          </h1>

          <p
            style={{
              fontSize: '13px',
              color: '#64748b',

              textAlign: 'center',
            }}
          >
            Enter your email to receive OTP
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {submitted && (
          <div
            style={{
              background: '#ECFDF5',

              color: '#059669',

              border:
                '1px solid #86EFAC',

              padding: '12px 14px',

              borderRadius: '10px',

              fontSize: '12px',

              marginBottom: '16px',

              textAlign: 'center',
            }}
          >
            ✓ {successMessage}
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

                  left: '12px',
                  top: '50%',

                  transform:
                    'translateY(-50%)',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent:
                    'center',

                  color: '#94a3b8',

                  pointerEvents: 'none',
                }}
              >
                <Mail size={18} />
              </div>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleChange}
                disabled={submitted}
                style={{
                  width: '100%',

                  padding:
                    '10px 12px 10px 44px',

                  border: errors.email
                    ? '1.5px solid #ef4444'
                    : '1.5px solid #e2e8f0',

                  borderRadius: '10px',

                  fontSize: '13px',

                  fontFamily:
                    "'DM Sans', sans-serif",

                  background: 'white',

                  color: '#0f172a',

                  outline: 'none',

                  boxSizing:
                    'border-box',

                  transition:
                    'all 0.2s',

                  opacity: submitted
                    ? 0.6
                    : 1,
                }}
              />
            </div>

            {errors.email && (
              <p
                style={{
                  color: '#ef4444',

                  fontSize: '11px',

                  marginTop: '4px',
                }}
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={
              loading || submitted
            }
            style={{
              width: '100%',

              padding: '11px',

              background: submitted
                ? '#10b981'
                : '#0EA5E9',

              color: 'white',

              border: 'none',

              borderRadius: '10px',

              fontSize: '14px',

              fontWeight: '600',

              fontFamily:
                "'DM Sans', sans-serif",

              cursor:
                loading || submitted
                  ? 'not-allowed'
                  : 'pointer',

              opacity: loading
                ? 0.7
                : 1,

              transition:
                'all 0.2s',

              boxShadow: submitted
                ? '0 4px 12px rgba(16,185,129,0.3)'
                : '0 4px 12px rgba(14,165,233,0.3)',
            }}
          >
            {loading
              ? 'Sending OTP...'
              : submitted
              ? 'OTP Sent'
              : 'Send OTP'}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <Link
          to="/login"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            gap: '8px',

            marginTop: '16px',

            color: '#0EA5E9',

            textDecoration: 'none',

            fontSize: '13px',

            fontWeight: '500',
          }}
        >
          <ArrowLeft size={16} />

          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;