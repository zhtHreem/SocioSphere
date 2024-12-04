import React from 'react';
import AddSociety from '../Components/SocietyData/addSociety';
import { Navbar,Footer } from '../Components/Home/layout';
const addSocietyInfo = () => {
    return(
        <>
            <Navbar/>
              <AddSociety/>
              <Footer/>
        </>      
    )
}

export default addSocietyInfo ;