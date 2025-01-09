import React from 'react';
import ContactPage from '../Components/Home/contact';
import { Navbar,Footer } from '../Components/Home/layout';
const Contact = () => {
    return(
        <>
            <Navbar/>
              <ContactPage />
              <Footer/>
        </>      
    )
}

export default Contact