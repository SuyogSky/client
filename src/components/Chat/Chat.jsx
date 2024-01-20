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
import { IoSend } from "react-icons/io5";

const swal = require('sweetalert2')
const Chat = () => {
    const currentUserString = sessionStorage.getItem('user');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    const navigate = useNavigate()
    const [chatdisplay, setChatDisplay] = useState(false);
    const [userinput, setuserInput] = useState('');
    const [chat, setChat] = useState([]);
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
                    title: "Sent Successfully",
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


        const fetchChat = async () => {
            try {
                const response = await Axios.get(
                    `${ip()}/chats/user/?id=` + userId,
                    {
                        headers: {
                            Authorization: `Token ${sessionStorage.getItem('token')}`
                        }
                    }
                );
                console.log(response.data.data.chat);
                setChat(response.data.data.chat);
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        };

        // Initial fetch  
        fetchChat();

        // Set up interval for periodic fetch
        const intervalId = setInterval(fetchChat, 1000);




        // Cleanup the event listener on component unmount

    }, []);



    const { userId } = useParams();
    
    return(
        <>
            <div className="messagebox">
                <div className="chat-box-header">
                    <h4>Chat</h4>
                    <button className="close-button" onClick={() => navigate('/view-waste')}>
                        <RxCrossCircled />
                    </button>
                </div>
                <div className="message_">
                    {chat
                        ? chat.map((item) => (
                            (item.id == currentUser.id) ?

                                <div className='sender' key={item.id}>
                                    {currentUser.full_name} : <span>{item.message}</span>
                                </div>
                                :
                                <div className='receiver' key={item.id}>
                                    <span>{item.message}</span> : {item.reciever.full_name}
                                </div>
                        ))
                        : null}
                </div>
                <div className="chatform-div">
                    <form onSubmit={handleSubmit} className="chat-form">
                        <input type='text' placeholder='Search...' onChange={(e) => setuserInput(e.target.value)} />
                        <button type="submit" value="send" className="chat-submit" id="chat-submit"><IoSend /></button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Chat