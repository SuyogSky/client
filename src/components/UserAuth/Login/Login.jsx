import React, { useState } from "react";
import "./Login.scss"

import Axios from 'axios'
import ip from "../../ip/ip";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading/Loading";
const swal = require('sweetalert2')


const Login = () => {
    const navigate = useNavigate()
    const win = window.sessionStorage;

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        Axios.post(`${ip()}/user/login/`, {
            email: email,
            password: password
        }).then((response) => {
            if (response.data.success === 1) {
                setLoading(false)
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
                const userString = JSON.stringify(response.data.data);
                win.setItem('user', userString)
                navigate('/')
            }
            else {
                setLoading(false)
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

    if (!loading) {
        return (
            <section className="login-section">
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
    else {
        return (
            <Loading />
        )
    }
}

export default Login