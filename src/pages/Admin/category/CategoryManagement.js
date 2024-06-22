import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import axios from 'axios';
import {Link} from 'react-router-dom';
import {upImageFirebase} from "../../../component/User/comment/firebase/Upfirebase";
import {toast, ToastContainer} from "react-toastify";
import * as XLSX from "xlsx";
import RootPathApi from "../../../route/RootPathApi";


const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedValue, setUpdatedValue] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
    const [newName, setNewName] = useState("");
    const [newValue, setNewValue] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [hasData, setHasData] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categoriesPerPage, setCategoriesPerPage] = useState(5);
    const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);
    const baseUrl = RootPathApi()
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/category/all`);
                setCategories(response.data);
                setHasData(response.data.length > 0);
            } catch (error) {
                console.error(error);
                // Xử lý lỗi ở đây nếu cần
            }
        };

        fetchCategories();
    }, []);
    const handleUpdateClick = (category) => {
        setSelectedCategory(category);
        setUpdatedName(category.name); // Cập nhật state updatedName
        setUpdatedValue(category.value); // Cập nhật state updatedValue
        setShowUpdateModal(true);
    };
    const handleCloseUpdateModal = () => setShowUpdateModal(false);
    const handleUpdateCategory = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/v1/category/update/${selectedCategory.id}`,
                { name: updatedName, value: updatedValue }
            );
            // Cập nhật lại danh sách categories sau khi cập nhật thành công
            setCategories(prevCategories => prevCategories.map(cat =>
                cat.id === selectedCategory.id ? response.data : cat
            ));
            setUpdatedName("");
            setUpdatedValue("");
            toast.success("Cập nhật danh mục thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi cập nhật danh mục.");
        } finally {
            handleCloseUpdateModal();
        }
    };
    const handleDeleteClick = (categoryId) => {
        setCategoryIdToDelete(categoryId);
        setShowDeleteModal(true);
    };
    const handleConfirmDelete = () => {
        if (categoryIdToDelete) {
            handleDeleteCategory(categoryIdToDelete); // Truyền ID vào đây
            setShowDeleteModal(false);
            setCategoryIdToDelete(null); // Reset lại ID
        }
    };
    const handleDeleteCategory = async (categoryId) => {

            try {
                await axios.delete(`${baseUrl}/api/v1/category/delete/${categoryId}`);
                setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));
                toast.success("Xóa danh mục thành công!");
            } catch (error) {
                console.error(error);
                toast.error("Có lỗi xảy ra khi xóa danh mục.");
            }

    };
    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setNewName("");
        setNewValue("");
    };
    const handleAddCategory = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/v1/category/add`, {
                name: newName,
                value: newValue,
            });

            setCategories(prevCategories => [...prevCategories, response.data]); // Thêm danh mục mới vào state
            setNewName("");
            setNewValue("");
            toast.success("Thêm danh mục thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi thêm danh mục.");
        } finally {
            handleCloseAddModal();
        }
    };

    const handleCheckboxChange = (categoryId) => {
        if (categoryId === "all") { // Kiểm tra xem có phải checkbox "Chọn tất cả" hay không
            setSelectAll(!selectAll);
            setSelectedCategories(selectAll ? [] : categories.map(cat => cat.id));
        } else {
            setSelectedCategories(prevSelected => {
                if (prevSelected.includes(categoryId)) {
                    return prevSelected.filter(id => id !== categoryId);
                } else {
                    return [...prevSelected, categoryId];
                }
            });
            setSelectAll(selectedCategories.length + 1 === categories.length); // Kiểm tra xem có nên tích "Chọn tất cả"
        }
    };


    const toggleDropdown = () => {
        setDropdownOpen(prevState => !dropdownOpen);
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);


    const filteredCategories = categories.filter(category => {
        const categoryValues = Object.values(category).join(' ').toLowerCase();
        return categoryValues.includes(searchTerm.toLowerCase());
    });
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCategories.length / categoriesPerPage); i++) {
        pageNumbers.push(i);
    }
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Render số trang

    const handleDeleteMultiple = () => {
        if (selectedCategories.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một danh mục để xóa.");
            return;
        }
        setShowDeleteMultipleModal(true); // Hiển thị modal xác nhận
    };
    const handleConfirmDeleteMultiple = async () => {
        try {
            // Gọi API DELETE để xóa nhiều danh mục
            await axios.delete(`${baseUrl}/api/v1/category/delete-multiple`, {
                data: selectedCategories, // Truyền mảng các ID cần xóa
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Cập nhật lại danh sách categories sau khi xóa
            setCategories(prevCategories =>
                prevCategories.filter(category => !selectedCategories.includes(category.id))
            );

            // Xóa các lựa chọn và thông báo thành công
            setSelectedCategories([]);
            toast.success("Xóa danh mục thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi xóa danh mục.");
        } finally {
            setShowDeleteMultipleModal(false); // Đóng modal sau khi xóa
        }
    };


    console.log(selectedCategories)


    return(
        <div>
            <ToastContainer/>
            <div className={"container-xl"}>
                <button className={"btn btn-success mb-2 p-2"} onClick={handleAddClick} >+ Thêm danh mục</button>
                <br/>
                {hasData ? ( // Hiển thị bảng và nút khi có dữ liệu
                    <>
                        <Button className={"btn btn-danger mb-1"} onClick={handleDeleteMultiple}
                                hidden={selectedCategories.length === 0}>
                            Xóa các mục đã chọn
                        </Button>
                        <div className="d-flex align-items-center mb-2">
                            <p className="m-0">Hiển thị:</p>
                            <select
                                className="form-select col-1"
                                value={categoriesPerPage}
                                onChange={(e) => {
                                    setCategoriesPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                            </select>


                        </div>

                        <table className="table text-left">
                            <thead>
                            <tr>
                                <th className="text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={() => handleCheckboxChange("all")} //
                                    />
                                </th>


                                <th className="text-center">Tên danh mục</th>

                                <th className="text-center">Nội dung</th>


                                <th className="text-center"></th>

                                <th></th>
                            </tr>
                            </thead>
                            <tbody>

                            {currentCategories.map((category) => (
                                <tr key={category.id}>
                                    <th className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => handleCheckboxChange(category.id)}
                                        />
                                    </th>

                                    <td className="text-center">{category.name}</td>
                                    <td className="text-center">{category.value}</td>
                                    <td className="text-center">
                                        <button type="button" className="btn btn-success" onClick={() => {

                                            handleUpdateClick(category)
                                        }}>
                                            Cập nhật
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteClick(category.id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            </tbody>
                        </table>
                        <nav className={"d-flex justify-content-end"}>
                            <ul className="pagination">
                                {pageNumbers.map(number => (
                                    <li key={number} className={`page-item ${number === currentPage ? "active" : ""}`}>
                                        <a onClick={() => paginate(number)} href="#" className="page-link">{number}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </>
                ) : (
                    <>
                        <p className="text-center">Không có dữ liệu</p>

                    </>
                )}

            </div>
            <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
                {/* ... (Modal.Header) */}
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên danh mục"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formValue">
                            <Form.Label>Giá trị</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập giá trị"
                                value={updatedValue}
                                onChange={(e) => setUpdatedValue(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUpdateModal}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleUpdateCategory}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {

                        setShowDeleteModal(false)

                    }}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleConfirmDelete}>
                        Xóa

                    </Button>

                </Modal.Footer>
            </Modal>
            <Modal show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm danh mục mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewName">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên danh mục"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNewValue">
                            <Form.Label>Giá trị</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập giá trị"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddCategory}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDeleteMultipleModal} onHide={() => setShowDeleteMultipleModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa nhiều danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa các danh mục đã chọn?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteMultipleModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleConfirmDeleteMultiple}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}
export default CategoryManagement