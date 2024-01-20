import React, { useState, useEffect } from "react";
import NavBar from "../../NavBar/NavBar";
import Axios from "axios"
import "./ViewRecycle.scss"
import ip from '../../ip/ip'
import { CgDetailsMore } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading/Loading";

const ViewRecycle = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([]);
    useEffect(() => {
        setLoading(true)
        const fetchProducts = () => {
            Axios.get(`${ip()}/products/recycledProductsAll/`, {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }
            }).then((response) => {
                setProducts(response.data.message);
                setLoading(false)
            }).then(() => {

            })
        }
        fetchProducts();
    }, []);

    if(!loading){
        return (
            <>
                <NavBar clas='dark' />
                <section className="view-wastes-section">
                    <h1>Recycled Products</h1>
                    <div className="products-container">
                        {products
                            ? products.map((item) => {
                                const imgPath = ip() + item.image
                                return (
                                    <div className="product-card">
                                        <div className="image"
                                                style={{
                                                    backgroundImage: `url(${imgPath})`,
                                                    backgroundPosition: 'center',
                                                    backgroundSize: 'cover'
                                                }}
                                            >
                                            </div>
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <button class="button" onClick={() => navigate(`/recycleDetails/${item.id}`)}>
                                            <CgDetailsMore />
                                            View More
                                            <div class="arrow">›</div>
                                        </button>
    
                                    </div>
                                )
                            })
                            : null}
                    </div>
                </section>
            </>
        )
    }
    else{
        return (
            <Loading />
        )
    }
}

export default ViewRecycle