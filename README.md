# 💰 Expense Tracker - Frontend

A modern, responsive expense tracking web application built with React, featuring real-time analytics and intuitive financial management.

## 📌 Overview

This project is a production-ready frontend application that allows users to:
* Track and visualize income and expenses in real-time
* Manage custom categories for better organization
* View monthly spending summaries and trends
* Access their financial data securely with JWT authentication

Built as part of my journey to master full-stack development and modern web technologies.

## 🛠️ Tech Stack

**Frontend Framework:**
* React 18 - Modern JavaScript library with Hooks
* Vite - Next-generation frontend build tool

**Routing & State:**
* React Router v6 - Client-side routing
* Context API - Global state management

**Styling:**
* Tailwind CSS 3 - Utility-first CSS framework
* Responsive design with mobile-first approach

**HTTP Client:**
* Axios - Promise-based HTTP client
* Centralized API service layer

## ✨ Features

### Core Functionality
* 🔐 **Secure Authentication** - Login/Register with JWT token management
* 📊 **Real-time Dashboard** - Live analytics showing income, expenses, and net balance
* 💸 **Expense Management** - Add, view, and delete expenses with category filtering
* 📁 **Category System** - Create and manage custom income/expense categories
* 📅 **Monthly View** - Chronological expense summaries with expandable details

### Technical Highlights
* ✅ Protected routes with automatic authentication checks
* ✅ Token-based session management with auto-logout on expiration
* ✅ Responsive design optimized for all screen sizes
* ✅ Real-time data synchronization with backend
* ✅ Form validation and error handling
* ✅ Smooth transitions and hover effects
* ✅ Color-coded UI for income vs expense visualization

## 📋 Prerequisites

Before running this project, ensure you have:
* Node.js 16+ installed
* npm or yarn package manager
* Backend API running on http://localhost:8000
* Git (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/BhavanaBasavaraj/expense-tracker-frontend.git
cd expense-tracker-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment (optional)
Create a `.env` file for custom API URL:
```env
VITE_API_URL=http://localhost:8000
```

### 4. Run development server
```bash
npm run dev
```

The application will be available at **http://localhost:5173**

### 5. Build for production
```bash
npm run build
npm run preview  # Preview production build
```

## 📊 Application Pages

**Authentication**
* `/login` - User login with email/password
* `/register` - New user registration

**Main Application**
* `/dashboard` - Main dashboard with analytics and expense list
* `/categories` - Category management page
* `/monthly` - Monthly expense summaries with detailed breakdowns

## 🔐 Authentication Flow

1. User registers or logs in with credentials
2. Backend validates and returns JWT access token
3. Token stored in localStorage for persistence
4. Token automatically sent with every API request
5. Protected routes verify token before rendering
6. Auto-logout on token expiration (401 errors)

## 🌐 API Integration

The frontend integrates with **16 backend API endpoints** including:
* Authentication endpoints (register, login, get user)
* Expense CRUD operations with pagination
* Category management
* Analytics endpoints (dashboard, category breakdown, monthly summaries)

All API calls are centralized in `src/services/api.js` for maintainability.

## 🐳 Docker Setup

### Build Docker Image
```bash
docker build -t expense-tracker-frontend:v1 .
```

### Run Container
```bash
docker run -d \
  --name expense-tracker-frontend \
  --add-host=host.docker.internal:host-gateway \
  -p 3000:80 \
  expense-tracker-frontend:v1
```

### Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Docker Compose (Recommended)
Run both frontend and backend together:
```bash
docker-compose up -d
```

### Technical Details
- **Multi-stage build:** Reduces image size from 1.2GB to 25MB
- **Nginx web server:** Production-grade serving with gzip compression
- **React Router support:** SPA routing handled by Nginx
- **API proxy:** `/api` routes proxied to backend container


## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## 👤 Author

**Bhavana Basavaraj**
* GitHub: [@BhavanaBasavaraj](https://github.com/BhavanaBasavaraj)
* LinkedIn: [MB Bhavana](https://www.linkedin.com/in/mb-bhavana/)
* Email: bhavanabasavaraj4@gmail.com

## 🔗 Related Repository

**Backend API:** [expense-tracker-api](https://github.com/BhavanaBasavaraj/expense-tracker-api)

---
