import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {Button, Modal} from "react-bootstrap";
import * as XLSX from "xlsx";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock, faUnlock} from '@fortawesome/free-solid-svg-icons';
import UserManagementAdd from "./UserManagementAdd";
import {Link} from "react-router-dom";
import RootPathApi from "../../../route/RootPathApi";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const userJson = JSON.parse(sessionStorage.getItem("user"));
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const baseUrl = RootPathApi();
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/management/users`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
            .then(res => {
                setUsers(res.data);
                console.log(res.data);
            }).catch(error => {
            console.log("error:" + error)
        });
    }, [refresh]);

    const handleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
        console.log(selectedUsers);
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(u => u.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleClearSelection = () => {
        setSelectedUsers([]);
        console.log(selectedUsers);
    };

    const deleteMultipleUsers = async () => {
        try {
            const filteredSelectedUsers = selectedUsers.filter(userId => userId !== userJson.id);

            const remainingUsers = users.filter(user => !filteredSelectedUsers.includes(user.id));
            const remainingAdmins = remainingUsers.filter(user => user.roles.includes('ADMIN'));

            if (remainingAdmins.length === 0) {
                toast.error('Không thể xóa, Vui lòng không xóa tài khoản đang đăng nhập!');
                return;
            }

            const response = await axios.delete(`${baseUrl}/api/v1/management/users/deletes`, {
                data: {
                    userIds: filteredSelectedUsers,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            setRefresh(prev => !prev);
            setShowDeleteModal(false);
            setCurrentPage(1);
            setSelectedUsers([]);
            setIsAllSelected(false);
            notify();
            console.log(response.status);
        } catch (error) {
            console.error('Error deleting users:', error);
        }
    };

    const notify = () => {
        toast.success('Xoá thành công', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(5);

    const filteredItems = users.filter((user) => {
        const userValues = Object.values(user).join(' ').toLowerCase();
        return userValues.includes(searchTerm.toLowerCase());
    });

    const indexOfLast = currentPage * itemPerPage;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredItems.length / itemPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const onExportExcel = () => {
        const worksheetData = users.map(user => ({
            id: user.id,
            fullname: user.fullname,
            email: user.email, // Lấy tên category từ đối tượng category
            phoneNumber: user.phoneNumber,
            roles: user.roles,
            createdAt: user.createdAt
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        XLSX.writeFile(workbook, 'users.xlsx');
    };

    const renderIcon = (isEnabled) => {
        if (isEnabled) {
            return <FontAwesomeIcon icon={faUnlock}/>;
        } else {
            return <FontAwesomeIcon icon={faLock}/>;
        }
    };

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <button className={"btn btn-success mb-2 p-2"} onClick={() => setShowAdd(true)}>+ Thêm người dùng
            </button>
            {users.length > 0 ? (<>
                <div className={"d-flex align-items-center mb-3"}>
                    <p className={"m-0"}>Hiển thị:</p>
                    <select className="form-select col-1" onChange={(e) => setItemPerPage(e.target.value)}>
                        <option selected value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                    </select>
                    <div className="btn-group dropend no-print ml-2 mr-2">
                        <button type="button" className="btn btn-primary" onClick={onExportExcel}>
                            Xuất file
                        </button>
                    </div>

                    <button className={"btn btn-danger"} hidden={selectedUsers.length > 0 ? false : true}
                            onClick={() => setShowDeleteModal(true)}>Xóa nhiều
                    </button>
                    <input className="form-control ms-auto me-2 col-4" type="search" placeholder="Search"
                           aria-label="Search"
                           onChange={handleSearch}/>
                </div>

                <table className={"table text-left"}>
                    <thead>
                    <tr>
                        <th><input type={"checkbox"} onClick={() => handleSelectAll()}/></th>
                        <th>ID</th>
                        <th>Tên người dùng</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Quyền</th>
                        <th>Hiển thị</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems && currentItems.map(user => (
                        <tr key={user.id}>
                            <th><input className={"mt-4"} type={"checkbox"} checked={selectedUsers.includes(user.id)}
                                       onChange={() => handleUserSelection(user.id)}/></th>
                            <td>{user.id}</td>
                            <td>{user.fullname}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.roles}</td>
                            <td className="text-center">
                                {renderIcon(user.enabled)}
                            </td>
                            <td className="text-center">
                                <Link to={`/admin/user-management/update/${user.id}`}>
                                    <Button>Sửa</Button>
                                </Link>
                            </td>
                            <td className="text-center">
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setShowDeleteModal(true)
                                        handleUserSelection(user.id)
                                    }}
                                    className="btn-delete"
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </>) : (<div className="alert alert-warning" role="alert">
                Không có dữ liệu
            </div>)}

            <nav className={"d-flex justify-content-end"}>
                <ul className="pagination">
                    {pageNumbers.map((number) => (
                        <li key={number} className={`page-item ${number === currentPage ? "active" : ""}`}>
                            <a
                                onClick={() => paginate(number)}
                                href="#"
                                className="page-link"
                            >
                                {number}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa tài khoản này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        handleClearSelection()
                        setShowDeleteModal(false)
                    }}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={deleteMultipleUsers}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
            <UserManagementAdd show={showAdd} onHide={() => {
                setShowAdd(false)
                setRefresh(pre => !pre)
            }}/>
        </div>
    );
}