const UserProfile = require('../models/UserProfile');

// ─────────────────────────────────────────────
// GET PROFILE
// GET /api/profile
// Protected
// ─────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.id });

    return res.status(200).json({
      success: true,
      profile: profile || null,
    });
  } catch (error) {
    console.error('[GET PROFILE ERROR]', error.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────
// GET OR CREATE PROFILE (for app initialization)
// GET /api/profile/init
// Protected
// ─────────────────────────────────────────────
const getOrCreateProfile = async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ user: req.user.id });

    if (!profile) {
      profile = await UserProfile.create({
        user: req.user.id,
        fullName: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        diseases: 'None',
        medications: 'None',
        allergies: 'None',
        sleepPatterns: '7-8 hours, deep',
        activityLevel: 'Moderate',
        healthGoals: 'Improve fitness',
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('[GET OR CREATE PROFILE ERROR]', error.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────
// UPSERT PROFILE (create on first save, update on edit)
// PUT /api/profile
// Protected
// ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      height,
      weight,
      diseases,
      medications,
      allergies,
      sleepPatterns,
      activityLevel,
      healthGoals,
    } = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        fullName,
        age,
        gender,
        height,
        weight,
        diseases,
        medications,
        allergies,
        sleepPatterns,
        activityLevel,
        healthGoals,
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile saved successfully.',
      profile,
    });
  } catch (error) {
    console.error('[UPDATE PROFILE ERROR]', error.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getProfile, updateProfile, getOrCreateProfile };