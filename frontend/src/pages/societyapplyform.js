import React from "react";
import ApplyForm from "../Components/Society/applyform";
import { Navbar,Footer } from "../Components/Home/layout";



export function SocietyApply(){
    return (
        <>
            <Navbar/>
            <ApplyForm />
            <Footer/>
        </>
    )
}