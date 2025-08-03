# Laboratory Management System - Backend API

A production-ready Node.js + Express + TypeScript backend for managing laboratory investigations, patients, doctors, and tests with MongoDB and comprehensive API endpoints.

## 🚀 Features

- **Complete CRUD Operations** for Patients, Doctors, Tests, and Investigations
- **Kanban Board Support** with drag-and-drop functionality for investigation status management
- **Advanced Filtering & Search** capabilities
- **File Upload Support** for investigation reports (AWS S3 integration)
- **Real-time Statistics** for dashboard analytics
- **Comprehensive Validation** using Zod schemas
- **Production-ready Security** with Helmet, CORS, and rate limiting
- **Full Test Coverage** with Vitest unit tests
- **Database Seeding** with demo data
- **TypeScript Support** with strict type checking

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod
- **File Storage**: AWS S3 with Multer
- **Testing**: Vitest with MongoDB Memory Server
- **Type Safety**: TypeScript
- **Security**: Helmet, CORS, Morgan logging
- **Development**: TSX for hot reloading

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB 5.0 or higher
- AWS S3 account (for file uploads)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lab-management-system/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
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

4. **Database Setup**
   ```bash
   # Seed the database with demo data
   npm run seed
   ```

## 🚀 Quick Start

```bash
# Development mode with hot reloading
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test

# Run tests with coverage
npm run coverage
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health Check
```http
GET /api/health
```

### Patients API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get all patients |
| GET | `/api/patients/:id` | Get patient by ID |
| GET | `/api/patients/search?q={term}` | Search patients |
| POST | `/api/patients` | Create new patient |
| PUT | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |

### Doctors API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/doctors/:id` | Get doctor by ID |
| GET | `/api/doctors/search?q={term}` | Search doctors |
| GET | `/api/doctors/specialization/:specialization` | Get doctors by specialization |
| POST | `/api/doctors` | Create new doctor |
| PUT | `/api/doctors/:id` | Update doctor |
| DELETE | `/api/doctors/:id` | Delete doctor |

### Tests API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tests` | Get all tests |
| GET | `/api/tests/:id` | Get test by ID |
| GET | `/api/tests/search?q={term}` | Search tests |
| GET | `/api/tests/categories` | Get all test categories |
| GET | `/api/tests/category/:category` | Get tests by category |
| POST | `/api/tests` | Create new test |
| PUT | `/api/tests/:id` | Update test |
| DELETE | `/api/tests/:id` | Delete test |

### Investigations API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/investigations` | Get all investigations with filtering |
| GET | `/api/investigations/:id` | Get investigation by ID |
| GET | `/api/investigations/stats` | Get investigation statistics |
| POST | `/api/investigations` | Create new investigation |
| PUT | `/api/investigations/:id` | Update investigation |
| POST | `/api/investigations/:id/move` | Move investigation (drag-and-drop) |
| POST | `/api/investigations/:id/upload-report` | Upload report file |
| DELETE | `/api/investigations/:id` | Delete investigation |

### Query Parameters for Investigations

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string[] | Filter by status(es) |
| `priority` | string[] | Filter by priority(ies) |
| `patientId` | string | Filter by patient ID |
| `doctorId` | string | Filter by doctor ID |
| `testId` | string | Filter by test ID |
| `search` | string | Search across multiple fields |
| `startDate` | string | Filter by start date |
| `endDate` | string | Filter by end date |

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🏗️ Project Structure

```
server/
├── src/
│   ├── config/         # Database and AWS configuration
│   ├── controllers/    # HTTP request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API route definitions
│   ├── schemas/        # Zod validation schemas
│   ├── services/       # Business logic layer
│   ├── scripts/        # Database seeding and utilities
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper functions
│   ├── __tests__/      # Unit tests
│   └── index.ts        # Application entry point
├── package.json
├── tsconfig.json
├── vitest.config.js
└── README.md
```

## 🧪 Testing

The project includes comprehensive unit tests using Vitest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:dev

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run coverage
```

Tests cover:
- Service layer functionality
- API route handlers
- Database operations
- Validation logic
- Error handling

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration for cross-origin requests
- **Input validation** with Zod schemas
- **MongoDB injection** prevention
- **File upload** security with type validation
- **Error handling** without sensitive data exposure

## 🎯 Key Features

### Drag-and-Drop Support
The Investigation API includes a special `/move` endpoint that supports the frontend's Kanban board drag-and-drop functionality:

```json
POST /api/investigations/:id/move
{
  "newStatus": "In Progress",
  "newIndex": 2
}
```

### Automatic Order Management
Investigations maintain proper ordering within each status column automatically.

### Data Population
All investigation endpoints return fully populated data including patient, doctor, and test details.

### Comprehensive Statistics
The stats endpoint provides real-time analytics for dashboard cards.

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-mongodb-uri
# ... other production configurations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ for efficient laboratory management 