import { useNavigate, useParams } from 'react-router-dom';
import "./Chat.scss"
import React, { useState, useEffect, useRef } from "react";
import "./Chat.scss";
import ip from '../ip/ip'
import { IoMdLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Axios from 'axios'
import { RxCrossCircled } from 'react-icons/rx'
import ChatIcon from '../../Assets/Images/chatbot.png'
const swal = require('sweetalert2')
const ReceivedList = () => {
      const currentUserString = sessionStorage.getItem('user');
      const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

      const [chatdisplay, setChatDisplay] = useState(false);
      const [userinput, setuserInput] = useState('');
      const [chat, setUserList] = useState([]);
      const messagesContainerRef = useRef(null);
      const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                  const formData = new FormData();
                  const response = await Axios.post(`${ip()}/chats/`, {
                        'message': userinput,
                        'reciever': userId,
                  }, {

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
                        console.log(response.data);
                  }
            } catch (error) {
                  console.error(error);
            }
      };


      useEffect(() => {


            const fetchUserList = async () => {
                  try {
                        const response = await Axios.get(
                              `${ip()}/chats/`,
                              {
                                    headers: {
                                          Authorization: `Token ${sessionStorage.getItem('token')}`
                                    }
                              }
                        );
                        console.log(response.data.data);
                        setUserList(response.data.data);
                  } catch (error) {
                        console.error("Error fetching chat:", error);
                  }
            };

            // Initial fetch  
            fetchUserList();

            // Set up interval for periodic fetch
            const intervalId = setInterval(fetchUserList, 10000);




            // Cleanup the event listener on component unmount

      }, []);



      const { userId } = useParams();

      return (
            <>

                  <div className="messagebox">
                        <div className="chat-box-header">
                              ChatBot
                              <button className="close-button" onClick={() => setChatDisplay(false)}>
                                    <i className="material-icon"><RxCrossCircled /></i>
                              </button>
                        </div>
                        <div className="message_">
                              {chat
                                    ? chat.map((item) => (
                                          <div>

                                                {item.id}
                                                <br></br>
                                          </div>

                                    ))
                                    : null}
                        </div>

                  </div>

            </>
      )
}

export default ReceivedList