# Lab Management System

A full-stack laboratory management system with React frontend and Node.js backend for managing patients, doctors, tests, and investigations with Kanban board functionality.

## Prerequisites

- Node.js 18+
- MongoDB 5.0+
- npm or yarn

> **Want to skip the setup?** Use our [Docker setup guide](./DOCKER.md) for one-command installation.

## Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lab-management-system
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cd ../server
   ```
   Create `.env` file with:
   ```env
    # Server Configuration
    PORT=3000
    NODE_ENV=development

    # Database Configuration
    MONGODB_URI=mongodb://localhost:27017/lab-management-system

    # AWS S3 Configuration
    AWS_REGION=us-east-1
    AWS_ACCESS_KEY_ID=your_access_key_here
    AWS_SECRET_ACCESS_KEY=your_secret_key_here
    AWS_S3_BUCKET_NAME=lab-management-reports

    # CORS Origins
    CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

4. **Seed database** (optional)
   ```bash
   # In server directory
   npm run seed
   ```

## Running the Application

1. **Start MongoDB** (make sure it's running on localhost:27017)

2. **Start the backend**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on http://localhost:3000

3. **Start the frontend** (in new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client runs on http://localhost:5173

> **Alternative**: For easier setup with zero configuration, see our [Docker guide](./DOCKER.md)

## Project Structure

```
lab-management-system/
├── client/                    # React + Vite frontend
├── server/                    # Node.js + Express backend
├── docker-compose.yml         # Docker development setup
├── docker-compose.prod.yml    # Docker production setup
├── README.md                  # Manual setup guide (this file)
└── DOCKER.md                  # Docker setup guide
```

## Features

- Patient, Doctor, Test, and Investigation management
- Kanban board with drag-and-drop functionality
- File upload support for investigation reports
- Advanced filtering and search capabilities
- Real-time statistics dashboard
- Comprehensive validation and error handling

## Production Deployment

### Manual Production Setup

1. **Build the applications**
   ```bash
   # Build backend
   cd server
   npm run build
   
   # Build frontend
   cd ../client
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   # In server directory, update .env for production
   NODE_ENV=production
   MONGODB_URI=mongodb://your-production-mongodb-uri
   AWS_ACCESS_KEY_ID=your_real_access_key
   AWS_SECRET_ACCESS_KEY=your_real_secret_key
   AWS_S3_BUCKET_NAME=your_bucket_name
   ```

3. **Start production servers**
   ```bash
   # Start backend
   cd server
   npm start
   
   # Serve frontend (use nginx, apache, or static hosting)
   # The built files are in client/dist/
   ```

> **Easier deployment**: Use our [Docker deployment guide](./DOCKER.md) for containerized production setup

## Documentation

- [Docker Setup Guide](./DOCKER.md) - Zero-configuration setup with Docker
- [Server API Documentation](./server/README.md) - Complete backend API reference
- [Client Documentation](./client/README.md) - Frontend development guide
