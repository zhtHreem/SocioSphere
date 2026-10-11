import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Navigate, useParams } from 'react-router-dom';

import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/api';
import App from './App';
import { UserProfile } from './pages/userprofile';
import { SocietyForm } from './pages/createapplyformpage';
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
import Community from './pages/communityPage';
import Event from './pages/eventPage';
import TeamPage from './pages/teamPage';

// the old ranks screen now lives at /society/:id/team
const OldPositions = () => { const { societyId } = useParams(); return <Navigate to={`/society/${societyId}/team`} replace />; };
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
    path: '/society/:id/community',
    element: <Community />,
  },
  {
    path: '/society/:id/team',
    element: <TeamPage />,
  },
  {
    path: '/event/:id',
    element: <Event />,
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
     element: <OldPositions />
  },
  {
    path: '/auth',
    element: <Authorization />,
  },
  {
    path: '/events',
    element: <Calender />,
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
 
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ThemeProvider>
);
