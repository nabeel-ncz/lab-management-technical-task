# Lab Management System - Docker Setup

Complete Docker setup guide for running the Lab Management System with zero configuration hassle.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lab-management-system
   ```

2. **Start all services**
   ```bash
   # Start all services (MongoDB, Backend, Frontend)
   docker compose up

   # Or run in background
   docker compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

That's it! The entire application stack is now running.

## What Gets Started

The Docker setup automatically starts:

- **MongoDB 7.0** - Database with persistent storage
- **Backend API** - Node.js Express server with hot reload
- **Frontend App** - React Vite development server with hot reload

All services are networked together and configured with the correct environment variables.

## Development Features

- **Hot Reload**: Code changes automatically update the running application
- **Volume Mounting**: Your local code is mounted into containers
- **Persistent Database**: Data survives container restarts
- **Service Dependencies**: Proper startup order (MongoDB → Backend → Frontend)

## Useful Commands

### Basic Operations
```bash
# Start services
docker compose up

# Start in background
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (deletes database data)
docker compose down -v
```

### Development Commands
```bash
# View logs from all services
docker compose logs -f

# View logs from specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb

# Rebuild containers after dependency changes
docker compose up --build

# Restart a specific service
docker compose restart backend
```

### Database Operations
```bash
# Access MongoDB shell
docker exec -it lab-mongodb mongosh lab-management-system

# Import/Export data
docker exec -i lab-mongodb mongoimport --db lab-management-system --collection patients --file /data/patients.json

# Backup database
docker exec lab-mongodb mongodump --db lab-management-system --out /backup
```

### Cleanup Commands
```bash
# Remove all containers and networks
docker compose down

# Remove containers, networks, and volumes
docker compose down -v

# Clean up unused Docker resources
docker system prune

# Remove all unused images
docker image prune -a
```

## Production Deployment

### Production Build

For production environments, use the optimized production configuration:

```bash
# Set environment variables for production
export AWS_ACCESS_KEY_ID=your_real_access_key
export AWS_SECRET_ACCESS_KEY=your_real_secret_key
export AWS_S3_BUCKET_NAME=your_bucket_name

# Build and run production containers
docker compose -f docker-compose.prod.yml up --build -d
```

### Production vs Development

| Feature | Development | Production |
|---------|-------------|------------|
| Hot Reload | ✅ Enabled | ❌ Disabled |
| Build Optimization | ❌ Basic | ✅ Optimized |
| Security | ❌ Relaxed | ✅ Hardened |
| File Serving | Dev Server | Static Server |
| Dependencies | All (dev + prod) | Production only |

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# If ports 3000 or 5173 are in use
docker compose down
# Kill processes using the ports, then
docker compose up
```

**Database connection issues:**
```bash
# Check if MongoDB is running
docker compose ps

# Restart MongoDB
docker compose restart mongodb

# Check MongoDB logs
docker compose logs mongodb
```

**Frontend not updating:**
```bash
# Rebuild frontend container
docker compose up --build frontend
```

**Backend API errors:**
```bash
# Check backend logs
docker compose logs backend

# Restart backend
docker compose restart backend
```

### Performance Tips

1. **Allocate sufficient resources** to Docker (4GB+ RAM recommended)
2. **Use .dockerignore** to exclude unnecessary files
3. **Restart services** individually instead of the entire stack
4. **Use volumes** for persistent data

## File Structure

```
lab-management-system/
├── docker-compose.yml           # Development configuration
├── docker-compose.prod.yml      # Production configuration
├── .dockerignore               # Global Docker ignore
├── client/
│   ├── Dockerfile              # Production frontend build
│   ├── Dockerfile.dev          # Development frontend
│   └── .dockerignore          # Client-specific ignore
├── server/
│   ├── Dockerfile              # Production backend build
│   ├── Dockerfile.dev          # Development backend
│   └── .dockerignore          # Server-specific ignore
└── README.md                   # Main documentation
```

## Environment Variables

The Docker setup includes sensible defaults for all environment variables:

```env
# Automatically configured in docker-compose.yml
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/lab-management-system
CORS_ORIGINS=http://localhost:5173,http://frontend:5173
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=lab-management-reports
```

For production, set real AWS credentials as environment variables before running.

## Benefits of Docker Setup

✅ **Zero Configuration** - No need to install Node.js, MongoDB, or manage dependencies  
✅ **Consistent Environment** - Same setup across all machines  
✅ **Instant Setup** - One command to start everything  
✅ **Isolated Dependencies** - No conflicts with local installations  
✅ **Easy Cleanup** - Remove everything with one command  
✅ **Production Ready** - Same containers can be used in production  

## Getting Help

If you encounter issues:

1. Check the [main README](./README.md) for manual setup instructions
2. Review Docker logs: `docker compose logs -f`
3. Ensure Docker has sufficient resources allocated
4. Try rebuilding containers: `docker compose up --build`

For more detailed API documentation, see [Server Documentation](./server/README.md). 