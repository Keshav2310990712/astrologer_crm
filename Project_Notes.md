# Aura CRM - Project Notes & Technical Ledger

This document serves as the project ledger, tracking major engineering decisions, lessons learned, styling parameters, and guidelines for future maintenance of Aura CRM.

---

## 📅 Implementation Log (Phase 1 to 6)

### Phase 1: Authentication & Core Architecture
* Established the dual-folder structure (`client` and `server`) containing distinct package configurations.
* Configured Mongoose to connect dynamically to local or cloud instances based on environment variables.
* Implemented the JWT creation and authorization header interceptors, protecting private dashboard widgets.
* Created the baseline cosmic-dark CSS layout system.

### Phase 2: Dashboard Statistics
* Structured key collection aggregation pipelines to compute summary figures: total clients, total scheduled consultations, total earnings.
* Integrated the main Dashboard page displaying responsive summary cards and historical line/bar analytics.

### Phase 3: Client Management
* Upgraded client records to include astrology birth chart metadata: Date of Birth, Time of Birth, and Place of Birth.
* Implemented searchable and paginated client rosters, restricting access exclusively to the creator astrologer.

### Phase 4: Consultation Scheduling
* Created a booking system where astrologers can select registered clients, schedule time blocks, set session rates, and update consultation status state machines.
* Added a modal component to read and edit session notes seamlessly.

### Phase 5: Advanced Analytics
* Implemented native MongoDB Aggregation Pipelines to process charts server-side.
* Rendered four dedicated analytics panels inside [Analytics.jsx](file:///c:/Users/kansa/OneDrive/Desktop/ASTROLOGER%20CRM/client/src/pages/Analytics.jsx) summarizing business trends.

### Phase 6: Code Quality & Polish
* Engineered a global centralized Express error handler middleware formatting Mongoose errors, token timeouts, and 404 falling routes into standardized JSON structures.
* Implemented custom CSS Toast alerts and unified loading loaders (`Spinner`) to eliminate dependency bloat.
* Added standard regex checks on all sign-up and onboarding input fields.

---

## 🎨 Cosmic Glassmorphic Design System Guidelines

Aura CRM uses custom CSS variables to generate a dark-space look with glowing gold highlights without downloading heavy CSS libraries:

### Design Tokens (`client/src/index.css`)
* **Backgrounds**: Cosmic Deep-Dark background (`#0b0813`) layered with soft purple-indigo highlights.
* **Gold Accents**: Gold buttons and text indicators (`#e2be2b` / HSL `48, 77%, 53%`).
* **Glassmorphism Panels**: Panel cards use transparent overlays with backdrop filters:
  ```css
  .glass-panel {
    background: rgba(18, 14, 33, 0.45);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(139, 92, 246, 0.15);
  }
  ```

---

## 🧠 Core Decisions & Architectural Trade-offs

### 1. Custom Toast System vs. React-Toastify
* **Decision**: Designed a stackable `ToastContext` provider from scratch instead of importing npm libraries.
* **Trade-off**: Required custom CSS transitions and state management code, but reduced bundle size, eliminated external dependency vulnerabilities, and allowed styling to match the cosmic theme out of the box.

### 2. Server-side Aggregations vs. Client Calculations
* **Decision**: Processed analytics charts using Mongoose Aggregations (like `$group`, `$sort`, `$lookup`) instead of fetching all records and mapping them in React.
* **Trade-off**: Increases database CPU utilization slightly, but keeps network payloads small and ensures high performance even as client rosters scale to thousands of records.

### 3. Compound Indexing for Clients
* **Decision**: Replaced generic unique email schema index with a compound key `{ email: 1, astrologer: 1 }`.
* **Trade-off**: Enables multi-tenancy (multiple astrologer accounts can register identical client emails), but safeguards against duplicates within an individual astrologer's profile registry.

---

## 🛠 Maintenance & Development Guidelines

1. **Keep Styling Localized**: When writing new panels, prefer using CSS classes from `client/src/index.css` (e.g. `glass-panel`, `cosmic-bg`) or Tailwind custom extension tags to maintain design consistency.
2. **Handle Errors Operationally**: In backend controllers, avoid generic `try/catch` JSON responses. Pass errors directly to the `next()` middleware helper utilizing the custom `AppError` class:
   ```javascript
   if (!record) {
     return next(new AppError('No record found with that ID', 404));
   }
   ```
3. **Validate Inputs in Both Places**: Always match client-side form regex checks with corresponding schema validation properties on the backend.
