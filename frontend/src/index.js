import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { UserProfile } from './pages/userprofile';
import { SocietyForm } from './pages/createapplyformpage';
import { Positions } from './pages/positions';
import { SocietyApply } from './pages/societyapplyform';
import AddSocietyInfo from './pages/addSocietyInfo';
import Society from './pages/societycataloguePage';
import Authorization from './pages/authorization';
import Calender from './pages/calender';
import SocietyProfile from './pages/societyProfilePage';
import AdminPage from './pages/adminpage';
import PrivateRoute from './Components/Authorization/privateRoute';
import AboutPage from './Components/Home/about';
import Contact from './pages/contactpage';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/add',
    element: <AddSocietyInfo  />,
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
    path: '/about', 
    element: <AboutPage />, 
  },{
    path: '/contact', 
    element: <Contact />,
  }
  
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <RouterProvider router={router} />
);
