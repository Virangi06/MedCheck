import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Brain, HeartPulse, ShieldAlert, Pill, Activity, User, Calendar, Siren,
  ChevronDown, Stethoscope, Leaf, Clock3, BadgeAlert, MapPin, AlertTriangle, LayoutDashboard, Sparkles, ArrowRight, Download, TrendingUp
} from 'lucide-react';
import { profileAPI, analysisAPI } from '../services/api';
import { feedbackAPI } from '../services/feedbackAPI';
import generateAnalysisPDF from '../utils/generateAnalysisPDF';
import HealthStatisticsDashboard from '../components/HealthStatisticsDashboard';
import MedicineInteractionChecker from '../components/MedicineInteractionChecker';
import HealthTipsFeed from '../components/HealthTipsFeed';
import { checkInteractionsLocally } from '../utils/medicineChecker';
import healthMetricsImg from '../assets/health_metrics.png';
import aiAssistantImg from '../assets/ai_assistant.png';

const dashboardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@400;500;600;700&display=swap');

  /* ─── KEYFRAME ANIMATIONS ─── */
  @keyframes floatCard {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulseRing {
    0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
    50% { box-shadow: 0 0 0 15px rgba(14, 165, 233, 0); }
    100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes heroGrid {
    0% { background-position: 0 0; }
    100% { background-position: 40px 40px; }
  }

  /* ─── HORIZONTAL OVERVIEW CARDS ─── */
  .horizontal-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 24px;
    padding: 34px 40px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    gap: 32px;
    animation: fadeInUp 0.6s ease-out forwards;
    position: relative;
    overflow: hidden;
  }
  .horizontal-card:hover {
    transform: translateY(-6px) scale(1.003);
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06);
    border-color: rgba(14, 165, 233, 0.35);
  }
  @media (max-width: 991px) {
    .horizontal-card {
      flex-direction: column !important;
      align-items: stretch !important;
      padding: 24px 28px !important;
      gap: 20px !important;
    }
  }
  .welcome-glow-card {
    background: linear-gradient(135deg, #0c1f35 0%, #0a2a4a 40%, #0d3b6e 70%, #0ea5e9 100%) !important;
    border: none !important;
    color: white !important;
    box-shadow: 0 12px 35px rgba(13, 59, 102, 0.2) !important;
  }
  .welcome-glow-card:hover {
    box-shadow: 0 25px 50px rgba(13, 59, 102, 0.3) !important;
  }
  .welcome-radial-glow {
    position: absolute;
    top: -60px;
    right: -60px;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
  }
  .premium-pill {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #e2e8f0;
    transition: all 0.25s ease;
  }
  .premium-pill:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
  }
  .premium-icon-box {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .horizontal-card:hover .premium-icon-box {
    transform: scale(1.1) rotate(5deg);
  }

  /* ─── DASHBOARD CLASSES ─── */
  .dashboard-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #f4f9ff 0%, #eef6fd 100%);
    font-family: 'DM Sans', sans-serif;
  }

  .dashboard-hero {
    background: linear-gradient(135deg, #071c2f 0%, #0b2742 50%, #0d3b66 100%);
    padding: 42px 40px 110px;
    position: relative;
    overflow: hidden;
  }

  .hero-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(0deg, transparent 24%, rgba(14, 165, 233, 0.08) 25%, rgba(14, 165, 233, 0.08) 26%, transparent 27%, transparent 74%, rgba(14, 165, 233, 0.08) 75%, rgba(14, 165, 233, 0.08) 76%, transparent 77%, transparent),
      linear-gradient(90deg, transparent 24%, rgba(14, 165, 233, 0.08) 25%, rgba(14, 165, 233, 0.08) 26%, transparent 27%, transparent 74%, rgba(14, 165, 233, 0.08) 75%, rgba(14, 165, 233, 0.08) 76%, transparent 77%, transparent);
    background-size: 40px 40px;
    opacity: 0.4;
  }

  .hero-blur {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    background: rgba(14, 165, 233, 0.2);
    border-radius: 50%;
    filter: blur(80px);
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 28px;
    padding: 28px;
    border: 1px solid rgba(226, 232, 240, 0.7);
    box-shadow: 0 12px 40px rgba(15, 23, 42, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .stat-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(14, 165, 233, 0.15);
    border-color: rgba(14, 165, 233, 0.3);
  }

  .stat-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(135deg, #071c2f, #0ea5e9);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    box-shadow: 0 10px 25px rgba(14, 165, 233, 0.22);
  }

  .tab-button {
    padding: 12px 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #64748b;
    position: relative;
    transition: color 0.3s ease;
  }

  .tab-button.active {
    color: #0284c7;
  }

  .tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #0ea5e9, #0284c7);
    border-radius: 1px;
    animation: slideDown 0.3s ease;
  }

  .analysis-card {
    background: white;
    border-radius: 24px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .analysis-card:hover {
    box-shadow: 0 20px 50px rgba(14, 165, 233, 0.12);
    border-color: rgba(14, 165, 233, 0.3);
    transform: translateY(-4px);
  }

  .analysis-card-header {
    padding: 20px 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: background 0.3s ease;
  }

  .analysis-card-header:hover {
    background: #f8fbff;
  }

  .urgency-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    animation: pulseRing 2s infinite;
  }

  .profile-card {
    background: white;
    border-radius: 20px;
    padding: 28px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .profile-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 50px rgba(14, 165, 233, 0.1);
  }

  .medical-detail-card {
    border-radius: 16px;
    padding: 22px;
    border: 1px solid;
    transition: all 0.3s ease;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .medical-detail-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  }

  .feedback-section {
    padding: 80px 24px;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-top: 1px solid #e2e8f0;
    position: relative;
    overflow: hidden;
  }

  .feedback-section::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(40px);
  }

  .feedback-container {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeInUp 0.3s ease;
  }

  .modal-content {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 28px;
    padding: 32px;
    width: 100%;
    max-width: 540px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.5);
    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .input-field {
    width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.3s ease;
  }

  .input-field:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }

  .textarea-field {
    width: 100%;
    min-height: 140px;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    resize: vertical;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  .textarea-field:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }

  .star-button {
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .star-button:hover {
    transform: scale(1.2);
  }

  .btn-primary {
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(14, 165, 233, 0.25);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(14, 165, 233, 0.35);
  }

  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .btn-success {
    background: #22c55e;
    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.25);
  }

  .feature-grid-item {
    background: #f8fbff;
    border: 1px solid #e0f2fe;
    border-radius: 24px;
    padding: 24px;
    transition: all 0.3s ease;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .feature-grid-item:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(14, 165, 233, 0.1);
  }

  .icon-box {
    width: 58px;
    height: 58px;
    border-radius: 18px;
    background: linear-gradient(135deg, #071c2f, #0ea5e9);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    box-shadow: 0 10px 25px rgba(14, 165, 233, 0.22);
  }

  /* ─── RESPONSIVE DESIGN ─── */
  @media (max-width: 768px) {
    .dashboard-hero {
      padding: 32px 20px 80px;
    }

    .stat-card {
      padding: 20px;
    }

    .modal-content {
      padding: 24px;
    }

    .feature-grid-item {
      padding: 18px;
    }

    .analysis-card-header {
      padding: 16px 18px;
      gap: 12px;
    }
  }

  @media (max-width: 480px) {
    .dashboard-hero {
      padding: 24px 16px 60px;
    }

    .feature-grid-item {
      border-radius: 16px;
      padding: 16px;
    }
  }

  /* Sidebar Links */
  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border-radius: 14px;
    color: #94a3b8;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    background: transparent;
    border: none;
    text-align: left;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
  }
  
  .sidebar-link:hover {
    color: white;
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
  }
  
  .sidebar-link.active {
    color: white;
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
  }

  @media (max-width: 991px) {
    .dashboard-layout {
      flex-direction: column !important;
    }
    .sidebar-container {
      width: 100% !important;
      height: auto !important;
      position: static !important;
      border-right: none !important;
      border-bottom: 1px solid rgba(255,255,255,0.08) !important;
    }
    .sidebar-menu {
      flex-direction: row !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
    }
    .sidebar-link {
      width: auto !important;
      flex: 1 1 160px !important;
    }
    .sidebar-action-box {
      display: none !important;
    }
  }
`;

function PatientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, updateProfile } = useAuth();

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [activeTab, setActiveTab] = useState('overview');

  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['overview', 'history', 'health', 'statistics', 'medicine', 'tips'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [healthProfile, setHealthProfile] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const [feedbackTab, setFeedbackTab] = useState('submit');
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, feedbackText: '' });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);



  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadDashboard();
  }, [profile]);


  useEffect(() => {
    if (feedbackTab === 'my-feedbacks') {
      loadUserFeedbacks();
    }
  }, [feedbackTab]);

  const loadDashboard = async () => {
    setLoading(true);

    await Promise.all([
      loadProfile(),
      loadHistory(),
    ]);

    setLoading(false);
  };

  const loadProfile = async () => {
    try {
      if (profile) {
        setHealthProfile(profile);
      }
    } catch (err) {
      console.warn(err.message);
    }
  };

  const loadHistory = async () => {
    try {
      const cached = localStorage.getItem(
        'analysisHistory'
      );

      if (cached) {
        setAnalyses(JSON.parse(cached));
      }

      const data =
        await analysisAPI.getHistory();

      const fresh = data.analyses || [];

      setAnalyses(fresh);

      localStorage.setItem(
        'analysisHistory',
        JSON.stringify(fresh)
      );
    } catch (err) {
      console.warn(err.message);

      const localRaw =
        localStorage.getItem(
          'analysisHistory'
        );

      if (localRaw) {
        setAnalyses(JSON.parse(localRaw));
      }
    }
  };

  const handleFeedbackSubmit = async () => {
    if (feedbackForm.feedbackText.trim().length < 10) {
      alert('Feedback must be at least 10 characters');
      return;
    }

    if (feedbackForm.rating < 1 || feedbackForm.rating > 5) {
      alert('Please select a valid rating');
      return;
    }

    setFeedbackSubmitting(true);

    try {
      await feedbackAPI.create({
        rating: feedbackForm.rating,
        feedbackText: feedbackForm.feedbackText,
        role: 'Patient',
      });

      setFeedbackSuccess(true);

      setFeedbackForm({
        rating: 5,
        feedbackText: '',
      });

      setTimeout(() => {
        setFeedbackSuccess(false);
        loadUserFeedbacks();
      }, 2000);

    } catch (error) {
      alert(
        'Failed to submit feedback: ' +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const loadUserFeedbacks = async () => {
    setLoadingFeedbacks(true);

    try {
      const data = await feedbackAPI.getUserFeedbacks();

      setUserFeedbacks(
        data.feedbacks || []
      );

    } catch (error) {
      console.warn(
        'Failed to load feedbacks:',
        error.message
      );
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this feedback?'
    );

    if (!confirmed) return;

    try {
      await feedbackAPI.delete(feedbackId);

      setUserFeedbacks(prev =>
        prev.filter(
          feedback =>
            feedback._id !== feedbackId
        )
      );

    } catch (error) {
      alert(
        'Failed to delete feedback: ' +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDownloadAnalysis = (item) => {
    const result = getResult(item);
    const input = getInput(item);
    generateAnalysisPDF(result, input, healthProfile, user.name, new Date(item.createdAt));
  };

  const openEditModal = () => {
    setEditForm({
      fullName:
        healthProfile?.fullName ||
        user?.name ||
        '',
      age: healthProfile?.age || '',
      gender:
        healthProfile?.gender || '',
      height:
        healthProfile?.height || '',
      weight:
        healthProfile?.weight || '',
      diseases:
        healthProfile?.diseases ||
        'None',
      medications:
        healthProfile?.medications ||
        'None',
      allergies:
        healthProfile?.allergies ||
        'None',
      sleepPatterns:
        healthProfile?.sleepPatterns ||
        '7-8 hours, deep',
      activityLevel:
        healthProfile?.activityLevel ||
        'Moderate',
      healthGoals:
        healthProfile?.healthGoals ||
        'Improve fitness',
    });

    setEditOpen(true);
    setEditSuccess(false);
  };

  const handleEditSave = async () => {
    setEditSaving(true);

    try {
      const data =
        await profileAPI.update(editForm);

      setHealthProfile(data.profile);

      updateProfile(data.profile);

      setEditSuccess(true);

      setTimeout(() => {
        setEditOpen(false);
        setEditSuccess(false);
      }, 1200);
    } catch (err) {
      alert(
        'Failed to save profile.'
      );
    } finally {
      setEditSaving(false);
    }
  };


  const getResult = item => ({
    possibleCondition:
      item.result?.possibleCondition ||
      item.possibleCondition ||
      '',

    conditionExplanation:
      item.result
        ?.conditionExplanation ||
      item.conditionExplanation ||
      '',

    urgencyLevel:
      item.result?.urgencyLevel ||
      item.urgencyLevel ||
      '',

    recommendedDoctor:
      item.result?.recommendedDoctor ||
      item.recommendedDoctor ||
      '',

    recommendedSpecialist:
      item.result
        ?.recommendedSpecialist ||
      item.recommendedSpecialist ||
      '',

    precautions:
      item.result?.precautions ||
      item.precautions ||
      [],

    recommendedMedicines:
      item.result
        ?.recommendedMedicines ||
      item.recommendedMedicines ||
      [],

    dietRecommendation:
      item.result?.dietRecommendation ||
      item.dietRecommendation ||
      '',

    recoveryAdvice:
      item.result?.recoveryAdvice ||
      item.recoveryAdvice ||
      '',

    emergencyWarning:
      item.result?.emergencyWarning ||
      item.emergencyWarning ||
      '',

    whenToSeeDoctor:
      item.result?.whenToSeeDoctor ||
      item.whenToSeeDoctor ||
      '',

    nearbyDoctors:
      item.result?.nearbyDoctors ||
      [],
  });

  const getInput = item => ({
    symptoms:
      item.inputData?.symptoms ||
      item.symptoms ||
      '',

    duration:
      item.inputData?.duration ||
      item.duration ||
      '',

    severity:
      item.inputData?.severity ||
      item.severity ||
      '',

    bodyArea:
      item.inputData?.bodyArea ||
      item.bodyArea ||
      '',
  });

  const urgencyColor = level => {
    if (!level) {
      return {
        bg: '#f1f5f9',
        text: '#475569',
        dot: '#94a3b8',
      };
    }

    const l = level.toLowerCase();

    if (l === 'emergency') {
      return {
        bg: '#fef2f2',
        text: '#991b1b',
        dot: '#ef4444',
      };
    }

    if (l === 'high') {
      return {
        bg: '#fff7ed',
        text: '#9a3412',
        dot: '#f97316',
      };
    }

    if (l === 'moderate') {
      return {
        bg: '#fefce8',
        text: '#854d0e',
        dot: '#eab308',
      };
    }

    return {
      bg: '#f0fdf4',
      text: '#166534',
      dot: '#22c55e',
    };
  };

  if (!user) return null;

  return (
    <div className="dashboard-container dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f4f9ff' }}>
      <style>{dashboardStyles}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── MAIN CONTENT AREA ── */}
      <div className="main-content" style={{ flex: 1, minHeight: 'calc(100vh - 72px)', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'overview' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

            {/* Section 1: Welcome Banner Section (2-Column Layout) */}
            <div className="welcome-glow-card" style={{ width: '100%', position: 'relative', overflow: 'hidden', padding: '64px 0' }}>
              <div className="hero-grid" style={{ opacity: 0.4 }} />
              <div className="welcome-radial-glow" />
              <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center', gap: '48px', position: 'relative', zIndex: 2 }}>
                
                {/* Left Column: Text & Welcome */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="premium-icon-box" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#38bdf8', width: '52px', height: '52px', borderRadius: '14px' }}>
                      <Activity size={28} />
                    </div>
                    <div>
                      <h1 style={{ margin: 0, fontSize: '28px', fontFamily: "'Syne', sans-serif", fontWeight: '500', color: 'white', lineHeight: 1.2 }}>
                        Welcome back, <span style={{ color: '#38bdf8' }}>{user.name}</span>
                      </h1>
                      <p style={{ margin: '6px 0 0', color: '#93c5fd', fontSize: '16px', lineHeight: 1.5 }}>
                        Access your clinical screening dashboard. Check your symptoms with advanced AI, view history trends, and analyze your diagnostic results.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Flat Vector Image */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '20px', maxWidth: '380px', width: '100%', boxSizing: 'border-box' }}>
                    <img 
                      src={healthMetricsImg} 
                      alt="Clinical Screening Overview" 
                      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} 
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Section 2: AI Clinical Assistant (2-Column Layout) */}
            <div style={{ width: '100%', background: '#ffffff', padding: '80px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center', gap: '48px' }}>
                
                {/* Left Column: Text & CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <div className="section-tag">✦ SMART CLINICAL QUERY</div>
                    <h2 style={{ fontSize: '30px', fontFamily: "'Syne', sans-serif", fontWeight: '500', color: '#0f172a', letterSpacing: '-0.8px', margin: '12px 0 16px' }}>
                      AI Clinical Assistant
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '16px', margin: 0, lineHeight: 1.6 }}>
                      Initiate a symptom query powered by clinical AI. Instantly screen for urgency levels, precautions, recovery guidance, and medical specialist recommendations.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                      <div style={{ background: '#eff9ff', color: '#0ea5e9', padding: '6px', borderRadius: '8px', marginTop: '2px' }}>
                        <Brain size={16} />
                      </div>
                      <span style={{ fontSize: '14px', color: '#475569', lineHeight: 1.4 }}>
                        Fast clinical symptom screening analysis takes less than 3 minutes.
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                      <div style={{ background: '#eff9ff', color: '#0ea5e9', padding: '6px', borderRadius: '8px', marginTop: '2px' }}>
                        <ShieldAlert size={16} />
                      </div>
                      <span style={{ fontSize: '14px', color: '#475569', lineHeight: 1.4 }}>
                        Urgency levels and self-care recovery precautions provided instantly.
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <button
                      onClick={() => navigate('/symptom-checker')}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 25px rgba(14, 165, 233, 0.2)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(14, 165, 233, 0.35)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.2)'; }}
                    >
                      <Brain size={18} /> Start AI Assessment
                    </button>
                  </div>
                </div>

                {/* Right Column: Flat Vector Image */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '20px', maxWidth: '360px', width: '100%', boxSizing: 'border-box' }}>
                    <img 
                      src={aiAssistantImg} 
                      alt="AI Clinical Assistant Illustration" 
                      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} 
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Sections 3 & 4: Assessments & Profile (Side-by-Side Grid) */}
            <div style={{ width: '100%', background: '#f4f9ff', padding: '80px 0', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '32px' }}>
                
                {/* Column A: Recent Assessments */}
                <div className="horizontal-card" style={{ background: '#ffffff', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', padding: '36px', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div className="premium-icon-box" style={{ background: 'rgba(14, 165, 233, 0.08)', color: '#0ea5e9', width: '48px', height: '48px', borderRadius: '14px' }}>
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>Recent Assessments</h3>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Latest clinical history timelines</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, marginBottom: '24px' }}>
                    {analyses.length === 0 ? (
                      <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>No symptom analyses recorded yet.</p>
                      </div>
                    ) : (
                      analyses.slice(0, 3).map((item, idx) => {
                        const r = getResult(item);
                        const uc = urgencyColor(r.urgencyLevel);
                        return (
                          <div key={idx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'all 0.3s ease', cursor: 'pointer' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            onClick={() => {
                              setActiveTab('history');
                              setExpandedId(item._id || idx);
                              navigate('/patient/dashboard?tab=history');
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{r.possibleCondition || 'Unknown'}</h4>
                              <span style={{ background: uc.bg, color: uc.text, fontSize: '9px', fontWeight: '600', padding: '2px 8px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.urgencyLevel || 'N/A'}</span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>⏱ {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('history');
                      navigate('/patient/dashboard?tab=history');
                    }}
                    style={{ padding: '12px 20px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: 'white', color: '#475569', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.25s ease', alignSelf: 'flex-start' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#0f172a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; }}
                  >
                    View Full History
                  </button>
                </div>

                {/* Column B: Your Health Profile */}
                <div className="horizontal-card" style={{ background: '#ffffff', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', padding: '36px', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div className="premium-icon-box" style={{ background: 'rgba(14, 165, 233, 0.08)', color: '#0ea5e9', width: '48px', height: '48px', borderRadius: '14px' }}>
                      <User size={24} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>Health Profile</h3>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Biometrics & Target medical targets</span>
                    </div>
                  </div>

                  {(() => {
                    const heightM = healthProfile?.height ? parseFloat(healthProfile.height) / 100 : 0;
                    const weightKg = healthProfile?.weight ? parseFloat(healthProfile.weight) : 0;
                    const bmiVal = heightM > 0 && weightKg > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '—';
                    const getBmiCategory = (val) => {
                      if (val === '—') return { text: '', color: '#64748b', bg: '#f1f5f9' };
                      const num = parseFloat(val);
                      if (num < 18.5) return { text: 'Underweight', color: '#b45309', bg: '#fef3c7' };
                      if (num < 25) return { text: 'Normal', color: '#15803d', bg: '#dcfce7' };
                      if (num < 30) return { text: 'Overweight', color: '#b45309', bg: '#fef3c7' };
                      return { text: 'Obese', color: '#b91c1c', bg: '#fee2e2' };
                    };
                    const bmiCat = getBmiCategory(bmiVal);
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, marginBottom: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', display: 'block', fontWeight: '700', marginBottom: '4px' }}>Age / Sex</span>
                            <strong style={{ fontSize: '14px', color: '#0f172a' }}>{healthProfile?.age ? `${healthProfile.age} yrs` : '—'} / {healthProfile?.gender || '—'}</strong>
                          </div>
                          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', display: 'block', fontWeight: '700', marginBottom: '4px' }}>BMI Score</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <strong style={{ fontSize: '14px', color: '#0f172a' }}>{bmiVal}</strong>
                              {bmiVal !== '—' && (
                                <span style={{ background: bmiCat.bg, color: bmiCat.color, fontSize: '9px', fontWeight: '600', padding: '1px 6px', borderRadius: '50px' }}>
                                  {bmiCat.text}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', display: 'block', fontWeight: '700', marginBottom: '4px' }}>Active Meds</span>
                          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={healthProfile?.medications}>{healthProfile?.medications || 'None'}</strong>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', display: 'block', fontWeight: '700', marginBottom: '4px' }}>Health Goals</span>
                          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={healthProfile?.healthGoals}>{healthProfile?.healthGoals || 'None'}</strong>
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    onClick={openEditModal}
                    style={{ padding: '12px 20px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: 'white', color: '#475569', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.25s ease', alignSelf: 'flex-start' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.color = '#0ea5e9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; }}
                  >
                    Edit Profile
                  </button>
                </div>

              </div>
            </div>

            {/* Section 5: Glassmorphic Community Feedback Banner */}
            <div style={{ width: '100%', background: '#ffffff', padding: '80px 0' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ marginBottom: '32px' }}>
                  <div className="section-tag">✦ COMMUNITY SATISFACTION</div>
                  <h2 style={{ fontSize: '28px', fontFamily: "'Syne', sans-serif", fontWeight: '500', color: '#0f172a', letterSpacing: '-0.8px', margin: '12px 0 16px' }}>
                    Share Your Experience
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
                    Your reviews and ratings directly contribute to the continuous refinement of our medical models.
                  </p>
                </div>

                <div className="horizontal-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)', borderColor: '#e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
                    <div className="premium-icon-box" style={{ background: 'rgba(14, 165, 233, 0.08)', color: '#0ea5e9', width: '52px', height: '52px', borderRadius: '14px' }}>
                      <Sparkles size={28} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>Community Feedback</h3>
                      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                        Help us improve our clinical screening platform. Submit reviews or track your previous feedback submissions.
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', gap: '2px', fontSize: '14px', color: '#f59e0b' }}>
                          ★ ★ ★ ★ ★
                        </div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>(5.0 / 5.0 Rating based on user experiences)</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <button
                      onClick={() => setFeedbackOpen(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 25px rgba(14, 165, 233, 0.2)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(14, 165, 233, 0.35)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.2)'; }}
                    >
                      <Sparkles size={16} /> Share Experience
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>Analysis History</h1>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '15px' }}>Access your past symptom checks, AI predictions, and clinic suggestions.</p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                <Brain size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontSize: '16px' }}>Loading your analysis history...</p>
              </div>
            ) : analyses.length === 0 ? (
              <div className="profile-card" style={{ textAlign: 'center', padding: '60px' }}>
                <Brain size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '8px', fontSize: '20px' }}>No analyses yet</h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>Run your first AI symptom check to see results here.</p>
                <button onClick={() => navigate('/symptom-checker')} className="btn-primary" style={{ width: 'auto' }}>
                  Check Symptoms Now →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analyses.map((item, idx) => {
                  const r = getResult(item);
                  const inp = getInput(item);
                  const uc = urgencyColor(r.urgencyLevel);
                  const isExpanded = expandedId === (item._id || idx);

                  return (
                    <div key={item._id || idx} className="analysis-card">
                      <div className="analysis-card-header" onClick={() => setExpandedId(isExpanded ? null : (item._id || idx))}>
                        <div className="urgency-dot" style={{ background: uc.dot }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontFamily: "'Syne', sans-serif", fontWeight: '600', color: '#0f172a' }}>{r.possibleCondition || 'Analysis Result'}</h3>
                            <span style={{ background: uc.bg, color: uc.text, fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.urgencyLevel || 'N/A'}</span>
                          </div>
                          <p style={{ margin: '0', fontSize: '13px', color: '#64748b' }}>
                            🩺 {inp.symptoms || '—'} &nbsp;·&nbsp; ⏱ {inp.duration || '—'} &nbsp;·&nbsp; 📅 {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadAnalysis(item);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#0284c7',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Download as PDF"
                        >
                          <Download size={18} />
                        </button>
                        <div style={{ color: '#94a3b8', transition: 'transform 0.3s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>{<ChevronDown size={20} />}</div>
                      </div>

                      {isExpanded && (
                        <div style={{ borderTop: '1px solid #f1f5f9', padding: '24px', background: '#fafcff', animation: 'fadeInUp 0.3s ease' }}>
                          {r.conditionExplanation && (
                            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                              <p style={{ margin: 0, color: '#1e40af', fontSize: '14px', lineHeight: '1.7' }}>{r.conditionExplanation}</p>
                            </div>
                          )}

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                            {[
                              { label: 'Doctor Type', value: r.recommendedDoctor, icon: <User size={14} /> },
                              { label: 'Specialist', value: r.recommendedSpecialist, icon: <Stethoscope size={14} /> },
                              { label: 'Severity', value: inp.severity, icon: <BadgeAlert size={14} /> },
                              { label: 'Body Area', value: inp.bodyArea, icon: <Activity size={14} /> },
                            ].map((f, i) => (
                              <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', transition: 'all 0.3s ease' }}>
                                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>{f.icon} {f.label}</p>
                                <p style={{ margin: 0, fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{f.value || '—'}</p>
                              </div>
                            ))}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                            {r.precautions?.length > 0 && (
                              <div>
                                <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldAlert size={15} color="#0284c7" /> Precautions</h4>
                                <ul style={{ margin: 0, paddingLeft: '18px', color: '#475569', fontSize: '13px', lineHeight: '1.9' }}>
                                  {r.precautions.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                              </div>
                            )}
                            {(() => {
                              const recommendedMeds = r.recommendedMedicines || [];
                              const profileMeds = healthProfile?.medications
                                ? healthProfile.medications.split(',').map(m => m.trim()).filter(m => m && m.toLowerCase() !== 'none')
                                : [];
                              const combined = [...new Set([...recommendedMeds, ...profileMeds])];
                              const interactions = checkInteractionsLocally(combined);

                              return recommendedMeds.length > 0 ? (
                                <div>
                                  <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><Pill size={15} color="#0284c7" /> Medicines</h4>
                                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#475569', fontSize: '13px', lineHeight: '1.9' }}>
                                    {recommendedMeds.map((m, i) => <li key={i}>{m}</li>)}
                                  </ul>
                                  {interactions.length > 0 && (
                                    <div style={{ marginTop: '12px', padding: '12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <AlertTriangle size={12} /> Interaction Warning!
                                      </p>
                                      {interactions.map((inter, i) => (
                                        <p key={i} style={{ margin: 0, fontSize: '11px', color: '#991b1b', lineHeight: 1.4 }}>
                                          <strong>{inter.medicationA}</strong> + <strong>{inter.medicationB}</strong>: {inter.description}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : null;
                            })()}
                            {r.dietRecommendation && (
                              <div>
                                <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><Leaf size={15} color="#059669" /> Diet</h4>
                                <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.7' }}>{r.dietRecommendation}</p>
                              </div>
                            )}
                            {r.recoveryAdvice && (
                              <div>
                                <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><HeartPulse size={15} color="#dc2626" /> Recovery</h4>
                                <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.7' }}>{r.recoveryAdvice}</p>
                              </div>
                            )}
                            {r.whenToSeeDoctor && (
                              <div>
                                <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={15} color="#7c3aed" /> When to See Doctor</h4>
                                <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.7' }}>{r.whenToSeeDoctor}</p>
                              </div>
                            )}
                          </div>

                          {r.emergencyWarning && ['high', 'emergency'].includes((r.urgencyLevel || '').toLowerCase()) && (
                            <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                              <Siren size={18} color="#dc2626" />
                              <p style={{ margin: 0, color: '#991b1b', fontSize: '13px', fontWeight: '600' }}>{r.emergencyWarning}</p>
                            </div>
                          )}

                          {r.nearbyDoctors?.length > 0 && (
                            <div>
                              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} color="#0284c7" /> Nearby Medical Facilities</h4>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                                {r.nearbyDoctors.map((doc, i) => (
                                  <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', transition: 'all 0.3s ease', cursor: 'pointer' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(14,165,233,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                  >
                                    <p style={{ margin: '0 0 4px', fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>{doc.name}</p>
                                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#0284c7', fontWeight: '600' }}>{doc.type}</p>
                                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748b' }}>📍 {doc.address}</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#0284c7', fontWeight: '600' }}>
                                      {typeof doc.distance === 'number' ? doc.distance.toFixed(1) : doc.distance} km away
                                    </p>
                                  </div>
                                ))}
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
          </div>
        )}

        {/* ── HEALTH PROFILE TAB ── */}
        {activeTab === 'health' && (
          <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>Health Profile</h1>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '15px' }}>Manage your general health metrics, existing conditions, medications, and allergies.</p>
            </div>

            {!healthProfile ? (
              <div className="profile-card" style={{ textAlign: 'center', padding: '60px' }}>
                <HeartPulse size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '8px', fontSize: '20px' }}>No health profile yet</h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>Complete a symptom check to save your health profile.</p>
                <button onClick={() => navigate('/symptom-checker')} className="btn-primary" style={{ width: 'auto' }}>
                  Start Symptom Check →
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Personal Info */}
                <div className="profile-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontFamily: "'Syne', sans-serif", fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={20} color="#0284c7" /> Personal Information
                    </h2>
                    <button
                      onClick={openEditModal}
                      style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                    {[
                      { label: 'Age', value: healthProfile.age ? `${healthProfile.age} yrs` : '—', icon: <Activity size={22} color="#0284c7" /> },
                      { label: 'Gender', value: healthProfile.gender || '—', icon: <User size={22} color="#0ea5e9" /> },
                      { label: 'Height', value: healthProfile.height ? `${healthProfile.height} cm` : '—', icon: <Stethoscope size={22} color="#7c3aed" /> },
                      { label: 'Weight', value: healthProfile.weight ? `${healthProfile.weight} kg` : '—', icon: <Pill size={22} color="#059669" /> },
                    ].map((f, i) => (
                      <div key={i} style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #f1f5f9' }}>
                        <p style={{ margin: '0 0 6px' }}>{f.icon}</p>
                        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>{f.label}</p>
                        <p style={{ margin: 0, fontSize: '18px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  {[
                    { label: 'Existing Diseases', value: healthProfile.diseases, icon: <ShieldAlert size={20} color="#dc2626" />, bg: '#fef2f2', border: '#fecaca' },
                    { label: 'Current Medications', value: healthProfile.medications, icon: <Pill size={20} color="#7c3aed" />, bg: '#f5f3ff', border: '#ddd6fe' },
                    { label: 'Allergies', value: healthProfile.allergies, icon: <AlertTriangle size={20} color="#d97706" />, bg: '#fffbeb', border: '#fde68a' },
                  ].map((f, i) => (
                    <div key={i} className="medical-detail-card" style={{ background: f.bg, borderColor: f.border }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        {f.icon}
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{f.label}</h3>
                      </div>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>{f.value || 'None'}</p>
                    </div>
                  ))}
                </div>

                {/* Conditions Timeline */}
                {analyses.length > 0 && (
                  <div className="profile-card">
                    <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontFamily: "'Syne', sans-serif", fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={20} color="#059669" /> Conditions Across All Analyses
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {[...new Set(analyses.map(a => getResult(a).possibleCondition).filter(Boolean))].map((cond, i) => (
                        <span key={i} style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '6px 16px', fontSize: '13px', fontWeight: '600', cursor: 'default' }}>
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── HEALTH STATISTICS TAB ── */}
        {activeTab === 'statistics' && (
          <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>Health Statistics</h1>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '15px' }}>Comprehensive metrics, trends, and analytical insights about your symptoms.</p>
            </div>
            <HealthStatisticsDashboard healthProfile={healthProfile} analyses={analyses} />
          </div>
        )}

        {/* ── MEDICINE INTERACTION CHECKER TAB ── */}
        {activeTab === 'medicine' && (
          <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>Medicine Interaction Checker</h1>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '15px' }}>Input medications to screen for dangerous warnings or negative combinations instantly.</p>
            </div>
            <MedicineInteractionChecker />
          </div>
        )}

        {/* ── DAILY HEALTH TIPS TAB ── */}
        {activeTab === 'tips' && (
          <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>Daily Health Tips</h1>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '15px' }}>Personalized advice curated by AI based on your conditions, liked by the patient community.</p>
            </div>
            <HealthTipsFeed />
          </div>
        )}

        {/* ── PREMIUM DASHBOARD FOOTER ── */}
        <footer style={{ marginTop: 'auto', background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '48px 24px 24px 24px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '32px' }}>
            {/* Brand Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartPulse size={24} color="#0ea5e9" />
                <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Syne', sans-serif", color: '#0f172a', letterSpacing: '-0.5px' }}>MedCheck</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                Your personal AI-powered clinical screening companion. Tracking vitals, symptom trends, and medicine interactions for a healthier tomorrow.
              </p>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                © {new Date().getFullYear()} MedCheck Healthcare. All rights reserved.
              </span>
            </div>

            {/* Quick Navigation Column */}
            <div>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px' }}>Quick Navigation</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Overview Dashboard', tab: 'overview' },
                  { name: 'Health Statistics', tab: 'statistics' },
                  { name: 'Symptom History', tab: 'history' },
                  { name: 'Interaction Checker', tab: 'interactions' },
                  { name: 'Daily Health Tips', tab: 'tips' }
                ].map((lnk) => (
                  <button
                    key={lnk.tab}
                    onClick={() => {
                      setActiveTab(lnk.tab);
                      navigate(`/patient/dashboard?tab=${lnk.tab}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ background: 'none', border: 'none', padding: 0, margin: 0, textAlign: 'left', color: activeTab === lnk.tab ? '#0ea5e9' : '#64748b', fontSize: '13px', fontWeight: activeTab === lnk.tab ? '600' : '400', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.target.style.color = '#0ea5e9'}
                    onMouseLeave={(e) => { if (activeTab !== lnk.tab) e.target.style.color = '#64748b'; }}
                  >
                    {lnk.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Disclaimer Column */}
            <div>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px' }}>Clinical Disclaimer</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                MedCheck provides AI-powered medical insights for educational and screening purposes only. It is not a replacement for professional medical advice, clinical diagnosis, or treatment. Always consult a certified healthcare professional.
              </p>
            </div>
          </div>

          {/* Bottom Emergency Banner */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '12px 16px', width: '100%' }}>
              <Siren size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: '500', lineHeight: 1.5 }}>
                <strong>EMERGENCY NOTICE:</strong> If you are experiencing a life-threatening medical emergency (such as severe chest pain, sudden weakness, or breathing difficulties), please immediately call your local emergency number (e.g. 102 / 911) or visit the nearest emergency room.
              </span>
            </div>
          </div>
        </footer>

      </div>
      {/* ── FEEDBACK MODAL ── */}
      {feedbackOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⭐ Share Your Experience
              </h2>
              <button onClick={() => setFeedbackOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = '#0f172a'}
                onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
              >✕</button>
            </div>

            {/* Feedback Tabs */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setFeedbackTab('submit')}
                className={`tab-button ${feedbackTab === 'submit' ? 'active' : ''}`}
                style={{
                  color: feedbackTab === 'submit' ? '#0ea5e9' : '#64748b',
                  fontWeight: feedbackTab === 'submit' ? 600 : 500,
                  fontSize: 15,
                  paddingBottom: '8px',
                  borderBottom: `2px solid ${feedbackTab === 'submit' ? '#0ea5e9' : 'transparent'}`,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setFeedbackTab('my-feedbacks')}
                className={`tab-button ${feedbackTab === 'my-feedbacks' ? 'active' : ''}`}
                style={{
                  color: feedbackTab === 'my-feedbacks' ? '#0ea5e9' : '#64748b',
                  fontWeight: feedbackTab === 'my-feedbacks' ? 600 : 500,
                  fontSize: 15,
                  paddingBottom: '8px',
                  borderBottom: `2px solid ${feedbackTab === 'my-feedbacks' ? '#0ea5e9' : 'transparent'}`,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                My Feedbacks ({userFeedbacks.length})
              </button>
            </div>

            {/* Submit Feedback Tab */}
            {feedbackTab === 'submit' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase' }}>
                    Rating
                  </label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                        className="star-button"
                        style={{
                          opacity: star <= feedbackForm.rating ? 1 : 0.3,
                          fontSize: '28px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ★
                      </button>
                    ))}
                    <span style={{ color: '#64748b', fontSize: 14, marginLeft: 12 }}>
                      {feedbackForm.rating}/5 Stars
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase' }}>
                    Your Feedback
                  </label>
                  <textarea
                    value={feedbackForm.feedbackText}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, feedbackText: e.target.value })}
                    placeholder="Share your experience using MedCheck... (minimum 10 characters)"
                    className="textarea-field"
                  />
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: '#94a3b8' }}>
                    {feedbackForm.feedbackText.length}/500 characters
                  </p>
                </div>

                <button
                  onClick={handleFeedbackSubmit}
                  disabled={feedbackSubmitting}
                  className={`btn-primary ${feedbackSuccess ? 'btn-success' : ''}`}
                  style={{ width: '100%', padding: '14px' }}
                >
                  {feedbackSubmitting ? 'Submitting...' : feedbackSuccess ? '✅ Feedback Submitted!' : 'Submit Feedback'}
                </button>
              </div>
            )}

            {/* My Feedbacks Tab */}
            {feedbackTab === 'my-feedbacks' && (
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {loadingFeedbacks ? (
                  <div style={{ textAlign: 'center', padding: 20, color: '#64748b' }}>
                    <p>Loading feedbacks...</p>
                  </div>
                ) : userFeedbacks.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center' }}>
                    <p style={{ color: '#64748b', margin: 0 }}>No feedbacks yet. Share your experience!</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {userFeedbacks.map((feedback) => (
                      <div key={feedback._id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' }}>
                          <div>
                            <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                              {Array(feedback.rating).fill(0).map((_, i) => (
                                <span key={i} style={{ color: '#F59E0B', fontSize: 14 }}>★</span>
                              ))}
                            </div>
                            <p style={{ margin: 0, color: '#475569', fontSize: 13, lineHeight: 1.5 }}>
                              {feedback.feedbackText}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteFeedback(feedback._id)}
                            style={{
                              background: '#fee2e2',
                              border: 'none',
                              color: '#dc2626',
                              padding: '4px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        <p style={{ margin: '8px 0 0', fontSize: 11, color: '#94a3b8' }}>
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}


      {/* ── EDIT PROFILE MODAL ── */}
      {editOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '600', color: '#0f172a' }}>✏️ Edit Health Profile</h2>
              <button onClick={() => setEditOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#0f172a'}
                onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
              >✕</button>
            </div>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
              {[
                { key: 'fullName', label: 'Full Name', type: 'text' },
                { key: 'age', label: 'Age', type: 'number' },
                { key: 'height', label: 'Height (cm)', type: 'number' },
                { key: 'weight', label: 'Weight (kg)', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={editForm[f.key] || ''}
                    onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                    className="input-field"
                  />
                </div>
              ))}

              {/* Gender */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gender</label>
                <select value={editForm.gender || ''} onChange={e => setEditForm({ ...editForm, gender: e.target.value })} className="input-field">
                  <option value="">Select</option>
                  {['Male', 'Female', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Diseases */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Existing Diseases</label>
                <input value={editForm.diseases || ''} onChange={e => setEditForm({ ...editForm, diseases: e.target.value })} className="input-field" placeholder="e.g. Diabetes, None" />
              </div>

              {/* Medications */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Medications</label>
                <input value={editForm.medications || ''} onChange={e => setEditForm({ ...editForm, medications: e.target.value })} className="input-field" placeholder="e.g. Insulin, None" />
              </div>

              {/* Allergies */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Allergies</label>
                <input value={editForm.allergies || ''} onChange={e => setEditForm({ ...editForm, allergies: e.target.value })} className="input-field" placeholder="e.g. Dust, None" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setEditOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontSize: '14px', fontWeight: '600', color: '#64748b', cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => { e.target.style.background = '#f8fafc'; }}
                onMouseLeave={(e) => { e.target.style.background = 'white'; }}
              >
                Cancel
              </button>
              <button onClick={handleEditSave} disabled={editSaving} className={`btn-primary ${editSuccess ? 'btn-success' : ''}`} style={{ flex: 2 }}>
                {editSaving ? 'Saving...' : editSuccess ? '✅ Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default PatientDashboard;