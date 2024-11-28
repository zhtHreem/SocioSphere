import React from "react";
import User from "../Components/User/profile";
import { Navbar,Footer } from "../Components/Home/layout";



export function UserProfile(){
    return (
        <>
            <Navbar/>
            <User />
            <Footer/>
        </>
    )
}