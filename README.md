# Lab Management System

A full-stack laboratory management system with React frontend and Node.js backend for managing patients, doctors, tests, and investigations with Kanban board functionality.

## Prerequisites

- Node.js 18+
- MongoDB 5.0+
- npm or yarn

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

1. **Start the backend**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on http://localhost:3000

2. **Start the frontend** (in new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client runs on http://localhost:5173

## Project Structure

```
lab-management-system/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
└── README.md        # This file
```

## Features

- Patient, Doctor, Test, and Investigation management
- Kanban board with drag-and-drop functionality
- File upload support for investigation reports
- Advanced filtering and search capabilities
- Real-time statistics dashboard
- Comprehensive validation and error handling

## Documentation

- [Server API Documentation](./server/README.md)
- [Client Documentation](./client/README.md)
