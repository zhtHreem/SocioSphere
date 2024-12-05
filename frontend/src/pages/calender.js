import React from 'react';
import Calender from '../Components/Calender/Calender';
import { Navbar,Footer } from '../Components/Home/layout';
const addSocietyInfo = () => {
    return(
        <>
            <Navbar/>
              <Calender/>
              <Footer/>
        </>      
    )
}

export default addSocietyInfo ;