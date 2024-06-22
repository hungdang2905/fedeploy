import {Button, Modal} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProductManagementUpdate from "./ProductManagementUpdate";
import ProductManagementAdd from "./ProductManagementAdd";
import {notify} from "../../../util/notify/Notify";
import CurrencyFormatter from "../../../util/CurrencyFormatter";
import RootPathApi from "../../../route/RootPathApi";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const accessToken = localStorage.getItem("accessToken");
    const baseUrl = RootPathApi()
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/products/getAll`).then(res => {
            setProducts(res.data)
            console.log(res.data)
        }).catch(error => {
            console.log("error:" + error)
        })
    }, [refresh]);
    const handleProductSelection = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter((id) => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
        console.log(selectedProducts)
    };
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(p => p.id));
        }
        setIsAllSelected(!isAllSelected);
    };
    const handleClearSelection = () => {
        if (selectedProducts.length < 2) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts([...selectedProducts]);
        }
        console.log(selectedProducts)
    };
    const deleteMultipleProducts = async () => {
        try {
            const response = await axios.delete(`${baseUrl}/api/v1/management/product/delete/products`, {
                data: {
                    productIds: selectedProducts,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            setRefresh(prev => !prev);

            // Gọi lại hook bằng cách thay đổi refreshTable
            setShowDeleteModal(false);
            setCurrentPage(1)
            setSelectedProducts([])
            setIsAllSelected(false)
            notify("success", "Xóa sản phẩm thành công")
            console.log(response.status);
        } catch (error) {
            notify("error", "Xóa sản phẩm thất bại")
            console.error('Error deleting products:', error);
        }
    };
    const checkProductInStock = (quantity) => {
        if (quantity === 0) {
            return (
                <button className={'btn btn-secondary'}>Hết hàng</button>
            )
        }
        if (quantity < 10 && quantity > 0) {
            return (
                <button className={'btn btn-warning'}>Sắp hết</button>
            )
        }
        if (quantity >= 10) {
            return (
                <button className={'btn btn-primary'}>Còn hàng</button>
            )
        }
    }

    //handle table
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(prevState => !dropdownOpen);
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(10);

    // Tìm kiếm đơn hàng
    const filteredItems = products.filter((order) => {
        const orderValues = Object.values(order).join(' ').toLowerCase();
        return orderValues.includes(searchTerm.toLowerCase());
    });

    // Lấy danh sách đơn hàng cho trang hiện tại
    const indexOfLast = currentPage * itemPerPage;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);

    // Chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Render số trang
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredItems.length / itemPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi tìm kiếm
    };


    const onExportExcel = () => {
        const worksheetData = products.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description,
            category: product.category.name, // Lấy tên category từ đối tượng category
            price: product.price,
            storage: product.storage,
            sale: product.sale,
            img1: product.img1,
            img2: product.img2
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        XLSX.writeFile(workbook, 'product' + Date.now() + '.xlsx');
        notify("success", "Xuất sản phẩm thành công")

    };
    const [showUpdateProduct, setShowUpdateProduct] = useState(false);
    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
    const handleImportProduct = async (event) => {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`${baseUrl}/api/v1/management/product/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setRefresh(prevState => !prevState)
            notify("success", "Nhập sản phẩm thành công")
        } catch (error) {
            notify("error", "Không thể nhập sản phẩm")
            console.error('Error:', error);
        }

    }

    return (
        <div>

            <ToastContainer/>
            <button className={"btn btn-success mb-2 p-2"} onClick={() => setShowAdd(true)}>+ Thêm sản phẩm
            </button>
            <button className={"btn btn-info mb-2 p-2 ml-3"}
                    onClick={handleButtonClick}> Import
            </button>
            <input type="file" style={{display: "none"}} onChange={handleImportProduct} ref={fileInputRef}/>


            {products.length > 0 ? (
                <>
                    <div className={"d-flex align-items-center mb-3"}>
                        <p className={"m-0"}>Hiển thị:</p>
                        <select className="form-select col-sm-auto" style={{width:"5%"}}  onChange={(e) => setItemPerPage(e.target.value)}>
                            <option selected value="10">10</option>
                            <option value="15">15</option>
                            <option value="25">25</option>
                        </select>
                        <div className="btn-group dropend no-print ml-2 mr-2">
                            <div className="btn-group dropend no-print ml-2 pr-1" style={{position: 'relative'}}>
                                <button type="button" className="btn btn-primary" onClick={onExportExcel}>
                                    Xuất file
                                </button>
                            </div>
                        </div>
                        <button className={"btn btn-danger"} hidden={selectedProducts.length > 0 ? false : true}
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
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Loại</th>
                            <th className={'text-left'}>Giá</th>
                            <th>Giảm giá(%)</th>
                            <th>Số lượng</th>
                            <th>Trạng thái</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems && currentItems.map((product) => (
                            <tr key={product.id}>
                                <th><input className={"mt-4"} type={"checkbox"}
                                           checked={selectedProducts.includes(product.id)}
                                           onChange={() => handleProductSelection(product.id)}/></th>
                                <td>{product.id}</td>
                                <td><img width={30} src={product.img1} alt={`sản phẩm ${product.id}`}/></td>
                                <td>{product.title}</td>
                                <td>{product.category.name}</td>
                                <td className="text-center"><CurrencyFormatter value={product.price}/> ₫</td>
                                <td className="text-center">{product.sale}</td>
                                <td className="text-center">
                                    {product.storage}
                                </td>
                                <td>
                                    {checkProductInStock(product.storage)}
                                </td>
                                <td className="text-center">

                                    <Button
                                        variant="success" onClick={() => {
                                        setShowUpdateProduct(true)
                                        setProduct(product)
                                    }}>Sửa</Button>

                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            setShowDeleteModal(true)
                                            handleProductSelection(product.id)
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
                </>
            ) : (<div className="alert alert-warning" role="alert">
                Không có dữ liệu
            </div>)}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa sản phẩm này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        handleClearSelection()
                        setShowDeleteModal(false)

                    }}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={deleteMultipleProducts}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
            <ProductManagementAdd show={showAdd} onHide={() => {
                setShowAdd(false)
                setRefresh(pre => !pre)
            }}/>
            <ProductManagementUpdate show={showUpdateProduct} onHide={() => {
                setShowUpdateProduct(false)
                setRefresh(pre => !pre)
            }} id={product.id}/>


        </div>
    )
}
export default ProductManagement