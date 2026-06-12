# Aura CRM - Astrologer Client Relationship Management (Phase 1)

A high-fidelity, secure, and modern CRM for astrologers built with the MERN stack. Aura CRM provides a premium experience with a cosmic-dark aesthetic, glassmorphic layouts, and gold-accented styling tailored specifically for astrologer operations.

---

## Tech Stack & Architecture

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend**: React (Vite), Tailwind CSS, React Router v6, Axios, Lucide React (Icons)
- **Design Language**: Cosmic Deep-Dark theme featuring glassmorphism (`backdrop-filter`), rich animations (float, pulsing, slide-ups), and custom HSL gradients.

---

## Directory Structure

```
ASTROLOGER CRM/
├── client/                     # React Frontend App
│   ├── public/
│   ├── src/
│   │   ├── components/         # ProtectedRoute, Navbar
│   │   ├── context/            # AuthContext (state, persistent logins)
│   │   ├── pages/              # Login, Signup, Dashboard, NotFound
│   │   ├── routes/             # AppRoutes config
│   │   ├── services/           # api.js (Axios instance with authorization interceptor)
│   │   ├── App.jsx             # Root layout and Providers
│   │   ├── index.css           # Custom fonts & glassmorphic styles
│   │   └── main.jsx            # DOM renderer
│   ├── package.json            # Frontend configurations
│   ├── tailwind.config.js      # Tailwind customized spacing/fonts/animations
│   └── vite.config.js          # Vite config
├── server/                     # Express Backend API
│   ├── config/                 # Mongoose DB connections
│   ├── controllers/            # signup, login, getProfile logic
│   ├── middleware/             # JWT auth validation
│   ├── models/                 # User Schema & Pre-Save Bcrypt Hashing
│   ├── routes/                 # Express Auth Routing
│   ├── .env                    # Local environment secrets
│   ├── package.json            # Backend dependencies
│   └── server.js               # Application Entry Point
└── README.md                   # Documentation
```

---

## Features Implemented in Phase 1

1. **Astrologer Signup**: Multi-field registration (Name, Email, Password, Primary Specialization, Years of Experience, Bio).
2. **Astrologer Login**: Authenticates credentials and returns a secure JWT token.
3. **Session Persistence**: Saves authorization token and user info in browser `localStorage`. Logs user back in automatically on refresh.
4. **JWT-based Authentication**: Automatically adds token via request interceptors on all private requests.
5. **Protected Dashboard**: Restricts unauthenticated access. Contains real-time welcome information, mock consultation panels, and practice statistics.
6. **Cosmic Theme & Micro-Animations**: Tailored styled dashboard with responsive widgets, interactive state loaders, and page-not-found layout.

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- [MongoDB](https://www.mongodb.com/try/download/community) server running locally or a MongoDB Atlas connection string.

### 2. Backend Setup
1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Set up environment variables by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update the values in `server/.env` if your MongoDB configuration differs:
   - `MONGO_URI`: Your MongoDB connection URI (e.g. `mongodb://localhost:27017/astrologer_crm`).
   - `JWT_SECRET`: A secure key for encoding JWTs (e.g. `super_secret_cosmic_jwt_key_998877`).
4. Install backend dependencies:
   ```bash
   npm install
   ```
5. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The server will start on port `5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will start on port `5173`.*

---

## API Routes Documentation

| Method | Endpoint | Description | Auth Required | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Registers a new astrologer | No | `{ name, email, password, specialization, experience, bio }` |
| **POST** | `/api/auth/login` | Authenticates and returns token | No | `{ email, password }` |
| **GET** | `/api/auth/me` | Fetch authenticated profile details | **Yes (Bearer Token)** | *None* |
| **GET** | `/api/status` | Server health status check | No | *None* |
