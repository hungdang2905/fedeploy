import React, {useEffect, useRef, useState} from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import DateFormatter from "../../../../util/DateFormatter";
import CurrencyFormatter from "../../../../util/CurrencyFormatter";
import RootPathApi from "../../../../route/RootPathApi";

const OrderDetail = () => {
    const contentRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const {id} = useParams()
    const [order, setOrder] = useState([])
    const [user, setUser] = useState([])
    const [products, setProducts] = useState([])
    const navigate=useNavigate()
    const baseUrl = RootPathApi()
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/order/${id}`)
            .then(res => {
                setOrder(res.data)
                setProducts(res.data.orderItems)
                setUser(res.data.user)
                console.log(order)
                console.log(products)
            })
            .catch(err => {
                console.error(err)
            })
    }, [id]);
    const printOrder = () => {
        html2canvas(contentRef.current, {scale: 1}).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            const imgWidth = 210; // width of PDF in mm
            const pageHeight = (imgWidth * canvas.height) / canvas.width;
            const imgHeight = pageHeight - 20; // height of PDF in mm

            const doc = new jsPDF("p", "mm", "a4");
            doc.addImage(imgData, "JPEG", 15, 15, imgWidth - 30, imgHeight - 30);
            doc.autoPrint();
            window.open(doc.output("bloburl"), "_blank");
        });
    };

    const saveAsPDF = () => {
        html2canvas(contentRef.current).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF();
            doc.addImage(imgData, 'PNG', 10, 10);
            doc.save('order.pdf');
        });
    };

    function handleNavigat() {
        navigate("/admin/order-management")
    }

    return (
        <div className={"m-8"}>
            <div className="btn-group dropend no-print">
                <button type="button" className="btn btn-light" onClick={handleNavigat}>
                    Trở về
                </button>
                <button type="button" className="btn btn-primary dropdown-toggle" onClick={toggleDropdown}>
                    Công cụ
                </button>
                <ul className={`dropdown-menu tool ${dropdownOpen ? "show" : ""}`}>
                    <li className="dropdown-item " onClick={printOrder}><a>In</a></li>
                    <li className="dropdown-item" onClick={saveAsPDF}><a>Lưu file PDF</a></li>
                </ul>
            </div>
            <div ref={contentRef} id="content">
                <div>
                    <p className={"display-6 mt-4"}>Đơn hàng</p>
                    <div className={"mt-2 d-flex align-items-center"}><p className={"h5 mb-0 me-2"}>Mã đơn hàng:</p>
                        <span className={"h5 mb-0 me-2 fw-normal"}>{order.id}</span></div>
                    <div className={"mt-2 d-flex align-items-center"}><p className={"h5 mb-0 me-2"}>Tên khách hàng:</p>
                        <span className={"h5 mb-0 me-2 fw-normal"}>{order.fullname}</span></div>
                    <div className={"mt-2 d-flex align-items-center"}><p className={"h5 mb-0 me-2"}>Địa chỉ:</p>
                        <span
                            className={"h5 mb-0 me-2 fw-normal"}>{order.numberHouse + ", " + order.ward + ", " + order.district + ", " + order.province}</span>
                    </div>
                    <div className={"mt-2 d-flex align-items-center"}><p className={"h5 mb-0 me-2"}>Số điện thoại:</p>
                        <span className={"h5 mb-0 me-2 fw-normal"}>{user.phoneNumber}</span></div>
                    <div className={"mt-2 d-flex align-items-center"}><p className={"h5 mb-0 me-2"}>Ngày đặt hàng:</p>
                        <span className={"h5 mb-0 me-2 fw-normal"}>{DateFormatter(order.createdAt)}</span></div>
                </div>
                <br/>
                <br/>
                <div>
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th width={"30%"}>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                                <tr key={product.product.id}>
                                    <td className="d-flex justify-content-center"><img style={{width: "30%"}}
                                                                                       src={product.product.img1}
                                                                                       alt={product.product.title}/></td>
                                    <td><strong>{product.product.title}</strong></td>
                                    <td className={"text-center"}><strong>{product.quantity}</strong></td>
                                    <td><strong><CurrencyFormatter value={product.price}/> ₫</strong>
                                    </td>
                                </tr>
                            )
                        )}


                        </tbody>
                    </table>
                    <br/>

                </div>


                <div className={"container"}>
                    <div className="row">
                        <div className="col pl-0">
                            <p className={"display-6"}>Phương thức thanh toán</p>
                            <div className={"mt-2 d-flex align-items-center"}><p className={"h5"}>Thanh toán bằng </p>
                                <span
                                    className={"h5 fw-normal"}>{order.paymentMethod === "online" ? ": VNPay" : ": Thanh toán khi nhận nhận"}</span>
                            </div>
                            <b/>
                            <div className={"mt-2 d-flex align-items-center"}><p className={"h5"}>Hỗ trợ thanh toán
                                qua: </p></div>
                            <img style={{width: "20%"}} src="/assets/img/logo/vnpay.jpg" alt=""/>
                            <b/>
                        </div>
                        <div className="col">
                            <p className={"display-6"}>Thành tiền</p>
                            <div className={"mt-2 d-flex align-items-center"}><p className={"h5"}>Thành tiền </p><span
                                className={"h5 me-2 fw-normal"}>: <CurrencyFormatter
                                value={order.totalAmount}/> ₫</span></div>
                            <b/>
                            <div className={"mt-2 d-flex align-items-center"}><p className={"h5"}>Thuế(0%) </p><span
                                className={"h5  me-2 fw-normal"}>: 0</span></div>
                            <b/>

                            <div className={"mt-2 d-flex align-items-center"}><p className={"h5"}>Phí vận chuyển </p>
                                <span className={"h5  me-2 fw-normal"}>: 0 ₫</span></div>
                            <b/>
                            <div className={"mt-2 d-flex align-items-center"}><p className={"h5"}>Đổi điểm thưởng</p>
                                <span className={"h5  me-2 fw-normal"}>: <CurrencyFormatter
                                    value={order.rewardPoints*100}/>  ₫</span></div>
                            <b/>

                            <div className={"mt-2 d-flex align-items-center"}><p className={"h5"}>Tổng tiền </p><span
                                className={"h5 me-2 fw-normal"}>: <CurrencyFormatter
                                value={order.totalAmount}/> ₫</span></div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default OrderDetail;
