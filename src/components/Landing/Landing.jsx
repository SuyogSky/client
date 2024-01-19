import React from "react";
import NavBar from "../NavBar/NavBar";

import "./Landing.scss"
const Landing = () => {
    return (
        <>
            <NavBar position='fixed' />
            <section className="landing-section">
                <p>Building a Greener</p>
                <h1>Tech Community.</h1>
            </section>

            <section className="about">
                
            </section>
        </>
    )
}

export default Landing