# AI Usage & Verification Declaration - Astrologer CRM

This document outlines the collaborative, human-in-the-loop development process between the Developer and the AI assistant during the engineering of Aura CRM. It discloses the scope of code generation and maps the review, testing, modification, and validation practices enforced to ensure high software quality.

---

## 🤖 AI Assistance & Code Generation Scope

AI was utilized during the development lifecycle across all six phases of the project:

1. **Boilerplate and Routing Scaffolding**: Initial React router layouts, Express entry setups, Cors configurations, and Dotenv mappings.
2. **Schema & Database Modelling**: Drafted Mongoose Schemas for `User`, `Client`, and `Consultation` tables, including compound index definitions.
3. **Database Aggregations**: Drafted MongoDB Aggregation pipelines for complex data charts (revenue trend, status pie chart distributions, client growth, top client expenditure).
4. **Reusable UI Components**: Scaffolded the custom glassmorphic styling system elements (Buttons, Input validations, Cards, Spinners) without using heavy styling libraries.
5. **Global Error Middleware**: Scaffolded custom Express `AppError` structures and status code mappers.

---

## 👁️ Developer Review & Code Verification Process

To maintain standard development quality and prevent regression bugs, all AI-generated code underwent structured manual reviews and verification processes:

### 1. Security & Authentication Audits
* **Bcrypt Pre-Save Hooks**: The developer reviewed the `UserSchema` pre-save hooks to verify that password hashes are generated only when the password field is explicitly modified.
* **Token Expiry Interceptors**: Verified that the Axios interceptor handles `401 Unauthorized` responses correctly, clearing local storage and redirecting the application state back to `/login` to prevent security lock issues.

### 2. Database Index & Schema Adjustments
* **Email Constraints**: The initial schema proposed a global unique constraint on Client email addresses. The developer modified this to a compound unique index:
  ```javascript
  ClientSchema.index({ email: 1, astrologer: 1 }, { unique: true });
  ```
  This modification allows different astrologers on the platform to manage clients with identical email addresses while ensuring no duplicate clients exist within a single astrologer’s directory.

### 3. State & Memory Leak Prevention
* **Axios Listener Cleans**: Verified that context subscriptions and state listeners in React pages clean up properly upon component unmounting (especially in loading overlays and toast alerts).
* **Toast Stack Caps**: Enforced a maximum stack cap (3 concurrent alerts) in `ToastContext.jsx` to prevent DOM layout bloat during high-frequency trigger events.

---

## 🧪 Testing & Validation Routines

All features were systematically validated prior to completion using both automated tools and manual review workflows:

1. **Vite Compilation Checks**: Running `npm run build` inside the client directory was enforced after every major layout change to verify that there are no unused imports, missing definitions, or invalid styling syntax.
2. **Standard API Testing**: Executed API integration tests locally utilizing `test_api.js` (a standalone mock runner) to verify the response structures of CRUD, Auth, and Analytics endpoints.
3. **Regex & Boundary Input Testing**:
   * Verified client-side email formats using standard RFC 5322 regex checks.
   * Inspected fee bounds in consultations (verifying negative inputs are rejected and default values of `0` apply gracefully).
   * Verified date constraints preventing future birth dates from being saved.
