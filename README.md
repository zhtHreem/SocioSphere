**SocioSphere:** Bringing University Student Societies on One Platform
SocioSphere is a MERN-stack-based web application that connects university student societies on a unified platform. It empowers students to explore societies, and positions, and collaborate seamlessly while providing society administrators with tools to manage memberships, events, and feedback effectively.

**Features**
**1. Unified Event Calendar:**
A centralized calendar with upcoming events.
**2. Real-Time Chatrooms:**
Society-dedicated spaces for discussions and collaborations.
**3. Membership Application Tracker:**
End-to-end tracking for society applications.
**4. Personal Dashboard:**
Showcases memberships and society details.
**5. Search Functionality:**
Easy-to-use search for societies, events, and fellow students.
**User Notifications:**
Alerts for important updates and changes.

**How to Use**
**1. Register/Login:**
Register or log in as a university student or society administrator.
**2. Explore:**
Browse societies, events, and positions based on your interests.
**3. Engage:**
Join societies, track membership applications, and access event details.
**4. Collaborate:**
Use real-time chat for discussions and manage profiles via a personal dashboard.

**Installation and Setup**
**Prerequisites**
Ensure Node.js and npm are installed.
MongoDB server running locally or on a cloud platform.

**Steps:**
1. Clone the Repository:
git clone _https://github.com/Afifam042/SocioSphere.git_
cd SocioSphere

2. Backend Setup: Navigate to the backend directory and install dependencies:
cd backend
npm install
Create a .env file and add the following:
makefile
_JWT_TOKEN=<your_secret_jwt_token>_
Start the backend server:
node index.js

3. Frontend Setup: Navigate to the frontend directory and install dependencies:
cd ../frontend
npm install
Start the development server:
npm start

**Tech Stack**
Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT
