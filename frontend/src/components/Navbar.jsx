import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function MedCheckLogo({ size = 'sm' }) {
  const px = size === 'sm' ? 34 : 44;
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

function Navbar({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      style={{
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
        padding: '6px 12px',
        borderRadius: 8,
        transition: 'all 0.15s',
        color: isActive(to) ? '#0EA5E9' : '#475569',
        background: isActive(to) ? '#EFF9FF' : 'transparent',
      }}
      onMouseOver={e => { if (!isActive(to)) e.currentTarget.style.color = '#0f172a'; }}
      onMouseOut={e => { if (!isActive(to)) e.currentTarget.style.color = '#475569'; }}
    >
      {label}
    </Link>
  );

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');`}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <MedCheckLogo size="sm" />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#0f172a', letterSpacing: '-0.3px' }}>MedCheck</span>
        </Link>

        {/* Desktop menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          {navLink('/', 'Home')}
          {user ? (
            <>
              {navLink('/symptom-checker', 'Check Symptoms')}
              {navLink('/patient/dashboard', 'My Dashboard')}

              <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 8px' }} />

              {/* User pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, color: '#475569', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || user.email}</span>
                <button
                  onClick={handleLogout}
                  style={{ fontSize: 13, fontWeight: 500, color: '#64748b', background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#FECACA'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: '#475569', textDecoration: 'none', padding: '8px 16px', borderRadius: 8 }}
                onMouseOver={e => e.currentTarget.style.color = '#0f172a'}
                onMouseOut={e => e.currentTarget.style.color = '#475569'}
              >Login</Link>
              <Link to="/register" style={{ fontSize: 14, fontWeight: 600, color: 'white', textDecoration: 'none', padding: '9px 20px', borderRadius: 50, background: '#0EA5E9', boxShadow: '0 2px 12px rgba(14,165,233,0.3)', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#0284c7'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,233,0.4)'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#0EA5E9'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(14,165,233,0.3)'; }}
              >Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <div style={{ width: 24, height: 2, background: '#475569', borderRadius: 2, marginBottom: 5, transition: 'all 0.2s', transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <div style={{ width: 24, height: 2, background: '#475569', borderRadius: 2, marginBottom: 5, opacity: mobileMenuOpen ? 0 : 1, transition: 'all 0.2s' }} />
          <div style={{ width: 24, height: 2, background: '#475569', borderRadius: 2, transition: 'all 0.2s', transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div style={{ borderTop: '1px solid #f1f5f9', background: 'white', padding: '12px 24px 20px' }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '10px 0', color: '#475569', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Home</Link>
          {user ? (
            <>
              <Link to="/symptom-checker" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '10px 0', color: '#475569', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Check Symptoms</Link>
              <Link to="/patient/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '10px 0', color: '#475569', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>My Dashboard</Link>
              <button onClick={handleLogout} style={{ marginTop: 8, width: '100%', padding: '10px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '10px 0', color: '#475569', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', marginTop: 8, padding: '12px', background: '#0EA5E9', color: 'white', textDecoration: 'none', borderRadius: 10, textAlign: 'center', fontSize: 15, fontWeight: 600 }}>Get Started Free</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
