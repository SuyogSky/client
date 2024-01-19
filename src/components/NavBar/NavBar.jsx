import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./NavBar.scss";
const NavBar = ( { position, bg, clas } ) => {
  const navigate = useNavigate();

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
    <div className={`navigation-bar ${navScroll} ${clas}`} style={{position: position, backgroundColor: bg}}>
      <h1><span className="span1">Tech</span><span className="span2">4</span><span className="span3">Green</span></h1>
      <ul className="nav-menu">
        <li onClick={() => navigate('/')}>Home</li>
        <li className="drop-down">
          Waste Management
          <ul className="drop-items">
            <li onClick={() => navigate('/view-waste')}>Waste Products</li>
            <li>Recycled Products</li>
            <li onClick={() => navigate('/add-waste')}>Add Waste Products</li>
            <li onClick={() => navigate('/add-recycle')}>Add Recycled Products</li>
          </ul>
        </li>
        <li>Forum</li>
        <li>Event Postings</li>
      </ul>
    </div>
  )
}

export default NavBar