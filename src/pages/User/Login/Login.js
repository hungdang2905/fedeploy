import Breadcrumb from "../../../component/User/Breadcrumb/Breadcrumb";

import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

import React, {useState} from "react";


import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

import {useGoogleLogin} from "@react-oauth/google";
import RootPathApi from "../../../route/RootPathApi";


const Login = () => {


    const [email, setEmail] = useState('');
    const [error1, setError1] = useState('');
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const baseUrl = RootPathApi()

    const handleLoginGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${response.access_token}`,
                        },
                    })
                const user = {
                    fullname: res.data.name,
                    email: res.data.email,
                    role: "USER"
                }
                const resGG =await axios.post(`${baseUrl}/api/v1/auth/login/google`, user)
                sessionStorage.setItem("user",JSON.stringify(resGG.data.user))
                console.log(res)
                console.log(user.role)
                navigate("/products")
            } catch (err) {
                console.log(err)
            }
        },



    });
    const handleLogin = async (e) => {
        e.preventDefault();
        if (email === "") {
            setError("")
            setError1("Vui lòng nhập email")
        }
        if (password === "") {
            setError("")
            setError2("Vui lòng nhập password")
        } else {
            try {
                const response = await axios.post(`${baseUrl}/api/v1/auth/login`, {email, password});
                // Lưu access token vào localStorage hoặc Redux store
                const accessToken = response.data.access_token;
                const refeshToken = response.data.refresh_token;
                const user = response.data.user;
                // eslint-disable-next-line react-hooks/rules-of-hooks


                // Lưu access token vào localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refeshToken', refeshToken);


                sessionStorage.setItem("user", JSON.stringify(user));

                console.log('Access token:', accessToken);
                console.log('Refesh token:', response.data.access_token);
                setError1("")
                setError2("")
                console.log('User:', response.data.user);
                navigate("/products")
            } catch (error) {
                setError("Đăng nhập thất bại");
                setError1("")
                setError2("")
                console.error('Đăng nhập thất bại:', error);
            }
        }


    };

    return (<div className="wrapper">
        <Breadcrumb title={"Đăng nhập"}/>
        <div className="log-in ptb-100 ptb-sm-60">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="well mb-sm-30">
                            <div className="new-customer">
                                <h3 className="custom-title">ĐĂNG KÍ</h3>
                                <br/>
                                <p>Bằng cách tạo tài khoản, bạn sẽ có thể mua sắm nhanh hơn, cập nhật trạng thái đơn
                                    hàng và theo dõi các đơn hàng bạn đã thực hiện trước đó</p>
                                <Link to={"/register"} className="customer-btn">Tiếp tục</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="well">
                            <div className="return-customer">
                                <h3 className="mb-10 custom-title">ĐĂNG NHẬP</h3>
                                <br/>
                                <form onSubmit={handleLogin} encType={password}>
                                    <label>Tài khoản</label>
                                    <div className="form-group d-md-flex align-items-md-center">
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                               name="email" placeholder="Nhập username..." id="input-email"
                                               className="form-control"/>
                                        {error1 && <p style={{color: 'red'}}>{error1}</p>}
                                    </div>
                                    <label>Mật khẩu</label>
                                    <div className="form-group d-md-flex align-items-md-center">

                                        <div className="col-md-10 p-0 mr-3">
                                            <input type={showPassword ? "text" : "password"}
                                                   value={password}
                                                   onChange={(e) => setPassword(e.target.value)}
                                                   required className="form-control" name="password" id="pwd"
                                                   placeholder="Mật khẩu"/>

                                        </div>
                                        <div className="col-md-2">
                                            <button className="form-control"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // Ngăn chặn hành động mặc định của form
                                                        setShowPassword(!showPassword);
                                                    }}>
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                                            </button>
                                        </div>

                                        {error2 && <p style={{color: 'red'}}>{error2}</p>}
                                    </div>
                                    {error && <p style={{color: 'red'}}>{error}</p>}
                                    <p className="lost-password"><Link to={"/forget"}>Quên mật khẩu?</Link></p>
                                    <input type="submit" value="Đăng nhập" style={{width: "100%"}}
                                           className="return-customer-btn "/>
                                    <div className={"mt-2 d-flex justify-content-center"} style={{width: "100%"}}>
                                        <div className="d-flex align-items-center">
                                            <div className={"mt-3 ml-2"} onClick={() => handleLoginGoogle()}><img
                                                style={{width: "70px"}} src={"assets/img/icon/googleIcon.jpg"}
                                                alt="google icon"/></div>
                                        </div>
                                    </div>
                                    <br/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}
export default Login