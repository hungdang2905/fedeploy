import React, {useEffect, useState} from "react";

import {notify} from "../../../util/notify/Notify";


import axios from "axios";
import * as XLSX from "xlsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Button, Modal} from "react-bootstrap";
import RootPathApi from "../../../route/RootPathApi";
import DateFormatter from "../../../util/DateFormatter";

const ReviewManagement = () => {

    const [reviews, setReviews] = useState([]);

    const [review, setReview] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(10);
    const accessToken = localStorage.getItem("accessToken");
    const baseUrl = RootPathApi()
    


    useEffect(() => {
        getALlReview()
    }, [refresh]);
    const getALlReview = async () => {
        try {
            let req = await axios.get(`${baseUrl}/api/v1/management/review`, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });
            console.log(req.data)
            setReview(req.data)
            setReviews(req.data)
        } catch (e) {

        }
    }
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedReviews([]);
        } else {
            setSelectedReviews(reviews.map(r => r.id));
        }
        setIsAllSelected(!isAllSelected);
    };
    const handleReviewSelection = (reviewID) => {
        setSelectedReviews(prevSelectedReviews => {
            if (prevSelectedReviews.includes(reviewID)) {
                return prevSelectedReviews.filter(id => id !== reviewID);
                console.log(setSelectedReviews());
            } else {
                return [...prevSelectedReviews, reviewID];
            }
        });
    };


    console.log("abc" + reviews);
    const filteredReviews = reviews.length > 0 ? reviews.filter((review) => {
        const reviewValues = Object.values(review).join(" ").toLowerCase();
        return reviewValues.includes(searchTerm.toLowerCase());
    }) : [];
    const indexOfLast = currentPage * itemPerPage;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentItems = filteredReviews.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Render số trang
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredReviews.length / itemPerPage); i++) {
        pageNumbers.push(i);
    }


    const handleConfirmDelete = async () => {
        try {
            const deleteReviewRequest = {reviewIds: selectedReviews};
            const res = await axios.delete(`${baseUrl}/api/v1/review/deletes`, {
                data: deleteReviewRequest,
            });
            notify("success", "Thanh cong");

            // const updatedData = review.filter(item => !selectedReviews.includes(item.id));
            setRefresh(prev => !prev)
            setSelectedReviews([]); // Xóa các đánh giá đã chọn
            setIsAllSelected(false);
            setShowDeleteModal(false);
            setCurrentPage(1);
        } catch (error) {
            notify("error", "Xóa thất bại");
            console.error(error);
        }
    };


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi tìm kiếm
    };
    const toggleDropdown = () => {
        setDropdownOpen(prevState => !dropdownOpen);
    };


    const onExportExcel = () => {
        const worksheetData = reviews.map(review => ({
            id: review.id,
            content: review.content,
            quality: review.quality,
            rate: review.rate, // Lấy tên category từ đối tượng category
            username: review.user.fullname

        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        XLSX.writeFile(workbook, 'product' + Date.now() + '.xlsx');
        notify("success", "Xuất sản phẩm thành công")

    };


    return (
        <div>
            <ToastContainer/>


            {reviews.length > 0 ? (
                <>

                    <div className={"container-xl"}>
                        <div className={"d-flex align-items-center mb-3"}>
                            <p className={"m-0"}>Hiển thị:</p>
                            <select
                                className="form-select col-1"
                                onChange={(e) => setItemPerPage(e.target.value)}
                            >
                                <option selected value="10">10</option>
                                <option value="15">15</option>
                                <option value="25">25</option>
                            </select>

                            <button className={"btn btn-danger"} hidden={selectedReviews.length > 0 ? false : true}
                                    onClick={() => setShowDeleteModal(true)}>Xóa nhiều
                            </button>
                            <input className="form-control ms-auto me-2 col-4" type="search" placeholder="Search"
                                   aria-label="Search"
                                   onChange={handleSearch}/>
                        </div>
                        <table className="table text-left">
                            <thead>
                            <tr>
                                <th><input type={"checkbox"} onClick={() => handleSelectAll()}/></th>
                                <th>ID</th>

                                <th>Mã sản phẩm</th>
                                <th>Tên khách hàng</th>
                                <th>Rating</th>
                                <th>Chất lượng</th>
                                <th>Nội dung</th>

                                <th>Ngày gửi đánh giá</th>

                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((e, index) =>

                                <tr key={index}>
                                    <th>
                                        <input
                                            className="mt-4"
                                            type="checkbox"
                                            checked={selectedReviews.includes(e.id)} // Sửa lỗi includes
                                            onChange={() => handleReviewSelection(e.id)}
                                        />
                                    </th>
                                    <td>{e.id}</td>

                                    <td>{e.product.id}</td>
                                    <td>{e.user.fullname}</td>
                                    <td>{e.rate}</td>
                                    <td className="text-center">{e.quality}</td>
                                    <td className="text-center"><span>{e.content}</span></td>


                                    <td className="text-center">{DateFormatter(e.createdAt)}</td>

                                    <td className="text-center">
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                setShowDeleteModal(true)
                                                handleReviewSelection(e.id)
                                            }}
                                            className="btn-delete"
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            )}


                            </tbody>
                        </table>
                        <nav className={"d-flex justify-content-end"}>
                            <ul className="pagination">
                                {pageNumbers.map((number) => (
                                    <li
                                        key={number}
                                        className={`page-item ${number === currentPage ? "active" : ""}`}
                                    >
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

                </>
            ) : (<div className="alert alert-warning" role="alert">
                Không có dữ liệu
            </div>)}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa Đánh giá này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {

                        setShowDeleteModal(false)

                    }}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleConfirmDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );

}
export default ReviewManagement;