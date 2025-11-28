# Docker Setup Guide for BrainBug

## Prerequisites

1. **Install Docker Desktop**
   - macOS: Download from [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   - Windows: Download from [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - Linux: Follow [Docker Engine installation](https://docs.docker.com/engine/install/)

2. **Start Docker Desktop**
   - Open Docker Desktop application
   - Wait for Docker to start (you'll see the whale icon in your system tray)
   - Verify Docker is running: `docker --version`

## Quick Start

### Option 1: Using the start script (Recommended)

```bash
# Make sure Docker Desktop is running first!
./start.sh
```

### Option 2: Using Docker Compose directly

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Option 3: Using Makefile

```bash
# See all available commands
make help

# Start services
make up

# View logs
make logs

# Stop services
make down
```

## What Gets Started?

When you run the Docker setup, three services start:

1. **MongoDB** (Port 27017)
   - Database for storing bug data
   - Data persists in a Docker volume

2. **Backend API** (Port 5001)
   - Node.js/Express server
   - Connects to MongoDB
   - Provides REST API endpoints

3. **Frontend** (Port 3000)
   - React application served by Nginx
   - Connects to backend API

## Accessing the Application

Once started, open your browser:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **MongoDB**: mongodb://localhost:27017

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Restart a service
docker-compose restart backend

# Rebuild images
docker-compose build --no-cache

# Remove everything (including data)
docker-compose down -v

# Check service status
docker-compose ps
```

## Troubleshooting

### Docker daemon not running
**Error**: `Cannot connect to the Docker daemon`

**Solution**: 
1. Open Docker Desktop application
2. Wait for it to fully start
3. Try again

### Port already in use
**Error**: `port is already allocated`

**Solution**:
```bash
# Find what's using the port
lsof -i :3000  # or :5001, :27017

# Stop the conflicting service or change ports in docker-compose.yml
```

### MongoDB connection issues
**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
```bash
# Restart MongoDB
docker-compose restart mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Verify MongoDB is running
docker-compose ps
```

### Frontend can't connect to backend
**Error**: `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution**:
1. Check backend is running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Verify backend URL in browser: http://localhost:5001/api/dashboard?userId=demo-user

### Build failures
**Error**: Build fails or takes too long

**Solution**:
```bash
# Clean rebuild
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

## Development vs Production

### Development (Current Setup)
- Hot reload enabled for backend
- Source code mounted as volumes
- Detailed logging
- Suitable for local development

### Production Deployment
For production, you would:
1. Remove volume mounts
2. Use environment-specific .env files
3. Enable SSL/HTTPS
4. Use a reverse proxy (nginx)
5. Set up proper logging and monitoring
6. Use managed MongoDB (MongoDB Atlas)

## Data Persistence

MongoDB data is stored in a Docker volume named `mongodb_data`. This means:
- Data persists between container restarts
- Data survives `docker-compose down`
- Data is removed with `docker-compose down -v`

To backup your data:
```bash
# Export data
docker-compose exec mongodb mongodump --out /data/backup

# Import data
docker-compose exec mongodb mongorestore /data/backup
```

## Resource Usage

Monitor Docker resource usage:
```bash
# View container stats
docker stats

# View disk usage
docker system df
```

## Cleaning Up

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove unused images and containers
docker system prune -a
```

## Next Steps

1. ✅ Start Docker Desktop
2. ✅ Run `./start.sh`
3. ✅ Open http://localhost:3000
4. ✅ Sign up and start using BrainBug!

For more information, see the main [README.md](README.md)
