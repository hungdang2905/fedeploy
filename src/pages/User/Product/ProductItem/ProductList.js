import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from "../../Cart/Redux/CartSlice";
import CurrencyFormatter from "../../../../util/CurrencyFormatter";

function ProductList({product}) {
    const cart = useSelector((state) => state.cart);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleAddToCart = () => {
        dispatch(addToCart({id: product.id, product}));

        console.log(product)
        console.log("Cart:", JSON.stringify(cart, null, 1));
    }
    return (
        <div>
            <div className="row">
                <div className="col-lg-4 col-md-5 col-sm-12">
                    <div className="pro-img" style={{width: '65%'}}>
                        <Link to={`/products/${product.id}`}>
                            <img className="primary-img" src={product.img1} alt={product.title}/>
                        </Link>
                    </div>
                </div>
                <div className="col-lg-8 col-md-7 col-sm-12">
                    <div className="pro-content hot-product2">
                        <h4>
                            <Link to={`/products/${product.id}`}>{product.title}</Link>
                        </h4>
                        <p>
                            <span className="price"><CurrencyFormatter
                                value={product.price - (product.price * (product.sale / 100))}/>₫</span>
                            {product.sale>0? (
                                <del className="prev-price"><CurrencyFormatter value={product.price}/>₫</del>):""}
                        </p>
                        <p>{product.description}</p>
                        <div className="pro-actions">
                            <div className="actions-primary">
                                <Link to="" title="Add to Cart" onClick={() => handleAddToCart()}> Thêm Vào Giỏ
                                    Hàng </Link>
                            </div>
                            <div className="actions-primary">
                                <Link to="" title="Add to Cart" onClick={() => {
                                    handleAddToCart()
                                    navigate("/cart")
                                }}> Mua ngay </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductList;