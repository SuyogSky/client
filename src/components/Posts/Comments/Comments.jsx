import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Axios from "axios";
import ip from "../../ip/ip";
import ReactPlayer from "react-player";
import './Comments.scss'
import { RxCross2 } from "react-icons/rx";
import { IoSend } from "react-icons/io5";
const swal = require('sweetalert2')

const Comments = () => {
    const { postId } = useParams();
    const navigate = useNavigate()
    const [postDetail, setPostDetail] = useState();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const fetchPostDetails = async () => {
            Axios.get(`${ip()}/post/one/?id=${postId}`, {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }
            }).then((response) => {
                setPostDetail(response.data.data)
                setLoading(false)
            }).then(() => {
            })
        };

        fetchPostDetails();

    }, [postId]);

    const [commentContent, setCommentContent] = useState('')
    const sendComment = (e) => {
        e.preventDefault();
        setLoading(true)
        Axios.post(
            `${ip()}/post/comment/`,
            {
                post: postId,
                text: commentContent
            },
            {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`,
                },
            }
        )
            .then((response) => {
                if (response.data.success == 1) {
                    swal.fire({
                        title: "Comment Posted",
                        icon: "success",
                        toast: true,
                        timer: 6000,
                        position: 'top-right',
                        timerProgressBar: true,
                        showConfirmButton: false,
                    })
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
                setCommentContent('')
            })
            .catch((error) => {
                console.error('Error claiming item:', error);
            });
    };

    return (
        <section className="comments-section">
            <div className="image">
                {postDetail ? <ReactPlayer url={ip() + postDetail.post.media} controls={true} className="media-player" /> : ''}
            </div>
            <div className="comments-container">
                <div className="top">
                    <RxCross2 onClick={() => navigate('/posts')}/>
                </div>
                <div className="content">
                    {postDetail ?
                        <>
                            <div className="user-info">
                                <div className="profile-image"
                                    style={postDetail ? {
                                        backgroundImage: `url(${ip() + postDetail.post.user.image})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                    } : null}
                                >
                                </div>
                                <div className="info">
                                    <h5>{postDetail.post.user.full_name}</h5>
                                    <p>{new Date(postDetail.post.date).toISOString().slice(0, 19).replace("T", " ")}</p>
                                </div>
                            </div>
                            <div className="post-content">
                                {postDetail.post.content}
                            </div>
                        </>
                        :
                        ''
                    }
                </div>
                <div className="comments custom-scrollbar">
                    {postDetail
                        ? postDetail.comments.map((comment) => {
                            return (
                                <div className="comment-card">
                                    <div className="commentor-image"
                                        style={comment ? {
                                            backgroundImage: `url(${ip() + comment.user.image})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                        } : null}
                                    >
                                    </div>
                                    <div className="comment-content">
                                        <h6>{comment.user.full_name}</h6>
                                        <p>{comment.text}</p>
                                    </div>
                                </div>
                            )
                        })
                        : null}
                    <div className="form">
                        <form action="" onSubmit={(e) => sendComment(e)}>
                            <input type="text" placeholder="Enter Comment..." value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />

                            {loading ?
                                <div class="loader">
                                    <li class="ball"></li>
                                    <li class="ball"></li>
                                    <li class="ball"></li>
                                </div>
                                : <button type="submit"><IoSend /></button>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Comments