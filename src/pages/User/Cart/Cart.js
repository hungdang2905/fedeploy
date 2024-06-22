// Cart.js

import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from 'react-router-dom';
import {removeFromCart, updateCart} from "./Redux/CartSlice";
import Breadcrumb from "../../../component/User/Breadcrumb/Breadcrumb";
import CurrencyFormatter from "../../../util/CurrencyFormatter";

const Cart = () => {
    const cart = useSelector((state) => state.cart.cart);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    const dispatch = useDispatch();
    const [checkedLogin, setCheckedLogin] = useState(false);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user !== null) {
            setCheckedLogin(true)
        }
    }, []);
    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart({id}));
    };

    function handleDecreaseQuantity(id, currentQuantity) {
        if (currentQuantity > 1) {
            dispatch(updateCart({id, quantity: currentQuantity - 1}));
            console.log(cart)
        }
    }

    function handleIncreaseQuantity(id, currentQuantity) {
        dispatch(updateCart({id, quantity: currentQuantity + 1}));
        console.log(cart)
    }

    return (
        <div className="wrapper">
            <div className="breadcrumb-area mt-30">
                <div className="container">
                    <Breadcrumb title={"Giỏ hàng"}/>
                </div>
            </div>
            <div className="cart-main-area ptb-100 ptb-sm-60">
                <div className="container">
                    <div className="row">

                        <div className="col-md-12 col-sm-12">
                            <div className="table-content table-responsive mb-45">
                                <table>
                                    <thead>
                                    <tr>
                                        <th className="product-thumbnail">Hình ảnh</th>
                                        <th className="product-name">Sản phẩm</th>
                                        <th className="product-price">Đơn giá</th>
                                        <th className="product-price">Giảm giá</th>
                                        <th className="product-quantity">Số lượng</th>
                                        <th className="product-subtotal">Tổng</th>
                                        <th className="product-remove">Xóa</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {cart.length === 0 ? (<tr>
                                        <td colSpan="6">Giỏ hàng trống!</td>
                                    </tr>) : cart.map((item, index) => (
                                        <tr key={index}>
                                            <td className="product-thumbnail">
                                                <img src={item.product.img1} alt="cart-image"/>
                                                <input type="hidden" name="productID" value={item.product.id}/>
                                            </td>
                                            <td className="product-name">
                                                <Link to={`/products/${item.product.id}`} target="_blank"
                                                      rel="noopener noreferrer">
                                                    {item.product.title}
                                                </Link>
                                            </td>
                                            <td className="product-price">
                                                <span className="amount"><CurrencyFormatter value={item.product.price}/>₫</span>

                                            </td>
                                            <td className="product-price">
                                                <span className="amount"><CurrencyFormatter value={item.product.price-item.product.price*item.product.sale/100}/>₫</span>

                                            </td>
                                            <td className="product-quantity">
                                                <button className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDecreaseQuantity(item.product.id, item.quantity)}> -
                                                </button>
                                                <span className="m-2">{item.quantity}</span>
                                                <button className="btn btn-sm btn-outline-success"
                                                        onClick={() => handleIncreaseQuantity(item.product.id, item.quantity)}>+
                                                </button>


                                            </td>
                                            <td className="product-subtotal">

                                                <span className="amount"><CurrencyFormatter
                                                    value={totalPrice}/>₫</span>
                                            </td>
                                            <td className="product-remove">
                                                <button className={"btn"}
                                                        onClick={() => handleRemoveFromCart(item.product.id)}>
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            {cart.length !== 0 ? (
                                <div className="row">
                                    <div className="col-md-8 col-sm-12">
                                        <div className="buttons-cart">
                                            <Link to="/products">Tiếp tục mua sắm</Link>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-12">
                                        <div className="cart_totals float-md-right text-md-right">
                                            <h2>SỐ TIỀN THANH TOÁN</h2>
                                            <table className="float-md-right">
                                                <tbody>
                                                <tr className="order-total">
                                                    <th>Tổng:</th>
                                                    <td>
                                                        <strong><span
                                                            className="amount"><CurrencyFormatter
                                                            value={totalPrice}/></span>₫</strong>

                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <div className="wc-proceed-to-checkout">
                                                {/*<Link to={""} data-bs-toggle={"modal"}*/}
                                                {/*      data-bs-target={"#checkLogin" }>THANH TOÁN</Link>*/}
                                                {/*<ModalLogin id={"checkLogin"}/>*/}
                                                <Link to={checkedLogin ? "/checkout" : ""} type="button"
                                                      onClick={checkedLogin ? "" : handleShowModal}>
                                                    THANH TOÁN
                                                </Link>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : ""}

                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal fade show" style={{display: "block"}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fs-5" id="exampleModalLabel">
                                    Thông báo
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">Bạn chưa đăng nhập, Vui lòng đăng nhập để tiến hành thanh toán
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Đóng
                                </button>
                                <Link to={"/login"} type="button" className="btn btn-primary">
                                    Đăng nhập
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
