import Breadcrumb from "../../../component/User/Breadcrumb/Breadcrumb";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import Review from "../../../component/User/review/Review";
import Comments from "../../../component/User/comment/Comment";
import CurrencyFormatter from "../../../util/CurrencyFormatter";
import {useDispatch} from "react-redux";
import {addToCart, updateCart} from "../Cart/Redux/CartSlice";
import RootPathApi from "../../../route/RootPathApi";

function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const baseUrl = RootPathApi();
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/product/${id}`)
            .then(response => {
                setProduct(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [id]);
    const handleAddToCart = () => {
        dispatch(addToCart({id: product.id, product}));
        if (quantity > 1) {
            dispatch(updateCart({id: product.id, quantity}))
        }
    }


    function handleDecreaseQuantity() {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    function handleIncreaseQuantity() {
        setQuantity(quantity + 1);

    }

    const [averageRating, setAverageRating] = useState(0);
    useEffect(() => {
        const handleAverageRatingCalculated = (event) => {
            setAverageRating(event.detail.averageRating);
        };

        window.addEventListener('averageRatingCalculated', handleAverageRatingCalculated);

        return () => {
            window.removeEventListener('averageRatingCalculated', handleAverageRatingCalculated);
        };
    }, []);
    return (<div>

        {product && (<div className="wrapper">

                <Breadcrumb title={'Chi tiết sản phẩm'}/>
                <div className="popup_banner">
                    <span className="popup_off_banner">×</span>
                    <div className="banner_popup_area">
                        <img src="img/banner/logo.png" alt=""/>
                    </div>
                </div>

                <div className="main-product-thumbnail ptb-100 ptb-sm-60">
                    <div className="container">
                        <div className="thumb-bg">
                            <div className="row">

                                <div className="col-lg-5 mb-all-40">

                                    <div className="tab-content">
                                        <div id="thumb1" className="tab-pane fade show active">
                                            <a data-fancybox="images"
                                               href={product.img1}><img
                                                src={product.img1}
                                                alt="product-view"/></a>
                                        </div>
                                        <div id="thumb2" className="tab-pane fade">
                                            <a data-fancybox="images"
                                               href={product.img2}><img
                                                src={product.img2}
                                                alt="product-view"/></a>
                                        </div>

                                    </div>

                                    <div className="product-thumbnail mt-15">
                                        <div className="thumb-menu owl-carousel nav tabs-area" role="tablist">
                                            <a className="active" data-toggle="tab" href="#thumb1"><img
                                                src={product.img1}
                                                alt="product-thumbnail"/></a>
                                            <a data-toggle="tab" href="#thumb2"><img
                                                src={product.img2}
                                                alt="product-thumbnail"/></a>

                                        </div>
                                    </div>

                                </div>

                                <div className="col-lg-7">
                                    <div className="thubnail-desc fix">
                                        <h3 className="product-header">{product.title}</h3>
                                        <div className="rating-summary fix mtb-10">
                                            <div className="rating">
                                                {[...Array(5)].map((star, i) => (
                                                    <i
                                                        key={i}
                                                        className={`fa fa-star${i < averageRating ? "" : "-o"}`}
                                                    ></i>
                                                ))}
                                            </div>


                                        </div>
                                        <div className="pro-price mtb-30">
                                            <p className="d-flex align-items-center">
                                                {product.sale > 0 ? (
                                                    <del className="prev-price"><CurrencyFormatter
                                                        value={product.price}/>₫</del>) : ""}

                                                <span
                                                    className="price"><CurrencyFormatter
                                                    value={product.price - product.price * (product.sale / 100)}/>₫</span>
                                                {product.sale>0?(<span
                                                    className="saving-price">Giảm {(product.sale)}%</span>):""}
                                            </p>
                                        </div>
                                        <p className="mb-20 pro-desc-details"> {product.description}</p>
                                        <div className="color clearfix mb-20">
                                            <label>Loại sản phẩm</label>
                                            <p>{product.category.name}</p>

                                        </div>
                                        <div className="box-quantity d-flex hot-product2">
                                            <div className={"w-25"}>
                                                <button className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDecreaseQuantity()}> -
                                                </button>
                                                <span className="m-2">{quantity}</span>
                                                <button className="btn btn-sm btn-outline-success"
                                                        onClick={() => handleIncreaseQuantity()}>+
                                                </button>
                                            </div>
                                            <div className="pro-actions">
                                                <div className="actions-primary">
                                                    <Link to="" title="Add to Cart"
                                                          onClick={() => handleAddToCart()}> Thêm Vào Giỏ
                                                        Hàng </Link>
                                                </div>
                                                <div className="actions-primary">
                                                    <Link to="" title="Add to Cart" onClick={() => {
                                                        handleAddToCart()
                                                        navigate("/cart")
                                                    }}> Mua ngay </Link>
                                                </div>
                                                {/*<div className="actions-secondary">*/}
                                                {/*    <a href="compare.html" title="" data-original-title="Compare"><i*/}
                                                {/*        className="lnr lnr-sync"></i> <span>Thêm so sánh</span></a>*/}
                                                {/*    <a href="wishlist.html" title="" data-original-title="WishList"><i*/}
                                                {/*        className="lnr lnr-heart"></i>*/}
                                                {/*        <span>Thêm vào danh sách yêu thích</span></a>*/}
                                                {/*</div>*/}
                                            </div>
                                        </div>
                                        <div className="pro-ref mt-20">
                                            <p><span className="in-stock"><i className="ion-checkmark-round"></i> Trong kho</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
                <div className="thumnail-desc pb-100 pb-sm-60">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="main-thumb-desc nav tabs-area" role="tablist">
                                    <li><a className="active" data-toggle="tab" href="#dtail">Thông tin chi tiết
                                        sản
                                        phẩm</a></li>
                                    <li><a data-toggle="tab" href="#review">Đánh giá</a></li>
                                    <li><a data-toggle="tab" href="#comment">Bình luận</a></li>
                                </ul>

                                <div className="tab-content thumb-content border-default">
                                    <div id="dtail" className="tab-pane fade show active">
                                        <p>{product.description}</p>
                                    </div>
                                    <Review productId={id}/>

                                    <Comments productId={id}/>

                                </div>

                            </div>
                        </div>

                    </div>

                </div>
                <div className="support-area bdr-top">
                    <div className="container">
                        <div className="d-flex flex-wrap text-center">
                            <div className="single-support">
                                <div className="support-icon">
                                    <i className="lnr lnr-gift"></i>
                                </div>
                                <div className="support-desc">
                                    <h6>Quà tặng</h6>
                                    <span>Nhiều phần quà tặng kèm hấp dẫn khi mua sắm.</span>
                                </div>
                            </div>
                            <div className="single-support">
                                <div className="support-icon">
                                    <i className="lnr lnr-rocket"></i>
                                </div>
                                <div className="support-desc">
                                    <h6>Giao hàng</h6>
                                    <span>Miễn phí giao hàng trong phạm vi bán kính 10km.</span>
                                </div>
                            </div>
                            <div className="single-support">
                                <div className="support-icon">
                                    <i className="lnr lnr-lock"></i>
                                </div>
                                <div className="support-desc">
                                    <h6>Thanh toán an toàn</h6>
                                    <span>Áp dụng nhiều phương thức thanh toán an toàn.</span>
                                </div>
                            </div>
                            <div className="single-support">
                                <div className="support-icon">
                                    <i className="lnr lnr-enter-down"></i>
                                </div>
                                <div className="support-desc">
                                    <h6>Tự tin mua sắm</h6>
                                    <span>Thoải mái mua sắm với sản phẩm đa dạng.</span>
                                </div>
                            </div>
                            <div className="single-support">
                                <div className="support-icon">
                                    <i className="lnr lnr-users"></i>
                                </div>
                                <div className="support-desc">
                                    <h6>Hỗ trợ khách hàng 24/7</h6>
                                    <span>Đội ngũ nhân viên tư vấn và hỗ trợ 24/7.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


        )}
    </div>)
}

export default ProductDetail