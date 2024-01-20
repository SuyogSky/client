import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./Posts.scss"
import ip from "../ip/ip";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { RxCross2 } from "react-icons/rx";
import Loading from '../Loading/Loading'
import { FaRegCommentDots } from "react-icons/fa6";


const swal = require('sweetalert2')
const Posts = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([]);

  const currentUserString = sessionStorage.getItem('user');
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const fetchPosts = () => {
      Axios.get(`${ip()}/post/`, {
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

  const [content, setContent] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
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
          title: "Post Added",
          icon: "success",
          toast: true,
          timer: 4000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        })
        navigate('/posts')
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
        <section className="posts-section">
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
                    <p className="texts">{post.content}</p>
                    <div className="image">
                      <ReactPlayer url={imgPath} controls={true} className="media-player" />
                    </div>
                  </div>
                  <div className="options">
                    <p onClick={() => navigate(`/comments/${post.id}`)}><FaRegCommentDots /> Comments</p>
                  </div>
                </div>
              )
            })
            : null}
        </section>
        <section className={`add-form-container ${showAddPost ? 'active' : ''}`}>
          <RxCross2 className="cross" onClick={() => toggleAddPost()} />
          <form action="" onSubmit={handleSubmit}>
            <h4>Enter Post Details</h4>
            <input type="text" placeholder="Enter Post Content" onChange={(e) => setContent(e.target.value)} />
            <label htmlFor="image">Upload Media</label>
            <input type="file" onChange={handleFile} />
            <button type="submit">submit</button>
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

export default Posts