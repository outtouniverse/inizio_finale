const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  validateProjectCreate,
  validateProjectUpdate,
  handleValidationErrors
} = require('../middleware/validation');

/**
 * @route   GET /api/v1/projects
 * @desc    Get all projects for authenticated user
 * @access  Private
 */
router.get('/', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('userId', 'username email');

    res.json({
      success: true,
      data: {
        projects,
        count: projects.length
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

/**
 * @route   GET /api/v1/projects/stats
 * @desc    Get project statistics for user
 * @access  Private
 */
router.get('/stats', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Project.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          totalRevenue: { $sum: { $toDouble: { $substr: ['$revenue', 1, -1] } } },
          avgValidationScore: { $avg: '$validationScore' },
          byStage: {
            $push: '$stage'
          },
          byIndustry: {
            $push: '$industry'
          }
        }
      }
    ]);

    const stageStats = await Project.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 }
        }
      }
    ]);

    const industryStats = await Project.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProjects: 0,
          totalRevenue: 0,
          avgValidationScore: 0
        },
        stageBreakdown: stageStats,
        industryBreakdown: industryStats
      }
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project statistics'
    });
  }
});

/**
 * @route   POST /api/v1/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', authenticateToken, apiLimiter, validateProjectCreate, async (req, res) => {
  try {
    const {
      name,
      pitch,
      industry,
      stage = 'IDEA',
      userGoal,
      constraints,
      tags = [],
      revenue = '$0'
    } = req.body;

    const project = new Project({
      userId: req.user._id,
      name,
      pitch,
      industry,
      stage,
      userGoal,
      constraints,
      tags,
      revenue,
      validationScore: 0,
      lastEdited: new Date()
    });

    await project.save();

    // Populate user data
    await project.populate('userId', 'username email');

    res.status(201).json({
      success: true,
      data: {
        project
      },
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Create project error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get a single project
 * @access  Private
 */
router.get('/:id', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'username email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Get project error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update a project
 * @access  Private
 */
router.put('/:id', authenticateToken, apiLimiter, validateProjectUpdate, async (req, res) => {
  try {
    const updates = req.body;
    updates.lastEdited = new Date();

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      {
        new: true,
        runValidators: true
      }
    ).populate('userId', 'username email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: {
        project
      },
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Update project error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete a project
 * @access  Private
 */
router.delete('/:id', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

/**
 * @route   POST /api/v1/projects/:id/duplicate
 * @desc    Duplicate a project
 * @access  Private
 */
router.post('/:id/duplicate', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const originalProject = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!originalProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const duplicatedProject = new Project({
      userId: req.user._id,
      name: `${originalProject.name} (Copy)`,
      pitch: originalProject.pitch,
      industry: originalProject.industry,
      stage: originalProject.stage,
      userGoal: originalProject.userGoal,
      constraints: originalProject.constraints,
      tags: [...originalProject.tags],
      revenue: originalProject.revenue,
      validationScore: originalProject.validationScore,
      lastEdited: new Date()
    });

    await duplicatedProject.save();
    await duplicatedProject.populate('userId', 'username email');

    res.status(201).json({
      success: true,
      data: {
        project: duplicatedProject
      },
      message: 'Project duplicated successfully'
    });
  } catch (error) {
    console.error('Duplicate project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate project'
    });
  }
});

/**
 * @route   GET /api/v1/projects/search
 * @desc    Search projects
 * @access  Private
 */
router.get('/search', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const { q, industry, stage, limit = 20, page = 1 } = req.query;

    const query = { userId: req.user._id };

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { pitch: { $regex: q, $options: 'i' } },
        { industry: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    if (industry) {
      query.industry = industry;
    }

    if (stage) {
      query.stage = stage;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username email');

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Search projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search projects'
    });
  }
});

/**
 * @route   PUT /api/v1/projects/batch
 * @desc    Batch update projects
 * @access  Private
 */
router.put('/batch', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: 'Updates must be an array'
      });
    }

    const results = [];

    for (const update of updates) {
      const { id, changes } = update;

      const project = await Project.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { ...changes, lastEdited: new Date() },
        { new: true }
      );

      if (project) {
        results.push(project);
      }
    }

    res.json({
      success: true,
      data: {
        projects: results,
        updated: results.length
      },
      message: `Successfully updated ${results.length} projects`
    });
  } catch (error) {
    console.error('Batch update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to batch update projects'
    });
  }
});

/**
 * @route   DELETE /api/v1/projects/batch
 * @desc    Batch delete projects
 * @access  Private
 */
router.delete('/batch', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'IDs must be an array'
      });
    }

    const result = await Project.deleteMany({
      _id: { $in: ids },
      userId: req.user._id
    });

    res.json({
      success: true,
      data: {
        deleted: result.deletedCount
      },
      message: `Successfully deleted ${result.deletedCount} projects`
    });
  } catch (error) {
    console.error('Batch delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to batch delete projects'
    });
  }
});

module.exports = router;
