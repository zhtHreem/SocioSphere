import React from 'react';
import SocietyProfile from '../Components/SocietyData/SocietyProfile';
import { Navbar,Footer } from '../Components/Home/layout';
const SocietyProfilePage = () => {
    return(
        <>
            <Navbar/>
              <SocietyProfile/>
              <Footer/>
        </>      
    )
}

export default SocietyProfilePage ;