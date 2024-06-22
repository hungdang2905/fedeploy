import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import axios from 'axios';
import {Link} from 'react-router-dom';
import {upImageFirebase} from "../../../component/User/comment/firebase/Upfirebase";
import {toast, ToastContainer} from "react-toastify";
import * as XLSX from "xlsx";
import RootPathApi from "../../../route/RootPathApi";


const CommentManagement = () => {
    const [comments, setComments] = useState([]);
    const [selectedCommentId, setSelectedCommentId] = useState(null); // State to track the selected comment for reply modal
    const [newCommentChild, setNewCommentChild] = useState("");
    const [imageFileChild, setImageFileChild] = useState(null);
    const [selectedCommentChild, setSelectedCommentChild] = useState([]);

    const [selectedComments, setSelectedComments] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedCommentContent, setSelectedCommentContent] = useState(""); // State để lưu trữ nội dung của comment mà người dùng đã chọn để trả lời

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [isAllSelected, setIsAllSelected] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [commentsPerPage, setCommentsPerPage] = useState(5);
    const accessToken = localStorage.getItem("accessToken");
    const baseUrl = RootPathApi()
    const paginateComments = () => {
        const indexOfLastComment = currentPage * commentsPerPage;
        const indexOfFirstComment = indexOfLastComment - commentsPerPage;
        return comments.slice(indexOfFirstComment, indexOfLastComment);
    };
    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(comments.length / commentsPerPage); i++) {
            pageNumbers.push(i);
        }
        return (<ul className="pagination">
            {pageNumbers.map(number => (
                <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                    <button onClick={() => setCurrentPage(number)} className="page-link">
                        {number}
                    </button>
                </li>))}
        </ul>);
    };

    const checkUserRole = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        // Kiểm tra xem người dùng có tồn tại và có phải là admin không
        if (user && user.role !== "USER") {
            // Người dùng là admin, cho phép truy cập nội dung
            return true;
        } else {
            // Người dùng không phải là admin, không cho phép truy cập nội dung
            return false;
        }
    };
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));

        setIsLoggedIn(!!user); // Check if user is logged in
        setIsAdmin(checkUserRole());
        console.log(user);
        getAllComments();
    }, []);

    async function getAllComments() {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/management/comment/all`, {headers: {Authorization: `Bearer ${accessToken}`}});
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    const [expandedComments, setExpandedComments] = useState({});

    const toggleCommentExpansion = (commentId) => {
        setExpandedComments((prevExpandedComments) => ({
            ...prevExpandedComments, [commentId]: !prevExpandedComments[commentId],
        }));
    };

    const replyToComment = (commentId, commentContent, commentChild) => {
        setSelectedCommentId(commentId); // Truyền commentId vào setSelectedCommentId
        setSelectedCommentContent(commentContent);
        setSelectedCommentChild(commentChild);
        console.log('Replying to comment:', commentId);
        setShowCommentModal(true);
        // Open the modal using vanilla JavaScript
        const modal = document.getElementById("modalComment");
        if (modal) {
            modal.style.display = "block";
        }
    };

    const selectComment = (commentId) => {
        if (selectedComments.includes(commentId)) {
            setSelectedComments(selectedComments.filter(id => id !== commentId));
        } else {
            setSelectedComments([...selectedComments, commentId]);
        }
    };

    const handleChangeCommentChild = (event) => {
        setNewCommentChild(event.target.value);
    };


    const deleteSelectedComments = async () => {
        try {
            await Promise.all(selectedComments.map(async (commentId) => {
                await axios.get(`${baseUrl}/api/v1/delete/comments/${commentId}`);
            }));
            getAllComments();
            setSelectedComments([]);
            setShowDeleteModal(false)
            notify()
        } catch (error) {
            console.error("Error deleting comments:", error);
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
    }


    const handleSubmitChild = async (event) => {
        event.preventDefault();
        const email = JSON.parse(sessionStorage.getItem("user")).email;
        let obj;
        if (imageFileChild != null) {
            const uploadResult = await upImageFirebase(imageFileChild, email);
            obj = {content: newCommentChild, email: email, image: uploadResult.name, fromStore: true}
        } else {
            obj = {content: newCommentChild, email: email, fromStore: true}
        }
        try {
            const response = await axios.post(`${baseUrl}/api/v1/${selectedCommentId}/comments-child`, obj);
            setNewCommentChild("");
            // Close the modal using vanilla JavaScript
            const modal = document.getElementById("modalComment");
            if (modal) {
                modal.style.display = "none";
            }

            getAllComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedComments([]);
        } else {
            setSelectedComments(comments.map(comment => comment.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const showComments = (comment) => {
        // Lấy email của người dùng hiện tại từ bộ nhớ đệm
        const currentUserEmail = JSON.parse(sessionStorage.getItem("user")).email;

        // Kiểm tra xem người dùng hiện tại có phải là người viết comment cha không
        const isCurrentUserCommentOwner = comment.user.email === currentUserEmail;

        // Xác định lớp để căn lề của comment
        const alignmentClass = isCurrentUserCommentOwner ? 'text-right' : 'text-left';
        const borderColor = isCurrentUserCommentOwner ? "border-primary" : "border-secondary";
        const bgColor = isCurrentUserCommentOwner ? "bg-primary" : "bg-secondary";
        const textColor = "text-white";
        const content = `<span class="border ${borderColor} ${bgColor} pl-3 pr-3 pt-1 pb-1 rounded-pill ${textColor} break-words" style="display: inline-block; font-size: 16px; max-width: 300px;">${comment.content}</span>`;


        // Hiển thị nội dung của comment cha trong hộp thoại
        let modalContent = `
     <div class="comment ${alignmentClass}">
         <div class="comment-content">
              <p style="font-size: 20px;"><strong>${comment.user.fullname}</strong></p>
              ${content} 
            
              
              <p>${comment.time}</p>
          </div>
      </div>
`;

        // Hiển thị nội dung của các comment con trong hộp thoại
        if (comment.commentChild.length > 0) {
            comment.commentChild.forEach(child => {
                // Kiểm tra xem người dùng hiện tại có phải là người viết comment con không
                const isChildCommentOwner = child.user.email === currentUserEmail;
                const childBorderColor = isChildCommentOwner ? "border-primary" : "border-secondary";
                const childBgColor = isChildCommentOwner ? "bg-primary" : "bg-secondary";
                const childTextColor = "text-white";
                const childAlignmentClass = isChildCommentOwner ? "text-right" : "text-left";
                const childContent = `<span class="border ${childBorderColor} ${childBgColor} pl-3 pr-3 pt-1 pb-1 rounded-pill  ${childTextColor} break-words" style=" font-size: 16px;display: inline-block;">${child.content}</span>`;
                modalContent += `
          <div class="comment ${childAlignmentClass}">
               <div class="comment-content">
                  <p style="font-size: 20px;"><strong>${child.user.fullname}</strong></p>
                  ${childContent}
                  
                  <p>${child.time}</p>
              </div>
          </div>
        `;
            });
        }

        // Hiển thị hộp thoại và nội dung của comment cha và các comment con
        const modal = document.getElementById("commentModal");
        if (modal) {
            modal.style.display = "block";
            const modalBody = modal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = modalContent;
            }
        }
    };


    const handleCommentSelection = (commentId) => {
        if (selectedComments.includes(commentId)) {
            setSelectedComments(selectedComments.filter((id) => id !== commentId));
        } else {
            setSelectedComments([...selectedComments, commentId]);
        }
        console.log(selectedComments)
    };


    return (<div className={"container-xl"}>

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
        <div className={"mt-5"}>
            <button className="btn btn-danger mb-2" onClick={setShowDeleteModal}
                    hidden={selectedComments.length === 0}>Xóa bình luận đã chọn
            </button>


            {paginateComments().length === 0 ? (<div className="alert alert-warning" role="alert">
                Không có dữ liệu
            </div>) : (
                <>
                    <div className="d-flex align-items-center mb-3">
                        <p className="m-0">Hiển thị:</p>
                        <select className="form-select col-1"
                                onChange={(e) => setCommentsPerPage(parseInt(e.target.value))}>
                            <option selected value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                        </select>
                    </div>
                    <table className={"table text-left"}>

                        <thead>
                        <tr>
                            <th><input type={"checkbox"} onClick={() => handleSelectAll()}/></th>
                            <th>ID comment</th>
                            <th>Nội dung</th>

                            <th>Thời gian đăng</th>
                            <th>Người đăng</th>
                            <th>ID sản phẩm</th>
                            <th>Trả lời</th>
                            <th>Xem chi tiết</th>
                            <th>Hành động</th>


                            <th></th>
                        </tr>
                        </thead>

                        <tbody>
                        {paginateComments().map((comment) => (<React.Fragment key={comment.id}>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        onChange={() => selectComment(comment.id)}
                                        checked={selectedComments.includes(comment.id)}
                                    />
                                </td>
                                <td>{comment.id}</td>
                                <td>{comment.content}</td>

                                <td>{comment.time}</td>
                                <td>{comment.user.fullname}</td>
                                <td>
                                    <Link to={'/products/' + comment.product?.id}>
                                        {comment.product?.id}
                                    </Link>
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                            replyToComment(comment.id); // Gọi hàm replyToComment
                                            showComments(comment); // Gọi hàm của bạn ở đây
                                        }}
                                        className="btn btn-outline-success mr-2 "
                                    >
                                        Trả lời
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleCommentExpansion(comment.id)}
                                        className="btn btn-outline-primary mr-2"
                                    >
                                        {expandedComments[comment.id] ? 'Ẩn' : 'Hiển thị '}
                                    </button>
                                </td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            // handleDeleteOrder(order.id)
                                            setShowDeleteModal(true)
                                            handleCommentSelection(comment.id)
                                        }}
                                        className="btn-delete"
                                    >
                                        Xóa
                                    </Button>
                                </td>


                            </tr>
                            {expandedComments[comment.id] && (<tr>
                                <td colSpan="8">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>ID comment</th>
                                            <th>Nội dung</th>
                                            <th>Hình ảnh</th>
                                            <th>Thời gian đăng</th>
                                            <th>Người đăng</th>
                                            <th>Hành động</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {comment.commentChild.map((childComment) => (<tr key={childComment.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    onChange={() => selectComment(childComment.id)}
                                                    checked={selectedComments.includes(childComment.id)}
                                                />
                                            </td>
                                            <td>{childComment.id}</td>
                                            <td>{childComment.content}</td>
                                            <td>
                                                {childComment.image && (<img
                                                    src={childComment.image}
                                                    alt="Child Comment Image"
                                                    style={{maxWidth: '100px'}}
                                                />)}
                                            </td>
                                            <td>{childComment.time}</td>
                                            <td>{childComment.user.fullname}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        // handleDeleteOrder(order.id)
                                                        setShowDeleteModal(true)
                                                        handleCommentSelection(childComment.id)
                                                    }}
                                                    className="btn-delete"
                                                >
                                                    Xóa
                                                </Button>
                                            </td>
                                        </tr>))}
                                        </tbody>
                                    </table>


                                </td>
                            </tr>)}
                        </React.Fragment>))}
                        </tbody>
                    </table>
                </>)}

            <nav className="d-flex justify-content-end">
                {renderPagination()}
            </nav>
        </div>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Xóa bình luân</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc chắn muốn xóa không?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {

                    setShowDeleteModal(false)

                }}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={deleteSelectedComments}>
                    Xóa

                </Button>

            </Modal.Footer>
        </Modal>
        <div className="modal" id="commentModal">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" style={{padding: '10px'}}>
                    <div className="modal-header">
                        <h4 className="modal-title">Bình luận </h4>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal" aria-label="Close"
                            onClick={() => {
                                const modal = document.getElementById("commentModal");
                                if (modal) {
                                    modal.style.display = "none";
                                }
                            }}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body text-left">
                        {/* Hiển thị comment cha và các comment con ở đây */}
                    </div>
                    <form onSubmit={handleSubmitChild}>
                        <div style={{marginTop: '20px'}}>
                                        <textarea className="form-control" rows="2" placeholder="Viết phản hồi..."
                                                  value={newCommentChild}
                                                  onChange={handleChangeCommentChild}
                                                  style={{marginBottom: '10px', width: '100%'}}> </textarea>


                            <button className="reply-submit-btn customer-btn mt-10"
                                    onClick={() => {
                                        setShowCommentModal(false);
                                        const modal = document.getElementById("commentModal");
                                        if (modal) {
                                            modal.style.display = "none";
                                        }
                                    }}
                            >Gửi
                            </button>
                        </div>
                    </form>

                    <div className="modal-footer justify-content-start">
                        <button
                            button type="button" class="btn btn-danger" data-dismiss="modal"
                            onClick={() => {
                                setShowCommentModal(false);
                                const modal = document.getElementById("commentModal");
                                if (modal) {
                                    modal.style.display = "none";
                                }
                            }}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}
export default CommentManagement