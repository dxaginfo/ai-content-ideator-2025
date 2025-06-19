const mongoose = require('mongoose');

const contentIdeaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['blog', 'video', 'social'],
    required: true
  },
  keywords: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published'],
    default: 'draft'
  },
  calendarDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
contentIdeaSchema.index({ userId: 1, contentType: 1 });
contentIdeaSchema.index({ userId: 1, status: 1 });
contentIdeaSchema.index({ userId: 1, calendarDate: 1 });
contentIdeaSchema.index({ keywords: 1 });

const ContentIdea = mongoose.model('ContentIdea', contentIdeaSchema);

module.exports = ContentIdea;