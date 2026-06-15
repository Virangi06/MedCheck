import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Brain, MapPin, CalendarDays, AlertTriangle, UserRound, ShieldCheck, Heart } from 'lucide-react';
import MedCheckLogo from '../components/MedCheckLogo';
import { feedbackAPI } from '../services/feedbackAPI'; // ADD THIS IMPORT

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // ADD THIS STATE
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // ADD THIS useEffect
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await feedbackAPI.getRandomFeedbacks(3);
        setTestimonials(data.feedbacks || []);
      } catch (error) {
        console.warn('Failed to load testimonials:', error.message);
        // Fallback to static if API fails
        setTestimonials([
          { 
            userName: 'Priya S.', 
            role: 'Patient', 
            feedbackText: 'MedCheck identified my symptoms as possibly related to thyroid issues. The AI was right — my doctor confirmed it at my appointment. Incredible tool.',
            rating: 5 
          },
          { 
            userName: 'Rahul M.', 
            role: 'Patient', 
            feedbackText: 'Booking a doctor used to take days. With MedCheck I found a cardiologist nearby and booked in 2 minutes. The seamless experience is unmatched.',
            rating: 5 
          },
          { 
            userName: 'Dr. Anjali K.', 
            role: 'Verified Doctor', 
            feedbackText: 'My patients arrive better informed now. MedCheck\'s symptom summaries help us use consultation time more effectively. Highly recommend.',
            rating: 5 
          },
        ]);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    loadTestimonials();
  }, []);

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
          background: #f8fafc;
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
        .disclaimer-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 36px 32px;
          backdrop-filter: blur(8px);
          transition: all 0.3s;
        }
        .disclaimer-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(14,165,233,0.4);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        @media (max-width: 768px) {
          section {
            padding: 48px 16px !important;
          }
          .hero-bg {
            padding: 80px 16px 80px !important;
          }
          .features-grid, .mission-grid, .testimonials-grid, .disclaimer-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .step-time-badge {
            font-size: 10px !important;
            padding: 2px 8px !important;
          }
          .step-title-row {
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
        }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="hero-bg" style={{ padding: '100px 24px 120px', position: 'relative' }}>
        <div className="hero-grid" />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Logo badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div className="float-card" style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '16px 28px', backdropFilter: 'blur(8px)' }}>
              <MedCheckLogo size="sm" showSubtitle={false} darkTheme={true} />
            </div>
          </div>

          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(36px, 7vw, 68px)', color: 'white', lineHeight: 1.08, marginBottom: 24, letterSpacing: '-1.5px' }}>
            Your Health,<br />
            <span style={{ color: '#38BDF8' }}>Understood</span> Instantly
          </h1>
          <p style={{ fontSize: 'clamp(16px,2.5vw,19px)', color: 'rgba(186,230,253,0.85)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
            AI-powered symptom analysis that helps you better understand your health instantly.
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
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: '96px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-tag">Why MedCheck</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,42px)', color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 16 }}>
              Healthcare, Reimagined
            </h2>
            <p style={{ color: '#475569', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
              Everything you need to understand your health and get the right care
            </p>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                icon: <Brain size={26} color="white" strokeWidth={1.8} />,
                title: 'Smart AI Analysis',
                desc: 'Advanced AI analyzes your symptoms, identifies possible health conditions, estimates severity levels, and provides personalized health guidance within seconds.',
              },
              {
                icon: <MapPin size={26} color="white" strokeWidth={1.8} />,
                title: 'Nearby Doctor Suggestions',
                desc: 'Get recommendations for nearby hospitals, clinics, and healthcare specialists based on your symptom analysis and health concerns.',
              },
              {
                icon: <CalendarDays size={26} color="white" strokeWidth={1.8} />,
                title: 'Personal Health History',
                desc: 'Securely save previous symptom analyses, monitor recurring health patterns, and access your complete health insight history anytime.',
              },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    background: 'linear-gradient(135deg, #0c1f35 0%, #0a3a6e 100%)',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(14,165,233,0.25)',
                    flexShrink: 0,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#0f172a' }}>{f.title}</h3>
                </div>
                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 15, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-tag">Simple Process</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,42px)', color: '#0f172a', letterSpacing: '-0.8px' }}>
              How MedCheck Works
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { step: '1', title: 'Describe Your Symptoms', desc: 'Tell MedCheck what you\'re experiencing — be as detailed as you like. Duration, severity, location.', time: '~2 min' },
              { step: '2', title: 'AI Analyzes Your Case', desc: 'Our medical AI cross-references your symptoms with thousands of conditions and creates your urgency profile.', time: 'Instant' },
              { step: '3', title: 'Review Your Results', desc: 'Get a clear breakdown of possible causes, urgency level, and recommended specialist type.', time: '~1 min' },
              { step: '4', title: 'Get Health Guidance', desc: 'Receive AI-powered health insights, personalized recommendations, and suggested nearby healthcare facilities based on your symptoms.', time: 'Instant' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '28px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                <div className="step-num">{item.step}</div>
                <div style={{ flex: 1 }}>
                  <div className="step-title-row" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 19, color: '#0f172a', margin: 0 }}>{item.title}</h3>
                    <span className="step-time-badge" style={{ background: '#EFF9FF', color: '#0284c7', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 50, border: '1px solid #BAE6FD', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.time}</span>
                  </div>
                  <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: 15 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR MISSION ─── */}
      <section style={{ padding: '96px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="mission-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <div className="section-tag">Our Mission</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,42px)', color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 20 }}>
                Empowering Every Patient With Clarity & Confidence
              </h2>
              <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
                We believe that healthcare starts with understanding. Our mission is to bridge the gap between complex medical jargon and human curiosity, providing clear, secure, and instant guidance to help you navigate your wellness journey.
              </p>
              <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
                At MedCheck, we build tools that democratize access to health intelligence. Whether you are checking a symptom or monitoring wellness patterns, we are here to support your health journey with care.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/symptom-checker" className="btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
                  Check Symptoms Now <span>→</span>
                </Link>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '24px' }}>
              {[
                { 
                  icon: <Heart size={26} color="white" strokeWidth={1.8} />, 
                  title: 'Patient-First Focus', 
                  desc: 'We translate complex symptom patterns into clear language, helping you understand your body before speaking with a professional.' 
                },
                { 
                  icon: <Brain size={26} color="white" strokeWidth={1.8} />, 
                  title: 'Intelligent Guidance', 
                  desc: 'By cross-referencing global medical insights with custom symptom metrics, we deliver contextually relevant health suggestions.' 
                },
                { 
                  icon: <ShieldCheck size={26} color="white" strokeWidth={1.8} />, 
                  title: 'Privacy as a Foundation', 
                  desc: 'Your health data belongs to you. We secure your personal symptom reports with industry-grade encryption and full data control.' 
                }
              ].map((item, idx) => (
                <div key={idx} className="feature-card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'start' }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    background: 'linear-gradient(135deg, #0c1f35 0%, #0a3a6e 100%)',
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(14,165,233,0.25)',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0f172a', fontFamily: 'Syne, sans-serif' }}>{item.title}</h3>
                    <p style={{ color: '#475569', lineHeight: 1.6, fontSize: 14, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-tag">Patient Stories</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,42px)', color: '#0f172a', letterSpacing: '-0.8px' }}>
              What People Are Saying
            </h2>
          </div>
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {loadingTestimonials ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>
                <p style={{ color: '#94a3b8' }}>Loading testimonials...</p>
              </div>
            ) : testimonials && testimonials.length > 0 ? (
              testimonials.map((t, i) => (
                <div key={i} className="testimonial">
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                    {Array(t.rating || 5).fill(0).map((_, j) => <span key={j} style={{ color: '#F59E0B', fontSize: 16 }}>★</span>)}
                  </div>
                  <p style={{ color: '#334155', lineHeight: 1.7, fontSize: 15, marginBottom: 20 }}>{t.feedbackText || t.text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15 }}>
                      {(t.userName || t.name || 'U')[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{t.userName || t.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: 12 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>
                <p style={{ color: '#94a3b8' }}>No testimonials yet. Be the first to share!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── DISCLAIMER ─── */}
      <section style={{
        padding: '96px 24px',
        background: 'linear-gradient(135deg, #0c1f35 0%, #0a2a4a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Glow */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          right: '-120px',
          width: 320,
          height: 320,
          background: 'rgba(14,165,233,0.12)',
          filter: 'blur(80px)',
          borderRadius: '50%',
        }} />

        <div style={{ maxWidth: 950, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(14,165,233,0.15)',
              color: '#38BDF8',
              fontSize: 13,
              padding: '6px 14px',
              borderRadius: 50,
              border: '1px solid rgba(14,165,233,0.3)',
              marginBottom: 16,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Medical Disclaimer
            </div>

            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(30px,4vw,46px)',
              color: 'white',
              letterSpacing: '-0.8px',
              marginBottom: 20,
            }}>
              Important Health Information
            </h2>

            <p style={{
              color: 'rgba(186,230,253,0.82)',
              fontSize: 17,
              lineHeight: 1.9,
              maxWidth: 760,
              margin: '0 auto',
            }}>
              MedCheck provides AI-powered health insights and symptom analysis
              for informational and educational purposes only. It is not intended
              to replace professional medical advice, diagnosis, or treatment.
            </p>
          </div>

          {/* ── Three standalone disclaimer cards (no outer wrapper) ── */}
          <div className="disclaimer-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {[
              {
                icon: <AlertTriangle size={26} color="white" strokeWidth={1.8} />,
                title: 'Not a Medical Diagnosis',
                desc: 'AI-generated insights should not be considered as professional medical diagnosis or treatment recommendations.',
              },
              {
                icon: <UserRound size={26} color="white" strokeWidth={1.8} />,
                title: 'Consult Healthcare Professionals',
                desc: 'Always seek advice from qualified medical professionals regarding health conditions or emergencies.',
              },
              {
                icon: <ShieldCheck size={26} color="white" strokeWidth={1.8} />,
                title: 'Secure & Private',
                desc: 'Your symptom data and health analyses are handled securely with privacy-focused practices.',
              },
            ].map((item, index) => (
              <div key={index} className="disclaimer-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 58,
                    height: 58,
                    borderRadius: 18,
                    background: 'linear-gradient(135deg, #0c2a4a 0%, #0a3a6e 100%)',
                    border: '1px solid rgba(14,165,233,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(14,165,233,0.2)',
                    flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>

                  <h3 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>
                    {item.title}
                  </h3>
                </div>

                <p style={{ color: 'rgba(186,230,253,0.72)', lineHeight: 1.8, fontSize: 14, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '100px 24px', background: '#ffffff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(14,165,233,0.04) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(14,165,233,0.03) 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          {/* CTA Logo Section */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <svg width={80} height={80} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="28" fill="#0EA5E9" />
              <rect x="24.5" y="12" width="7" height="32" rx="3.5" fill="white" />
              <rect x="12" y="24.5" width="32" height="7" rx="3.5" fill="white" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 500, color: '#0f172a', letterSpacing: '-1px', margin: '24px 0 16px' }}>
            Take Control of Your Health Today
          </h2>
          {user ? (
            <button className="btn-primary" onClick={() => navigate('/symptom-checker')} style={{ background: '#0EA5E9', color: 'white', boxShadow: '0 4px 16px rgba(14,165,233,0.35)' }}>
              Go to Symptom Checker →
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ background: '#0EA5E9', color: 'white', boxShadow: '0 4px 16px rgba(14,165,233,0.35)' }}>Get Started Free →</Link>
              <Link to="/login" className="btn-outline" style={{ background: 'transparent', color: '#0EA5E9', border: '1.5px solid #0EA5E9' }}>Sign In</Link>
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
                <MedCheckLogo size="sm" showSubtitle={false} darkTheme={true} />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 220 }}>Intelligent health insights connecting patients with verified medical professionals.</p>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'white', marginBottom: 16, fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Product</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'AI Symptom Analysis', path: '/product/symptom-analysis' },
                  { name: 'Health Insights', path: '/product/health-insights' },
                  { name: 'Nearby Doctor Suggestions', path: '/product/doctor-suggestions' },
                  { name: 'Personal Health History', path: '/product/health-history' }
                ].map(l => (
                  <li key={l.name}>
                    <Link to={l.path} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#38BDF8'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'white', marginBottom: 16, fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Legal</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'Symptoms Library', path: '/symptoms' },
                  { name: 'Privacy Policy', path: '/privacy-policy' },
                  { name: 'Terms of Service', path: '/terms-of-service' },
                  { name: 'Medical Disclaimer', path: '/medical-disclaimer' },
                  { name: 'Cookie Policy', path: '/cookie-policy' }
                ].map(l => (
                  <li key={l.name}>
                    <Link to={l.path} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#38BDF8'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13 }}>© 2026 MedCheck. All rights reserved. This is a health informational tool — not a substitute for medical diagnosis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;