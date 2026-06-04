import { Link } from 'react-router-dom';
import { Target, Brain, ShieldCheck, Activity, Sparkles, MapPin, Calendar, HelpCircle, ArrowRight } from 'lucide-react';
import MedCheckLogo from '../components/MedCheckLogo';

function AboutUs() {
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
      `}</style>

      {/* HERO */}
      <section
        className="hero-bg"
        style={{
          padding: '100px 24px 120px',
          position: 'relative',
        }}
      >
        <div className="hero-grid"></div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 900,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 30,
            }}
          >
            <MedCheckLogo size="lg" darkTheme={true} />
          </div>

          <div className="section-tag">
            <Sparkles size={14} strokeWidth={2.5} />
            About MedCheck
          </div>

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
            AI-Powered Healthcare
            <br />
            <span style={{ color: '#38BDF8' }}>
              Built For Everyone
            </span>
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
            MedCheck is designed to help people better understand their
            health through intelligent AI-powered symptom analysis,
            personalized health insights, and accessible healthcare
            guidance.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ padding: '100px 24px' }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
              gap: 28,
            }}
          >
            <div className="glass-card">
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: '#EFF9FF',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  border: '1px solid #BAE6FD',
                  boxShadow: '0 4px 12px rgba(14,165,233,0.08)',
                }}
              >
                <Target size={28} color="#0284c7" strokeWidth={2} />
              </div>

              <h2
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 28,
                  marginBottom: 16,
                  color: '#0f172a',
                }}
              >
                Our Mission
              </h2>

              <p
                style={{
                  color: '#475569',
                  lineHeight: 1.9,
                  fontSize: 15,
                }}
              >
                We aim to make healthcare guidance more accessible by
                combining modern AI technology with intuitive user
                experiences. MedCheck helps users understand possible
                health concerns before seeking professional medical care.
              </p>
            </div>

            <div className="glass-card">
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: '#EFF9FF',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  border: '1px solid #BAE6FD',
                  boxShadow: '0 4px 12px rgba(14,165,233,0.08)',
                }}
              >
                <Brain size={28} color="#0284c7" strokeWidth={2} />
              </div>

              <h2
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 28,
                  marginBottom: 16,
                  color: '#0f172a',
                }}
              >
                AI-Driven Insights
              </h2>

              <p
                style={{
                  color: '#475569',
                  lineHeight: 1.9,
                  fontSize: 15,
                }}
              >
                Using AI-powered symptom analysis, MedCheck provides
                intelligent health insights, severity estimation,
                wellness recommendations, and healthcare guidance
                tailored to user symptoms.
              </p>
            </div>

            <div className="glass-card">
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: '#EFF9FF',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  border: '1px solid #BAE6FD',
                  boxShadow: '0 4px 12px rgba(14,165,233,0.08)',
                }}
              >
                <ShieldCheck size={28} color="#0284c7" strokeWidth={2} />
              </div>

              <h2
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 28,
                  marginBottom: 16,
                  color: '#0f172a',
                }}
              >
                Privacy & Security
              </h2>

              <p
                style={{
                  color: '#475569',
                  lineHeight: 1.9,
                  fontSize: 15,
                }}
              >
                We prioritize user privacy and data security. Health
                information and symptom analyses are stored securely to
                ensure a safe and trustworthy healthcare experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY MEDCHECK */}
      <section
        style={{
          padding: '100px 24px',
          background: 'white',
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div className="section-tag">
            <Sparkles size={14} strokeWidth={2.5} />
            Why Choose MedCheck
          </div>

          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(30px,5vw,48px)',
              fontWeight: 500,
              color: '#0f172a',
              marginBottom: 22,
            }}
          >
            Smarter Healthcare Assistance
          </h2>

          <p
            style={{
              color: '#64748b',
              lineHeight: 1.9,
              fontSize: 17,
              maxWidth: 720,
              margin: '0 auto 60px',
            }}
          >
            MedCheck combines healthcare guidance with modern AI
            technology to create a more intelligent and user-friendly
            health experience.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: 24,
            }}
          >
            {[
              { title: 'AI Symptom Analysis', icon: Brain },
              { title: 'Health Risk Insights', icon: Activity },
              { title: 'Nearby Doctor Suggestions', icon: MapPin },
              { title: 'Personal Health Tracking', icon: Calendar },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="glass-card"
                  style={{
                    textAlign: 'center',
                    padding: 28,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      background: '#EFF9FF',
                      borderRadius: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 18px',
                      border: '1px solid #BAE6FD',
                      boxShadow: '0 4px 12px rgba(14,165,233,0.08)',
                    }}
                  >
                    <IconComponent size={28} color="#0284c7" strokeWidth={2} />
                  </div>

                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section
        style={{
          padding: '80px 24px',
          background: '#f8fafc',
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          <div
            className="glass-card"
            style={{
              background: '#fff',
              borderLeft: '4px solid #0EA5E9',
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: '#EFF9FF',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #BAE6FD',
                flexShrink: 0,
              }}
            >
              <HelpCircle size={24} color="#0284c7" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: 16,
                  marginTop: 4,
                }}
              >
                Medical Disclaimer
              </h3>

              <p
                style={{
                  color: '#64748b',
                  lineHeight: 1.9,
                  fontSize: 15,
                }}
              >
                MedCheck provides AI-generated health insights for
                educational and informational purposes only. It is not
                intended to replace professional medical advice,
                diagnosis, or treatment. Always consult a qualified
                healthcare professional regarding medical concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: '100px 24px',
          background:
            'linear-gradient(135deg, #0f172a 0%, #2f4371ff 100%)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: 700,
            margin: '0 auto',
          }}
        >
          <MedCheckLogo size="lg" darkTheme={true} />

          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(32px,5vw,52px)',
              fontWeight: 500,
              color: 'white',
              margin: '24px 0',
            }}
          >
            Start Your Health Journey Today
          </h2>

          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.8,
              marginBottom: 36,
              fontSize: 17,
            }}
          >
            Experience AI-powered symptom analysis and smarter health
            insights with MedCheck.
          </p>

          <Link to="/register" className="btn-primary">
            Get Started <ArrowRight size={16} strokeWidth={2.5} style={{ marginLeft: 4 }} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;