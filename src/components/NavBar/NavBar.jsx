import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./NavBar.scss";
import ip from '../ip/ip'
import { IoMdLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

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

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`navigation-bar ${navScroll} ${clas}`} style={{ position: position, backgroundColor: bg }}>
      <h1><span className="span1">Tech</span><span className="span2">4</span><span className="span3">Green</span></h1>
      <ul className="nav-menu">
        <li onClick={() => navigate('/')}>Home</li>
        <li className="drop-down">
          Waste Management
          <ul className="drop-items">
            <li onClick={() => navigate('/view-waste')}>Waste Products</li>
            <li onClick={() => navigate('/view-map')}>Map</li>

            <li onClick={() => navigate('/view-recycle')}>Recycled Products</li>
            <li onClick={() => navigate('/add-waste')}>Add Waste Products</li>
            <li onClick={() => navigate('/add-recycle')}>Add Recycled Products</li>
          </ul>
        </li>
        <li onClick={() => navigate('/posts')}>Posts</li>
        <li onClick={()=> navigate('/get-journal')}>Journals </li>
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
        {currentUser?'':<CgProfile className="icon" />}
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
  )
}

export default NavBar