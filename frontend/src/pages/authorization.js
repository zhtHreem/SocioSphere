import React from 'react';
import AuthPage from '../Components/Authorization/auth';
import { Navbar,Footer } from '../Components/Home/layout';
const Authorization = () => {
    return(
        <>
            <Navbar/>
              <AuthPage/>
              <Footer/>
        </>      
    )
}

export default Authorization;