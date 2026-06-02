// backend/controllers/statisticsController.js
// Copy this entire file to your project

const Analysis = require('../models/Analysis');
const User = require('../models/User');
const StatisticsCache = require('../models/StatisticsCache');
const HealthMetric = require('../models/HealthMetric');
const UserProfile = require('../models/UserProfile');

// ===== MAIN ENDPOINT =====
// GET Dashboard Statistics - Returns all charts data
const getDashboardStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if cache exists and is still valid
    const cachedStats = await StatisticsCache.findOne({
      userId,
      expiresAt: { $gt: new Date() }
    });

    if (cachedStats) {
      return res.status(200).json({
        success: true,
        data: cachedStats,
        fromCache: true,
        message: 'Data retrieved from cache'
      });
    }

    // Get all analyses for the user
    const analyses = await Analysis.find({ user: userId })
      .sort({ createdAt: -1 });

    if (analyses.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalAnalyses: 0,
          symptomFrequency: [],
          urgencyStats: { low: 0, moderate: 0, high: 0, emergency: 0 },
          mostCommonConditions: [],
          monthlyData: [],
          insights: {
            totalAnalyses: 0,
            averageUrgencyLevel: 'N/A',
            riskLevel: 'No Risk',
            topCondition: 'N/A',
            recommendedAction: 'No analyses yet. Start by running a symptom check!'
          }
        },
        fromCache: false,
        message: 'No analysis data found'
      });
    }

    // Calculate all statistics
    const symptomFrequency = calculateSymptomFrequency(analyses);
    const urgencyStats = calculateUrgencyStats(analyses);
    const mostCommonConditions = calculateConditionFrequency(analyses);
    const monthlyData = calculateMonthlyTrends(analyses);
    const insights = generateInsights(
      analyses,
      urgencyStats,
      mostCommonConditions,
      monthlyData
    );

    const statisticsData = {
      userId,
      totalAnalyses: analyses.length,
      symptomFrequency,
      urgencyStats,
      mostCommonConditions,
      monthlyData,
      insights,
      lastUpdated: new Date()
    };

    // Save to cache
    try {
      await StatisticsCache.findOneAndUpdate(
        { userId },
        statisticsData,
        { upsert: true, new: true }
      );
    } catch (cacheError) {
      console.warn('Cache storage failed:', cacheError.message);
      // Continue without caching - not critical
    }

    res.status(200).json({
      success: true,
      data: statisticsData,
      fromCache: false,
      message: 'Statistics calculated successfully'
    });

  } catch (error) {
    console.error('Statistics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// GET Quick Summary - Lightweight endpoint
const getStatisticsSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const analyses = await Analysis.find({ user: userId });
    const totalAnalyses = analyses.length;
    
    const now = new Date();
    const currentMonth = analyses.filter(a => {
      const date = new Date(a.createdAt);
      return date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    }).length;

    const summary = {
      totalAnalyses,
      lastAnalysisDate: analyses.length > 0 ? analyses[0].createdAt : null,
      analysisThisMonth: currentMonth,
      lastSevenDays: analyses.filter(a => {
        const date = new Date(a.createdAt);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date > sevenDaysAgo;
      }).length
    };

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summary'
    });
  }
};

// POST Clear Cache - Manual cache invalidation
const clearStatisticsCache = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await StatisticsCache.deleteOne({ userId });
    
    res.status(200).json({
      success: true,
      message: 'Cache cleared successfully',
      deleted: result.deletedCount > 0
    });
  } catch (error) {
    console.error('Cache Clear Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache'
    });
  }
};

// ===== HELPER FUNCTIONS =====

/**
 * Calculate symptom frequency from analyses
 * Returns top 10 symptoms with count and percentage
 */
function calculateSymptomFrequency(analyses) {
  const symptomMap = {};

  analyses.forEach(analysis => {
    // Extract symptoms from inputData
    const symptomsString = analysis.inputData?.symptoms || '';
    const symptoms = symptomsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    symptoms.forEach(symptom => {
      const normalized = symptom.toLowerCase();
      symptomMap[normalized] = (symptomMap[normalized] || 0) + 1;
    });
  });

  // Convert to array, capitalize, and sort by frequency
  const symptomArray = Object.entries(symptomMap)
    .map(([symptom, count]) => ({
      symptom: symptom.charAt(0).toUpperCase() + symptom.slice(1),
      count,
      percentage: parseFloat(((count / analyses.length) * 100).toFixed(1))
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 only

  return symptomArray;
}

/**
 * Calculate urgency distribution
 * Returns count for each urgency level
 */
function calculateUrgencyStats(analyses) {
  const stats = {
    low: 0,
    moderate: 0,
    high: 0,
    emergency: 0
  };

  analyses.forEach(analysis => {
    const urgency = analysis.urgencyLevel?.toLowerCase() || 'moderate';
    
    if (urgency === 'low') stats.low++;
    else if (urgency === 'moderate') stats.moderate++;
    else if (urgency === 'high') stats.high++;
    else if (urgency === 'emergency') stats.emergency++;
  });

  return stats;
}

/**
 * Calculate most common conditions
 * Returns top 8 conditions with count and percentage
 */
function calculateConditionFrequency(analyses) {
  const conditionMap = {};

  analyses.forEach(analysis => {
    const condition = analysis.possibleCondition;
    if (condition && condition.trim().length > 0) {
      if (!conditionMap[condition]) {
        conditionMap[condition] = {
          count: 0,
          lastDetected: null
        };
      }
      conditionMap[condition].count++;
      conditionMap[condition].lastDetected = analysis.createdAt;
    }
  });

  // Convert to array and sort by frequency
  const conditionArray = Object.entries(conditionMap)
    .map(([condition, data]) => ({
      condition,
      count: data.count,
      percentage: parseFloat(((data.count / analyses.length) * 100).toFixed(1)),
      lastDetected: data.lastDetected
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 only

  return conditionArray;
}

/**
 * Calculate monthly trends
 * Returns analysis count and average urgency per month
 */
function calculateMonthlyTrends(analyses) {
  const monthMap = {};

  analyses.forEach(analysis => {
    const date = new Date(analysis.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        analyses: [],
        urgencies: []
      };
    }
    
    monthMap[monthKey].analyses.push(analysis);
    monthMap[monthKey].urgencies.push(analysis.urgencyLevel);
  });

  // Convert to array with calculations
  const monthlyArray = Object.entries(monthMap)
    .map(([month, data]) => {
      const urgencies = data.urgencies.map(u => u?.toLowerCase() || 'moderate');
      
      // Urgency score for averaging
      const urgencyScore = {
        'low': 1,
        'moderate': 2,
        'high': 3,
        'emergency': 4
      };
      
      const avgUrgency = parseFloat(
        (urgencies.reduce((sum, u) => sum + (urgencyScore[u] || 2), 0) / urgencies.length).toFixed(2)
      );

      const highUrgencyCount = urgencies.filter(u => u === 'high' || u === 'emergency').length;

      return {
        month,
        analysisCount: data.analyses.length,
        averageUrgency: avgUrgency,
        highUrgencyCount
      };
    })
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  return monthlyArray;
}

/**
 * Generate health insights based on statistics
 * Returns summary metrics and recommendations
 */
function generateInsights(analyses, urgencyStats, conditions, monthlyData) {
  const totalAnalyses = analyses.length;
  const totalUrgencies = Object.values(urgencyStats).reduce((a, b) => a + b, 0);
  
  // Calculate average urgency level
  const urgencyScore = {
    'low': 1,
    'moderate': 2,
    'high': 3,
    'emergency': 4
  };

  const avgUrgencyValue = (
    (urgencyStats.low * 1 + urgencyStats.moderate * 2 + urgencyStats.high * 3 + urgencyStats.emergency * 4) / 
    totalUrgencies
  );

  let averageUrgencyLevel = 'N/A';
  if (avgUrgencyValue <= 1.5) averageUrgencyLevel = 'Low';
  else if (avgUrgencyValue <= 2.5) averageUrgencyLevel = 'Moderate';
  else if (avgUrgencyValue <= 3.5) averageUrgencyLevel = 'High';
  else averageUrgencyLevel = 'Emergency';

  // Calculate risk level
  const emergencyPercent = totalUrgencies > 0 ? (urgencyStats.emergency / totalUrgencies * 100) : 0;
  const highPercent = totalUrgencies > 0 ? (urgencyStats.high / totalUrgencies * 100) : 0;
  const totalHighRiskPercent = emergencyPercent + highPercent;

  let riskLevel = 'Low Risk ✓';
  if (emergencyPercent > 20) riskLevel = 'Critical Risk 🚨';
  else if (emergencyPercent > 10) riskLevel = 'High Risk ⚠️';
  else if (totalHighRiskPercent > 30) riskLevel = 'Moderate Risk';

  // Generate recommendation
  let recommendedAction = '🟢 Your health appears stable. Continue regular check-ups and maintain a healthy lifestyle.';
  if (totalHighRiskPercent > 30) {
    recommendedAction = '🟡 Schedule a check-up with your doctor. Monitor your symptoms carefully and follow medical advice.';
  }
  if (totalHighRiskPercent > 50 || emergencyPercent > 15) {
    recommendedAction = '🔴 Please consult a doctor as soon as possible. Multiple concerning symptoms detected that require medical attention.';
  }

  // Most recent analysis
  const mostRecentAnalysis = analyses.length > 0 ? analyses[0].createdAt : null;

  // Top condition
  const topCondition = conditions.length > 0 ? conditions[0].condition : 'No data';

  // Trend analysis
  let trend = 'Stable';
  if (monthlyData.length > 1) {
    const recent = monthlyData[monthlyData.length - 1].analysisCount;
    const previous = monthlyData[monthlyData.length - 2].analysisCount;
    if (recent > previous) trend = 'Increasing 📈';
    else if (recent < previous) trend = 'Decreasing 📉';
  }

  return {
    totalAnalyses,
    averageUrgencyLevel,
    riskLevel,
    mostRecentAnalysis,
    topCondition,
    recommendedAction,
    trend,
    calculatedAt: new Date()
  };
}

const getHealthMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    let metrics = await HealthMetric.find({ user: userId }).sort({ date: 1 });

    if (metrics.length === 0) {
      console.log('Generating 30 days of mock health metrics for user', userId);
      const profile = await UserProfile.findOne({ user: userId });
      const heightCm = profile && profile.height ? parseFloat(profile.height) : 175;
      const baseWeight = profile && profile.weight ? parseFloat(profile.weight) : 72;
      const heightM = heightCm / 100;

      const mockEntries = [];
      const now = new Date();

      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = d.toISOString().split('T')[0];

        // Slightly realistic variations over time
        const heartRate = Math.round(65 + Math.sin(i / 3) * 6 + Math.random() * 5);
        const systolic = Math.round(116 + Math.cos(i / 4) * 5 + Math.random() * 4);
        const diastolic = Math.round(75 + Math.sin(i / 4) * 3 + Math.random() * 3);
        const weight = parseFloat((baseWeight - (29 - i) * 0.05 + Math.random() * 0.4).toFixed(1));
        const sleepDuration = parseFloat((7.0 + Math.sin(i / 2) * 1.0 + Math.random() * 0.8).toFixed(1));
        const activityLevel = Math.round(6000 + Math.sin(i / 5) * 2000 + Math.random() * 3000);
        
        // Calculate health score: sleep, steps, and heart rate factor
        const sleepFactor = Math.min((sleepDuration / 8) * 35, 35);
        const stepsFactor = Math.min((activityLevel / 10000) * 45, 45);
        const hrFactor = Math.max(0, 20 - Math.abs(heartRate - 70) * 1.5);
        const healthScore = Math.round(sleepFactor + stepsFactor + hrFactor);

        const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

        mockEntries.push({
          user: userId,
          date: dateStr,
          heartRate,
          bloodPressure: { systolic, diastolic },
          weight,
          sleepDuration,
          activityLevel,
          healthScore: Math.min(healthScore, 100),
          bmi
        });
      }

      await HealthMetric.insertMany(mockEntries);
      metrics = await HealthMetric.find({ user: userId }).sort({ date: 1 });
    }

    res.status(200).json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error('getHealthMetrics error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve metrics' });
  }
};

const saveHealthMetric = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, heartRate, systolic, diastolic, weight, sleepDuration, activityLevel } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const profile = await UserProfile.findOne({ user: userId });
    const heightCm = profile && profile.height ? parseFloat(profile.height) : 175;
    const heightM = heightCm / 100;

    let bmi = 0;
    if (weight) {
      bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));
    }

    // Compute health score
    const hr = heartRate || 72;
    const sleep = sleepDuration || 7.5;
    const steps = activityLevel || 7500;
    const sleepFactor = Math.min((sleep / 8) * 35, 35);
    const stepsFactor = Math.min((steps / 10000) * 45, 45);
    const hrFactor = Math.max(0, 20 - Math.abs(hr - 70) * 1.5);
    const healthScore = Math.round(sleepFactor + stepsFactor + hrFactor);

    const updateObj = {
      heartRate: hr,
      bloodPressure: {
        systolic: systolic || 120,
        diastolic: diastolic || 80
      },
      weight: weight || (profile ? profile.weight : 70),
      sleepDuration: sleep,
      activityLevel: steps,
      healthScore: Math.min(healthScore, 100),
      bmi
    };

    const metric = await HealthMetric.findOneAndUpdate(
      { user: userId, date },
      updateObj,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Metric saved successfully',
      metric
    });
  } catch (error) {
    console.error('saveHealthMetric error:', error);
    res.status(500).json({ success: false, message: 'Failed to save metric' });
  }
};

module.exports = {
  getDashboardStatistics,
  getStatisticsSummary,
  clearStatisticsCache,
  getHealthMetrics,
  saveHealthMetric
};