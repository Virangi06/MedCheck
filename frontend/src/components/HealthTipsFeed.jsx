// frontend/src/components/HealthTipsFeed.jsx

import React, { useState, useEffect } from 'react';
import { getHealthTips, toggleRecommendationCompletion } from '../services/tipsService';
import { Sparkles, RefreshCw, BookOpen, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Calendar, Target, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';

const feedStyles = `
  .goal-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    border: 1.5px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 4px 15px rgba(15, 23, 42, 0.01);
  }
  .goal-card.completed {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  .goal-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(14, 165, 233, 0.08);
    border-color: rgba(14, 165, 233, 0.3);
  }
  .checkbox-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: white;
    transition: all 0.25s ease;
    flex-shrink: 0;
  }
  .checkbox-btn.checked {
    background: #10b981;
    border-color: #10b981;
    color: white;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
  }
  .checkbox-btn:hover {
    border-color: #10b981;
    transform: scale(1.05);
  }
  .priority-badge {
    padding: 3px 10px;
    border-radius: 50px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }
  .category-label {
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }
  .progress-container {
    background: white;
    padding: 28px;
    border-radius: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 15px rgba(15, 23, 42, 0.02);
  }
  .goal-text {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    transition: all 0.2s ease;
  }
  .goal-text.completed {
    color: #64748b;
    text-decoration: line-through;
  }
  .details-trigger {
    background: none;
    border: none;
    cursor: pointer;
    color: #0ea5e9;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    width: fit-content;
  }
`;

const HealthTipsFeed = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const response = await getHealthTips();
      if (response.success) {
        setRecommendations(response.recommendations || []);
      } else {
        throw new Error(response.message || 'Failed to fetch daily goals');
      }
    } catch (err) {
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggle = async (recId, currentStatus) => {
    try {
      const targetState = !currentStatus;
      const response = await toggleRecommendationCompletion(recId, targetState);
      if (response.success) {
        setRecommendations(response.recommendations || []);
        if (targetState) {
          toast.success('Goal completed! Keep it up! 🎉');
        } else {
          toast('Goal marked as pending', { icon: '⏳' });
        }
      }
    } catch (err) {
      toast.error('Failed to update goal completion status');
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      // Wait a moment for generation
      await fetchRecommendations(true);
    } catch (err) {
      toast.error('Failed to refresh daily goals');
    } finally {
      setRefreshing(false);
    }
  };

  const getPriorityStyle = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p === 'high') {
      return { bg: '#fee2e2', color: '#dc2626' };
    }
    if (p === 'medium') {
      return { bg: '#fef3c7', color: '#d97706' };
    }
    return { bg: '#dcfce7', color: '#166534' };
  };

  const completedCount = recommendations.filter(r => r.completed).length;
  const totalCount = recommendations.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '350px' }}>
        <style>{feedStyles}</style>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #f3f3f3', borderTop: '4px solid #0ea5e9', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ margin: 0, fontWeight: '700', fontSize: '18px', color: '#0f172a' }}>Curating Personalized AI Coach Suggestions...</p>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>Parsing lifestyle habits and medical profile...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '24px', padding: '32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <style>{feedStyles}</style>
        <AlertCircle style={{ color: '#ef4444', marginBottom: '16px' }} size={48} />
        <h3 style={{ margin: '0 0 8px', color: '#991b1b', fontSize: '18px', fontWeight: '700' }}>Unable to Load Health Suggestions</h3>
        <p style={{ margin: '0 0 20px', color: '#b91c1c', fontSize: '14px' }}>{error}</p>
        <button onClick={() => fetchRecommendations()} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#dc2626', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
          Retry Fetch
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <style>{feedStyles}</style>

      {/* Progress & Header Card */}
      <div className="progress-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)', padding: '6px 12px', borderRadius: '50px', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0284c7', marginBottom: '10px' }}>
              <Target size={12} /> Daily Health Coach
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>
              Your Daily Actions
            </h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
              Personalized checkbox goals generated by MedCheck AI based on your lifestyle profile and metrics.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing Suggestions...' : 'Refresh Plan'}
          </button>
        </div>

        {/* Progress bar */}
        {totalCount > 0 ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
              <span>Completion Rate</span>
              <span>{completedCount} of {totalCount} Goals ({progressPercent}%)</span>
            </div>
            <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '10px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No goals generated for today. Check your metrics or history.</p>
        )}
      </div>

      {/* Completion Congratulatory Message */}
      {allCompleted && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', border: '1px solid #86efac', borderRadius: '20px', padding: '20px 28px', animation: 'scaleUp 0.3s ease-out' }}>
          <Award size={36} color="#166534" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#14532d' }}>Splendid Work! All Daily Goals Completed</h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#166534', lineHeight: 1.5 }}>
              You've completed all actions requested by your AI Health Coach today. Keep maintaining these consistency patterns for optimal results.
            </p>
          </div>
        </div>
      )}

      {/* Actionable Suggestions List */}
      {recommendations.length === 0 ? (
        <div className="profile-card" style={{ textAlign: 'center', padding: '60px' }}>
          <BookOpen size={40} style={{ opacity: 0.3, marginBottom: '12px', color: '#94a3b8' }} />
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>No recommendations found. Try clicking "Refresh Plan" above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {recommendations.map((rec) => {
            const isCompleted = rec.completed;
            const priorityStyle = getPriorityStyle(rec.priority);
            const isExpanded = expandedId === rec._id;

            return (
              <div key={rec._id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => handleToggle(rec._id, isCompleted)}
                    className={`checkbox-btn ${isCompleted ? 'checked' : ''}`}
                    title={isCompleted ? "Mark as pending" : "Mark as completed"}
                  >
                    {isCompleted && <span style={{ fontSize: '14px', fontWeight: '700' }}>✓</span>}
                  </button>

                  {/* Goal Contents */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span className="category-label">{rec.category}</span>
                      <span className="priority-badge" style={{ background: priorityStyle.bg, color: priorityStyle.color }}>
                        {rec.priority} Priority
                      </span>
                    </div>

                    <h3 className={`goal-text ${isCompleted ? 'completed' : ''}`}>
                      {rec.actionable}
                    </h3>
                  </div>

                  {/* Expander Button */}
                  <button 
                    onClick={() => setExpandedId(isExpanded ? null : rec._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', animation: 'slideDown 0.25s ease' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{rec.title}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                      {rec.content}
                    </p>
                  </div>
                )}

                {/* Micro Expand Link (Only visible when collapsed) */}
                {!isExpanded && (
                  <button 
                    onClick={() => setExpandedId(rec._id)}
                    className="details-trigger"
                    style={{ marginLeft: '44px' }}
                  >
                    View explanation <Sparkles size={12} />
                  </button>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HealthTipsFeed;
