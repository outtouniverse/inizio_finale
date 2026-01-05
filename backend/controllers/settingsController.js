const Settings = require('../models/Settings');

// Get user settings
const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await Settings.findByUserId(userId);

    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.upsertByUserId(userId, {});
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get settings'
    });
  }
};

// Update user settings
const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settingsData = req.body;

    // Validate settings data
    const validThemes = ['cyberwave', 'dark', 'light', 'neon', 'minimal'];
    if (settingsData.theme && !validThemes.includes(settingsData.theme)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme'
      });
    }

    const validArchetypes = ['Strategic', 'Creative', 'Analytical', 'Bold', 'Conservative'];
    if (settingsData.aiPersonality?.archetype && !validArchetypes.includes(settingsData.aiPersonality.archetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid AI personality archetype'
      });
    }

    const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko'];
    if (settingsData.language && !validLanguages.includes(settingsData.language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language'
      });
    }

    // Update or create settings
    const settings = await Settings.upsertByUserId(userId, settingsData);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

// Reset settings to defaults
const resetSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete existing settings
    await Settings.findOneAndDelete({ userId });

    // Create new default settings
    const settings = await Settings.upsertByUserId(userId, {});

    res.json({
      success: true,
      message: 'Settings reset to defaults',
      data: settings
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings'
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  resetSettings
};
