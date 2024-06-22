import React, {useEffect, useRef, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import axios from "axios";
import {Link} from "react-router-dom";
import StatusList from "../../../data/order/StatusList";
import DateFormatter from "../../../util/DateFormatter";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import CurrencyFormatter from "../../../util/CurrencyFormatter";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {notify} from "../../../util/notify/Notify";
import RootPathApi from "../../../route/RootPathApi";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const accessToken = localStorage.getItem("accessToken");
    const baseUrl = RootPathApi()
    

    useEffect(() => {
        const getOrders=async ()=>{
            await axios.get(`${baseUrl}/api/v1/order`).then(res => {
                setOrders(res.data)
                console.log(res.data)
            }).catch(error => {
                console.log("error:" + error)
            })
        }

        getOrders()
        const interval = setInterval(getOrders, 300000); // Polling every 5 seconds

        return () => clearInterval(interval);
    }, [refresh]);
    const handleOrderSelection = (orderId) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
        console.log(selectedOrders)
    };

    const contentRef = useRef(null);
    const printOrder = () => {
        html2canvas(contentRef.current, {scale: 2}).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Scale image dimensions to fit within PDF dimensions
            const imgWidth = canvas.width * 0.264583; // convert px to mm
            const imgHeight = canvas.height * 0.264583; // convert px to mm
            let width, height;

            if (imgWidth > pdfWidth) {
                width = pdfWidth;
                height = (pdfWidth / imgWidth) * imgHeight;
            } else {
                width = imgWidth;
                height = imgHeight;
            }

            if (height > pdfHeight) {
                width = (pdfHeight / height) * width;
                height = pdfHeight;
            }

            pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
            pdf.autoPrint();
            window.open(pdf.output('bloburl'), '_blank');
        });
    };
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(order => order.id));
        }
        setIsAllSelected(!isAllSelected);
    };
    const handleClearSelection = () => {
        if (selectedOrders.length < 2) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders([...selectedOrders]);
        }
        console.log(selectedOrders)
    };
    const deleteMultipleOrders = async () => {
        try {
            await axios.delete(`${baseUrl}/api/v1/order-management/order/delete/orders`, {data: selectedOrders,headers: {
                    Authorization: `Bearer ${accessToken}`,
                }});
            // Cập nhật lại danh sách đơn hàng sau khi xóa
            setRefresh(prev => !prev);

            // Gọi lại hook bằng cách thay đổi refreshTable
            setShowDeleteModal(false);
            notify("success", "Xóa đơn thành công");
            setCurrentPage(1)

            // const updatedOrders = orders.filter((o) => o.id !== orderToDelete.id);
            // setOrders(updatedOrders);
        } catch (error) {
            notify("error", "xóa đơn hàng thất bại");
            console.error('Error deleting orders:', error);
        }
    };


    const toggleDropdown = () => {
        setDropdownOpen(prevState => !dropdownOpen);
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(5);

    // Tìm kiếm đơn hàng
    const filteredOrders = orders.filter((order) => {
        const orderValues = Object.values(order).join(' ').toLowerCase();
        return orderValues.includes(searchTerm.toLowerCase());
    });

    // Lấy danh sách đơn hàng cho trang hiện tại
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Render số trang
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi tìm kiếm
    };


    const onExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(orders);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, `orders.xlsx`);
    };
    const getStatusValue = (status) => {
        const statusObj = StatusList.find(item => item.status === status);
        return statusObj ? statusObj.value : 'Status không hợp lệ';
    };
    const confirmMuiltipleOrder = async () => {
        try {
              await axios.put(`${baseUrl}/api/v1/order-management/order/confirm/orders`, selectedOrders,{headers: {
                      Authorization: `Bearer ${accessToken}`,
                  }});
            // Cập nhật lại danh sách đơn hàng sau khi xóa
            setRefresh(prev => !prev);
            setSelectedOrders([]);
            setIsAllSelected(false)
            notify("success", "Duyệt đơn hàng thành công")
            setShowConfirmModal(false);
            setCurrentPage(1)

        } catch (error) {
            notify("error", "Duyệt đơn hàng thất bại")

            console.error('Error deleting orders:', error);
        }
    };
    return (
        <div className={"container-xl"}>

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


            {currentOrders.length === 0 ? <div className="alert alert-warning" role="alert">
                    Không có dữ liệu
                </div> :

                <>
                    <div className={"mt-5"}>
                        <div className="btn-group dropend no-print mb-2 mr-2">
                            <button type="button" className="btn btn-primary dropdown-toggle"
                                    onClick={toggleDropdown}>
                                Công cụ
                            </button>
                            <ul className={`dropdown-menu tool ${dropdownOpen ? "show" : ""}`}>
                                <li className="dropdown-item " onClick={printOrder}><a>In</a></li>
                                <li className="dropdown-item" onClick={onExportExcel}><a>Xuất ra exel</a></li>

                            </ul>
                        </div>
                        <button className={"btn btn-outline-danger mb-2"}
                                hidden={selectedOrders.length > 0 ? false : true}
                                onClick={() => setShowDeleteModal(true)}>Xóa nhiều
                        </button>
                        <button className={"btn btn-outline-success ml-2 mb-2"}
                                hidden={selectedOrders.length > 0 ? false : true}
                                onClick={() => setShowConfirmModal(true)}>Duyệt đơn
                        </button>
                        <div className={"d-flex align-items-center mb-3"}>
                            <p className={"m-0"}>Hiển thị:</p>
                            <select className="form-select col-1"
                                    onChange={(e) => setOrdersPerPage(e.target.value)}>
                                <option selected value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                            </select>
                            <input className="form-control ms-auto me-2 col-4" type="search" placeholder="Search"
                                   aria-label="Search"
                                   onChange={handleSearch}/>
                        </div>
                        <div ref={contentRef} id="content">
                            <table className={"table text-left"}>
                                <thead>
                                <tr>
                                    <th><input type={"checkbox"} checked={isAllSelected} onClick={() => handleSelectAll()}/></th>
                                    <th>ID</th>
                                    <th>Tên khách hàng</th>
                                    <th>Địa chỉ</th>
                                    <th>SĐT</th>
                                    <th>Tổng tiền</th>
                                    <th>Thanh toán</th>
                                    <th>Tình trạng đơn</th>
                                    <th>Trạng thái đơn</th>
                                    <th>Ngày đặt</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentOrders && currentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <th><input className={"mt-4"} type={"checkbox"}
                                                   checked={selectedOrders.includes(order.id)}
                                                   onChange={() => handleOrderSelection(order.id)}/></th>
                                        <td>{order.id}</td>
                                        <td>{order.fullname}</td>
                                        <td>{order.numberHouse + "/" + order.ward + "/" + order.district + "/" + order.province}</td>

                                        <td className="text-center">{order.user.phoneNumber}</td>

                                        <td className="text-center"><CurrencyFormatter value={order.totalAmount}/></td>
                                        <td className="text-center">{order.paymentMethod}</td>
                                        <td className="text-center">
                                            {/*<select className="custom-select">*/}
                                            {/*    <option value="ready_to_pick">Chờ xác nhận</option>*/}
                                            {/*    {StatusList.map(status => (*/}
                                            {/*        <option value={status.status}>{status.value}</option>*/}
                                            {/*    ))}*/}
                                            {/*</select>*/}
                                            {order.status === "pending" ? (
                                                <div className={"btn btn-primary"} onClick={() => {
                                                    setShowConfirmModal(true)
                                                    handleOrderSelection(order.id)
                                                }}>Duyệt đơn</div>) : (
                                                <div className="alert alert-info" role="alert">
                                                    {getStatusValue(order.status)}
                                                </div>)}


                                        </td>
                                        <td className="text-center">
                                            <button
                                                className={`btn ${order.paied ? "btn-light" : "btn-info"}`}>{order.paied ? "Đã thanh toán" : "Chưa thanh toán"}</button>
                                        </td>
                                        <td className="text-center">{DateFormatter(order.createdAt)}</td>

                                        <td className="text-center">

                                            <Link to={`/admin/order-management/order/${order.id}`}><Button
                                                variant="success">Xem</Button></Link>

                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="danger"
                                                onClick={() => {
                                                    // handleDeleteOrder(order.id)
                                                    setShowDeleteModal(true)
                                                    handleOrderSelection(order.id)
                                                }}
                                                className="btn-delete"
                                            >
                                                Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <nav className={"d-flex justify-content-end"}>
                                <ul className="pagination">
                                    {pageNumbers.map((number) => (
                                        <li key={number}
                                            className={`page-item ${number === currentPage ? "active" : ""}`}>
                                            <a
                                                onClick={() => paginate(number)}
                                                href="#"
                                                className="page-link"
                                            >
                                                {number}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </>
            }


            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa đơn hàng này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        handleClearSelection()
                        setShowDeleteModal(false)

                    }}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={deleteMultipleOrders}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Duyệt đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn duyệt đơn hàng này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        handleClearSelection()
                        setShowConfirmModal(false)

                    }}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={confirmMuiltipleOrder}>
                        Duyệt
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
        ;
};

export default OrderManagement;