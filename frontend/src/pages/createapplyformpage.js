import React from "react";
import FormBuilder from "../Components/Society/createapplyform";
import { Navbar,Footer } from "../Components/Home/layout";

export function SocietyForm(){
    return (
        <>
            <Navbar/>
            <FormBuilder />
            <Footer/>
        </>
    )
}