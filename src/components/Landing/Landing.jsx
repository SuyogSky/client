import React from "react";
import NavBar from "../NavBar/NavBar";
import Nature from '../../Assets/Images/nature.svg'
import "./Landing.scss"
const Landing = () => {
    return (
        <>
            <NavBar position='fixed'/>
            <section className="landing-section">
                <p>Building a Greener</p>
                <h1>Tech Community.</h1>
                <img src={Nature} alt="" className="trash" />
            </section>

            <section className="about">
                
            </section>
        </>
    )
}

export default Landing