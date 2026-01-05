const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/auth');
const { requireOwnershipOrAdmin } = require('../middleware/roleCheck');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  validateProfileUpdate,
  validatePasswordChange
} = require('../middleware/validation');
const { revokeAllUserTokens } = require('../utils/tokenUtils');

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
          profilePicture: user.profilePicture,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          // Extended Profile Fields
          archetype: user.archetype,
          level: user.level,
          mission: user.mission,
          badges: user.badges,
          traits: user.traits,
          // Activity Data
          buildStreak: user.buildStreak,
          activityCount: user.activityCount,
          lastActivity: user.lastActivity
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, apiLimiter, validateProfileUpdate, async (req, res) => {
  try {
    const {
      username,
      email,
      archetype,
      mission,
      traits,
      profilePicture
    } = req.body;
    const userId = req.user._id;

    // Check if username is already taken (if updating)
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    // Check if email is already taken (if updating)
    if (email && email.toLowerCase() !== req.user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
    }

    // Validate archetype if provided
    const validArchetypes = ['Visionary Architect', 'Strategic Builder', 'Creative Innovator', 'Technical Founder', 'Market Pioneer'];
    if (archetype && !validArchetypes.includes(archetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid archetype'
      });
    }

    // Update user
    const updateData = {};

    // Basic fields
    if (username) updateData.username = username;
    if (email) {
      updateData.email = email.toLowerCase();
      updateData.emailVerified = false; // Require re-verification for email change
    }
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    // Extended profile fields
    if (archetype) updateData.archetype = archetype;
    if (mission) updateData.mission = mission;
    if (traits) {
      // Validate traits array
      if (!Array.isArray(traits)) {
        return res.status(400).json({
          success: false,
          message: 'Traits must be an array'
        });
      }

      // Validate each trait
      for (const trait of traits) {
        if (!trait.name || typeof trait.score !== 'number' ||
            trait.score < 0 || trait.score > 100) {
          return res.status(400).json({
            success: false,
            message: 'Invalid trait data'
          });
        }
      }

      updateData.traits = traits;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
          profilePicture: user.profilePicture,
          archetype: user.archetype,
          level: user.level,
          mission: user.mission,
          badges: user.badges,
          traits: user.traits
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

/**
 * @route   GET /api/v1/users/profile/stats
 * @desc    Get user profile statistics
 * @access  Private
 */
router.get('/profile/stats', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get project statistics
    const projectStats = await Project.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          validatedIdeas: {
            $sum: {
              $cond: [
                { $in: ['$stage', ['Validation', 'Build']] },
                1,
                0
              ]
            }
          },
          totalRevenue: {
            $sum: {
              $convert: {
                input: { $substr: ['$revenue', 1, -1] },
                to: 'double',
                onError: 0,
                onNull: 0
              }
            }
          },
          avgValidationScore: { $avg: '$validationScore' },
          lastActivity: { $max: '$updatedAt' }
        }
      }
    ]);

    // Calculate build streak (consecutive days with activity)
    const userProjects = await Project.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(50); // Last 50 activities

    let buildStreak = 0;
    if (userProjects.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Get unique activity dates (last 30 days)
      const activityDates = new Set();
      userProjects.forEach(project => {
        const date = new Date(project.updatedAt);
        date.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 30) {
          activityDates.add(date.toISOString().split('T')[0]);
        }
      });

      // Calculate streak
      const sortedDates = Array.from(activityDates).sort().reverse();
      let currentDate = new Date(today);

      for (const dateStr of sortedDates) {
        const activityDate = new Date(dateStr);
        const daysDiff = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 1) {
          buildStreak++;
          currentDate = new Date(activityDate);
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate system power (based on activity and project completion)
    const stats = projectStats[0] || {
      totalProjects: 0,
      validatedIdeas: 0,
      totalRevenue: 0,
      avgValidationScore: 0
    };

    const activityScore = Math.min(userProjects.length * 2, 40); // Max 40 points
    const completionScore = Math.min(stats.validatedIdeas * 10, 30); // Max 30 points
    const validationScore = Math.min((stats.avgValidationScore || 0) * 0.3, 30); // Max 30 points

    const systemPower = Math.min(activityScore + completionScore + validationScore, 98);

    res.json({
      success: true,
      data: {
        stats: {
          buildStreak,
          validatedIdeas: stats.validatedIdeas || 0,
          systemPower: Math.round(systemPower),
          totalProjects: stats.totalProjects || 0,
          totalRevenue: stats.totalRevenue || 0,
          avgValidationScore: Math.round(stats.avgValidationScore || 0),
          lastActivity: stats.lastActivity
        }
      }
    });
  } catch (error) {
    console.error('Get profile stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile statistics'
    });
  }
});

/**
 * @route   GET /api/v1/users/profile/activity
 * @desc    Get user activity data for heatmap and timeline
 * @access  Private
 */
router.get('/profile/activity', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get project activity for heatmap (last 365 days)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const projectActivity = await Project.aggregate([
      { $match: { userId, updatedAt: { $gte: oneYearAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' }
          },
          count: { $sum: 1 },
          intensity: {
            $sum: {
              $cond: [
                { $in: ['$stage', ['Validation', 'Build']] },
                4, // High intensity for validated projects
                2  // Medium intensity for other activity
              ]
            }
          }
        }
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          intensity: { $min: ['$intensity', 4] }, // Cap at 4
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Get milestone events for timeline
    const user = await User.findById(userId);
    const timelineEvents = [];

    // Account creation milestone
    timelineEvents.push({
      id: 'account_created',
      date: user.createdAt.toISOString().split('T')[0],
      title: 'Account Created',
      type: 'MILESTONE',
      description: 'Started the journey as a founder.'
    });

    // Project milestones
    const projects = await Project.find({ userId })
      .sort({ createdAt: 1 })
      .limit(20);

    projects.forEach((project, index) => {
      if (index === 0) {
        timelineEvents.push({
          id: `first_project_${project._id}`,
          date: project.createdAt.toISOString().split('T')[0],
          title: 'First Project Created',
          type: 'IDEA',
          description: `Created "${project.name}" - ${project.pitch}`
        });
      }

      if (project.stage === 'Validation' || project.stage === 'Build') {
        timelineEvents.push({
          id: `validated_${project._id}`,
          date: project.updatedAt.toISOString().split('T')[0],
          title: 'Project Validated',
          type: 'EXECUTION',
          description: `"${project.name}" reached validation stage with score ${project.validationScore}`
        });
      }
    });

    // Sort timeline events by date
    timelineEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: {
        heatmap: projectActivity,
        timeline: timelineEvents
      }
    });
  } catch (error) {
    console.error('Get profile activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile activity'
    });
  }
});

/**
 * @route   PUT /api/v1/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticateToken, apiLimiter, validatePasswordChange, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Revoke all other sessions for security
    await revokeAllUserTokens(userId);

    res.json({
      success: true,
      message: 'Password changed successfully. You may need to log in again on other devices.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

/**
 * @route   DELETE /api/v1/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const userId = req.user._id;

    // Revoke all sessions
    await revokeAllUserTokens(userId);

    // Delete user (soft delete by marking as inactive)
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isActive: false,
        email: `${user.email}.deleted.${Date.now()}`, // Prevent email reuse
        username: `${user.username}.deleted.${Date.now()}` // Prevent username reuse
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID (admin only or own profile)
 * @access  Private
 */
router.get('/:id', authenticateToken, requireOwnershipOrAdmin, apiLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
          profilePicture: user.profilePicture,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
});

module.exports = router;