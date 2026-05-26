import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MedCheckLogo from '../components/MedCheckLogo';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (serverError) setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || 'Invalid email or password');
        return;
      }

      login(data.user, data.token);
      navigate('/symptom-checker');
    } catch (err) {
      setServerError('Unable to connect. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c1f35 0%, #0a2a4a 50%, #0d3b6e 100%)', display: 'flex', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .auth-input {
          width: 100%; padding: 14px 16px 14px 44px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 15px; font-family: 'DM Sans', sans-serif;
          background: white; color: #0f172a;
          outline: none; box-sizing: border-box;
          transition: all 0.2s;
        }
        .auth-input:focus { border-color: #0EA5E9; box-shadow: 0 0 0 3px rgba(14,165,233,0.12); }
        .auth-input.error { border-color: #ef4444; }
        .auth-input.error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
        .auth-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #0EA5E9, #0284c7);
          color: white; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(14,165,233,0.35);
        }
        .auth-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(14,165,233,0.45); }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .grid-bg {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      <div className="grid-bg" />

      {/* Left panel — branding */}
      <div style={{ flex: 1, display: 'none', padding: '64px 48px', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }} className="left-panel">
      </div>

      {/* Right panel — form */}
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}>

          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 20 }}>
              <MedCheckLogo size="md" />
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#0f172a', letterSpacing: '-0.5px' }}>MedCheck</span>
            </Link>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 8, textAlign: 'center', letterSpacing: '-0.4px', lineHeight: 1.3 }}>Welcome back</h1>
            <p style={{ color: '#64748b', textAlign: 'center', fontSize: 15 }}>Sign in to access your health dashboard</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: '#DC2626', fontSize: 16, marginTop: 1 }}>⚠</span>
              <span style={{ color: '#DC2626', fontSize: 14 }}>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>✉️</span>
                <input className={`auth-input${errors.email ? ' error' : ''}`} name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
              {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Password</label>
                <a href="#" style={{ fontSize: 13, color: '#0EA5E9', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>🔐</span>
                <input className={`auth-input${errors.password ? ' error' : ''}`} name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={handleChange} autoComplete="current-password" style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18, padding: 0 }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5 }}>{errors.password}</p>}
            </div>

            {/* Remember me */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#0EA5E9', cursor: 'pointer' }} />
              <span style={{ fontSize: 14, color: '#475569' }}>Keep me signed in</span>
            </label>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div style={{ position: 'relative', margin: '28px 0', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#e2e8f0' }} />
            <span style={{ position: 'relative', background: 'white', padding: '0 16px', color: '#94a3b8', fontSize: 13 }}>or</span>
          </div>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: 15 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
          </p>
        </div>

        {/* Security note */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(186,230,253,0.6)', fontSize: 13 }}>
          <span>🔒</span>
          <span>Secured with 256-bit encryption</span>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Login;
