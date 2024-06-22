import {useEffect, useState} from "react";
import axios from "axios";
import React from "react";
import Carousel from 'react-multi-carousel';
import {Link} from "react-router-dom";
import CurrencyFormatter from "../../../util/CurrencyFormatter";
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import MemoryIcon from '@mui/icons-material/Memory';
import MouseIcon from '@mui/icons-material/Mouse';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import RootPathApi from "../../../route/RootPathApi";

export default function ListProductCategory({value}) {
    const [products, setProducts] = useState([]);
    const baseUrl = RootPathApi()
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/category/${value.value}`)
            .then(res => {
                setProducts(res.data)
                console.log(res.data)
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [value])

    const renderIcon = () => {
        switch (value.value) {
            case 'laptop':
                return <LaptopMacIcon style={{width: '28px', height: '28px', marginTop: '10px', marginLeft: '30px'}}/>;
            case 'ram':
                return <MemoryIcon style={{width: '28px', height: '28px', marginTop: '10px', marginLeft: '30px'}}/>;
            case 'rouse':
                return <MouseIcon style={{width: '28px', height: '28px', marginTop: '10px', marginLeft: '30px'}}/>;
            case 'keyboard':
                return <KeyboardIcon style={{width: '28px', height: '28px', marginTop: '10px', marginLeft: '30px'}}/>;
            default:
                return null;
        }
    };

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: {max: 4000, min: 3000},
            items: 5
        },
        desktop: {
            breakpoint: {max: 3000, min: 1024},
            items: 3
        },
        tablet: {
            breakpoint: {max: 1024, min: 464},
            items: 2
        },
        mobile: {
            breakpoint: {max: 464, min: 0},
            items: 1
        }
    };
    return (
        <div className="mg-6" style={{
            marginBottom: '50px',
            height: "450px",
            background: 'linear-gradient(rgb(230 46 4), rgb(254, 80, 72)) 0% 0% / cover',
            borderRadius: '7px'
        }}>
            <div className="title-category" style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                color: "#fff"
            }}>
                {renderIcon()}
                <Link to={"/products"}>

                    <h2 style={{
                        color: '#fff',
                        fontWeight: '600',
                        marginTop: '10px',
                        marginLeft: '10px',

                    }}>{value.name}</h2>
                </Link>
            </div>
            <div className="size-list-product" style={{
                margin: '0px 25px',
                height: '325px'
            }}>
                <Carousel responsive={responsive}>
                    {products.map((product) => (
                        <div className="card" style={{marginRight: '5px', height: "330px"}}>
                            <div key={product.id} className="swiper-slide">
                                <div className="product-info text-center">
                                    <Link to={`/products/${product.id}`} style={{cursor: "pointer"}}>
                                        <div style={{boxSizing: "inherit"}}>
                                            <img src={product.img1} alt="ảnh sản phẩm" style={{
                                                width: '180px',
                                                margin: '0px 105px'
                                            }}/>
                                        </div>
                                        <div className="product--name" style={{
                                            color: '#444',
                                            textAlign: 'center',
                                        }}>
                                            <h2 style={{
                                                fontSize: 'unset',
                                                fontWeight: '600',
                                                margin: '18px 25px',
                                                height:"40px"
                                            }}>
                                                {product.title}</h2>
                                            <div className={"d-flex align-items-center justify-content-center"}>
                                                <div style={{
                                                    width: '220px'
                                                }}>
                                                    <p>
                                                <span
                                                    className="price"><CurrencyFormatter
                                                    value={product.price - product.price * (product.sale / 100)}/> VNĐ
                                                </span>
                                                        {product.sale > 0 ? (
                                                            <span className="prev-price"><CurrencyFormatter
                                                                value={product.price}/> VNĐ</span>) : ""}</p>
                                                </div>
                                                {product.sale > 0 ? (
                                                    <>
                                                        <br/>

                                                        <div className="sale">
                                                            <p><span
                                                                className="saving-price">Giảm {(product.sale)}%</span>
                                                            </p>
                                                        </div>
                                                    </>

                                                ) : ""}
                                            </div>
                                        </div>

                                    </Link>

                                </div>
                            </div>
                        </div>

                    ))}

                </Carousel>
            </div>


        </div>
    )
}