import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import "./NavBar.scss";
import ip from '../ip/ip'
import { IoMdLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Axios from 'axios'
import { RxCrossCircled } from 'react-icons/rx'
import ChatIcon from '../../Assets/Images/chatbot.png'
const swal = require('sweetalert2')

const NavBar = ({ position, bg, clas }) => {
  const navigate = useNavigate();
  const currentUserString = sessionStorage.getItem('user');
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;


  const [navScroll, setNavScroll] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setNavScroll('scroll');
      } else {
        setNavScroll('');
      }
    };

    const fetchChat = async () => {
      try {
        const response = await Axios.post(
          `${ip()}/chatbot/fetch/`,
          {},
          {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
          }
        );
        console.log(response.data.data);
        setChat(response.data.data);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    // Initial fetch  
    fetchChat();

    // Set up interval for periodic fetch
    const intervalId = setInterval(fetchChat, 1000);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(intervalId);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Chat Bot
  const [chatdisplay, setChatDisplay] = useState(false);
  const [userinput, setuserInput] = useState('');
  const [chat, setChat] = useState([]);
  const messagesContainerRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to the bottom when chatdisplay becomes true
    if (chatdisplay) {
      scrollToBottom({ behavior: 'smooth' });
    }
  }, [chatdisplay]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('user_input', userinput);
      const response = await Axios.post(`${ip()}/chatbot/`, formData, {
        headers: {
          Authorization: `Token ${sessionStorage.getItem('token')}`
        },
      });

      if (response.data.success === 1) {
        swal.fire({
          title: "Added Successfully",
          icon: "success",
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        swal.fire({
          title: response.data.message,
          icon: "error",
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        });
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <div className={`navigation-bar ${navScroll} ${clas}`} style={{ position: position, backgroundColor: bg }}>
        <h1><span className="span1">Tech</span><span className="span2">4</span><span className="span3">Green</span></h1>
        <ul className="nav-menu">
          <li onClick={() => navigate('/')}>Home</li>
          <li className="drop-down">
            Waste Management
            <ul className="drop-items">
              <li onClick={() => navigate('/view-waste')}>Waste Products</li>
              <li onClick={() => navigate('/view-recycle')}>Recycled Products</li>
              <li onClick={() => navigate('/add-waste')}>Add Waste Products</li>
              <li onClick={() => navigate('/add-recycle')}>Add Recycled Products</li>
            </ul>
          </li>
          <li onClick={() => navigate('/posts')}>Posts</li>
          <li onClick={() => navigate('/events')}>Event Postings</li>
        </ul>

        <div className="profile"
          style={currentUser ? {
            backgroundImage: `url(${ip() + currentUser.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          } : null}
          onClick={() => {
            if (currentUser == null) {
              navigate('/login')
            }
          }}
        >
          {currentUser ? '' : <CgProfile className="icon" />}
          {currentUser ?
            <ul className="options">
              <li onClick={() => navigate('/profile')}><CgProfile />Profile</li>
              <li onClick={() => {
                sessionStorage.clear()
                window.location.href = '/login';
              }}><IoMdLogOut />Logout</li>
            </ul>
            :
            ''
          }
        </div>
      </div>

      <div className="chat" onClick={() => setChatDisplay(true)}>
        <img src={ChatIcon} alt="" height={"100px"} />
      </div>
      {chatdisplay && (
        <div className="chatbox" ref={messagesContainerRef}>
          <div className="chat-box-header">
            ChatBot
            <button className="close-button" onClick={() => setChatDisplay(false)}>
              <i className="material-icon"><RxCrossCircled /></i>
            </button>
          </div>
          <div className="chats-messages">
            {chat
              ? chat.map((item) => (
                <div className="product-card" key={item.id}>
                  <div className="question-div">
                    <p className="question">{item.question}</p>
                    <img src={ip() + currentUser.image} alt="" height={"30"} width={"20px"} />

                  </div>
                  <div className="answer-div">
                    <img src="" alt="" />
                    <p className="answer">{item.answer}</p>
                  </div>
                </div>
              ))
              : null}
          </div>
          <div className="chatform-div">
            <form onSubmit={handleSubmit} className="chat-form">
              <input type='text' placeholder='Search...' onChange={(e) => setuserInput(e.target.value)} />
              <input type="submit" value="send" className="chat-submit" id="chat-submit">
              </input>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default NavBar