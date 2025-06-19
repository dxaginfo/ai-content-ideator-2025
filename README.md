# AI Content Ideator

A web application that generates creative and engaging content ideas for blog posts, videos, and social media using artificial intelligence.

## Project Overview

AI Content Ideator is designed to help content creators, marketers, and social media managers quickly generate high-quality content ideas tailored to their target audience. By leveraging AI technology, the platform analyzes trending topics, performs keyword optimization, and assists with content calendar planning to maximize engagement and efficiency.

## Key Features

- **Multi-platform Content Idea Generation**
  - Blog post idea generator
  - Video content idea generator
  - Social media post idea generator
  - Keyword optimization suggestions

- **Trend Analysis**
  - Integration with Google Trends API
  - Social media trend analysis
  - Industry-specific trend monitoring

- **Content Calendar Management**
  - Drag-and-drop calendar interface
  - Scheduling and planning tools
  - Content categorization and tagging

- **Analytics Dashboard**
  - Content performance metrics
  - User engagement statistics
  - Trend visualization

## Technology Stack

### Frontend
- React.js with TypeScript
- Material-UI for responsive design
- Redux for state management
- Axios for API communication

### Backend
- Node.js with Express
- MongoDB for data storage
- OpenAI API integration
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- OpenAI API key

### Installation
1. Clone the repository
```
git clone https://github.com/dxaginfo/ai-content-ideator-2025.git
cd ai-content-ideator-2025
```

2. Install dependencies
```
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```
# In the backend directory, create a .env file
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
PORT=3001

# In the frontend directory, create a .env file
REACT_APP_API_URL=http://localhost:3001/api
```

4. Start the development servers
```
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm start
```

## Project Status

This project is currently in active development. The initial MVP will focus on the core idea generation functionality with basic user management. Additional features will be implemented in subsequent phases.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the API used for content idea generation
- The open-source community for the fantastic libraries and tools used in this project