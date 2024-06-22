import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Breadcrumb from "../../../component/User/Breadcrumb/Breadcrumb";
import {useDispatch} from "react-redux";
import {addToCart} from "../Cart/Redux/CartSlice";
import CurrencyFormatter from "../../../util/CurrencyFormatter";
import {ToastContainer} from 'react-toastify';


import ProductReviewForm from "../../../component/User/review/ProductReviewForm";
import {Modal} from "react-bootstrap";
import RootPathApi from "../../../route/RootPathApi";

function MyOrder() {
    const [order, setOrder] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [userId, setUserId] = useState(null);
    const dispatch = useDispatch();
    const userJson = sessionStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const [filteredOrders, setFilteredOrders] = useState([]);
    const baseUrl = RootPathApi()



    useEffect(() => {
        fetchMyOrder();
    }, []);
    useEffect(() => {
        // Lọc danh sách đơn hàng khi order thay đổi
        const paidOrders = order.filter(o => o.paied === true);
        setFilteredOrders(paidOrders);
    }, [order]);

        async function fetchMyOrder() {
        try {
            const user = JSON.parse(sessionStorage.getItem("user"));
            const response = await axios.get(
                `${baseUrl}/api/v1/order/my_order/${user.email}`
            );
            setOrder(response.data);
            setUserId(user.id); // Lưu userId
            console.log(response.data);

        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    const toggleProductList = (orderId) => {
        setSelectedOrderId(orderId === selectedOrderId ? null : orderId); // Nếu orderId đã được chọn thì đặt lại thành null, ngược lại, đặt là orderId
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart({ id: product.id, product }));
        console.log(product);
    };

    const handleReview = (product, orderId) => {
        setSelectedProduct({ ...product, orderId });
        setShowReviewModal(true);
    };
    const handleReviewSubmit = (newReview) => {
        setOrder(prevOrder => prevOrder.map(o => {
            if (o.id === selectedProduct.orderId) {
                return {
                    ...o,
                    orderItems: o.orderItems.map(item => {
                        if (item.product.id === selectedProduct.id) {
                            return {
                                ...item,
                                product: {
                                    ...item.product,
                                    reviews: [...(item.product.reviews || []), newReview], // Sửa lỗi tại đây
                                },
                            };
                        }
                        return item;
                    }),
                };
            }
            return o;
        }));

        setShowReviewModal(false);
    };




    return (
        <div className="container mt-4">
            <Breadcrumb title={'Lịch sử mua hàng'} />

            <h2 className="mb-4">Đơn hàng</h2>
            {filteredOrders.length === 0 ? (
                <div className="alert alert-warning" role="alert">
                    Không có dữ liệu
                </div>
            ) : (
                filteredOrders.map((o, index) => (
                    <div key={o.id} className="card mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                        <div className="header">
                            <h5 className="card-title mb-0 mt-4 ml-3">ID Đơn hàng: {o.id} - {o.fullname}</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold text-success mb-0">Ngày đăng:</h6>
                                    <h6>{o.createdAt}</h6>
                                </div>
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold text-info mb-0">Phương thức thanh toán:</h6>
                                    <h6>{o.paymentMethod}</h6>
                                </div>
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold text-danger mb-0">Trạng thái:</h6>
                                    <h6 style={{ color: o.paied ? "green" : "red" }}>
                                        {o.paied  ? "Đã thanh toán" : "Chưa thanh toán"}
                                    </h6>
                                </div>
                                <div className="col-md-3">
                                    <button type="button" className="btn btn-info btn-sm"
                                            onClick={() => toggleProductList(o.id)}
                                    > {selectedOrderId === o.id ? "Ẩn " : "Xem chi tiết"}</button>

                                </div>
                            </div>

                            <div className="table-responsive mt-4"
                                 style={{backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "10px"}}>
                                {o.orderItems.map((item, i) => (
                                    <>
                                        {selectedOrderId === o.id && (
                                            <div key={item.product.id} className="order-item row"
                                                 style={{marginBottom: "20px"}}>
                                            <div className="m-2 col-lg-2 col-md-3 col-sm-4">
                                                    <img src={item.product.img1} alt={item.product.title} width={130}
                                                         height={130}
                                                         style={{ border: "2px solid #dee2e6", borderRadius: "5px" }} />
                                                </div>
                                                <div className="col-lg-9 col-md-9 col-sm-8">
                                                    <div className="row">
                                                        <div className="m-2 col-8">
                                                            <h5 style={{ color: "#343a40" }}>
                                                                Tên sản phẩm:
                                                                <Link to={"/products/" + `${item.product.id}`}>
                                                                    <span style={{ color: "#007bff" }}> {item.product.title}</span>
                                                                </Link>
                                                            </h5>
                                                            <span style={{ color: "#6c757d" }}>Loại sản phẩm: {item.product.category.name}</span>
                                                            <p>Giá bán: <CurrencyFormatter
                                                                value={item.product.price - item.product.price * item.product.sale / 100} /> VND
                                                            </p>
                                                            <p>Số lượng: {item.quantity}</p>
                                                        </div>
                                                        <div className="m-2 col-md-3">
                                                            <div className="col-md-2">
                                                                <br/>
                                                                <button type="button" className="btn btn-danger mb-2"
                                                                        onClick={() => handleAddToCart(item.product)}>Mua
                                                                    Lại
                                                                </button>
                                                                <br/>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-success mt-2"
                                                                    onClick={() => handleReview(item.product, o.id)}
                                                                >
                                                                    Đánh giá
                                                                </button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <hr/>
                                    </>
                                ))}

                            </div>

                            <div className="row p-1">
                                <hr className="col-11"/>
                                <div className="col-md-10">
                                    <h3 className="text-dark">Tổng tiền: <CurrencyFormatter value={o.totalAmount}/> VND
                                    </h3>
                                    {/*<button*/}
                                    {/*    type="button"*/}
                                    {/*    className="btn btn-success mt-2"*/}
                                    {/*    onClick={() => handleReview(o.product, o.id)}*/}
                                    {/*>*/}
                                    {/*    Đánh giá*/}
                                    {/*</button>*/}
                                    {/*<button*/}
                                    {/*    type="button"*/}
                                    {/*    className="btn btn-success mt-2 ml-2"*/}
                                    {/*    onClick={() => handleShowReview( o.id)}*/}
                                    {/*>*/}
                                    {/*    Xem Đánh giá*/}
                                    {/*</button>*/}

                                </div>

                            </div>

                        </div>
                    </div>
                ))
            )}
            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Đánh giá sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <ProductReviewForm
                            productId={selectedProduct.id}
                            onReviewSubmit={handleReviewSubmit}
                            user={user}
                        />
                    )}
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default MyOrder;
