# Choice of Components, Modules, Methods, and Techniques

This document details the technical rationale behind the selection of components, modules, and methodologies used to develop the Engagement Tracking System.

## 1. Architectural Choice
- **Client-Server (Decoupled) Architecture**: The application is split into a standalone frontend client and a RESTful backend API. 
  - *Rationale*: This separation of concerns allows the frontend and backend to be developed, scaled, and deployed independently (e.g., frontend on Vercel, backend on Render). It also makes it easier to potentially build a mobile app in the future that consumes the exact same API.

## 2. Frontend Components & Modules
- **React.js (UI Library)**
  - *Rationale*: Chosen for its component-based architecture and Virtual DOM. It allows for the creation of reusable UI components (like Navbars, Sidebar, and metric cards) and provides real-time UI updates essential for dynamic dashboards without reloading the page.
- **React Router DOM (Routing Method)**
  - *Rationale*: Enables a Single Page Application (SPA) experience. It handles client-side routing, preserving global application state (like the authenticated user) when navigating between the Dashboard, Activities, and Courses.
- **React Context API (State Management Technique)**
  - *Rationale*: Used specifically for `AuthContext` to manage user sessions across the app. Since the global state requirements are relatively straightforward (mainly user roles and tokens), the Context API avoids the heavy boilerplate and complexity of an external library like Redux.
- **Axios (HTTP Client)**
  - *Rationale*: Preferred over the native `fetch` API because of its automatic JSON data transformation, robust error handling, and most importantly, **Interceptors**. Axios interceptors are utilized to securely attach the JWT to the authorization headers of every outgoing outgoing request automatically.
- **Recharts (Data Visualization Module)**
  - *Rationale*: Selected for plotting engagement trends and dashboard metrics. Unlike low-level libraries like D3.js, Recharts provides declarative, React-friendly chart components (Bar charts, Gauges) that seamlessly bind to dynamic data states.

## 3. Backend Modules & Frameworks
- **Node.js & Express.js (Runtime & Framework)**
  - *Rationale*: Chosen for its asynchronous, non-blocking I/O model, which excels at handling concurrent API requests. Express.js provides a lightweight routing and middleware layer that expedites backend development.
- **MongoDB & Mongoose (Database & ODM)**
  - *Rationale*: As a NoSQL document store, MongoDB provides the schema flexibility necessary to store varied activity types (Hackathons, Courses, Quizzes) without rigid tabular constraints. Mongoose is used as the Object Data Modeling (ODM) layer to enforce application-level schemas, field validations, and relational mapping (e.g., populating a User within an Activity).
- **JSON Web Tokens (JWT) (Authentication Method)**
  - *Rationale*: Used for stateless authentication. Instead of storing session IDs in the server's memory or database, JWT securely encodes user claims (like user ID and role) with a cryptographic signature. This allows the backend to verify users instantly and securely, reducing database load.
- **Bcrypt.js (Security Module)**
  - *Rationale*: Used to hash user passwords before storing them in the database. Utilizing a random "salt" and the blowfish cipher, it defends the database against dictionary and rainbow-table attacks, ensuring sensitive credentials are never plain text.

## 4. Specific Methodologies and Techniques
- **Role-Based Access Control (RBAC)**
  - *Rationale*: Implemented via custom middleware (`authMiddleware.js`). It intercepts incoming requests, verifies the JWT, and checks the user's role. This technique ensures strict security boundaries: standard students cannot access administrative routes (like analytics) and vice-versa.
- **Algorithmic Engagement Scoring Engine**
  - *Rationale*: A central functional capability that normalizes heterogeneous events into a standardized point system. It relies conditionally on logic to dynamically assign weights based on the event category (e.g., Course = proportional scoring; Hackathon = flat rate presence scoring).
- **Time-Series Video Tracking (IFrame Interception Method)**
  - *Rationale*: Utilizing the YouTube IFrame API, the frontend accurately queries the exact playback timestamp of educational videos. This technique prevents "fast-forwarding" exploitation, sending chunked validation requests to the backend to ensure proportional credit is only awarded for *actual* time spent watching.
- **RESTful API Design**
  - *Rationale*: The backend adheres to REST standards, organizing resources by nouns (e.g., `/api/users`, `/api/activities`) and utilizing standard HTTP verbs (GET, POST, PUT, DELETE) to denote Create, Read, Update, and Delete (CRUD) operations, ensuring an intuitive and standard integration with the frontend.
