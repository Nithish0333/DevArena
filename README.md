# DevArena - Coding Platform

A full-stack coding platform similar to HackerRank and W3Schools with integrated code editor.

## Tech Stack

- **Frontend**: React.js, Bootstrap, Monaco Editor
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Features

- User authentication (signup/login)
- Coding problems with difficulty levels
- Integrated Monaco code editor
- Code submission and execution
- User progress tracking
- Bookmark system
- Submission history

## Deployment

### Frontend
[![Netlify Status](https://api.netlify.com/api/v1/badges/855937e8-b205-4570-85be-47460eae2b80/deploy-status)]

**URL**: https://teal-speculoos-8e4b82.netlify.app

### Backend
[![Render Status](https://api.render.com/api/v1/services/855937e8-b205-4570-85be-47460eae2b80/status)]

**URL**: https://devarena-backend.onrender.com

**Health Check**: https://devarena-backend.onrender.com/api/health
- Leaderboard
- Gamification (points, badges, streaks)
- Dark theme and responsive design

## Project Structure

```
DevArena/
|-- frontend/          # React frontend
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- App.js
|   |   |-- index.js
|   |-- package.json
|   |-- .env
|-- backend/           # Node.js backend
|   |-- models/
|   |-- routes/
|   |-- controllers/
|   |-- middleware/
|   |-- utils/
|   |-- index.js
|   |-- package.json
|   |-- .env
|-- README.md          # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd DevArena
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Set up environment variables

5. Start MongoDB service

6. Seed the database with sample problems

7. Run the application

### Environment Variables

Create `.env` file in the backend directory:

Backend (.env):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devarena
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

Create `.env` file in the frontend directory:

Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Database Setup

1. Make sure MongoDB is running on your system
2. Seed the database with sample problems:
   ```bash
   cd backend
   npm run seed
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
   The backend will run on http://localhost:5000

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000

3. Open your browser and navigate to http://localhost:3000

## Available Scripts

### Backend
- `npm start` - Start the backend server
- `npm run seed` - Seed database with sample problems

### Frontend
- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Problems
- `GET /api/problems` - Get all problems with filters
- `GET /api/problems/:id` - Get specific problem
- `POST /api/problems/:id/submit` - Submit solution
- `POST /api/problems/:id/bookmark` - Bookmark problem
- `DELETE /api/problems/:id/bookmark` - Remove bookmark
- `GET /api/problems/categories/list` - Get problem categories

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/submissions` - Get user submissions
- `GET /api/user/bookmarks` - Get user bookmarks
- `GET /api/user/stats` - Get user statistics

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard

## Sample Problems

The platform comes with 8 sample problems covering various categories:
- Two Sum (Arrays)
- Palindrome Number (Math)
- Valid Parentheses (Stacks)
- Binary Search (Searching)
- Maximum Subarray (Dynamic Programming)
- Merge Sort (Sorting)
- Fibonacci Number (Recursion)
- Linked List Cycle (Linked Lists)

## Security Features

- JWT authentication
- Rate limiting (100 requests per 15 minutes)
- Input validation
- Password hashing with bcryptjs
- CORS protection
- Helmet for security headers

## Supported Languages

- JavaScript (Node.js)
- Python
- Java
- C++
- C

## Future Enhancements

- Docker-based code execution
- Real-time collaboration with WebSockets
- AI assistant for coding hints
- Contest mode
- GitHub-style contribution graph
- Notifications system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
