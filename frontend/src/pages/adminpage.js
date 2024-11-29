import React from 'react';
import Admin from '../Components/User/admin';
import { Navbar,Footer } from '../Components/Home/layout';
const AdminPage = () => {
    return(
        <>
            <Navbar/>
              <Admin/>
              <Footer/>
        </>      
    )
}

export default AdminPage ;