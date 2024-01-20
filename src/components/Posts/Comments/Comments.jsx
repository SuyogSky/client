import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Axios from "axios";
import ip from "../../ip/ip";
import ReactPlayer from "react-player";
import './Comments.scss'

const swal = require('sweetalert2')

const Comments = () => {
    const { postId } = useParams();
    const navigate = useNavigate()
    const [comments, setComments] = useState();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const fetchPostDetails = async () => {
            Axios.get(`${ip()}/post/one/?id=${postId}`, {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }
            }).then((response) => {
                setComments(response.data.data);
                setLoading(false)
            }).then(() => {
            })
        };

        fetchComments();

    }, [postId]);

    return (
        <section className="comments-section">
            <div className="image">
                
            </div>
            <div className="comments-container">
                <div className="top">

                </div>
                <div className="content">

                </div>
                <div className="comments">
                    {comments
                        ? comments.map((comment) => {
                            const imgPath = ip() + comment.post.media
                            const dateString = comment.post.date;

                            const dateObject = new Date(dateString);
                            const formattedDate = dateObject.toISOString().slice(0, 19).replace("T", " ");

                            return (
                                <div className="previous-post">
                                    hasd
                                    {/* <div className="top">
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
                                    </div> */}
                                </div>
                            )
                        })
                        : null}
                </div>
            </div>
        </section>
    )
}

export default Comments