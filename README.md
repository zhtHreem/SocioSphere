# SocioSphere: Bringing University Student Societies on One Platform

## Project Overview
**SocioSphere** is a MERN-stack-based web application that connects university student societies on a unified platform. It empowers students to explore societies, and positions, and collaborate seamlessly while providing society administrators with tools to manage memberships, events, and feedback effectively.


---

## Features  
- **Society Management**: Admins can create societies, define hierarchical positions, and organize events.
- **JWT Authentication**: Secure authentication with role-based access control ensures that only authorized users can perform specific actions.
- **Unique Event Calendar**: A centralized calendar with upcoming events.
- **Real-Time Chatrooms**:   Society-dedicated spaces for discussions and collaborations.
- **Membership Application Tracker**:   Users can submit applications, which are processed by higher-level members in the hierarchy.
- **Search Functionality**:  Easy-to-use search for societies and events.
- **User Notifications**:  Alerts for important updates and changes.

## How to Use  

- **Register/Log In**:  Register or log in as a university student or society administrator.  
- **Explore**:  Browse societies, events, and positions based on your interests.
- **Engage**: Join societies, track membership applications, and access event details
- **Collaborate**: Use real-time chat for discussions .

---
## Installation & Setup

### Prerequisites:
- Node.js and npm installed on your system.
- MongoDB server running locally or on a cloud platform.

### Steps:
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/zhtHreem/SocioSphere.git
   cd SocioSphere
   ```
2.Navigate to **Backend** directory: 
   ```bash
     cd backend
   ```
3.Create a .env file in the backend folder and add the following environment variables:
   ```bash
     JWT_TOKEN=<your_secret_jwt_token>
     MONGO_URI =<your_mongo_database_url>
   ```
4.Install backend dependencies:
   ```bash
     npm install
   ```
4.Start the **backend** server:
   ```bash
     nodemon server.js

   ```

5.To run **Frontend** open new terminal
   ```bash
     cd frontend
     npm install
     npm start
   ```

   

## Tech Stack    

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT


