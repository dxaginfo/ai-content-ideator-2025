const express = require('express');
const { ideasController } = require('../controllers');
const auth = require('../middleware/auth');
const { body, query, param } = require('express-validator');

const router = express.Router();

/**
 * @route   POST /api/ideas/generate
 * @desc    Generate content ideas
 * @access  Private
 */
router.post(
  '/generate',
  auth,
  [
    body('contentType').isIn(['blog', 'video', 'social']).withMessage('Invalid content type'),
    body('keywords').optional().isArray(),
    body('count').optional().isInt({ min: 1, max: 10 }).withMessage('Count must be between 1 and 10')
  ],
  ideasController.generateIdeas
);

/**
 * @route   GET /api/ideas
 * @desc    Get all user's content ideas
 * @access  Private
 */
router.get(
  '/',
  auth,
  [
    query('contentType').optional().isIn(['blog', 'video', 'social']),
    query('status').optional().isIn(['draft', 'scheduled', 'published']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ],
  ideasController.getIdeas
);

/**
 * @route   GET /api/ideas/:id
 * @desc    Get a single content idea
 * @access  Private
 */
router.get(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid idea ID')
  ],
  ideasController.getIdeaById
);

/**
 * @route   PUT /api/ideas/:id
 * @desc    Update a content idea
 * @access  Private
 */
router.put(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid idea ID'),
    body('title').optional().not().isEmpty().withMessage('Title cannot be empty'),
    body('description').optional().not().isEmpty().withMessage('Description cannot be empty'),
    body('status').optional().isIn(['draft', 'scheduled', 'published']).withMessage('Invalid status'),
    body('calendarDate').optional().isISO8601().withMessage('Invalid date format'),
    body('keywords').optional().isArray()
  ],
  ideasController.updateIdea
);

/**
 * @route   DELETE /api/ideas/:id
 * @desc    Delete a content idea
 * @access  Private
 */
router.delete(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid idea ID')
  ],
  ideasController.deleteIdea
);

module.exports = router;