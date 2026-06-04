import { Link } from 'react-router-dom';
import MedCheckLogo from '../components/MedCheckLogo';

function PrivacyPolicy() {
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
      `}</style>

      {/* HERO */}
      <section className="hero-bg" style={{ padding: '80px 24px', position: 'relative' }}>
        <div className="hero-grid"></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <MedCheckLogo size="md" darkTheme={true} />
          </div>
          <div className="section-tag">✦ Legal Documents</div>
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
            Privacy Policy
          </h1>
          <p style={{ color: 'rgba(186,230,253,0.85)', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
            Last updated: May 29, 2026. Your health information privacy is our highest commitment.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <div className="document-card">
            <p>
              At MedCheck, we value your privacy above all else. This Privacy Policy details how we handle, protect, and process the personal information and health symptom inputs you share with our AI health assistant.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information that is necessary to provide dynamic AI symptom assessments:
            </p>
            <ul>
              <li><strong>Account Credentials:</strong> Name, email address, and authentication details when you sign up.</li>
              <li><strong>Symptom Input Details:</strong> Descriptions of symptoms, location, pain duration, and severity profiles you submit for evaluation.</li>
              <li><strong>Technical Metadata:</strong> Anonymized usage statistics, IP address, and browser characteristics to keep systems running optimally.</li>
            </ul>

            <h2>2. How We Use Your Data</h2>
            <p>
              Your data is exclusively processed to:
            </p>
            <ul>
              <li>Generate relevant AI symptom reports and risk estimations.</li>
              <li>Provide helpful recommendations for nearby specialists or clinics.</li>
              <li>Maintain and save your Personal Health History dashboard.</li>
              <li>Improve system accuracy and performance using aggregate, completely de-identified data.</li>
            </ul>

            <h2>3. Information Sharing & Disclosure</h2>
            <p>
              We enforce a strict policy regarding your sensitive data:
            </p>
            <ul>
              <li><strong>No Commercial Sharing:</strong> We do not sell or lease your health history or personal information to third-party advertising companies.</li>
              <li><strong>Medical Professionals:</strong> Your data is only shared with medical providers at your explicit direction (e.g., when export options are selected).</li>
              <li><strong>Legal Compliance:</strong> We will only disclose information if strictly required by local regulatory or judicial warrants.</li>
            </ul>

            <h2>4. Security Standards</h2>
            <p>
              We utilize advanced industry protection, including End-to-End Transport Layer Security (TLS/SSL encryption), secure database partitions, and rigorous auditing, to safeguard your sensitive information.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              For questions regarding this policy or to request account and data removal, please contact privacy@medcheck.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
