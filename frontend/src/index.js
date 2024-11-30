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
import Calender from './Components/Calender/Calender';
import SocietyProfile from './pages/societyProfilePage';
import TesterSociety from './Components/Society/testersociety';
import AdminPage from './pages/adminpage';
const router = createBrowserRouter([
  {
    path: '/', 
    element: <App />, 
  },
  {
    path: '/add',
    element: <Add />,
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
    element: <UserProfile />,
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
    path: '/admin', // Explicit path for TesterSociety
    element: <AdminPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);
