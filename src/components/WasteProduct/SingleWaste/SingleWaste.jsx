import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ip from '../../ip/ip'
import NavBar from '../../NavBar/NavBar';
import "./SingleWaste.scss"
import Loading from '../../Loading/Loading'

const swal = require('sweetalert2')
const SingleWaste = () => {
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const { itemId } = useParams();

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const fetchProductDetails = async () => {
      Axios.get(`${ip()}/products/wasteProducts/?id=${itemId}`, {
        headers: {
          Authorization: `Token ${sessionStorage.getItem('token')}`
        }
      }).then((response) => {
        setProductDetails(response.data.data.product);
        setUserDetails(response.data.data.user)
        setLoading(false)
      }).then(() => {
      })
    };

    fetchProductDetails();
  }, [itemId]);

  const claimItem = (id) => {
    setLoading(true)
    Axios.post(
      `${ip()}/purchase/waste/`,
      {
        waste_product: id,
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
            title: "Item Claimed Successfully",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
          })
          navigate('/view-waste')
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
      })
      .catch((error) => {
        console.error('Error claiming item:', error);
      });
  };


  if (!loading) {
    return (
      <>
        <NavBar color='white' clas='dark' />
        <section className="waste-details-section">
          <div className="detail-container">
            <div className="image">
              <img src={ip() + productDetails.image} alt="" />
            </div>
            <div className="product-info">
              <h2>Product Details</h2>
              <div className="info">
                <h3>{productDetails.name}</h3>
                <p>{productDetails.description}</p>
              </div>
              <br /><br />
              <h2 className='seller'>Seller Details</h2>
              <div className="info info2">
                <div className="image">
                  <img src={ip() + userDetails.image} alt="" />
                </div>
                <div className="user-info">
                  <h3>{userDetails.full_name}</h3>
                  <p>{userDetails.phone_number}</p>
                </div>
              </div>
              <div className="buttons">
                <button onClick={() => claimItem(itemId)}>Claim</button>
                <button onClick={() => navigate(`/chat/${userDetails.id}`)}>Chat</button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
  else {
    return (
      <Loading />
    )
  }
};

export default SingleWaste;
