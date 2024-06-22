import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import * as XLSX from "xlsx";
import {Button, Modal} from "react-bootstrap";
import {DateRangePicker} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {format} from 'date-fns';
import {Link} from "react-router-dom";
import RootPathApi from "../../../route/RootPathApi";
import {notify} from "../../../util/notify/Notify";

function BlogManagement() {
    const [blogs, setBlogs] = useState([]);
    const [allBlogs, setAllBlogs] = useState([]);

    const [blog, setBlog] = useState([]);
    const accessToken = localStorage.getItem("accessToken");

    const [startDate, setStartDate] = useState(new Date);
    const [endDate, setEndDate] = useState(new Date);
    const [openDate, setOpenDate] = useState(false)

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const baseUrl = RootPathApi();
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/blogs`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }).then(res => {
            setBlogs(res.data)
            setAllBlogs(res.data)
            console.log(res.data)

        }).catch(error => {
            console.log("error:" + error)
        })
    }, [refresh]);

    const handleSelect = (date) => {
        let filtered = allBlogs.filter((blog) => {
            let blogDate = new Date(blog["dataCreate"]);
            return (
                blogDate >= date.selection.startDate &&
                blogDate <= date.selection.endDate
            );
        });
        setStartDate(date.selection.startDate);
        setEndDate(date.selection.endDate);
        setBlogs(filtered);
        console.log(date)
    }

    const handleClick = () => {
        setOpenDate((prev) => !prev);
    }

    const printDate = (number) => {
        return new Date(number).toLocaleString();
    }

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    }

    const handleBlogSelection = (blogId) => {
        if (selectedBlogs.includes(blogId)) {
            setSelectedBlogs(selectedBlogs.filter((id) => id !== blogId));
        } else {
            setSelectedBlogs([...selectedBlogs, blogId]);
        }
        console.log(selectedBlogs)
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedBlogs([]);
        } else {
            setSelectedBlogs(blogs.map(p => p.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleClearSelection = () => {
        if (selectedBlogs.length < 2) {
            setSelectedBlogs([]);
        } else {
            setSelectedBlogs([...selectedBlogs]);
        }
        console.log(selectedBlogs)
    };

    const deleteMultipleBlogs = async () => {
        try {
            const response = await axios.delete(`${baseUrl}/api/v1/blogs/deletes`, {
                data: {
                    blogIds: selectedBlogs,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            setRefresh(prev => !prev);

            // Gọi lại hook bằng cách thay đổi refreshTable
            setShowDeleteModal(false);
            setCurrentPage(1)
            setSelectedBlogs([])
            setIsAllSelected(false)
            notify("success", "Xóa bài viết thành công");
            console.log(response.status);
        } catch (error) {
            console.error('Error deleting blogs:', error);
        }
    };
    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };



    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(prevState => !dropdownOpen);
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(5);

    // Tìm kiếm đơn hàng
    const filteredItems = blogs.filter((order) => {
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
    const handleImportBlogs = async (event) => {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`${baseUrl}/api/v1/blogs/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setRefresh(prevState => !prevState)
            notify("success", "Thêm bài viết thành công");
        } catch (error) {
            notify("error", "Không thể thêm bài viết")
            console.error('Error:', error);
        }

    }


    const onExportExcel = () => {
        const worksheetData = blogs.map(blog => ({
            id: blog.id,
            title: blog.title,
            category: blog.category.name, // Lấy tên category từ đối tượng category
            description: blog.description,
            author: blog.author,
            content: blog.content,
            img: blog.img,
            dataCreate: blog.dataCreate
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Blogs');
        XLSX.writeFile(workbook, 'blogs.xlsx');
    };
    const [showUpdateBlog, setShowUpdateBlog] = useState(false);

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
            <Link to={`/admin/blog-management/add`}>
                <button className={"btn btn-success mb-2 p-2"}>+ Thêm bài viết</button>
            </Link>
            <button className={"btn btn-info mb-2 p-2 ml-2"}
                    onClick={handleButtonClick}> Nhập file
            </button>
            <input type="file" style={{display: "none"}} onChange={handleImportBlogs} ref={fileInputRef}/>
            {blogs.length>0?( <>
                <div className={"d-flex align-items-center mb-3"}>
                    <p className={"m-0"}>Hiển thị:</p>
                    <select className="form-select col-sm-auto" style={{width:"5%"}} onChange={(e) => setItemPerPage(e.target.value)}>
                        <option selected value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                    </select>
                    <div className="btn-group dropend no-print ml-2 pr-1" style={{position: 'relative'}}>
                        <button type="button" className="btn btn-primary" onClick={onExportExcel}>
                            Xuất file
                        </button>
                    </div>

                    <button className={"btn btn-danger"} hidden={selectedBlogs.length > 0 ? false : true}
                            onClick={() => setShowDeleteModal(true)}>Xóa nhiều
                    </button>
                    <input className="form-control ms-auto me-2 col-4" type="search" placeholder="Search"
                           aria-label="Search"
                           onChange={handleSearch}/>
                </div>
                <div>
                    <button onClick={handleClick} type="button" className="btn btn-primary" style={{margin: '3px 0px'}}>
                        {`${format(startDate, 'MMM,dd,yyyy')} to ${format(endDate, 'MMM,dd,yyyy')}`}
                    </button>
                    {openDate && <DateRangePicker
                        ranges={[selectionRange]}
                        onChange={handleSelect}
                        // minDate={startDate}
                    />}
                </div>

                <table className={"table text-left"}>
                    <thead>
                    <tr>
                        <th><input type={"checkbox"} onClick={() => handleSelectAll()}/></th>
                        <th>ID</th>
                        <th>Tên tác giả</th>
                        <th>Tên bài viết</th>
                        <th>Hình ảnh</th>
                        <th>Thể loại</th>
                        <th>Nội dung</th>
                        <th>Ngày viết</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems && currentItems.map((blog) => (
                        <tr key={blog.id}>
                            <th><input className={"mt-4"} type={"checkbox"} checked={selectedBlogs.includes(blog.id)}
                                       onChange={() => handleBlogSelection(blog.id)}/></th>
                            <td>{blog.id}</td>
                            <td>{blog.author}</td>
                            <td className="text-center">
                                {blog.title.slice(0, 25)}
                                {blog.title.length > 25 && '...'}
                            </td>
                            <td><img width={30} src={blog.img} alt={`bài viết ${blog.id}`}/></td>
                            <td>{blog.category.value}</td>
                            <td className="text-center">
                                {blog.description.slice(0, 90)}
                                {blog.description.length > 90 && '...'}
                            </td>
                            <td>{printDate(blog.dataCreate)}</td>
                            <td className="text-center">
                                <Link to={`/admin/blog-management/update/${blog.id}`}>
                                    <Button
                                        variant="success" onClick={() => {
                                        setShowUpdateBlog(true)
                                        setBlog(blog)
                                    }}>Sửa</Button>
                                </Link>


                            </td>
                            <td className="text-center">
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setShowDeleteModal(true)
                                        handleBlogSelection(blog.id)
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
            </>): (<div className="alert alert-warning" role="alert">
                Không có dữ liệu
            </div>)}


            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
                    <Modal.Title>Xóa bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa bài viết này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        handleClearSelection()
                        setShowDeleteModal(false)

                    }}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={deleteMultipleBlogs}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    )
}

export default BlogManagement;