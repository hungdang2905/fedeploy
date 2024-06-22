import {Link, useNavigate} from "react-router-dom";
import React, { useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Toast from "../Login/Toast";
import RootPathApi from "../../../route/RootPathApi";
function ForgetPass() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [errorr, setError] = useState('');
    const baseUrl = RootPathApi()
    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await axios.post(`${baseUrl}/api/v1/auth/forgot_password`,
                {
           "email":email
                },
                {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if(response.data===true){
                toast.success("Vui lòng kiểm tra email");
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Vui lòng kiểm tra email. Sẽ chuyển trang trong 3 giây.',
                    timer: 3000, // Tự động đóng sau 3 giây
                    timerProgressBar: true, // Hiển thị thanh tiến trình
                }).then(() => {
                    navigate("/confirm");
                });

            }else{
                setError('Thất bại');
                Toast("false")
                console.log(response.data)
            }
            // console.log(response.data);
            //
            // toast.success("Vui lòng kiểm tra email");
            // setTimeout(() => {
            //     navigate('/confirm');
            // }, 3000);

        } catch (error) {
            setError('thất bại');
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
                                    <h2 className="fs-6 fw-normal text-center text-secondary m-0 px-md-5">Vui lòng nhập
                                        email của bạn để khôi phục mật khẩu .</h2>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="row gy-3 gy-md-4 overflow-hidden">
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">
                                            Email <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-envelope"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                                                </svg>
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="d-grid">
                                            <button className="btn btn-primary btn-lg" type="submit">
                                                Gửi
                                            </button>
                                        </div>
                                    </div>
                                    <p hidden={errorr===""}>{errorr}</p>
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
            <ToastContainer />
        </div>
    )
        ;
}

export default ForgetPass;
