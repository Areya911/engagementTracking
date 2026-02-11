# Engagement Tracking System

## Project Overview

The Engagement Tracking System is a web-based application designed to help organizations monitor and manage interactions with users/clients. It allows admins to record activities, track engagement history, manage contacts, and generate insights from stored interaction data.

##  Features

* Admin dashboard with engagement statistics
* Add, edit, and delete activities
* Contact management system
* Engagement history tracking
* Search and filter by date, type, or contact
* Secure authentication (login/logout)

##  Tech Stack

Frontend: React.js
Backend: Node.js + Express.js
Database: MongoDB
Version Control: Git + GitHub

##  Project Structure

client/ → Frontend React application
server/ → Backend Express API
models/ → Database schemas
routes/ → API endpoints
controllers/ → Business logic
.env → Environment variables

##  Installation & Setup

### 1. Clone the repository

git clone https://github.com/your-username/engagement-tracking-system.git

### 2. Navigate into the project folder

cd engagement-tracking-system

### 3. Install backend dependencies

cd server
npm install

### 4. Install frontend dependencies

cd ../client
npm install

### 5. Setup environment variables

Create a .env file inside the server folder and add:
MONGO_URI=your_database_connection
PORT=5000

### 6. Run the application

Backend:
cd server
npm start

Frontend:
cd client
npm start

The app will run at:
http://localhost:3000

## 🗄️ Database Design

Main entities:

* Users (Admin login details)
* Contacts
* Activities
* Engagements

Relationships:

* One user can create many activities
* One contact can have multiple engagements
* Each activity is linked to a contact

##  UI/UX Design

Wireframes created using Figma for:

* Admin Dashboard
* Activity Log
* Contact Details
* Add New Activity Form

##  Git Workflow

* main → Stable production code
* develop → Active development
* feature/* → Individual feature branches


## 👨‍💻 Author

Areya K S
3rd Year Computer Science Student
