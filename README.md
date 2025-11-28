# BrainBug - AI-Powered Bug Analysis Platform

BrainBug is an intelligent coding companion that helps developers analyze, track, and learn from their bugs using AI-powered insights.

## 🚀 Features

- **AI Bug Analysis**: Powered by Google Gemini AI for intelligent bug pattern recognition
- **Dashboard**: Real-time overview of your coding progress and bug statistics
- **Bug History**: Track and analyze your bug patterns over time
- **Analytics**: Detailed insights into your coding improvements
- **Dark/Light Theme**: Toggle between themes for comfortable viewing

## 📋 Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js 18+ and MongoDB (for local development)

## 🐳 Quick Start with Docker (Recommended)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd BrainBug
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env and add your Gemini API key
```

### 3. Start all services
```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 5001
- Frontend on port 3000

### 4. Access the application
Open your browser and navigate to: **http://localhost:3000**

### 5. Stop all services
```bash
docker-compose down
```

### 6. Stop and remove all data
```bash
docker-compose down -v
```

## 💻 Local Development (Without Docker)

### Backend Setup

```bash
cd brainbug-backend

# Install dependencies
npm install

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
echo "MONGO_URI=mongodb://localhost:27017/brainbug" >> .env

# Start MongoDB (if not running)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start backend
npm run dev
```

Backend will run on: **http://localhost:5001**

### Frontend Setup

```bash
cd brainbug-frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 🏗️ Project Structure

```
BrainBug/
├── brainbug-backend/          # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── index.js          # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── brainbug-frontend/         # React/TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts (Auth, Theme)
│   │   ├── services/         # API services
│   │   └── App.tsx           # Main app component
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml         # Docker orchestration
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

- `PORT` - Backend server port (default: 5001)
- `MONGO_URI` - MongoDB connection string
- `GEMINI_API_KEY` - Google Gemini API key for AI features
- `NODE_ENV` - Environment (development/production)

### Frontend Configuration

The frontend automatically connects to the backend at `http://localhost:5001/api`

## 📚 API Endpoints

### Dashboard
- `GET /api/dashboard?userId=<userId>` - Get dashboard data

### Analytics
- `GET /api/analytics?userId=<userId>` - Get analytics data

### Bug History
- `GET /api/bug-history?userId=<userId>` - Get bug history with filters

### Bug Analysis
- `POST /api/analyze` - Analyze code and detect bugs

## 🛠️ Development Commands

### Backend
```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Start production server
npm test         # Run tests
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Docker
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f backend    # View backend logs
docker-compose logs -f frontend   # View frontend logs
docker-compose restart backend    # Restart backend
docker-compose build --no-cache   # Rebuild images
```

## 🔍 Troubleshooting

### Port 5000 already in use (macOS)
macOS AirPlay uses port 5000. BrainBug uses port 5001 instead.

### MongoDB connection issues
```bash
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Frontend can't connect to backend
- Ensure backend is running on port 5001
- Check CORS configuration in `brainbug-backend/src/index.js`
- Verify API URL in `brainbug-frontend/src/services/api.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Google Gemini AI for powering the bug analysis
- MongoDB for the database
- React and Vite for the frontend framework
- Express.js for the backend framework
