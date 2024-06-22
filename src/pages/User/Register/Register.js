import {useState} from "react";
import {useNavigate} from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import axios from "axios";
import Breadcrumb from "../../../component/User/Breadcrumb/Breadcrumb";
import RootPathApi from "../../../route/RootPathApi";

const Register = () => {
    const [fullname, setFullname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const baseUrl = RootPathApi()

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra ràng buộc của phoneNumber
        if (phoneNumber.length < 10) {
            setError('Số điện thoại phải có ít nhất 10 số');
            return;
        }

        // Kiểm tra ràng buộc của password
        if (password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự');
            return;
        }

        // Kiểm tra ràng buộc của confirmPassword
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        const data = JSON.stringify({
            fullname,
            email,
            password,
            phoneNumber,
            role: "USER",
            enabled:true
        });

        try {
            const response = await axios.post(`${baseUrl}/api/v1/auth/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            setError('Đăng ký thất bại');
        }
    };
    return (
        <>
            <Breadcrumb title={"Đăng ký"}/>
            <div className="register-account ptb-100 ptb-sm-60">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="register-title">
                                <h3 className="mb-10">ĐĂNG KÍ TÀI KHOẢN</h3>
                                <p className="mb-10">Nếu bạn chưa có tài khoản, vui lòng đăng kí tại đây.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            {error && <p style={{color: 'red'}}>{error}</p>}
                            <form className="form-register" onSubmit={handleSubmit}>
                                <fieldset>
                                    <legend>Thông tin cá nhân</legend>
                                    <div className="form-group d-md-flex align-items-md-center">
                                        <label className="control-label col-md-2" for="f-name"><span
                                            className="require">*</span>Họ và Tên</label>
                                        <div className="col-md-10">
                                            <input type="text" className="form-control" value={fullname}
                                                   onChange={(e) => setFullname(e.target.value)}
                                                   required name="name" id="f-name"
                                                   placeholder="Vui lòng nhập họ và tên.."/>
                                        </div>
                                    </div>
                                    <div className="form-group d-md-flex align-items-md-center">
                                        <label className="control-label col-md-2" for="email"><span className="require">*</span>Email</label>
                                        <div className="col-md-10">
                                            <input type="email" className="form-control" value={email}
                                                   onChange={(e) => setEmail(e.target.value)}
                                                   required name="email" id="email"
                                                   placeholder="Nhập địa chỉ email..."/>
                                        </div>
                                    </div>
                                    <div className="form-group d-md-flex align-items-md-center">
                                        <label className="control-label col-md-2" for="number"><span
                                            className="require">*</span>Số điện thoại</label>
                                        <div className="col-md-10">
                                            <input type="text" className="form-control" value={phoneNumber}
                                                   onChange={(e) => setPhoneNumber(e.target.value)}
                                                   required name="phone" id="number" placeholder="Số điện thoại"/>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Cài đặt mật khẩu</legend>
                                    <div className="form-group d-md-flex align-items-md-center">
                                        <label className="control-label col-md-2" for="pwd"><span className="require">*</span>Mật
                                            khẩu:</label>
                                        <div className="col-md-9">
                                            <input  type={showPassword ? "text" : "password"}
                                                    value={password}
                                                   onChange={(e) => setPassword(e.target.value)}
                                                   required className="form-control" name="password" id="pwd"
                                                   placeholder="Mật khẩu"/>

                                        </div>
                                        <div className="col-md-1">
                                            <button className="form-control"
                                                    onClick={() => setShowPassword(!showPassword)}>
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                                            </button>
                                        </div>

                                    </div>
                                    <div className="form-group d-md-flex align-items-md-center">
                                        <label className="control-label col-md-2" for="pwd-confirm"><span
                                            >*</span>Xác nhận mật khẩu</label>
                                        <div className="col-md-9">
                                            <input type={showConfirm ? "text" : "password"}  id="pwd-confirm"
                                                   onChange={(e) => setConfirmPassword(e.target.value)}
                                                   required className="form-control"
                                                   placeholder="Nhập lại mật khẩu..."/>
                                        </div>
                                        <div className="col-md-1">
                                            <button className="form-control"
                                                    onClick={() => setShowConfirm(!showConfirm)}>
                                                <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye}/>
                                            </button>
                                        </div>
                                    </div>

                                </fieldset>

                                <div className="terms">
                                    <div className="float-md-right">
                                        <span>Tôi đã đọc và đồng ý <a href="#" className="agree"><b>chính sách bảo mật của cửa hàng</b></a></span>
                                        <input type="checkbox" name="agree" value="1"/> &nbsp;
                                        <input type="submit" value="Tiếp tục" className="return-customer-btn"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Register