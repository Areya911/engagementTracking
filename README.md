Engagement Tracking System (MERN):
A full-stack web application to track, manage, and report user participation in institutional activities such as workshops, events, and programs.
Built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) with JWT authentication and role-based access control.

🚀 Features
Authentication & Roles
User Registration and Login
JWT-based Authentication
Role-based Access (Admin / User)
Password encryption using bcrypt
Activity Management (Admin)
Create, update, delete activities
Activity details: name, category, date, duration, description

Engagement Tracking:
Users register for activities
Admin marks attendance and completion
Engagement records stored per user per activity
Dashboard & Reports
Total users, activities, engagements
Participation statistics
Data ready for charts (Recharts / Chart.js)

🧱 Architecture
React (Frontend)
      ↓
Express + Node (Backend API)
      ↓
MongoDB (Database)


Follows a clean 3-tier architecture as per SRS.

🛠️ Tech Stack
Layer	Technology
Frontend	React.js, Axios, React Router
Backend	Node.js, Express.js
Database	MongoDB, Mongoose
Auth	JWT, bcrypt
API Style	RESTful
📂 Folder Structure
Engagement-Tracking-System
   ├── server
   │    ├── models
   │    ├── controllers
   │    ├── routes
   │    ├── middleware
   │    └── server.js
   └── client
        ├── src
        │    ├── pages
        │    ├── api
        │    ├── context
        │    └── App.js

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/Areya911/engagementTracking.git
cd Engagement-Tracking-System

2️⃣ Backend Setup
cd server
npm install


Create .env file:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/engagementDB
JWT_SECRET=supersecretkey


Run server:

npm run dev

3️⃣ Frontend Setup

Open new terminal:

cd client
npm install
npm start


App runs at:

http://localhost:3000

🧪 API Endpoints (Sample)
Method	Route	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
GET	/api/activities	Get all activities
POST	/api/activities	Create activity (Admin)
POST	/api/engagements/register/:id	User registers
GET	/api/dashboard	Admin dashboard stats

🔐 Roles
Admin: Manages activities, views reports, updates engagement
User: Registers and participates in activities

📊 Future Enhancements
CSV export of reports
Chart visualizations
Notifications
Automated attendance tracking

👩‍💻 Author
Areya K S
B.E Computer Science
MERN Stack Developer
