const mongoose = require('mongoose');

/**
 * Project/Idea Model
 * Handles project data, validation, and management
 */

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters'],
  },
  pitch: {
    type: String,
    required: [true, 'Project pitch is required'],
    maxlength: [2000, 'Project pitch cannot exceed 2000 characters'],
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true,
    maxlength: [50, 'Industry name cannot exceed 50 characters'],
  },
  stage: {
    type: String,
    enum: {
      values: ['IDEA', 'VALIDATION', 'BUILDING', 'LAUNCH', 'GROWTH', 'EXIT'],
      message: 'Stage must be one of: IDEA, VALIDATION, BUILDING, LAUNCH, GROWTH, EXIT'
    },
    default: 'IDEA',
  },
  userGoal: {
    type: String,
    maxlength: [500, 'User goal cannot exceed 500 characters'],
  },
  constraints: {
    type: String,
    maxlength: [500, 'Constraints cannot exceed 500 characters'],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
  }],
  revenue: {
    type: String,
    default: '$0',
    maxlength: [20, 'Revenue string cannot exceed 20 characters'],
  },
  validationScore: {
    type: Number,
    min: [0, 'Validation score cannot be negative'],
    max: [100, 'Validation score cannot exceed 100'],
    default: 0,
  },
  lastEdited: {
    type: Date,
    default: Date.now,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
projectSchema.index({ userId: 1, updatedAt: -1 });
projectSchema.index({ userId: 1, stage: 1 });
projectSchema.index({ userId: 1, industry: 1 });
projectSchema.index({ userId: 1, tags: 1 });
projectSchema.index({ userId: 1, name: 'text', pitch: 'text' }); // Text search index

// Pre-save middleware
projectSchema.pre('save', function(next) {
  this.lastEdited = new Date();
  next();
});

// Instance methods
projectSchema.methods.markAsEdited = function() {
  this.lastEdited = new Date();
  return this.save();
};

projectSchema.methods.archive = function() {
  this.isArchived = true;
  return this.save();
};

projectSchema.methods.unarchive = function() {
  this.isArchived = false;
  return this.save();
};

// Static methods
projectSchema.statics.findActiveByUser = function(userId) {
  return this.find({ userId, isArchived: false }).sort({ updatedAt: -1 });
};

projectSchema.statics.findByStage = function(userId, stage) {
  return this.find({ userId, stage, isArchived: false }).sort({ updatedAt: -1 });
};

projectSchema.statics.findByIndustry = function(userId, industry) {
  return this.find({ userId, industry, isArchived: false }).sort({ updatedAt: -1 });
};

projectSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), isArchived: false } },
    {
      $group: {
        _id: null,
        totalProjects: { $sum: 1 },
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
        stages: { $addToSet: '$stage' },
        industries: { $addToSet: '$industry' }
      }
    }
  ]);
};

// Virtual for formatted revenue
projectSchema.virtual('revenueAmount').get(function() {
  const match = this.revenue.match(/\$?([\d,]+)/);
  return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
});

// Ensure virtual fields are serialized
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

// Transform function to clean up the output
projectSchema.methods.toJSON = function() {
  const projectObject = this.toObject();
  delete projectObject.__v;
  return projectObject;
};

module.exports = mongoose.model('Project', projectSchema);
