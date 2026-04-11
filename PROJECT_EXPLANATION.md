# EduTrack: Student Engagement Intelligence Platform

## 🌟 Overview
**EduTrack** is a full-stack student engagement intelligence platform designed to track, analyze, and reward student participation across diverse educational activities. It provides administrators with data-driven insights to identify at-risk students and helps students monitor their own learning journey through real-time analytics and interactive course tracking.

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt for password hashing
- **Middleware**: CORS, Express JSON, Auth Guard

### Frontend
- **Library**: React.js
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API (AuthContext)
- **Data Visualization**: Recharts (Line charts, Bar charts, Gauges)
- **API Client**: Axios with interceptors
- **Styling**: Vanilla CSS (Modern design system with variables)
- **Integrations**: YouTube IFrame API for video tracking

---

## 🚀 Key Features

### 1. Multi-Role Authentication
- Secure Login/Register system.
- Role-Based Access Control (RBAC):
    - **Admin**: Full control over users, activities, and system analytics.
    - **Student**: Access to personal dashboard, courses, and progress tracking.

### 2. Admin Command Center
- **Dynamic Dashboard**: Real-time stats on total users, activities, and engagement levels.
- **Student Management**: View detailed engagement reports for every student.
- **Activity Management**: Create and manage Quizzes, Workshops, Hackathons, Conferences, and Courses.
- **Risk Detection**: Automated flagging of "High Risk" students based on low engagement scores.
- **Direct Alerts**: Send targeted notifications to specific students.
- **Analytics**: Monthly registration trends and department-wise engagement distribution.

### 3. Student Experience
- **Personalized Dashboard**: Weekly study activity bar charts and engagement score gauges.
- **Course Player**: Integrated YouTube player that tracks watch time second-by-second.
- **Smart Progress**: Automatic progress saving and proportional score updates.
- **Study Notes**: Save time-stamped notes directly while watching course videos.
- **Notification System**: Real-time alerts from administrators.
- **Activity Registry**: Browse and register for upcoming campus events.

---

## 🧠 Core Logic: Engagement Scoring Engine

The heart of EduTrack is the **Engagement Scoring Engine**, which converts activity into a numerical score (capped at 200).

### Scoring Points Table:
| Activity Category | Base Points | Condition |
| :--- | :--- | :--- |
| **Course** | 40 | Proportional to % video watched |
| **Hackathon** | 25 | Awarded upon "Present" attendance |
| **Workshop** | 15 | Awarded upon "Present" attendance |
| **Quiz** | 10 | Awarded upon "Present" attendance |
| **Conference** | 8 | Awarded upon "Present" attendance |

### Risk Assessment:
- 🔴 **High Risk**: Score < 20
- 🟡 **Moderate**: Score 20 - 50
- 🟢 **Healthy**: Score > 50

---

## 📂 System Architecture

### Frontend Structure
- `/client/src/api`: Axios configuration and base URL settings.
- `/client/src/components`: UI icons and reusable components.
- `/client/src/context`: AuthContext for global session management.
- `/client/src/pages/admin`: Admin-specific views (Dashboard, Users, Analytics, etc.).
- `/client/src/pages/user`: Student-specific views (Courses, Player, Dashboard, etc.).
- `/client/src/styles`: Shared design system using CSS variables.

### Backend Structure
- `/server/controllers`: Logic for auth, activities, engagements, and notifications.
- `/server/models`: Mongoose schemas (User, Activity, Engagement, Notification).
- `/server/routes`: Express route definitions.
- `/server/utils`: The `scoreEngine.js` logic.
- `/server/middleware`: JWT protection layer.

---

## 🗄️ Database Schema (Primary Models)

### **User**
- Name, Email, Password (hashed), Role (Admin/User), Department, Engagement Score.

### **Activity**
- Name, Category, Description, Date/Time, YouTube URL (for courses), Start/End Dates.

### **Engagement**
- Links a User to an Activity. Stores attendance status, watch time progress, and student notes.

### **Notification**
- Message content for specific users with a "read/unread" status.

---

## 🔧 Installation & Setup

1. **Clone the repository**
2. **Server Setup**:
   - `cd server`
   - `npm install`
   - Create `.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`.
   - `npm run dev`
3. **Client Setup**:
   - `cd client`
   - `npm install`
   - `npm start`

---

## ☁️ Deployment Configuration

EduTrack is designed to be easily deployed to platforms like Render, Vercel, or Railway.
- **Frontend**: Needs `REACT_APP_API_URL` environment variable pointing to the backend.
- **Backend**: Needs `CLIENT_URL` environment variable pointing to the frontend and `MONGO_URI` pointing to a cloud MongoDB Atlas instance.
