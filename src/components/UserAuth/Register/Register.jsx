import React, { useState } from "react";
import "./Register.scss"
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import ip from "../../ip/ip";
const swal = require('sweetalert2')

const Register = () => {
    const navigate = useNavigate()

    const [file, setFile] = useState(null);
    const [path, setPath] = useState(null);

    const handleFile = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]))
        setPath(e.target.files[0])
    }

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('user')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('full_name', fullName);
            formData.append('email', email);
            formData.append('phone_number', phone);
            formData.append('user_type', role);
            formData.append('password', password);
            formData.append('image', path);
            const response = await Axios.post(`${ip()}/user/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data)

            if (response.data.success == 1) {
                swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                })
                navigate('/login')
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

            // Handle the response
        } catch (error) {
            console.error(error);
            // Handle errors
        }
    };

    return (
        <section className="register-section">
            <div className="banner-image">

            </div>
            <div className="register-form-container">
                <form class="form" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="image">
                        <label
                            htmlFor="item-image"
                            className="label"
                            style={file ? {
                                backgroundImage: `url(${file})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                            } : null}
                        >
                            <div className="img-upload-section">
                                <div className="text">Upload Image</div>
                            </div>
                        </label>

                        <input required type="file" id="item-image" name="item_image" onChange={(e) => {
                            handleFile(e)
                        }} />

                        <select name="" id="" onChange={(e) => setRole(e.target.value)}>
                            <option value="user">Regular User</option>
                            <option value="recycler">Recycler</option>
                        </select>
                    </div>

                    <div className="input-fields">
                        <div class="form">
                            <p class="title">Register </p>
                            <p class="message">Signup now and get full access to our app. </p>
                            <label>
                                <input required class="input" type="text" placeholder="" onChange={e => setFullName(e.target.value)} />
                                <span>Full Name</span>
                            </label>

                            <label>
                                <input required class="input" type="email" placeholder="" onChange={e => setEmail(e.target.value)} />
                                <span>Email</span>
                            </label>

                            <label>
                                <input required class="input" type="number" placeholder="" onChange={e => setPhone(e.target.value)} />
                                <span>Phone Number</span>
                            </label>

                            <label>
                                <input required class="input" type="password" placeholder="" onChange={e => setPassword(e.target.value)} />
                                <span>Password</span>
                            </label>
                            <label>
                                <input required class="input" type="password" placeholder="" onChange={e => setPassword2(e.target.value)} />
                                <span>Confirm password</span>
                            </label>
                            <button type="submit" class="submit">Submit</button>
                            <p class="signin">Already have an acount ? <a onClick={() => navigate('/login')}>Signin</a> </p>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Register