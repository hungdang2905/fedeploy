import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import RootPathApi from "../../../route/RootPathApi";

function EvaluateModal({show, handleClose, product, userId}) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const navigate = useNavigate();
    const baseUrl = RootPathApi()
    const handleSubmit = async () => {
        const token = localStorage.getItem("accessToken");
        let id_user = sessionStorage.getItem("user");
        const user = JSON.parse(id_user);
        const quality = rating <= 2 ? "BAD" : "GOOD";
        console.log(token);
        const evaluate = {
            rate: rating,
            content: comment,
            quality,
            email: user.email, // Sử dụng userId từ props
            order_id: product.orderId, // Sử dụng orderId từ product props
            roles: "USER", // Hoặc role thích hợp khác
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            const response = await axios.post(`${baseUrl}/api/v1/evaluate/post`, evaluate);
            console.log(response)
            navigate('/history')
        } catch (e) {
            console.log(e)
        }
    };

    const ratingChanged = (newRating) => {
        setRating(newRating);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Đánh giá sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {product ? (
                    <Form>
                        <Form.Group>
                            <Form.Label><b>ID đơn hàng:</b> {product.orderId}</Form.Label>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center align-items-center flex-column mb-2">
                            <Form.Label><b>Đánh giá</b></Form.Label>
                            <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                size={24}
                                activeColor="#ffd700"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><b>Nhận xét của bạn</b></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                ) : (
                    <p>Không có thông tin sản phẩm</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Gửi đánh giá
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EvaluateModal;
