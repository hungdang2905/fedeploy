import {Button, Form, Modal} from "react-bootstrap";
import React, {useState} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import RootPathApi from "../../../route/RootPathApi";

const UserManagementAdd = ({show, onHide}) => {
    const [fullname, setFullname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const baseUrl = RootPathApi();
    const accessToken = localStorage.getItem("accessToken");
    const handleClose = () => {
        onHide();
    };
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
            enabled: true
        });

        try {
            const response = await axios.post(`${baseUrl}/api/v1/auth/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response.data);
        } catch (error) {
            setError('Đăng ký thất bại');
        }
        handleClose()
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} className={"text-left"}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm người dùng</Modal.Title>
                </Modal.Header>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3 text-left" controlId="fullname">
                            <Form.Label>Họ Và Tên</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập họ và tên"
                                value={fullname}
                                autoFocus
                                onChange={(e) => setFullname(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 text-left" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 text-left" controlId="phoneNumber">
                            <Form.Label>Số Điện Thoại</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập số điện thoại"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </Form.Group>
                        <div className="row">
                            <Form.Group className="mb-3 text-left col-6" controlId="password">
                                <Form.Label>Mật Khẩu</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                                    </button>
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3 text-left col-6" controlId="confirmPassword">
                                <Form.Label>Xác Nhận Mật Khẩu</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Nhập lại mật khẩu"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    >
                                        <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye}/>
                                    </button>
                                </div>
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default UserManagementAdd