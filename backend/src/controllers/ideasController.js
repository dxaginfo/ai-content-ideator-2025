const { ContentIdea } = require('../models');
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Generate content ideas using OpenAI
 */
exports.generateIdeas = async (req, res) => {
  try {
    const { contentType, keywords, count = 5 } = req.body;
    
    if (!contentType) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Content type is required'
      });
    }

    let prompt = '';
    
    switch (contentType) {
      case 'blog':
        prompt = `Generate ${count} unique blog post ideas`;
        break;
      case 'video':
        prompt = `Generate ${count} unique video content ideas`;
        break;
      case 'social':
        prompt = `Generate ${count} unique social media post ideas`;
        break;
      default:
        prompt = `Generate ${count} unique content ideas`;
    }

    if (keywords && keywords.length > 0) {
      prompt += ` related to ${keywords.join(', ')}`;
    }

    prompt += `. For each idea, provide a compelling title and a brief description. Format the response as a JSON array with objects containing 'title' and 'description' properties.`;

    // Call OpenAI API
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Parse the response to extract ideas
    let ideas = [];
    try {
      const content = completion.data.choices[0].text.trim();
      // Try to parse as JSON
      ideas = JSON.parse(content);
    } catch (error) {
      // If parsing fails, handle text format
      console.error('Error parsing OpenAI response:', error);
      const content = completion.data.choices[0].text.trim();
      
      // Simple parsing fallback
      const ideaBlocks = content.split(/\n\s*\n/);
      ideas = ideaBlocks.map(block => {
        const lines = block.split('\n').filter(line => line.trim());
        return {
          title: lines[0]?.replace(/^[0-9]+\.\s*/, '').trim() || 'Untitled Idea',
          description: lines.slice(1).join(' ').trim() || 'No description provided'
        };
      });
    }

    // Save ideas to database
    const savedIdeas = await Promise.all(
      ideas.map(idea => {
        const newIdea = new ContentIdea({
          userId: req.userId,
          title: idea.title,
          description: idea.description,
          contentType,
          keywords: keywords || []
        });
        return newIdea.save();
      })
    );

    res.json({
      message: 'Ideas generated successfully',
      ideas: savedIdeas
    });
  } catch (error) {
    console.error('Generate ideas error:', error);
    res.status(500).json({
      error: 'Failed to generate ideas',
      message: error.message
    });
  }
};

/**
 * Get all user's content ideas with pagination and filtering
 */
exports.getIdeas = async (req, res) => {
  try {
    const { contentType, status, page = 1, limit = 10 } = req.query;
    
    // Build query filters
    const filter = { userId: req.userId };
    if (contentType) filter.contentType = contentType;
    if (status) filter.status = status;

    // Count total matching documents
    const total = await ContentIdea.countDocuments(filter);
    
    // Get paginated results
    const ideas = await ContentIdea.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    res.json({
      ideas,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({
      error: 'Failed to retrieve ideas',
      message: error.message
    });
  }
};

/**
 * Get a single content idea by ID
 */
exports.getIdeaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const idea = await ContentIdea.findOne({
      _id: id,
      userId: req.userId
    });
    
    if (!idea) {
      return res.status(404).json({
        error: 'Idea not found',
        message: 'Content idea not found'
      });
    }

    res.json({ idea });
  } catch (error) {
    console.error('Get idea by ID error:', error);
    res.status(500).json({
      error: 'Failed to retrieve idea',
      message: error.message
    });
  }
};

/**
 * Update a content idea
 */
exports.updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, calendarDate, keywords } = req.body;
    
    const idea = await ContentIdea.findOne({
      _id: id,
      userId: req.userId
    });
    
    if (!idea) {
      return res.status(404).json({
        error: 'Idea not found',
        message: 'Content idea not found'
      });
    }

    // Update fields
    if (title) idea.title = title;
    if (description) idea.description = description;
    if (status) idea.status = status;
    if (calendarDate !== undefined) idea.calendarDate = calendarDate;
    if (keywords) idea.keywords = keywords;

    await idea.save();

    res.json({
      message: 'Idea updated successfully',
      idea
    });
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({
      error: 'Failed to update idea',
      message: error.message
    });
  }
};

/**
 * Delete a content idea
 */
exports.deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await ContentIdea.deleteOne({
      _id: id,
      userId: req.userId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: 'Idea not found',
        message: 'Content idea not found or already deleted'
      });
    }

    res.json({
      message: 'Idea deleted successfully'
    });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({
      error: 'Failed to delete idea',
      message: error.message
    });
  }
};