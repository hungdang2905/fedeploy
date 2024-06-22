import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {Button, Modal} from "react-bootstrap";
import RootPathApi from "../../../route/RootPathApi";

function Review({productId}) {
    const [reviews, setReviews] = useState([]);
    const [visibleReviews, setVisibleReviews] = useState(3); // Số lượng đánh giá hiển thị
    const [lastAdded, setLastAdded] = useState(0); // Số đánh giá được thêm vào lần trước

    const userJson = sessionStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null; // Kiểm tra xem userJson có giá trị null không
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(0);
    const baseUrl =RootPathApi()

    console.log(": "+reviews);
    useEffect(() => {
        // Lấy danh sách đánh giá từ server
        axios.get(`${baseUrl}/api/v1/review/all?product_id=${productId}`)
            .then(response => {
                setReviews(response.data);
                // console.log(response.data);
            })
            .catch(error => {
                    console.error('Có lỗi xảy ra khi lấy đánh giá:', error);
                }
            );
    }, [productId]);






    const handleShowLess = () => {
        setVisibleReviews(3); // Đặt visibleReviews về 3 khi nhấn "Ẩn bớt"
    };
    console.log(reviews);
    const averageRating = reviews.length > 0 ? (
        reviews.reduce((sum, review) => sum + review.rate, 0) / reviews.length
    ) : 0;

    // Sử dụng useEffect để gửi điểm trung bình lên cha
    useEffect(() => {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            const event = new CustomEvent('averageRatingCalculated', { detail: { averageRating } });
            window.dispatchEvent(event);
        }
    }, [averageRating]);
    console.log(averageRating);

    const handleDeleteClick = (reviewId) => {
        setIdToDelete(reviewId);
        setShowConfirmationModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`${baseUrl}/api/v1/review/delete?id=${idToDelete}`);

            if (response.status === 202) {
                setReviews(prevReviews => prevReviews.filter(r => r.id !== idToDelete));
                toast.success("Đánh giá đã được xóa thành công!");
            } else {
                toast.error(`Xóa đánh giá không thành công! (Mã lỗi: ${response.status})`);
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi xóa đánh giá:', error);
            toast.error("Xóa đánh giá không thành công! (Lỗi mạng)");
        } finally {
            setShowConfirmationModal(false); // Đóng modal sau khi xử lý
        }
    };


    return (
        <div id="review" className="tab-pane fade">

            <div className="group-title">
                <h2>Đánh giá của khách hàng ({reviews.length} Đánh giá)</h2>
            </div>

            <div className="review-list" style={{display: "flex", flexDirection: "column", gap: "20px",}}>
                {reviews.length > 0 ? (
                    [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, visibleReviews).map((review, index) => (
                        <div key={review.id} className="review-item" style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            borderRadius: "5px",
                        }}>
                            {review.user && review.user.email &&

                                <p> {review.user.fullname}</p>}
                            {review.user && user && user.email === review.user.email && (
                                <div style={{textAlign: 'right'}}> {/* Nút xóa */}
                                    <button type="button" className="delete-btn btn-lg"
                                            onClick={() => handleDeleteClick(review.id)}
                                            style={{float: 'right', alignItems: 'center'}}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                            )}
                            <div className="rating">

                                {[...Array(5)].map((star, i) => (
                                    <i
                                        key={i}
                                        className={`fa fa-star${i < review.rate ? "" : "-o"}`}
                                    ></i>
                                ))}
                            </div>
                            <p className="text-muted">Ngày đánh giá: {review.createdAt} | Danh mục sản phẩm: {review.product.category.value}</p>

                            <p>Chất lượng: {review.quality === "BAD" ? "Không tốt" : "Tốt"}</p>

                            <p>Nội dung: {review.content}</p>

                        </div>

                    ))) : (
                    <p>Không có dữ liệu</p> // Hiển thị thông báo khi không có đánh giá
                )}
                <div style={{display: "flex", gap: "10px"}}>
                    {visibleReviews < reviews.length && (
                        <button onClick={() => {
                            const added = Math.min(3, reviews.length - visibleReviews);
                            setVisibleReviews(prev => prev + added);
                            setLastAdded(added);
                        }} className="customer-btn">
                            Xem thêm
                        </button>
                    )}
                    {visibleReviews > 3 && (
                        <button onClick={handleShowLess} className="customer-btn">
                            Ẩn bớt
                        </button>
                    )}
                </div>
            </div>
            <ToastContainer/>
            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa đánh giá này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Review;