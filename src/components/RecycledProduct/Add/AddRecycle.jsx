import React, { useState, useEffect } from "react";
import NavBar from "../../NavBar/NavBar";

import './AddRecycle.scss'
import Axios from 'axios'
import ip from "../../ip/ip";
const swal = require('sweetalert2')

const AddRecycle = () => {
    const win = window.sessionStorage;

    const [file, setFile] = useState(null);
    const [path, setPath] = useState(null);

    const handleFile = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]))
        setPath(e.target.files[0])
    }

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('image', path);
            const response = await Axios.post(`${ip()}/products/recycledProducts/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                },
            });

            if (response.data.success == 1) {
                swal.fire({
                    title: "Added Successfully",
                    icon: "success",
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                })
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
                console.log(response.data.message)
            }

            // Handle the response
        } catch (error) {
            console.error(error);
            // Handle errors
        }
    };

    return(
        <>
            <NavBar clas='dark' />
            <section className="add-waste-section">
                <form action="" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="left">
                        <div className="name field">
                            <label htmlFor="product-name">Product Name<span>*</span></label>
                            <input type="text" id="product-name" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="description field">
                            <label htmlFor="product-description">Product Description<span>*</span></label>
                            <textarea type="text" id="product-description" placeholder="Description" onChange={e => setDescription(e.target.value)}></textarea>
                        </div>
                        <button type="submit">Submit</button>
                    </div>
                    <div className="right">
                        <div className="image field">
                            <label className="img-lbl" htmlFor="product-image">Product Image<span>*</span></label>
                            <label
                                htmlFor="item-image"
                                className="label"
                                style={file ? {
                                    backgroundImage: `url(${file})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                } : null}
                            ></label>
                            <input type="file" id="product-image" onChange={(e) => handleFile(e)} />
                        </div>
                    </div>
                </form>
            </section>
        </>
    )
}

export default AddRecycle