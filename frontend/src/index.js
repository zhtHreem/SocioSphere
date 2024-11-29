import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider ,createBrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import { UserProfile } from './pages/userprofile';
import { SocietyForm } from './pages/createapplyformpage';
import { Positions } from './pages/positions';
import { SocietyApply } from './pages/societyapplyform';
import Add from './Components/SocietyData/addSociety';
import Society from './pages/societycataloguePage'
import Authorization from './pages/authorization';
import SocietyProfile from './pages/societyProfilePage';
const router = createBrowserRouter([
 
  {
    path:"/",
    element:<App/>
  },{
    path:"/add",
    element:<Add/>
  },{
    path:"/society",
    element:<Society/>
  },
  {
    path:"/user",
    element:<UserProfile/>
  },
  {
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
  },
  
  {
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





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
   
    <RouterProvider router={router}/>
 
  
);
