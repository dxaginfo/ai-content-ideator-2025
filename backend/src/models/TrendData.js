const mongoose = require('mongoose');

const trendDataSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  industry: {
    type: String,
    trim: true,
    index: true
  },
  trendScore: {
    type: Number,
    required: true
  },
  data: [{
    date: {
      type: Date,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  }],
  source: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // Data expires after 30 days
  }
});

// Compound index for keyword and industry
trendDataSchema.index({ keyword: 1, industry: 1 });

// Index for searching by date range
trendDataSchema.index({ 'data.date': 1 });

const TrendData = mongoose.model('TrendData', trendDataSchema);

module.exports = TrendData;