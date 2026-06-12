# Aura CRM - Astrologer Client Relationship Management

Aura CRM is a high-fidelity, secure, and modern CRM dashboard specifically designed for professional astrologers. Built on the MERN (MongoDB, Express, React, Node.js) stack, it provides a premium client-management experience wrapped in a cosmic deep-dark, glassmorphic layout with gold accents.

Aura CRM empowers astrologers to seamlessly manage client natal charts, schedule and track consultations, view automated financial analytics, and monitor business progress through a single intuitive dashboard.

---

## 🌌 Key Highlights & Features

1. **Secure Astrologer Auth System**: Credentials-based signup and login with secure bcrypt password hashing and stateful JSON Web Token (JWT) session persistence.
2. **Client Management (CRUD)**: Comprehensive client profiles including detailed natal birth records (Date of Birth, Time of Birth, and Place of Birth). Includes real-time validation, pagination, and multi-parameter search capabilities.
3. **Consultation Scheduling**: Book sessions, track duration and fees, assign status state-machines (`Scheduled`, `Completed`, `Cancelled`), and document intuitive insights via consultation notes.
4. **Interactive Analytics (Recharts)**: Automated dashboard reports summarizing revenue progression over the past six months, status distributions, client acquisition rates, and top revenue contributors.
5. **Quality of Service (Phase 6)**: Global error-handling engine on the backend, custom stackable toast alerts on the frontend, loading spinners, form-validation wrappers, and graceful empty states.

---

## 🛠 Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Recharts (Charts), Lucide React (Icons), Axios (API client with interceptors)
* **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js (Hashing)
* **Design Aesthetic**: Cosmic Deep-Dark theme featuring custom HSL gradients, glassmorphism (`backdrop-filter`), smooth micro-animations, and responsive grids.

---

## 📂 Project Directory Structure

```text
ASTROLOGER CRM/
├── client/                           # React Frontend App (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # Reusable UI Atoms
│   │   │   │   ├── Button.jsx        # Glassmorphic cosmic button
│   │   │   │   ├── Card.jsx          # Glass pane container
│   │   │   │   ├── Input.jsx         # Field input with validations
│   │   │   │   └── Spinner.jsx       # Glowing loader ring
│   │   │   ├── ClientFormModal.jsx
│   │   │   ├── ConsultationFormModal.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── Navbar.jsx            # Cosmic navigation header
│   │   │   ├── NotesViewModal.jsx    # Session notes popup
│   │   │   └── ProtectedRoute.jsx    # Route security guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Persistent login session manager
│   │   │   └── ToastContext.jsx      # Stackable alert notification manager
│   │   ├── pages/
│   │   │   ├── Analytics.jsx         # Interactive charts dashboard
│   │   │   ├── Clients.jsx           # Clients listing & CRUD trigger
│   │   │   ├── Consultations.jsx     # Consultations scheduler
│   │   │   ├── Dashboard.jsx         # Main stats & dynamic grids
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── NotFound.jsx          # Custom 404 page
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx         # React router routing tree
│   │   ├── services/
│   │   │   └── api.js                # Axios instance with interceptors
│   │   ├── App.jsx                   # Component layout mounting Providers
│   │   ├── index.css                 # Cosmic core design system CSS
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                           # Express Backend API
│   ├── config/
│   │   ├── db.js                     # MongoDB Mongoose connector
│   │   └── errorHandler.js           # Custom AppError helper class
│   ├── controllers/
│   │   ├── analyticsController.js    # Data aggregation pipelines
│   │   ├── authController.js         # JWT login & signup logic
│   │   ├── clientController.js       # Client CRUD controllers
│   │   ├── consultationController.js # Session scheduling logic
│   │   └── dashboardController.js    # General summary numbers
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification header interceptor
│   │   └── errorMiddleware.js        # Global Express exception formatter
│   ├── models/
│   │   ├── Client.js                 # Client schema with birth records
│   │   ├── Consultation.js           # Consultation record details schema
│   │   └── User.js                   # Astrologer account schema
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── consultationRoutes.js
│   │   └── dashboardRoutes.js
│   ├── server.js                     # Main server listener
│   └── package.json
```

---

## 🗄 Database Design

### User Model (Astrologers)
* `name`: String (Required)
* `email`: String (Required, Unique, Lowercase)
* `password`: String (Required, Hidden from selects)
* `specialization`: String (Required, Enum: Vedic, Tarot, Numerology, Vastu Shastra, Palmistry, Western)
* `experience`: Number (Required, Minimum 0)
* `bio`: String (Optional)
* Timestamps: `createdAt`, `updatedAt`

### Client Model (Natal Charts)
* `name`: String (Required)
* `email`: String (Required, Lowercase)
* `phone`: String (Optional)
* `dateOfBirth`: Date (Optional)
* `timeOfBirth`: String (Optional, e.g. "14:30")
* `placeOfBirth`: String (Optional)
* `astrologer`: ObjectId reference to `User` (Required)
* Timestamps: `createdAt`, `updatedAt`
* *Indexes*: Compound index `{ email: 1, astrologer: 1 }` is enforced to ensure unique emails per astrologer client directory.

### Consultation Model (Sessions)
* `client`: ObjectId reference to `Client` (Required)
* `astrologer`: ObjectId reference to `User` (Required)
* `date`: Date (Required)
* `duration`: Number (Required, default 30 mins)
* `status`: String (Enum: `Scheduled`, `Completed`, `Cancelled`, default `Scheduled`)
* `fee`: Number (Required, minimum 0)
* `notes`: String (Optional)
* Timestamps: `createdAt`, `updatedAt`

---

## 🔌 API Routes Documentation

All private routes require an `Authorization` header containing `Bearer <JWT_TOKEN>`.

### Auth Endpoints
* **POST** `/api/auth/signup` - Registers a new astrologer account.
* **POST** `/api/auth/login` - Authenticates credentials and returns a JWT token.
* **GET** `/api/auth/me` - Fetches authenticated profile details (Private).

### Client Management Endpoints
* **GET** `/api/clients` - Fetches Paginated & searchable list of clients (Private).
* **GET** `/api/clients/:id` - Fetches a single client detail record (Private).
* **POST** `/api/clients` - Registers a new client profile (Private).
* **PUT** `/api/clients/:id` - Updates client details & birth chart records (Private).
* **DELETE** `/api/clients/:id` - Deletes a client profile (Private).

### Consultation Scheduling Endpoints
* **GET** `/api/consultations` - Lists all consultations for the authenticated astrologer (Private).
* **POST** `/api/consultations` - Creates a new consultation session booking (Private).
* **PUT** `/api/consultations/:id` - Updates booking details or session status (Private).
* **DELETE** `/api/consultations/:id` - Deletes a scheduled consultation (Private).

### Dashboard & Analytics Endpoints
* **GET** `/api/dashboard/stats` - Pulls quick statistics cards (Private).
* **GET** `/api/dashboard/analytics` - Fetches summary numbers for main graphs (Private).
* **GET** `/api/analytics` - Aggregates client onboarding growth, revenue, status ratios, and top clients via Mongoose aggregation pipelines (Private).

### Health & Server Check
* **GET** `/api/status` - Simple server check endpoint (Public).

---

## 🚀 Setup & Execution Guide

### Prerequisites
* **Node.js** v18+ installed.
* **MongoDB** (local community version running on port `27017` or a remote Atlas Connection URI).

### 1. Backend Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Setup environment configuration:
   ```bash
   copy .env.example .env
   ```
3. Update `server/.env` with your secrets:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_signature_key
   NODE_ENV=development
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Client Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web interface in your browser at `http://localhost:5173`.

---

## ☁️ Deployment Guide

### Backend Hosting (Node/Express API)
1. **Host Provider**: Render, Railway, or Heroku.
2. **Environment Configuration**: Set environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) directly in the platform’s settings dashboard.
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js` or `npm start` (ensure `package.json` maps `start` script correctly).

### Frontend Hosting (React Static Assets)
1. **Host Provider**: Vercel, Netlify, or AWS Amplify.
2. **Build Configuration**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **API Routing Config**: Configure fallback redirects (e.g. `vercel.json` or `_redirects` file on Netlify) to route all subpaths back to `index.html` to support React Router single-page navigation.

---

## 🔮 Future Improvements
1. **Birth Chart Generator Integration**: Connect to open-source astronomical ephemerides or external APIs to render interactive Kundli charts, Lagna charts, and planetary positions based on saved birth details.
2. **Consultation Calendar View**: Introduce interactive drag-and-drop calendar maps (e.g., FullCalendar) in the scheduling panel instead of simple tables.
3. **Payment Gateway Integration**: Automate fee collections using Stripe or Razorpay API, generating digital invoices upon completion.
4. **Automated Reminders**: Connect Twilio or SendGrid email APIs to dispatch automatic reminder alerts to clients 24 hours prior to their scheduled consultation dates.
