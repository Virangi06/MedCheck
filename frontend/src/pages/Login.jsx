import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      {/* LOGIN CARD */}
      <div style={{ width: '100%', maxWidth: '390px', background: '#ffffff', borderRadius: '18px', padding: '28px 24px', boxShadow: '0 8px 28px rgba(15, 23, 42, 0.08)', border: '1px solid #e2e8f0' }}>

        {/* LOGO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <MedCheckLogo size="md" showSubtitle={true} />
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Welcome Back</h1>
          <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center' }}>Sign in to access your health dashboard</p>
        </div>

        {/* ERROR */}
        {serverError && (
          <div style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', marginBottom: '14px' }}>
            {serverError}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* EMAIL */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#334155' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', pointerEvents: 'none' }}>
                <Mail size={18} />
              </div>
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} style={{ width: '100%', padding: '10px 12px 10px 44px', border: errors.email ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", background: 'white', color: '#0f172a', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }} />
            </div>
            {errors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '12px', color: '#0EA5E9', textDecoration: 'none', fontWeight: '500' }}>Forgot?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', pointerEvents: 'none' }}>
                <Lock size={18} />
              </div>
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: '10px 44px 10px 44px', border: errors.password ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", background: 'white', color: '#0f172a', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.password}</p>}
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', fontFamily: "'DM Sans', sans-serif", cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* DIVIDER */}
        <div style={{ position: 'relative', margin: '16px 0', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e2e8f0' }} />
          <span style={{ position: 'relative', background: 'white', padding: '0 12px', color: '#94a3b8', fontSize: '12px' }}>or</span>
        </div>

        {/* SIGNUP LINK */}
        <p style={{ textAlign: 'center', color: '#475569', fontSize: '13px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#0EA5E9', fontWeight: '600', textDecoration: 'none' }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
