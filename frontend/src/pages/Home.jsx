import { Link, useNavigate } from 'react-router-dom';

// Inline SVG Logo Component
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

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .hero-bg {
          background: linear-gradient(135deg, #0c1f35 0%, #0a2a4a 40%, #0d3b6e 70%, #0ea5e9 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(14,165,233,0.18) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(56,189,248,0.12) 0%, transparent 60%);
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .pulse-ring {
          animation: pulseRing 2.5s ease-out infinite;
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .float-card {
          animation: floatCard 6s ease-in-out infinite;
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .btn-primary {
          background: #0EA5E9;
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 24px rgba(14,165,233,0.4);
        }
        .btn-primary:hover { background: #0284c7; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(14,165,233,0.5); }
        .btn-outline {
          background: transparent;
          color: white;
          border: 1.5px solid rgba(255,255,255,0.4);
          padding: 14px 32px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.7); }
        .feature-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #0EA5E9, #38BDF8);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s;
        }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(14,165,233,0.12); }
        .feature-card:hover::before { transform: scaleX(1); }
        .step-num {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #0EA5E9, #38BDF8);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 700; color: white;
          font-family: 'Syne', sans-serif;
          box-shadow: 0 8px 20px rgba(14,165,233,0.35);
          flex-shrink: 0;
        }
        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 36px 24px;
          text-align: center;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
        }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(14,165,233,0.1); }
        .check-item::before {
          content: '';
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #EFF9FF;
          border: 2px solid #0EA5E9;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .section-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EFF9FF;
          color: #0284c7;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 50px;
          border: 1px solid #BAE6FD;
          margin-bottom: 16px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .testimonial {
          background: white;
          border-radius: 20px;
          padding: 28px;
          border: 1px solid #e2e8f0;
          position: relative;
        }
        .testimonial::before {
          content: '"';
          position: absolute;
          top: 12px; right: 24px;
          font-size: 80px;
          font-family: 'Syne', sans-serif;
          color: #BAE6FD;
          line-height: 1;
        }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="hero-bg" style={{ padding: '100px 24px 120px', position: 'relative' }}>
        <div className="hero-grid" />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Logo badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div className="float-card" style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '12px 24px', backdropFilter: 'blur(8px)' }}>
              <div style={{ position: 'relative' }}>
                <div className="pulse-ring" style={{ position: 'absolute', inset: -4, borderRadius: 16, border: '2px solid rgba(14,165,233,0.5)' }} />
                <MedCheckLogo size="md" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: 'white', letterSpacing: '-0.5px' }}>MedCheck</div>
                <div style={{ fontSize: 12, color: 'rgba(186,230,253,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Medical Symptom Checker</div>
              </div>
            </div>
          </div>

          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 7vw, 68px)', color: 'white', lineHeight: 1.08, marginBottom: 24, letterSpacing: '-1.5px' }}>
            Your Health,<br />
            <span style={{ color: '#38BDF8' }}>Understood</span> Instantly
          </h1>
          <p style={{ fontSize: 'clamp(16px,2.5vw,19px)', color: 'rgba(186,230,253,0.85)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
            AI-powered symptom analysis that gives you real health insights — then connects you with verified doctors in your area.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <button className="btn-primary" onClick={() => navigate('/symptom-checker')}>
                Start Symptom Check <span>→</span>
              </button>
            ) : (
              <>
                <Link to="/register" className="btn-primary">Get Started Free <span>→</span></Link>
                <Link to="/login" className="btn-outline">Sign In</Link>
              </>
            )}
          </div>

          {/* Trust bar */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
            {[['50K+', 'Active Users'], ['800+', 'Verified Doctors'], ['98%', 'Satisfaction Rate']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#38BDF8' }}>{n}</div>
                <div style={{ fontSize: 13, color: 'rgba(186,230,253,0.7)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: '96px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-tag">✦ Why MedCheck</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 16 }}>
              Healthcare, Reimagined
            </h2>
            <p style={{ color: '#475569', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
              Everything you need to understand your health and get the right care
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: '🧠', title: 'Smart AI Analysis', desc: 'Analyzes symptoms across 10,000+ medical conditions, giving you urgency levels and actionable next steps.', color: '#EFF9FF' },
              { icon: '🩺', title: 'Verified Doctors', desc: 'Every doctor is license-verified. View qualifications, experience, patient reviews, and transparent pricing.', color: '#F0FDF4' },
              { icon: '📅', title: 'Instant Booking', desc: 'Real-time availability, one-tap booking, auto-reminders, and your complete medical history in one place.', color: '#FFF7ED' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ width: 56, height: 56, background: f.color, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: 15 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-tag">✦ Simple Process</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px' }}>
              How MedCheck Works
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { step: '1', title: 'Describe Your Symptoms', desc: 'Tell MedCheck what you\'re experiencing — be as detailed as you like. Duration, severity, location.', time: '~2 min' },
              { step: '2', title: 'AI Analyzes Your Case', desc: 'Our medical AI cross-references your symptoms with thousands of conditions and creates your urgency profile.', time: 'Instant' },
              { step: '3', title: 'Review Your Results', desc: 'Get a clear breakdown of possible causes, urgency level, and recommended specialist type.', time: '~1 min' },
              { step: '4', title: 'Book the Right Doctor', desc: 'Connect with a verified specialist matched to your symptoms. Book in seconds, get reminders automatically.', time: 'Instant' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '28px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                <div className="step-num">{item.step}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 19, fontWeight: 700, color: '#0f172a' }}>{item.title}</h3>
                    <span style={{ background: '#EFF9FF', color: '#0284c7', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 50, border: '1px solid #BAE6FD' }}>{item.time}</span>
                  </div>
                  <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: 15 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(135deg, #0c1f35 0%, #0a2a4a 100%)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(14,165,233,0.15)', color: '#38BDF8', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 50, border: '1px solid rgba(14,165,233,0.3)', marginBottom: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>✦ Trusted Platform</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: 'white', letterSpacing: '-0.8px' }}>
              Trusted by Thousands
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { n: '50K+', l: 'Active Patients', d: 'Using MedCheck monthly' },
              { n: '800+', l: 'Verified Doctors', d: 'Licensed & credentialed' },
              { n: '98%', l: 'Satisfaction Rate', d: 'From user surveys' },
              { n: '10K+', l: 'Conditions Analyzed', d: 'In our medical database' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 44, fontWeight: 800, color: '#38BDF8', marginBottom: 6 }}>{s.n}</div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{s.l}</div>
                <div style={{ color: 'rgba(186,230,253,0.6)', fontSize: 13 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: '96px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-tag">✦ Patient Stories</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px' }}>
              What People Are Saying
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { name: 'Priya S.', role: 'Patient', text: 'MedCheck identified my symptoms as possibly related to thyroid issues. The AI was right — my doctor confirmed it at my appointment. Incredible tool.', stars: 5 },
              { name: 'Rahul M.', role: 'Patient', text: 'Booking a doctor used to take days. With MedCheck I found a cardiologist nearby and booked in 2 minutes. The seamless experience is unmatched.', stars: 5 },
              { name: 'Dr. Anjali K.', role: 'Verified Doctor', text: 'My patients arrive better informed now. MedCheck\'s symptom summaries help us use consultation time more effectively. Highly recommend.', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="testimonial">
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array(t.stars).fill(0).map((_, j) => <span key={j} style={{ color: '#F59E0B', fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: 15, marginBottom: 20 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #0EA5E9 0%, #0284c7 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <MedCheckLogo size="lg" />
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, color: 'white', letterSpacing: '-1px', margin: '24px 0 16px' }}>
            Take Control of Your Health Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, marginBottom: 40, lineHeight: 1.7 }}>
            Join 50,000+ people who've found clarity about their health with MedCheck
          </p>
          {user ? (
            <button className="btn-primary" onClick={() => navigate('/symptom-checker')} style={{ background: 'white', color: '#0EA5E9', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              Go to Symptom Checker →
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ background: 'white', color: '#0EA5E9', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>Get Started Free →</Link>
              <Link to="/login" className="btn-outline">Sign In</Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#0c1f35', color: '#94a3b8', padding: '64px 24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <MedCheckLogo size="sm" />
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'white' }}>MedCheck</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 220 }}>Intelligent health insights connecting patients with verified medical professionals.</p>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'white', marginBottom: 16, fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Product</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Symptom Checker', 'Find Doctors', 'Book Appointments', 'Patient Dashboard'].map(l => (
                  <li key={l}><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#38BDF8'} onMouseOut={e => e.target.style.color = '#94a3b8'}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'white', marginBottom: 16, fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Company</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['About Us', 'For Doctors', 'Contact', 'Careers'].map(l => (
                  <li key={l}><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }} onMouseOver={e => e.target.style.color = '#38BDF8'} onMouseOut={e => e.target.style.color = '#94a3b8'}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'white', marginBottom: 16, fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Legal</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Privacy Policy', 'Terms of Service', 'Medical Disclaimer', 'Cookie Policy'].map(l => (
                  <li key={l}><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }} onMouseOver={e => e.target.style.color = '#38BDF8'} onMouseOut={e => e.target.style.color = '#94a3b8'}>{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13 }}>© 2026 MedCheck. All rights reserved. This is a health informational tool — not a substitute for medical diagnosis.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              <span style={{ fontSize: 13, color: '#4ade80' }}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
