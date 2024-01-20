import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./EventDetails.scss"
import ip from "../ip/ip";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { RxCross2 } from "react-icons/rx";

import { FaRegCommentDots } from "react-icons/fa6";
import { FaPencil } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import Loading from "../Loading/Loading";

const swal = require('sweetalert2')
const EventDetails = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([]);

  const currentUserString = sessionStorage.getItem('user');
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const fetchPosts = () => {
      Axios.get(`${ip()}/events/`, {
        headers: {
          Authorization: `Token ${sessionStorage.getItem('token')}`
        }
      }).then((response) => {
        setPosts(response.data.data);
      }).then(() => {
        setLoading(false)
      })
    }
    fetchPosts();
  }, []);

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

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('type', title);
      formData.append('location', location);
      formData.append('date_of_event', date);
      formData.append('description', description);
      formData.append('image', path);
      const response = await Axios.post(`${ip()}/events/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${sessionStorage.getItem('token')}`
        },
      });

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
      setLoading(false)

      // Handle the response
    } catch (error) {
      console.error(error);
      // Handle errors
    }
  };

  if(!loading){
    return (
      <>
        <NavBar clas='dark' />
        <section className="events-section">
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
            <div className="input" onClick={() => toggleAddPost()}>Post an Event details.</div>
          </div>
          {posts
            ? posts.map((post) => {
              const imgPath = ip() + post.image
              const dateString = post.date;
  
              const dateObject = new Date(dateString);
              const formattedDate = dateObject.toISOString().slice(0, 19).replace("T", " ");
              return (
                <div className="previous-post">
                  <div className="top">
                    <div className="profile-image"
                      style={post.user ? {
                        backgroundImage: `url(${ip() + post.user.image})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                      } : null}
                    >
                    </div>
                    <div className="info">
                      <h3>{post.user.full_name}</h3>
                      <p>{formattedDate}</p>
                    </div>
                  </div>
                  <div className="content">
                    <p className="title">{post.type}</p>
                    <p className="location"><IoLocationOutline />{post.location}</p>
                    <p className="texts"><FaRegCalendarAlt />{post.date_of_event}</p>
                    <p className="desc">{post.description}</p>
                    <div className="image">
                      <img src={imgPath} alt="" />
                    </div>
                  </div>
                  <div className="options">
                    <p><FaRegCommentDots /> Comments</p>
                  </div>
                </div>
              )
            })
            : null}
        </section>
        <section className={`add-form-container ${showAddPost ? 'active' : ''}`}>
          <RxCross2 className="cross" onClick={() => toggleAddPost()} />
          <form className="event-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" placeholder="Enter a Title here" value={title} onChange={(e) => setTitle(e.target.value)} />
  
        <label>Location</label>
        <input type="text" placeholder="Enter event location" value={location} onChange={(e) => setLocation(e.target.value)} />
  
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
  
        <label>File</label>
        <input type="file" onChange={handleFile} />
  
        <label>Description</label>
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
  
        <button type="submit">Submit</button>
      </form>
        </section>
      </>
    )
  }
  else{
    return(
      <Loading />
    )
  }
}

export default EventDetails