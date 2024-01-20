import React from "react";
import NavBar from "../NavBar/NavBar";
import Trash from '../../Assets/Images/trash.png'
import "./Landing.scss"
const Landing = () => {
    return (
        <>
            <NavBar clas='dark' position='fixed' />
            <section className="landing-section">
                <p>Building a Greener</p>
                <h1>Tech Community.</h1>
                <img src={Trash} alt="" className="trash" />
            </section>

            <section className="about">
                
            </section>
        </>
    )
}

export default Landing