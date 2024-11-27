import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider ,createBrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import Add from './Components/addSociety';
import Society from './Components/SocietyPage'

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
 
 



])





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   
    <RouterProvider router={router}/>
 
  </React.StrictMode>
);
