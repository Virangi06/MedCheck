import { Link } from 'react-router-dom';
import MedCheckLogo from '../components/MedCheckLogo';

function HealthHistory() {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .hero-bg {
          background: linear-gradient(135deg, #0c1f35 0%, #0a2a4a 40%, #0d3b6e 70%, #0ea5e9 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .glass-card {
          background: white;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 36px;
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(14,165,233,0.08);
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
          text-transform: uppercase;
        }

        .btn-primary {
          background: #0EA5E9;
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: 0.3s;
          box-shadow: 0 8px 24px rgba(14,165,233,0.35);
        }

        .btn-primary:hover {
          background: #0284c7;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .glass-card {
            padding: 24px 16px !important;
            border-radius: 16px !important;
          }
          .hero-bg {
            padding: 60px 16px 80px !important;
          }
          .glass-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="hero-bg" style={{ padding: '100px 24px 120px', position: 'relative' }}>
        <div className="hero-grid"></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
            <MedCheckLogo size="lg" darkTheme={true} />
          </div>
          <div className="section-tag">Health Record</div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(38px, 7vw, 68px)',
              color: 'white',
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: '-1px',
            }}
          >
            Personal Health
            <br />
            <span style={{ color: '#38BDF8' }}>History</span>
          </h1>
          <p
            style={{
              color: 'rgba(186,230,253,0.85)',
              fontSize: 18,
              lineHeight: 1.8,
              maxWidth: 720,
              margin: '0 auto',
            }}
          >
            Keep track of all your health checks in one place. Monitor recurring symptoms, record severity over time, and keep a reliable historical file to share with medical professionals.
          </p>
        </div>
      </section>

      {/* BENIFITS */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="glass-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            <div className="glass-card">
              <div style={{ fontSize: 46, marginBottom: 18 }}>📅</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, marginBottom: 16, color: '#0f172a' }}>Historical Tracking</h2>
              <p style={{ color: '#475569', lineHeight: 1.9, fontSize: 15 }}>
                Every symptom checker session you perform is saved securely in your profile dashboard. Easily access, review, and filter previous results.
              </p>
            </div>
            <div className="glass-card">
              <div style={{ fontSize: 46, marginBottom: 18 }}>📈</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, marginBottom: 16, color: '#0f172a' }}>Trend Analysis</h2>
              <p style={{ color: '#475569', lineHeight: 1.9, fontSize: 15 }}>
                Observe changes in symptom patterns. Discover if headaches, seasonal allergies, or other complaints have a high frequency in particular months.
              </p>
            </div>
            <div className="glass-card">
              <div style={{ fontSize: 46, marginBottom: 18 }}>📤</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, marginBottom: 16, color: '#0f172a' }}>Physician Sharing</h2>
              <p style={{ color: '#475569', lineHeight: 1.9, fontSize: 15 }}>
                When visiting a doctor, pull up your symptom history on the dashboard to provide clear context on when symptoms started and how severe they have been.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section
        style={{
          padding: '100px 24px',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #0284c7 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 500, color: 'white', margin: '0 0 24px' }}>
            Build Your Health Portfolio
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: 36, fontSize: 17 }}>
            Sign up or sign in to track assessments, compile health trends, and manage your health information.
          </p>
          <Link to="/register" className="btn-primary">
            Create Free Account →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HealthHistory;
