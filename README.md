# Shamba Records - Farm Field Management System

A comprehensive web application for managing agricultural fields, tracking field status, assigning agents, and monitoring field updates in real-time.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Design Decisions](#design-decisions)
- [Assumptions](#assumptions)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

## Overview

Shamba Records is a farm field management system designed to help agricultural organizations track field status, assign responsibility to agents, and maintain a historical record of field updates. The application provides real-time status calculations based on planting dates and growth stages, with role-based access control for administrators and field agents.

**Key Objective**: Simplify field management with automated status tracking and responsive mobile-first design.

## Features

### Core Features
- **Field Management**: Create, read, update, and delete field records
- **Field Properties**: Name, crop type, location, size (in acres), planting date, current stage
- **Agent Assignment**: Assign fields to agents for monitoring and updates
- **Automated Status Calculation**: 
  - **Active**: Field is on track (newly planted or growing)
  - **At Risk**: Field exceeds growth window (>90 days) without stage progression
  - **Completed**: Field has been harvested
- **Field Updates**: Agents can record field progress with notes and stage updates
- **Timeline View**: Visual timeline of all updates for a field
- **Filtering & Pagination**: Search and filter fields by agent, location, size, stage, and status
- **Mobile Responsive**: Optimized design for mobile (375px), tablet (768px), and desktop (1024px+)

### User Features
- **Role-Based Access Control**: Admin and Agent roles with specific permissions
- **Authentication**: JWT-based authentication with secure token storage
- **Dashboard**: 
  - Admin: View all fields with comprehensive filters
  - Agent: View assigned fields only
- **Status Indicators**: Color-coded status badges (Active/Green, At Risk/Red, Completed/Blue)
- **Risk Level Badges**: High/Medium/Low risk indicators with icons

### UI/UX Features
- **Hamburger Navigation**: Mobile-friendly menu on devices < 640px
- **Responsive Tables & Cards**: Grid switches based on screen size
- **Collapsible Filters**: On mobile, filters collapse with a chevron toggle
- **Smooth Interactions**: Toast notifications, loading states, error handling
- **Accessible Forms**: Proper labels, validation, error messages

## Tech Stack

### Frontend
- **Framework**: React 19.2.5
- **Build Tool**: Vite (v8.0.9)
- **Styling**: Tailwind CSS 4.2.3 with responsive breakpoints
- **Routing**: React Router v6
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **UI Components**: React Icons (FiPlus, FiEdit2, FiTrash2, etc.)
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Port**: 9000 (configurable)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL Server (v5.7 or higher)
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (create `.env`):
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=shamba_records
   DB_PORT=3306
   PORT=9000
   JWT_SECRET=your_secret_key_here
   ```

4. **Create database**:
   ```bash
   mysql -u root -p
   CREATE DATABASE shamba_records;
   EXIT;
   ```

5. **Start backend server**:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:9000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (create `.env`):
   ```
   VITE_API_URL=http://localhost:9000
   VITE_ITEMS_PER_PAGE=5
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```
   Application runs on `http://localhost:5173`

5. **Build for production**:
   ```bash
   npm run build
   ```

### Seed Demo Data

To populate the database with demo credentials and sample data, run:

```bash
cd backend
npm run seed
```

### Demo Credentials

After seeding, you can log in with the following demo accounts:

#### Admin Account
- **Email**: `admin@email.com`
- **Password**: `admin123`
- **Role**: Admin (full access to all fields and user management)

#### Agent Account 1
- **Email**: `agent1@email.com`
- **Password**: `agent123`
- **Name**: John Agent

#### Agent Account 2
- **Email**: `agent2@email.com`
- **Password**: `agent123`
- **Name**: Jane Agent

## Configuration

### Database Configuration
Edit `backend/config/database.js`:
```javascript
const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
};
```

### API Base URL
Frontend expects backend at `http://localhost:9000`. Update in `frontend/src/services/axiosInstance.js` if different.

### JWT Configuration
Backend uses JWT for authentication. Set `JWT_SECRET` in `.env` for token signing.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Fields Table
```sql
CREATE TABLE fields (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  cropType VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  size DECIMAL(10, 2) NOT NULL,
  plantingDate DATE NOT NULL,
  currentStage ENUM('planted', 'growing', 'ready', 'harvested') DEFAULT 'planted',
  assignedAgentId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assignedAgentId) REFERENCES users(id)
);
```

### Field Updates Table
```sql
CREATE TABLE field_updates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fieldId INT NOT NULL,
  agentId INT NOT NULL,
  fieldStage ENUM('planted', 'growing', 'ready', 'harvested') NOT NULL,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (fieldId) REFERENCES fields(id),
  FOREIGN KEY (agentId) REFERENCES users(id)
);
```

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ username, email, password, role }`
- **Response**: `{ user, token }`

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ user, token }`

#### Logout
- **POST** `/api/auth/logout`
- **Headers**: `Authorization: Bearer {token}`

### Field Endpoints

#### Get All Fields (Admin)
- **GET** `/api/fields`
- **Response**: `[{ field, status, message, daysElapsed, riskLevel }, ...]`

#### Get My Fields (Agent)
- **GET** `/api/fields/my-fields`
- **Response**: `[{ field, status, message, daysElapsed, riskLevel }, ...]`

#### Get Field by ID
- **GET** `/api/fields/:id`
- **Response**: `{ field, status, message, daysElapsed, riskLevel }`

#### Create Field
- **POST** `/api/fields`
- **Body**: `{ name, cropType, location, size, plantingDate, assignedAgentId }`

#### Update Field
- **PUT** `/api/fields/:id`
- **Body**: `{ name, cropType, location, size, plantingDate, currentStage, assignedAgentId }`

#### Delete Field
- **DELETE** `/api/fields/:id`

### Field Update Endpoints

#### Get Field Updates
- **GET** `/api/fields/:fieldId/updates`
- **Response**: `[{ id, fieldStage, notes, agent, createdAt }, ...]`

#### Create Field Update
- **POST** `/api/fields/:fieldId/updates`
- **Body**: `{ fieldStage, notes }`

#### Update Field Update
- **PUT** `/api/fields/:fieldId/updates/:updateId`
- **Body**: `{ fieldStage, notes }`

#### Delete Field Update
- **DELETE** `/api/fields/:fieldId/updates/:updateId`

## Design Decisions

### 1. **Field Status Calculation**
**Decision**: Automated status calculation based on planting date and stage.

**Rationale**:
- Reduces manual status updates
- Provides real-time field health insights
- Helps identify fields needing attention

**Implementation**: 
- PLANTED/GROWING > 90 days → AT_RISK (field should have progressed)
- READY > 120 days → AT_RISK (overdue for harvest)
- HARVESTED → COMPLETED (field is done)

### 2. **Role-Based Access Control**
**Decision**: Two roles (Admin, Agent) with role-specific dashboards.

**Rationale**:
- Admins manage all fields and users
- Agents only see assigned fields
- Simple, scalable permission model

**Implementation**: 
- Role check on protected routes
- API endpoints validate user role
- Dashboard router selects appropriate view

### 3. **Mobile-First Responsive Design**
**Decision**: Tailwind CSS with mobile-first breakpoints (sm: 640px, md: 768px, lg: 1024px).

**Rationale**:
- Growing mobile usage in agriculture
- Touch-friendly targets (32-40px minimum)
- Progressive enhancement for larger screens

**Implementation**:
- Hamburger menu on mobile (< 640px)
- Collapsible filters on mobile
- Hidden columns on smaller screens
- Grid responsive classes (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)

### 4. **Form Validation**
**Decision**: Client-side validation with Zod + React Hook Form.

**Rationale**:
- Immediate user feedback
- Better UX than server-side only
- Type-safe validation schema

**Implementation**:
- Zod schema for form validation
- React Hook Form for state management
- Async validation on backend as backup

### 5. **State Management**
**Decision**: Zustand for global auth state (user, token) + localStorage persistence.

**Rationale**:
- Lightweight compared to Redux
- Simple API for auth needs
- Automatic localStorage sync for session persistence

**Implementation**:
- AuthStore: `{ user, authToken, login, logout, initializeAuth }`
- localStorage key: `auth-state`
- Auto-initialize on app load

### 6. **Error Handling**
**Decision**: Consistent error response format with custom AppError class.

**Rationale**:
- Predictable API responses
- Clear error messages to frontend
- Easier debugging and logging

**Response Format**:
```json
{
  "status": "error",
  "message": "User not found",
  "statusCode": 404
}
```

### 7. **API Request Interceptors**
**Decision**: Axios interceptors for automatic token injection.

**Rationale**:
- No need to manually add auth header to each request
- Centralized token refresh logic
- Clean service code

**Implementation**:
- Request interceptor: Add `Authorization: Bearer {token}` if exists
- Response interceptor: Handle 401 errors (token expired/invalid)

## Assumptions

### Functional Assumptions
1. **90-Day Growth Cycle**: All crops follow a standard 90-day growth window before harvest-ready stage
2. **Single Crop per Field**: Each field grows only one crop type at a time
3. **Linear Stage Progression**: Fields progress PLANTED → GROWING → READY → HARVESTED (no stage regression)
4. **Agent Responsibility**: Only one agent is assigned per field; no shared responsibility
5. **UTC Timestamps**: All dates stored as UTC; frontend converts to local timezone for display

### Technical Assumptions
1. **Browser Compatibility**: Modern browsers with ES6+ support (Chrome, Firefox, Safari, Edge latest versions)
2. **Network Connectivity**: Stable internet connection required; no offline mode
3. **Database Availability**: MySQL server is always available (no connection pool recovery logic)
4. **Token Expiry**: JWT tokens don't expire (set in `jwtUtils.js`); production should add expiry
5. **File Storage**: No file uploads supported; all data text-based

### User Assumptions
1. **User Education**: Users understand field stages and status meanings
2. **Data Quality**: Agents will enter accurate field update information
3. **Schedule Adherence**: Field updates are recorded in real-time, not backdated
4. **Permission Model**: Users trust admin role assignment

### Deployment Assumptions
1. **Environment Variables**: All sensitive data in `.env` files (not in version control)
2. **HTTPS in Production**: Frontend assumes secure cookies if implementing session auth
3. **CORS Policy**: Backend configured to accept requests from frontend origin
4. **Database Backups**: IT team manages database backups and disaster recovery

## Development Workflow

### Running Both Servers Simultaneously

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### Code Changes
1. **Backend Changes**: Server auto-restarts with nodemon
2. **Frontend Changes**: Page auto-refreshes with HMR (Hot Module Replacement)

### Testing the Application
1. Create admin account (register, set role to admin in database)
2. Create agent account (register as user)
3. Login as admin → Create fields → Assign to agents
4. Login as agent → View assigned fields → Add updates
5. Check status calculations and filtering


## License

MIT
