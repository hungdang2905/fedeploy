import {Button, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {notify} from "../../../util/notify/Notify";
import {useNavigate, useParams} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import RootPathApi from "../../../route/RootPathApi";

function UserManagementUpdate(){
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const {id} = useParams();
    const baseUrl = RootPathApi();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/management/users/user/${id}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
            .then(res => {
                setUser(res.data)
                console.log(res.data)
            })
            .catch(error => console.log("error:", error));
    }, [id]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (user.fullname==='') {
            notify("error", "Vui lòng nhập họ và tên !!!")
            return;
        }
        if (user.email==='') {
            notify("error", "Vui lòng nhập email !!!")
            return;
        }
        if (user.phoneNumber==='') {
            notify("error", "Vui lòng nhập số điện thoại !!!")
            return;
        }
        if (user.fullname !== '' && user.email !== '' && user.phoneNumber !== '' ) {
            const data = {
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                roles: user.roles,
                enabled: user.enabled
            }
            console.log(data)
            await axios.put(`${baseUrl}/api/v1/management/users/update/${id}`, data,{headers: {
                    Authorization: `Bearer ${accessToken}`,
                }}
            ).then(res => {
                console.log(res.data)
                notify("success","Đã cập nhật người dùng");
                navigate('/admin/user-management');
            }).catch(err => {
                console.log(err)
            })

        }
    }

    const updateHTML=()=>{
        return(
            <div>
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title>Cập nhật người dùng</Modal.Title>
                    </Modal.Header>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3 text-left" controlId="fullname">
                                <Form.Label>Họ Và Tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập họ và tên"
                                    name="fullname"
                                    value={user.fullname}
                                    autoFocus
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 text-left" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Nhập email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 text-left" controlId="phoneNumber">
                                <Form.Label>Số Điện Thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập số điện thoại"
                                    name="phoneNumber"
                                    value={user.phoneNumber}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 text-left" controlId="roles">
                                <Form.Label>Quyền</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="roles"
                                    value={user.roles}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="MANAGER">MANAGER</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3 text-left" controlId="enabled">
                                <Form.Label>Hiển thị</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="enabled"
                                    value={user.enabled}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="true">Tài khoản còn khả dụng</option>
                                    <option value="false">Khóa tài khoản</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => window.history.back()}>
                            Hủy
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Cập nhật
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }


    return(
        <div>
            <ToastContainer/>
            {user && updateHTML()}
        </div>
    );
}
export default UserManagementUpdate