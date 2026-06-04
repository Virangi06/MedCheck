import { useState } from 'react';

import {
  useNavigate,
  Link,
} from 'react-router-dom';

import {
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

import MedCheckLogo from '../components/MedCheckLogo';

function VerifyOtp() {

  const navigate = useNavigate();

  const [otp, setOtp] =
    useState('');

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
  // Handle Change
  // ─────────────────────────────
  const handleChange = (e) => {

    const value =
      e.target.value;

    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }

    // Remove error
    if (errors.otp) {
      setErrors({
        ...errors,
        otp: '',
      });
    }
  };

  // ─────────────────────────────
  // Validation
  // ─────────────────────────────
  const validate = () => {

    const newErrors = {};

    if (!otp.trim()) {

      newErrors.otp =
        'OTP is required';

    } else if (
      otp.length !== 6
    ) {

      newErrors.otp =
        'OTP must be 6 digits';
    }

    return newErrors;
  };

  // ─────────────────────────────
  // Verify OTP
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

    setLoading(true);

    try {

      const res = await fetch(
        'http://localhost:5000/api/auth/verify-otp',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email,

            otp:
              otp.toString(),
          }),
        }
      );

      const data =
        await res.json();

      // Error
      if (!res.ok) {

        setErrors({
          otp:
            data.message ||
            'Invalid OTP',
        });

        return;
      }

      // Success
      setSuccessMessage(
        'OTP verified successfully'
      );

      if (data.resetToken) {
        localStorage.setItem('resetToken', data.resetToken);
      }

      // Redirect
      setTimeout(() => {

        navigate(
          '/reset-password'
        );

      }, 1500);

    } catch (err) {

      setErrors({
        otp:
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
              textDecoration:
                'none',

              display: 'flex',

              justifyContent:
                'center',

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
            Verify OTP
          </h1>

          <p
            style={{
              fontSize: '13px',

              color: '#64748b',

              textAlign: 'center',

              lineHeight: '1.6',
            }}
          >
            Enter the 6-digit
            verification code
            sent to your email
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
          {/* OTP */}
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
              Verification Code
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
                <ShieldCheck
                  size={18}
                />
              </div>

              <input
                type="text"

                placeholder="Enter 6-digit OTP"

                value={otp}

                onChange={
                  handleChange
                }

                maxLength={6}

                style={{
                  width: '100%',

                  padding:
                    '10px 12px 10px 44px',

                  border:
                    errors.otp
                      ? '1.5px solid #ef4444'
                      : '1.5px solid #e2e8f0',

                  borderRadius:
                    '10px',

                  fontSize:
                    '15px',

                  letterSpacing:
                    '4px',

                  fontWeight:
                    '600',

                  background:
                    '#fff',

                  color:
                    '#0f172a',

                  outline:
                    'none',

                  boxSizing:
                    'border-box',

                  textAlign:
                    'center',
                }}
              />
            </div>

            {errors.otp && (
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
                {errors.otp}
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

              transition:
                'all 0.2s',

              boxShadow:
                '0 4px 12px rgba(14,165,233,0.3)',
            }}
          >
            {loading
              ? 'Verifying...'
              : 'Verify OTP'}
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

export default VerifyOtp;