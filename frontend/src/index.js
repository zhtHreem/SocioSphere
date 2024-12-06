import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { UserProfile } from './pages/userprofile';
import { SocietyForm } from './pages/createapplyformpage';
import { Positions } from './pages/positions';
import { SocietyApply } from './pages/societyapplyform';
import AddSocietyData from './Components/SocietyData/addSociety';
import AddSocietyInfo from './pages/addSocietyInfo';
import Society from './pages/societycataloguePage';
import Authorization from './pages/authorization';
import Calender from './pages/calender';
import SocietyProfile from './pages/societyProfilePage';
import AdminPage from './pages/adminpage';
import Chat from './Components/Chat/chat'; // Import the Chat component
//import Notification from './Components/Notification/Notification';
import PrivateRoute from './Components/Authorization/privateRoute';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/add',
    element: <AddSocietyData />,
  },
  {
    path: '/society',
    element: <Society />,
  },
  {
    path: '/society/:id',
    element: <SocietyProfile />,
  },
  {
    path: '/user',
    element: <PrivateRoute allowedRoles={['user']}>
               <UserProfile/>
                </PrivateRoute>,
  },{
    path:"/society/:societyId/create/:id",
    element:<SocietyForm />
  },
  {
    path:"/society/:societyId/apply/:id",
    element: <SocietyApply/>
  },
  {
     path:"/society/:societyId/position/:id",
     element: <Positions/>
  },
  {
    path: '/auth',
    element: <Authorization />,
  },
  {
    path: '/c',
    element: <Calender />,
  },
  {
    
    path: '/admin', 
    element: ( <PrivateRoute allowedRoles={[ 'admin']}>
               <AdminPage/>
                </PrivateRoute>),
              
  },
  {
    path: '/chat', // Optional dedicated route for Chat
    element: <Chat />, // Render the Chat component
  },
  //{
    //path: '/notifications', // Route for NotificationsPage
    //element: <Notifications />, // Render the NotificationsPage component
 // },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <RouterProvider router={router} />
);
