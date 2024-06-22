import {Link, useNavigate} from "react-router-dom";
import React, {useState} from 'react';
import axios from "axios";
import Toast from '../Login/Toast'
import CountdownComponent from "./CountdownComponent";
import {toast, ToastContainer} from "react-toastify";
import RootPathApi from "../../../route/RootPathApi";

function Confirm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [errorr, setError] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false); // Thêm state để kiểm soát hiển thị thông báo lỗi
    const baseUrl = RootPathApi()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${baseUrl}/api/v1/auth/reset_password`,
                {
                    params: {
                        token: email,

                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            if (response.data === true) {
                toast.success('Mã xác nhận chính xác.');
                setTimeout(() => {
                    navigate('/changepassword', {state: {token: email}});
                }, 1000);

            } else {
                setError('Mã xác nhận không đúng.');
                toast.error('Mã xác nhận không đúng.');
                setShowErrorMessage(true);
                Toast("false")
                console.log(response.data)

            }

        } catch (error) {
            setError('Mã xác nhận không đúng.');
            toast.error('Mã xác nhận không đúng.');
            setShowErrorMessage(true);
        }


    };

    return (
        <div className="bg-light py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                        <div className="bg-white p-4 p-md-5 rounded shadow-sm">
                            <div className="row gy-3 mb-5">
                                <div className="col-12">
                                    <div className="text-center">

                                    </div>
                                </div>
                                <div className="col-12">
                                    <CountdownComponent/>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="row gy-3 gy-md-4 overflow-hidden">
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">
                                            Mã xác nhận <span className="text-danger">*</span>
                                        </label>

                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="email"
                                                id="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}

                                            />
                                        </div>

                                        {showErrorMessage && ( // Hiển thị thông báo lỗi khi showErrorMessage là true
                                            <p style={{color: 'red'}}>{errorr}</p>
                                        )}
                                    </div>
                                    <div className="col-12">
                                        <div className="d-grid">
                                            <button className="btn btn-primary btn-lg" type="submit">
                                                Gửi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="row">
                                <div className="col-12">
                                    <hr className="mt-5 mb-4 border-secondary-subtle"/>
                                    <div className="d-flex gap-4 justify-content-center">
                                        <Link to={"/login"} className="link-secondary text-decoration-none">Đăng
                                            nhập</Link>
                                        <Link to={"/register"} className="link-secondary text-decoration-none">Đăng
                                            ký</Link>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
        ;
}

export default Confirm;
