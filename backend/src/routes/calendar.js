const express = require('express');
const auth = require('../middleware/auth');
const { ContentIdea } = require('../models');

const router = express.Router();

/**
 * @route   GET /api/calendar
 * @desc    Get content calendar
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateFilter = {
        calendarDate: {
          $gte: startDate,
          $lte: endDate
        }
      };
    }

    // Query scheduled content ideas
    const scheduledIdeas = await ContentIdea.find({
      userId: req.userId,
      status: 'scheduled',
      calendarDate: { $ne: null },
      ...dateFilter
    }).sort({ calendarDate: 1 });

    res.json({
      calendar: scheduledIdeas
    });
  } catch (error) {
    console.error('Calendar error:', error);
    res.status(500).json({
      error: 'Failed to retrieve calendar',
      message: error.message
    });
  }
});

module.exports = router;