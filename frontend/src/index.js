import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider ,createBrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import { UserProfile } from './pages/userprofile';
import { SocietyForm } from './pages/createapplyformpage';
import { Positions } from './pages/positions';
import { SocietyApply } from './pages/societyapplyform';
import Add from './Components/addSociety';
import Society from './Components/SocietyPage'
import Authorization from './pages/authorization';
import SocietyProfile from './Components/SocietyProfile';
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
    path:"/create",
    element:<SocietyForm />
  },
  {
    path:"/apply",
    element:<SocietyApply/>
  },
  {
     path:"/position",
     element:<Positions/>
  },
  
  {
     path:"/auth",
     element:<Authorization/>
  },{
    path: '/society/:id',
    element: <SocietyProfile />,
  },
 
 



])





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
   
    <RouterProvider router={router}/>
 
  
);
