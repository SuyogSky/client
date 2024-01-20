import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import "./Chat.scss"
const Chat = () => {
    const { userId } = useParams();
    
    return(
        <>
            {userId}
        </>
    )
}

export default Chat