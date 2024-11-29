import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { UserProfile } from './pages/userprofile';
import { SocietyForm } from './pages/createapplyformpage';
import { Positions } from './pages/positions';
import { SocietyApply } from './pages/societyapplyform';
<<<<<<< HEAD
import Add from './Components/addSociety';
import Society from './Components/SocietyPage';
import Authorization from './pages/authorization';

// Import the new testerSociety component
import TesterSociety from './Components/Society/testersociety';

=======
import Add from './Components/SocietyData/addSociety';
import Society from './pages/societycataloguePage'
import Authorization from './pages/authorization';
import SocietyProfile from './pages/societyProfilePage';
import AdminPage from './pages/adminpage';
>>>>>>> b34bc7db10e627c44c073680600d4f6feb1f2643
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
<<<<<<< HEAD
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
=======
    path:"/society/:societyId/create/:id",
    element:<SocietyForm />
  },
  {
    path:"/society/:societyId/apply/:id",
    element:<SocietyApply/>
  },
  {
     path:"/society/:societyId/position/:id",
     element:<Positions/>
>>>>>>> b34bc7db10e627c44c073680600d4f6feb1f2643
  },
  {
<<<<<<< HEAD
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
    path: '/tester-society', // Explicit path for TesterSociety
    element: <TesterSociety />,
  },
]);
=======
     path:"/auth",
     element:<Authorization/>
  },{
    path: '/society/:id',
    element: <SocietyProfile />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
 
 



])




>>>>>>> b34bc7db10e627c44c073680600d4f6feb1f2643

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);
