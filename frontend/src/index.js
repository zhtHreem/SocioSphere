import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider ,createBrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';



const router = createBrowserRouter([
 
  {
    path:"/",
    element:<App/>
  },
 
 



])





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   
    <RouterProvider router={router}/>
 
  </React.StrictMode>
);
