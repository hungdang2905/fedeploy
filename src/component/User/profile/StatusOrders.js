import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, CardText, CardTitle} from 'reactstrap';
import {Modal, Nav} from 'react-bootstrap';
import axios from 'axios';
import CurrencyFormatter from '../../../util/CurrencyFormatter';
import DateFormatter from '../../../util/DateFormatter';
import {notify} from "../../../util/notify/Notify";
import {ToastContainer} from "react-toastify";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {addToCart} from "../../../pages/User/Cart/Redux/CartSlice";
import CustomizedSteppers from "../Stepper/Stepper";
import RootPathApi from "../../../route/RootPathApi";

const StatusOrders = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [id, setId] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user.email)
    const baseUrl = RootPathApi();
    useEffect(() => {
        if (user === null) {
            navigate("/login")
        }
    }, [user]);
    const handleRepurchase = (orderItems) => {
        orderItems.forEach(item => {
            dispatch(addToCart({id: item.product.id, product: item.product}));
        });
        navigate("/cart");
    };
    useEffect(() => {
        const fetchOrders = async () => {
            await axios.get(`${baseUrl}/api/v1/order/${activeTab}/orders`, {params: {email: JSON.parse(sessionStorage.getItem('user')).email}}).then(res => {
                setOrders(res.data);
                setFilteredOrders(res.data); // initialize filtered orders with fetched data
                console.log(filteredOrders)
            }).catch(err => {
                console.log(err);
            });
        };
        fetchOrders();
    }, [activeTab, refresh]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = orders.filter(order =>
            order.id.toString().includes(query) ||
            order.orderItems.some(item =>
                item.product.title.toLowerCase().includes(query)
            )
        );
        setFilteredOrders(filtered);
    }, [searchQuery, orders]);

    const handleCancelOrder = (id) => {
        axios.put(`${baseUrl}/api/v1/order/cancel-order/${id}`)
            .then(res => {
                    setRefresh(pre => !pre)
                    notify("success", "Hủy đơn hàng thành công")

                    setShowModal(false)
                    console.log("da huy don")
                }
            ).catch(err => notify("error", "Hủy đơn hàng thất bại"))
    }
    const handleReturnOrder = (id) => {
        axios.put(`${baseUrl}/api/v1/order/return-order/${id}`)
            .then(res => {
                    setRefresh(pre => !pre)
                    notify("success", "Trả đơn hàng thành công")
                    setShowReturnModal(false)
                }
            ).catch(err => notify("error", "Trả đơn hàng thất bại"))
    }
    return (
        <div className="flex-grow-1 p-3">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <div>
                <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                    <Nav.Item>
                        <Nav.Link eventKey="all">Tất cả</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="pending">Chờ xác nhận</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="delivering">Đang giao hàng</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="delivered">Hoàn thành</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="cancel">Đã hủy</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="returned">Trả hàng</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            {orders.length > 0 ? (
                <div className="d-flex justify-content-between mb-3 mt-3">
                    <input
                        type="text"
                        placeholder="Bạn có thể tìm kiếm theo ID đơn hàng hoặc Tên Sản phẩm"
                        className="form-control w-50"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            ) : (
                <div className="text-center text-secondary p-3">Không có đơn hàng</div>
            )}
            {filteredOrders.map(order => (
                <Card className="mt-3" key={order.id}>
                    <div className="header">
                        <h5 className="card-title mb-0 mt-4 ml-3">ID Đơn hàng: {order.id} - {order.user.email}</h5>
                    </div>
                    <div className={"mt-4"}>
                        <CustomizedSteppers status={order.status}/>
                    </div>
                    <div className="card-body">
                        <div className="row" style={{fontSize: "15px"}}>
                            <div className="col-md-4">
                                <p className="mb-0 font-weight-bold text-success">
                                    Ngày Đặt hàng: <span
                                    className="text-black font-weight-normal">{DateFormatter(order.createdAt)}</span>
                                </p>
                            </div>
                            <div className="col-md-4">
                                <p className="mb-0 font-weight-bold text-info">
                                    Phương thức thanh toán: <span
                                    className="text-black font-weight-normal">{order.paymentMethod === "online" ? "VNPay" : "Tại nhà"}</span>
                                </p>
                            </div>
                            <div className="col-md-4">
                                <p className="mb-0 font-weight-bold text-danger">
                                    Trạng thái: <span
                                    className="text-black font-weight-normal">{order.paied === true ? "Đã thanh toán" : "Chưa thanh toán"}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <CardBody>
                        {order.orderItems.map((item, index) => (<>
                                <div className="d-flex" key={item.product.id}>
                                    <img src={item.product.img1} alt="Product" className="img-thumbnail" width="100"/>
                                    <div className="flex-grow-1 ml-3">
                                        <Link to={`/products/${item.product.id}`}>
                                            <CardTitle>{item.product.title}</CardTitle>
                                        </Link>
                                        <CardText>Phân loại hàng: {item.product.category.name}</CardText>
                                        <CardText>x{item.quantity}</CardText>
                                    </div>
                                    <div className="text-right mr-5">
                                        {item.product.sale > 0 ? (
                                            <p>
                                                <del>₫<CurrencyFormatter value={item.product.price}/></del>
                                            </p>
                                        ) : ""}
                                        <p>
                                            ₫<CurrencyFormatter
                                            value={item.product.price - (item.product.price * (item.product.sale / 100))}/>
                                        </p>
                                    </div>
                                </div>
                                {index < order.orderItems.length - 1 && (
                                    <>
                                        <br/>
                                        <hr style={{borderWidth: "1px", borderStyle: "solid"}}/>
                                        <br/>
                                    </>
                                )}
                            </>
                        ))}
                        <br/>
                        <div className="text-right mr-5">
                            <p><strong>Thành tiền</strong>: ₫<CurrencyFormatter value={order.totalAmount}/></p>
                        </div>
                        <div className="text-right mr-5">
                            <button style={{background: "#ff3504", color: "#fff"}}
                                    className={order.status === "pending" ? "btn mr-2" : "btn"}
                                    onClick={() => handleRepurchase(order.orderItems)}>Mua Lại
                            </button>
                            {order.status === "pending" ? (<Button color="secondary" onClick={(e) => {
                                setId(order.id)
                                setShowModal(true)
                            }}>Hủy đơn</Button>) : ""}
                            {order.status === "delivered" ? (
                                <Button className={"ml-2"} color="secondary" onClick={(e) => {
                                    setId(order.id)
                                    setShowReturnModal(true)
                                }}>Trả hàng</Button>) : ""}
                        </div>
                    </CardBody>
                </Card>
            ))}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Hủy đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn hủy đơn hàng này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal(false)

                    }}>
                        Trở về
                    </Button>
                    <Button className={"btn btn-danger"} onClick={() => handleCancelOrder(id)}>
                        Hủy đơn
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showReturnModal} onHide={() => setShowReturnModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Trả đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn trả đơn hàng này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowReturnModal(false)

                    }}>
                        Trở về
                    </Button>
                    <Button className={"btn btn-danger"} onClick={() => handleReturnOrder(id)}>
                        Trả đơn
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StatusOrders;
