import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { UserProfile } from './pages/userprofile';
import { SocietyForm } from './pages/createapplyformpage';
import { Positions } from './pages/positions';
import { SocietyApply } from './pages/societyapplyform';
import Add from './Components/SocietyData/addSociety';
import Society from './pages/societycataloguePage';
import Authorization from './pages/authorization';
import SocietyProfile from './pages/societyProfilePage';
import AdminPage from './pages/adminpage';
import Chat from './Components/Chat/chat'; // Import the Chat component
import NotificationsPage from './Components/Notification/NotificationsPage'; // Import NotificationsPage

const router = createBrowserRouter([
  {
    path: '/add',
    element: <Add />,
  },
  {
    path: "/society/:societyId/create/:id",
    element: <SocietyForm />
  },
  {
    path: "/society/:societyId/apply/:id",
    element: <SocietyApply />
  },
  {
    path: "/society/:societyId/position/:id",
    element: <Positions />
  },
  {
    path: "/",
    element: <Authorization />
  },
  {
    path: '/society/:id',
    element: <SocietyProfile />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/chat', // Optional dedicated route for Chat
    element: <Chat />, // Render the Chat component
  },
  {
    path: '/notifications', // Route for NotificationsPage
    element: <NotificationsPage />, // Render the NotificationsPage component
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);
