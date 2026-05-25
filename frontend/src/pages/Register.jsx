import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MedCheckLogo({ size = 'md' }) {
  const sizes = { sm: 32, md: 44, lg: 64 };
  const px = sizes[size] || 44;
  return (
    <svg width={px} height={px} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="12" fill="#0EA5E9" />
      <rect x="19" y="10" width="6" height="24" rx="3" fill="white" />
      <rect x="10" y="19" width="24" height="6" rx="3" fill="white" />
      <path d="M8 22 L13 22 L16 15 L20 29 L23 18 L26 24 L29 24 L36 24"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        opacity="0.55" />
    </svg>
  );
}

function PasswordStrength({ password }) {
  const getStrength = (p) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  if (!password) return null;
  const score = getStrength(password);
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < score ? colors[score - 1] : '#e2e8f0', transition: 'background 0.3s' }} />
        ))}
      </div>
      <span style={{ fontSize: 12, color: colors[score - 1] || '#94a3b8' }}>{score > 0 ? labels[score - 1] : ''}</span>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: 'patient',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || 'Registration failed. Please try again.');
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c1f35 0%, #0a2a4a 50%, #0d3b6e 100%)', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .auth-input {
          width: 100%; padding: 14px 16px 14px 44px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 15px; font-family: 'DM Sans', sans-serif;
          background: white; color: #0f172a;
          outline: none; box-sizing: border-box; transition: all 0.2s;
        }
        .auth-input:focus { border-color: #0EA5E9; box-shadow: 0 0 0 3px rgba(14,165,233,0.12); }
        .auth-input.error { border-color: #ef4444; }
        .role-card {
          flex: 1; padding: 16px;
          border: 2px solid #e2e8f0; border-radius: 12px;
          cursor: pointer; transition: all 0.2s; background: white; text-align: center;
        }
        .role-card.selected { border-color: #0EA5E9; background: #EFF9FF; }
        .role-card:hover { border-color: #BAE6FD; }
        .auth-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #0EA5E9, #0284c7);
          color: white; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(14,165,233,0.35);
        }
        .auth-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(14,165,233,0.45); }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .grid-bg {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="grid-bg" />

      <div style={{ width: '100%', maxWidth: 520, margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'white', borderRadius: 24, padding: '44px 40px', boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}>

          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 20 }}>
              <MedCheckLogo size="md" />
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#0f172a', letterSpacing: '-0.5px' }}>MedCheck</span>
            </Link>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 8, textAlign: 'center', letterSpacing: '-0.4px', lineHeight: 1.3 }}>Create your account</h1>
            <p style={{ color: '#64748b', textAlign: 'center', fontSize: 15 }}>Join thousands managing their health smarter</p>
          </div>

          {serverError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
              <span style={{ color: '#DC2626' }}>⚠ {serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Full name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>👤</span>
                <input className={`auth-input${errors.name ? ' error' : ''}`} name="name" placeholder="John Doe" value={form.name} onChange={handleChange} autoComplete="name" />
              </div>
              {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>✉️</span>
                <input className={`auth-input${errors.email ? ' error' : ''}`} name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
              {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔐</span>
                <input className={`auth-input${errors.password ? ' error' : ''}`} name="password" type={showPassword ? 'text' : 'password'} placeholder="Minimum 6 characters" value={form.password} onChange={handleChange} autoComplete="new-password" style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Confirm password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔐</span>
                <input className={`auth-input${errors.confirmPassword ? ' error' : ''}`} name="confirmPassword" type="password" placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#22c55e' }}>✓</span>
                )}
              </div>
              {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <div style={{ position: 'relative', margin: '24px 0', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#e2e8f0' }} />
            <span style={{ position: 'relative', background: 'white', padding: '0 16px', color: '#94a3b8', fontSize: 13 }}>or</span>
          </div>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: 15 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>

        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(186,230,253,0.6)', fontSize: 13 }}>
          <span>🔒</span>
          <span>Your data is encrypted and never sold</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
