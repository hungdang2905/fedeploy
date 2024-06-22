import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import JoditEditor from 'jodit-react';
import {Button, Container, Form, Input, Label} from "reactstrap";
import {ToastContainer} from "react-toastify";
import {notify} from "../../../util/notify/Notify";
import {deleteImage, handleUpload} from "../../../util/uploadImage/UploadImage";
import RootPathApi from "../../../route/RootPathApi";
import {Link, useNavigate} from "react-router-dom";

export default function BlogManagementAdd(){
    const [allCategorys, setAllCategorys] = useState([]);
    const [img, setImg] = useState('');
    const baseUrl = RootPathApi();
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    useEffect(() => {

    }, [img]);
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/category/all`,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(res => {
            setAllCategorys(res.data)
            console.log(res.data)
        }).catch(error => {
            console.log("error:" + error)
        })
    }, []);

    const [blog, setBlog] = useState({
        title: '',
        category: '',
        description:'',
        author:'',
        content: ''
    });
    const editor = useRef(null);
    const fieldChanged = (event) => {
        // console.log(event)
        setBlog({ ...blog, [event.target.name]: event.target.value })
    }
    const contentFieldChanaged=(data)=>{
        setBlog({...blog, 'content': data})
    }



    const createBlog=async(event)=>{
        event.preventDefault();

        if(blog.title.trim()===''){
            notify("error", "Vui lòng nhập tiêu đề bài viết !!!")
            return;
        }
        if(blog.description.trim()===''){
            notify("error", "Vui lòng miêu tả bài viết !!!")
            return;
        }
        if(blog.author.trim()===''){
            notify("error", "Vui lòng nhập tên tác giả !!!")
            return;
        }
        if(blog.content.trim()===''){
            notify("error", "Vui lòng nhập nội dung bài viết !!!")
            return;
        }
        if(!blog.category){
            notify("error", "Vui lòng chọn thể loại bài viết !!!")
            return;
        }
        if (blog.title !== '' && blog.description !== '' && blog.author !== '' && blog.content !== '' && blog.category !== ''  ) {
            const data = {
                title: blog.title,
                category: blog.category,
                description: blog.description,
                author: blog.author,
                content: blog.content,
                img: img
            }
            console.log(data)
            await axios.post(`${baseUrl}/api/v1/blogs/add`, data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }}
            ).then(res => {
                notify("success","Đã thêm bài viết thành công")
                console.log(res.data);
                navigate('/admin/blog-management');
            }).catch(err => {
                notify("error", "Không thể tạo do bị lỗi")
            })
        }

    }

    return(
        <div>
            <ToastContainer/>
            <h3>Thêm bài viết</h3>
            <Form onSubmit={createBlog}>
                <div className={"row"}>
                    <div className="flex-form col-md-9">
                        <div className="my-3">
                            <Label for="title">Tiêu đề bài viết</Label>
                            <Input
                                type="text"
                                id="title"
                                placeholder="Nhập vào"
                                className="rounded-0"
                                name="title"
                                onChange={fieldChanged}
                            />
                        </div>
                        <div className="my-3">
                            <Label for="description">Miêu tả</Label>
                            <Input
                                type="text"
                                id="title"
                                placeholder="Nhập vào"
                                className="rounded-0"
                                name="description"
                                onChange={fieldChanged}
                            />
                        </div>
                        <div className="my-3">
                            <Label for="author">Tên tác giả</Label>
                            <Input
                                type="text"
                                id="title"
                                placeholder="Nhập vào"
                                className="rounded-0"
                                name="author"
                                onChange={fieldChanged}
                            />
                        </div>
                        <select className="form-select"
                                aria-label="Default select example"
                                name="category"
                                onChange={fieldChanged}>
                            <option selected>Chọn thể loại:</option>
                            {allCategorys.map((category) => (
                                <option key={category.id} value={category.value}>
                                    {category.value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-3 col-sm">
                        <Label for="img">Chọn ảnh cho bài viết</Label>
                        <Input
                            id="img"
                            type="file"
                            placeholder="Chọn file"
                            autoFocus
                            onChange={(e) => {
                                deleteImage(img);
                                handleUpload(e.target.files[0], setImg);
                            }}
                        />
                        <br/>
                        {img!==""? (<img width={290} src={img} alt={"anh"}/>):""}
                    </div>
                </div>
                <div className="my-3">
                    <Label for="content">Nội dung bài viết</Label>
                    <JoditEditor
                        ref={editor}
                        value={blog.content}
                        onChange={contentFieldChanaged}
                    />
                </div>



                <Container className="text-center">
                    <Button type="submit" className="rounded-0" color="primary" onClick={createBlog}>Tạo bài
                        viết</Button>
                    <Link to="/admin/blog-management"><Button className="rounded-0 ms-2" color="danger">Trở về</Button></Link>
                </Container>


            </Form>
            {/*{content}*/}
        </div>
    )
}