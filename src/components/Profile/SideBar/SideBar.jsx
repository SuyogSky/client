import React from "react";
import ip from '../../ip/ip'
import { MdPostAdd } from "react-icons/md";
import { GiWaterBottle } from "react-icons/gi";
import { FaRecycle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReceivedList from "../../Chat/ReceivedList";

const SideBar = () => {
    const navigate = useNavigate()
    const currentUserString = sessionStorage.getItem('user');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

    return (
        <>
            <div className="user-info">
            <div className="profile-image"
                style={currentUser ? {
                    backgroundImage: `url(${ip() + currentUser.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                } : null}
            >
            </div>
            <div className="info-container">
                <p><span>Name:</span> {currentUser.full_name}</p>
                <p><span>Phone:</span> {currentUser.phone_number}</p>
                <p><span>Email:</span> {currentUser.email}</p>
            </div>
            <br />
            <p className="history">View History</p>
            <ul className="history-navigator">
                <li onClick={() => navigate('/my-posts')}><MdPostAdd />My Posts</li>
                <li><GiWaterBottle />Added Products</li>
                <li><FaRecycle />Purchases</li>
            </ul>
        </div>
        </>
    )
}
export default SideBar