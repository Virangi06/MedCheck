// frontend/src/components/HealthTipsFeed.jsx
import React, { useState, useEffect } from 'react';
import { getHealthTips } from '../services/tipsService';
import {
  Sparkles, RefreshCw, AlertCircle, ChevronRight,
  Lightbulb, Heart, Activity, Moon, Droplets, Shield,
  Pill, Apple, Brain, Zap, Info,
} from 'lucide-react';

/* ─── Category config ─────────────────────────────────── */
const CAT_CONFIG = {
  cardiovascular: { icon: <Heart size={20} />,    gradient: 'linear-gradient(135deg,#fda4af,#f43f5e)', light: '#fff1f2', text: '#be123c' },
  hydration:      { icon: <Droplets size={20} />, gradient: 'linear-gradient(135deg,#7dd3fc,#0ea5e9)', light: '#f0f9ff', text: '#0369a1' },
  sleep:          { icon: <Moon size={20} />,     gradient: 'linear-gradient(135deg,#c4b5fd,#8b5cf6)', light: '#f5f3ff', text: '#6d28d9' },
  activity:       { icon: <Activity size={20} />, gradient: 'linear-gradient(135deg,#86efac,#22c55e)', light: '#f0fdf4', text: '#15803d' },
  medication:     { icon: <Pill size={20} />,     gradient: 'linear-gradient(135deg,#fcd34d,#f59e0b)', light: '#fffbeb', text: '#b45309' },
  diet:           { icon: <Apple size={20} />,    gradient: 'linear-gradient(135deg,#f9a8d4,#ec4899)', light: '#fdf2f8', text: '#9d174d' },
  nutrition:      { icon: <Apple size={20} />,    gradient: 'linear-gradient(135deg,#f9a8d4,#ec4899)', light: '#fdf2f8', text: '#9d174d' },
  mental:         { icon: <Brain size={20} />,    gradient: 'linear-gradient(135deg,#a5b4fc,#6366f1)', light: '#eef2ff', text: '#4338ca' },
  stress:         { icon: <Brain size={20} />,    gradient: 'linear-gradient(135deg,#a5b4fc,#6366f1)', light: '#eef2ff', text: '#4338ca' },
  immunity:       { icon: <Shield size={20} />,   gradient: 'linear-gradient(135deg,#6ee7b7,#10b981)', light: '#ecfdf5', text: '#065f46' },
  energy:         { icon: <Zap size={20} />,      gradient: 'linear-gradient(135deg,#fde68a,#eab308)', light: '#fefce8', text: '#854d0e' },
};

const getCat = (cat = '') => {
  const key = cat.toLowerCase().split(' ')[0];
  return CAT_CONFIG[key] || {
    icon: <Lightbulb size={20} />,
    gradient: 'linear-gradient(135deg,#93c5fd,#3b82f6)',
    light: '#eff6ff',
    text: '#1d4ed8',
  };
};

/* ═══════════════════════════════════════════════════════ */
const HealthTipsFeed = () => {
  const [tips, setTips]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [error, setError]             = useState(null);
  const [expanded, setExpanded]       = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => { fetchTips(); }, []);

  const fetchTips = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await getHealthTips();
      if (res.success) { setTips(res.recommendations || []); setExpanded(null); }
      else throw new Error(res.message || 'Failed to load');
    } catch (err) { setError(err.message || 'Unable to load tips'); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const handleRefresh = () => { setRefreshing(true); fetchTips(true); };

  const categories = ['All', ...new Set(tips.map(t => t.category).filter(Boolean))];
  const filtered   = activeFilter === 'All' ? tips : tips.filter(t => t.category === activeFilter);

  /* ── LOADING ── */
  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'80px 24px', background:'white', borderRadius:'24px',
      border:'1.5px solid #f1f5f9', minHeight:'360px' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:'48px', height:'48px', borderRadius:'50%',
        border:'4px solid #f1f5f9', borderTop:'4px solid #0ea5e9',
        animation:'spin 0.85s linear infinite', marginBottom:'20px' }} />
      <p style={{ margin:0, fontWeight:'700', fontSize:'17px', color:'#0f172a', fontFamily:"'Syne',sans-serif" }}>
        Generating your tips…
      </p>
      <p style={{ margin:'6px 0 0', fontSize:'13px', color:'#94a3b8' }}>
        Analysing your symptoms &amp; health profile
      </p>
    </div>
  );

  /* ── ERROR ── */
  if (error) return (
    <div style={{ background:'#fef2f2', border:'1.5px solid #fecaca',
      borderRadius:'20px', padding:'40px 32px', textAlign:'center' }}>
      <AlertCircle size={40} color="#ef4444" style={{ marginBottom:'14px' }} />
      <h3 style={{ margin:'0 0 8px', color:'#991b1b', fontSize:'17px', fontWeight:'700' }}>
        Could not load tips
      </h3>
      <p style={{ margin:'0 0 20px', color:'#b91c1c', fontSize:'13.5px' }}>{error}</p>
      <button onClick={fetchTips} style={{
        padding:'11px 26px', borderRadius:'12px', border:'none',
        background:'#dc2626', color:'white', fontWeight:'600', fontSize:'14px', cursor:'pointer',
      }}>Try Again</button>
    </div>
  );

  /* ── MAIN ── */
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'22px' }}>
      <style>{`
        @keyframes spin  { to { transform:rotate(360deg) } }
        @keyframes fadeUp{
          from{ opacity:0; transform:translateY(14px) }
          to  { opacity:1; transform:translateY(0) }
        }
        .tip-row { cursor:pointer; transition:background 0.18s ease; }
        .tip-row:hover { background:#f8fafc !important; }
        .filter-btn { cursor:pointer; transition:all 0.16s ease; border:none; }
        .filter-btn:hover { transform:translateY(-1px); }
        .refresh-btn:hover { background:#f1f5f9 !important; }

        .tips-hero-header {
          background: linear-gradient(135deg,#0c4a6e 0%,#0369a1 55%,#38bdf8 100%);
          border-radius: 22px;
          padding: 30px 34px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }

        .tip-row-item {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 20px 24px;
          background: white;
          cursor: pointer;
          transition: background 0.18s ease;
        }
        .tip-row-item.active {
          background: #f8fafc;
        }
        .tip-row-item:hover {
          background: #f8fafc;
        }

        .tip-expanded-content {
          padding: 0 24px 22px 90px;
          animation: fadeUp 0.22s ease;
        }

        .actionable-tip-box {
          display: inline-flex;
          align-items: flex-start;
          gap: 10px;
          background: white;
          border-radius: 12px;
          padding: 12px 16px;
        }

        @media (max-width: 480px) {
          .tips-hero-header {
            padding: 16px 20px !important;
            border-radius: 16px !important;
            gap: 12px !important;
          }
          .tips-hero-header h2 {
            font-size: 18px !important;
          }
          .tips-hero-header p {
            font-size: 11.5px !important;
          }
          .tips-hero-header .refresh-btn {
            padding: 8px 14px !important;
            font-size: 11.5px !important;
          }
          .tip-row-item {
            padding: 14px 16px !important;
            gap: 12px !important;
          }
          .tip-row-item p {
            font-size: 14px !important;
          }
          .tip-row-item span {
            font-size: 9.5px !important;
          }
          .tip-expanded-content {
            padding: 0 16px 16px 16px !important;
          }
          .actionable-tip-box {
            display: flex !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 10px 12px !important;
            gap: 8px !important;
          }
        }
      `}</style>

      {/* ── HERO HEADER ── */}
      <div className="tips-hero-header">
        {/* decorative blobs */}
        <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'160px', height:'160px',
          borderRadius:'50%', background:'rgba(255,255,255,0.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-20px', right:'140px', width:'80px', height:'80px',
          borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />

        <div style={{ display:'flex', alignItems:'center', gap:'16px', position:'relative' }}>
          <div style={{
            width:'52px', height:'52px', borderRadius:'16px', flexShrink:0,
            background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Sparkles size={26} color="white" />
          </div>
          <div>
            <h2 style={{ margin:0, fontSize:'20px', fontFamily:"'Syne',sans-serif",
              fontWeight:'800', color:'white', letterSpacing:'-0.3px' }}>
              AI Health Tips
            </h2>
            <p style={{ margin:'3px 0 0', fontSize:'13px', color:'rgba(255,255,255,0.75)' }}>
              {tips.length} personalised tip{tips.length !== 1 ? 's' : ''} based on your profile
            </p>
          </div>
        </div>

        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            display:'flex', alignItems:'center', gap:'7px',
            padding:'10px 18px', borderRadius:'12px',
            border:'1px solid rgba(255,255,255,0.25)',
            background:'rgba(255,255,255,0.12)',
            color:'white', fontSize:'13px', fontWeight:'600',
            cursor:refreshing ? 'not-allowed':'pointer',
            backdropFilter:'blur(6px)', position:'relative',
          }}
        >
          <RefreshCw size={14} style={refreshing ? { animation:'spin 0.9s linear infinite' } : {}} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* ── CATEGORY FILTER STRIP ── */}
      {categories.length > 2 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
          {categories.map(cat => {
            const isActive = activeFilter === cat;
            const cfg = getCat(cat);
            return (
              <button
                key={cat}
                className="filter-btn"
                onClick={() => setActiveFilter(cat)}
                style={{
                  display:'inline-flex', alignItems:'center', gap:'6px',
                  padding:'7px 16px', borderRadius:'999px',
                  background: isActive ? (cat === 'All' ? '#0284c7' : cfg.text) : 'white',
                  color: isActive ? 'white' : '#64748b',
                  border:`1.5px solid ${isActive ? 'transparent' : '#e2e8f0'}`,
                  fontSize:'12.5px', fontWeight: isActive ? '700' : '500',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                {cat !== 'All' && React.cloneElement(cfg.icon, { size: 12 })}
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* ── TIPS LIST ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 24px', background:'white',
          borderRadius:'20px', border:'1.5px solid #f1f5f9' }}>
          <Lightbulb size={42} color="#cbd5e1" style={{ marginBottom:'12px' }} />
          <p style={{ margin:0, fontSize:'15px', color:'#64748b' }}>No tips in this category.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0', borderRadius:'20px',
          border:'1.5px solid #e2e8f0', overflow:'hidden',
          boxShadow:'0 4px 20px rgba(15,23,42,0.04)' }}>

          {filtered.map((tip, idx) => {
            const cfg        = getCat(tip.category);
            const isExpanded = expanded === idx;
            const isLast     = idx === filtered.length - 1;

            return (
              <div key={idx} style={{ animation:`fadeUp 0.35s ease ${idx * 0.06}s both` }}>

                {/* ── MAIN ROW ── */}
                <div
                  className={`tip-row-item ${isExpanded ? 'active' : ''}`}
                  onClick={() => setExpanded(isExpanded ? null : idx)}
                  style={{
                    borderBottom: isLast && !isExpanded ? 'none' : '1px solid #f1f5f9',
                  }}
                >
                  {/* gradient icon bubble */}
                  <div style={{
                    width:'48px', height:'48px', borderRadius:'14px', flexShrink:0,
                    background: cfg.gradient,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'white', boxShadow:`0 6px 16px ${cfg.light}88`,
                  }}>
                    {cfg.icon}
                  </div>

                  {/* text */}
                  <div style={{ flex:1, minWidth:0 }}>
                    {/* category label */}
                    <span style={{
                      display:'inline-block', marginBottom:'5px',
                      fontSize:'10.5px', fontWeight:'700', textTransform:'uppercase',
                      letterSpacing:'0.07em', color: cfg.text,
                    }}>
                      {tip.category || 'General'}
                    </span>

                    {/* title */}
                    <p style={{
                      margin:0, fontSize:'15px', fontWeight:'700',
                      color:'#0f172a', lineHeight:1.4,
                      fontFamily:"'Syne',sans-serif",
                    }}>
                      {tip.title}
                    </p>

                    {/* action pill — only visible when collapsed */}
                    {!isExpanded && tip.actionable && (
                      <p style={{
                        margin:'6px 0 0', fontSize:'12.5px', color:'#64748b', lineHeight:1.5,
                        display:'-webkit-box', WebkitLineClamp:1,
                        WebkitBoxOrient:'vertical', overflow:'hidden',
                      }}>
                        💡 {tip.actionable}
                      </p>
                    )}
                  </div>

                  {/* chevron */}
                  <ChevronRight size={18} color="#94a3b8" style={{
                    flexShrink:0,
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                    transition:'transform 0.2s ease',
                  }} />
                </div>

                {/* ── EXPANDED DETAIL ── */}
                {isExpanded && (
                  <div className="tip-expanded-content" style={{
                    background: cfg.light,
                    borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                  }}>
                    {/* full tip content */}
                    <p style={{
                      margin:'0 0 16px', fontSize:'14px', color:'#334155',
                      lineHeight:1.8,
                    }}>
                      {tip.content}
                    </p>

                    {/* actionable tip */}
                    {tip.actionable && (
                      <div className="actionable-tip-box" style={{
                        border:`1.5px solid ${cfg.text}22`,
                      }}>
                        <Zap size={15} color={cfg.text} style={{ flexShrink:0, marginTop:'1px' }} />
                        <div>
                          <span style={{ display:'block', fontSize:'10px', fontWeight:'700',
                            textTransform:'uppercase', letterSpacing:'0.07em',
                            color: cfg.text, marginBottom:'3px' }}>
                            Tip
                          </span>
                          <span style={{ fontSize:'13.5px', color:'#1e293b', fontWeight:'600', lineHeight:1.5 }}>
                            {tip.actionable}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── DISCLAIMER ── */}
      <div style={{
        display:'flex', gap:'12px', alignItems:'flex-start',
        background:'#fffbeb', border:'1.5px solid #fde68a',
        borderRadius:'14px', padding:'14px 18px',
      }}>
        <Info size={16} color="#d97706" style={{ flexShrink:0, marginTop:'2px' }} />
        <p style={{ margin:0, fontSize:'12px', color:'#92400e', lineHeight:1.65 }}>
          These tips are AI-generated for educational purposes based on your profile.
          They are not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default HealthTipsFeed;
