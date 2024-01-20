import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./Profile.scss"
import SideBar from "./SideBar/SideBar";
import { MdOutlinePermMedia } from "react-icons/md";
import ip from "../ip/ip";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { RxCross2 } from "react-icons/rx";
import ReactPlayer from 'react-player'
import { FaRegCommentDots } from "react-icons/fa6";

const swal = require('sweetalert2')
const Profile = () => {
    const navigate = useNavigate()
    const currentUserString = sessionStorage.getItem('user');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

    const [showAddPost, setShowAddPost] = useState(false)
    const toggleAddPost = () => {
        setShowAddPost(!showAddPost)
    }

    const [file, setFile] = useState(null);
    const [path, setPath] = useState(null);

    const handleFile = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]))
        setPath(e.target.files[0])
    }

    const [content, setContent] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('media', path);
            const response = await Axios.post(`${ip()}/post/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${sessionStorage.getItem('token')}`
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
            else {
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

    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchPosts = () => {
            Axios.get(`${ip()}/post/user/`, {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }
            }).then((response) => {
                setPosts(response.data.data);
            }).then(() => {

            })
        }
        fetchPosts();
    }, []);

    return (
        <>
            <NavBar clas='dark' />
            <section className="profile-section">
                <SideBar />
                <div className="post-container">
                    <div className="add-post-form">
                        <div className="profile-image"
                            style={currentUser ? {
                                backgroundImage: `url(${ip() + currentUser.image})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                            } : null}
                        >
                        </div>
                        <div className="input" onClick={() => toggleAddPost()}>Upload a Post.</div>
                    </div>
                    <br />
                    {posts
                        ? posts.map((post) => {
                            const imgPath = ip() + post.media
                            const dateString = post.date;

                            const dateObject = new Date(dateString);
                            const formattedDate = dateObject.toISOString().slice(0, 19).replace("T", " ");

                            console.log(imgPath)
                            return (
                                <div className="previous-post">
                                    <div className="top">
                                        <div className="profile-image"
                                            style={currentUser ? {
                                                backgroundImage: `url(${ip() + currentUser.image})`,
                                                backgroundPosition: 'center',
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                            } : null}
                                        >
                                        </div>
                                        <div className="info">
                                            <h3>{currentUser.full_name}</h3>
                                            <p>{formattedDate}</p>
                                        </div>
                                    </div>
                                    <div className="content">
                                        <p className="texts">{post.content}</p>
                                        <div className="image">
                                            <ReactPlayer url={imgPath} controls={true} className="media-player" />
                                        </div>
                                    </div>
                                    <div className="options">
                                            <p><FaRegCommentDots /> Comments</p>
                                    </div>
                                </div>
                            )
                        })
                        : null}

                </div>
            </section>
            <section className={`add-form-container ${showAddPost ? 'active' : ''}`}>
                <RxCross2 className="cross" onClick={() => toggleAddPost()} />
                <form action="" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Upload a Post" onChange={(e) => setContent(e.target.value)} />
                    <input type="file" onChange={handleFile} />
                    <button type="submit">submit</button>
                </form>
            </section>
        </>
    )
}

export default Profile