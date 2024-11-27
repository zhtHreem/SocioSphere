import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider ,createBrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import { UserProfile } from './pages/userprofile';
import { SocietyForm } from './pages/createapplyformpage';
import { Positions } from './pages/positions';
import { SocietyApply } from './pages/societyapplyform';
const router = createBrowserRouter([
 
  {
    path:"/",
    element:<App/>
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
  }
 
 



])





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
   
    <RouterProvider router={router}/>
 
  
);
