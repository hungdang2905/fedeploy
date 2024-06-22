import React, {useState} from 'react';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import {Link} from "react-router-dom";
import RootPathApi from "../../../route/RootPathApi";

function ProductReviewForm({productId, onReviewSubmit, user}) {
    const [review, setReview] = useState({
        rate: 1,
        content: '',
        email: user ? user.email : '',
        productId,
        quality: 'GOOD',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const baseUrl = RootPathApi()
    const handleChange = (event) => {
        const {name, value} = event.target;
        setReview(prevReview => ({
            ...prevReview,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const quality = review.rate < 3 ? "BAD" : "GOOD";
            const response = await axios.post(`${baseUrl}/api/v1/review/create`, {
                ...review,
                quality,
            });

            if (response.data.id === -999 || response.data.id === 0) {
                toast.error("Bạn chưa mua sản phẩm!");
            } else {
                onReviewSubmit(response.data); // Gọi hàm callback để cập nhật danh sách đánh giá
                toast.success("Đánh giá của bạn đã được gửi thành công!");
                setReview({rate: 1, content: '', email: user ? user.email : '', productId, quality: 'GOOD'});
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi gửi đánh giá:', error);
            toast.error("Có lỗi xảy ra khi gửi đánh giá!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="rate">Đánh giá:</label>
                    <div className="rating">
                        {[...Array(5)].map((star, i) => (
                            <i
                                key={i}
                                className={`fa fa-star${i < review.rate ? '' : '-o'}`}
                                onClick={() => setReview({...review, rate: i + 1})}
                            />
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="content">Nội dung:</label>
                    <textarea
                        className="form-control"
                        id="content"
                        name="content"
                        value={review.content}
                        onChange={handleChange}
                        rows="5"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
            </form>


        </div>
    );
}

export default ProductReviewForm;