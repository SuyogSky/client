import React, { useState, useEffect } from "react";
import NavBar from "../../NavBar/NavBar";
import Axios from "axios"
import "./ViewWastes.scss"
import ip from '../../ip/ip'
import { CgDetailsMore } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const ViewWastes = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = () => {
            Axios.get(`${ip()}/products/wasteProductsAll/`, {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }
            }).then((response) => {
                setProducts(response.data.message);
            }).then(() => {

            })
        }
        fetchProducts();
    }, []);

    return (
        <>
            <NavBar clas='dark' />
            <section className="view-wastes-section">
                <h1>Waste Products</h1>
                <div className="products-container">
                    {products
                        ? products.map((item) => {
                            const imgPath = ip() + item.image
                            return (
                                <div className="product-card">
                                    <div className="image">
                                        <img src={imgPath} alt="" />
                                    </div>
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <button class="button" onClick={() => navigate(`/details/${item.id}`)}>
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

export default ViewWastes