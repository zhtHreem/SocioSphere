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
// Import the new testerSociety component
import TesterSociety from './Components/Society/testersociety';

const router = createBrowserRouter([
  {
    path: '/', // Default route
    element: <TesterSociety />, // Set TesterSociety as the landing page
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
    path: '/user',
    element: <UserProfile />,
  },
  {
    path: '/create',
    element: <SocietyForm />,
  },
  {
    path: '/apply',
    element: <SocietyApply />,
  },
  {
    path: '/position',
    element: <Positions />,
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
    path: '/tester-society', // Explicit path for TesterSociety
    element: <TesterSociety />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);
