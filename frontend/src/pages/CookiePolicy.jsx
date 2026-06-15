import MedCheckLogo from '../components/MedCheckLogo';

function CookiePolicy() {
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

        .document-card {
          background: white;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 48px;
          box-shadow: 0 4px 20px rgba(15,23,42,0.03);
          line-height: 1.8;
          color: #334155;
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

        h2 {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          color: #0f172a;
          margin-top: 36px;
          margin-bottom: 16px;
          font-weight: 700;
        }

        p {
          margin-bottom: 20px;
          font-size: 15px;
        }

        ul {
          margin-bottom: 24px;
          padding-left: 20px;
        }

        li {
          margin-bottom: 10px;
          font-size: 15px;
        }
        @media (max-width: 768px) {
          .document-card {
            padding: 24px 16px !important;
            border-radius: 16px !important;
          }
          .hero-bg {
            padding: 50px 16px !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="hero-bg" style={{ padding: '80px 24px', position: 'relative' }}>
        <div className="hero-grid"></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <MedCheckLogo size="md" darkTheme={true} />
          </div>
          <div className="section-tag">Cookie Guidelines</div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(32px, 6vw, 56px)',
              color: 'white',
              lineHeight: 1.1,
              marginBottom: 16,
              letterSpacing: '-1.5px',
            }}
          >
            Cookie Policy
          </h1>
          <p style={{ color: 'rgba(186,230,253,0.85)', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
            Last updated: May 29, 2026. Learn how we use tracking cookies and storage options.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <div className="document-card">
            <p>
              MedCheck uses cookies, local storage capabilities, and equivalent technologies to offer a consistent, secure, and personalized user experience. This Policy details how and why we deploy these storage features.
            </p>

            <h2>1. What are Cookies and Local Storage?</h2>
            <p>
              Cookies are small fragments of text saved to your browser directory when you load websites. Local storage and session storage are mechanisms built into your browser that allow us to save data locally on your device between checker sessions.
            </p>

            <h2>2. Types of Cookies We Use</h2>
            <ul>
              <li><strong>Essential Storage:</strong> Required to keep you authenticated, process dashboard logins, and maintain checker sessions. Disabling these will cause site login errors.</li>
              <li><strong>Performance & Statistics:</strong> Tracks page load speeds and error occurrences in an anonymized aggregate format to keep systems stable.</li>
              <li><strong>Preferences:</strong> Stores dashboard visual states (such as selected color themes or layout profiles) for a seamless experience.</li>
            </ul>

            <h2>3. Managing Your Cookie Settings</h2>
            <p>
              You can adjust, refuse, or block cookies through your browser preference panel. However, please note that blocking essential cookies will make it impossible to log in, save symptom histories, or access patient dashboard features.
            </p>

            <h2>4. Policy Updates</h2>
            <p>
              We periodically update this policy. Any modifications will be declared directly on this page with an updated modification date.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CookiePolicy;
