import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { UserProfile } from './pages/userprofile';
import { SocietyForm } from './pages/createapplyformpage';
import { Positions } from './pages/positions';
import { SocietyApply } from './pages/societyapplyform';
import Add from './pages/addSocietyInfo';
import Society from './pages/societycataloguePage';
import Authorization from './pages/authorization';
import Calender from './pages/calender';
import SocietyProfile from './pages/societyProfilePage';
import TesterSociety from './Components/Society/testersociety';
import AdminPage from './pages/adminpage';
import PrivateRoute from './Components/Authorization/privateRoute';
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
 
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <RouterProvider router={router} />
);
