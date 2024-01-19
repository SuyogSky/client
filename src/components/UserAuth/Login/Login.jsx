import React, { useState } from "react";
import "./Login.scss"

import Axios from 'axios'
import ip from "../../ip/ip";
import { useNavigate } from "react-router-dom";
const swal = require('sweetalert2')


const Login = () => {
    const navigate = useNavigate()
    const win = window.sessionStorage;

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) =>{
        e.preventDefault();
        Axios.post(`${ip()}/user/login/`, {
            email: email,
            password: password
        }).then((response) =>{
            if(response.data.success === 1){
                swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                })
                win.setItem('token', response.data.token)
            }
            else{
                swal.fire({
                    title: response.data.message,
                    icon: "error",
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                })
            }
        })
    }

    return (
        <section className="register-section">
            <div className="banner-image">

            </div>
            <div className="register-form-container">
                <form class="form" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="input-fields">
                        <div class="form">
                            <p class="title">Login</p>
                            <p class="message">Signup now and get full access to our app. </p>
                            <label>
                                <input required class="input" type="email" placeholder="" onChange={e => setEmail(e.target.value)} />
                                <span>Email</span>
                            </label>

                            <label>
                                <input required class="input" type="password" placeholder="" onChange={e => setPassword(e.target.value)} />
                                <span>Password</span>
                            </label>
                            <button type="submit" class="submit">Submit</button>
                            <p class="signin">Donot have an Account ? <a onClick={() => navigate('/register')}>Sign Up</a> </p>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Login