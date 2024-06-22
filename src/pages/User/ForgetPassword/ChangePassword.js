import {Link, useNavigate,useLocation} from "react-router-dom";
import React, {useState} from "react";
import axios from "axios";
import Toast from "../Login/Toast";
import Swal from 'sweetalert2';
import RootPathApi from "../../../route/RootPathApi";

function ChangePassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const baseUrl = RootPathApi()

    const handleSubmit =async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${baseUrl}/api/v1/auth/reset_password`, {},
                {
                    params: {
                        token:location.state.token,
                        password:pass

                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            if(response.data===true){
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Bạn đã cập nhật mật khẩu thành công. Sẽ chuyển đến trang đăng nhập trong 3 giây.',
                    timer: 3000, // Tự động đóng sau 3 giây
                    timerProgressBar: true, // Hiển thị thanh tiến trình
                }).then(() => {
                    navigate("/login");
                });

            }else{
                setError('Đăng ký thất bại');
                Toast("false")
                console.log(response.data)
            }

        } catch (error) {
            setError('Đăng ký thất bại');
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
                                        <p style={{  fontSize: '18px', fontWeight: 'bold' }}>Nhập mật khẩu mới</p>

                                    </div>
                                </div>
                                <div className="card-body">
                                    <form className="form was-validated" role="form" autoComplete="off" id="loginForm"
                                          noValidate="" method="POST" onSubmit={handleSubmit}>
                                        <div className="form-group d-md-flex align-items-md-center">
                                            <input type="password"
                                                   required
                                                   name="password" placeholder="Nhập mật khẩu mới" id="input-pass"
                                                   className="form-control"     value={pass}
                                                   onChange={(e) => setPass(e.target.value)}/>

                                        </div>


                                        <button type="submit" className="btn btn-success btn-lg float-right"

                                                id="btnLogin">Xác nhận
                                        </button>
                                        <p hidden={error === ""} className={"text-danger"}>{error}</p>
                                    </form>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ChangePassword