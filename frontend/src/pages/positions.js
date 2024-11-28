import React from "react";
import SocietyPositions from "../Components/Society/Positions";
import { Navbar,Footer } from "../Components/Home/layout";



export function Positions(){
    return (
        <>
            <Navbar/>
            <SocietyPositions />
            <Footer/>
        </>
    )
}