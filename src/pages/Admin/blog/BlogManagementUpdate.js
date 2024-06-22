import {Link, useNavigate, useParams} from "react-router-dom";
import React, { useEffect, useRef, useState} from "react";
import axios from "axios";
import {ToastContainer} from "react-toastify";
import {Button, Container, Form, Input, Label} from "reactstrap";
import JoditEditor from "jodit-react";
import {deleteImage, handleUpload} from "../../../util/uploadImage/UploadImage";
import {notify} from "../../../util/notify/Notify";
import RootPathApi from "../../../route/RootPathApi";
import category from "../../../component/User/Category/Category";

export default function BlogManagementUpdate(){
    const [blog, setBlog] = useState(null);
    const [allCategorys, setAllCategorys] = useState([]);
    const [category, setCategory] = useState('');
    const {id} = useParams();
    const baseUrl = RootPathApi()
    const navigate = useNavigate();
    const [img, setImg] = useState('');
    const editor = useRef(null);
    const accessToken = localStorage.getItem("accessToken");
    useEffect(()=>{
        axios.get(`${baseUrl}/api/v1/category/all`)
            .then(res => setAllCategorys(res.data))
            .catch(error => console.log("error:", error));
    }, [allCategorys]);

    useEffect(() => {

        axios.get(`${baseUrl}/api/v1/blogs/${id}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
            .then(res => {
                const blogDate = res.data;
                setBlog(blogDate);
                setImg(res.data.img)
                setCategory(res.data.category)
                console.log("category"+category)
            })
            .catch(error => console.log("error:", error));
    }, [id]);


    const handleChange = (event, fieldName)=>{
        setBlog({
            ...blog,
            [fieldName]:event.target.value
        })
    }

    const updateBlog=async(event)=>{
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

        if (blog.title !== '' && blog.description !== '' && blog.author !== '' && blog.content !== '' ) {
            const data = {
                title: blog.title,
                category: category.value,
                description: blog.description,
                author: blog.author,
                content: blog.content,
                img:img
            }
            console.log(data)
            await axios.put(`${baseUrl}/api/v1/blogs/update/${id}`, data
            ).then(res => {
                notify("success","Đã sửa bài viết thành công")
                console.log(res.data)
                navigate('/admin/blog-management');
            }).catch(err => {
                notify("error", "Không thể sửa do bị lỗi")
            })
        }
    }
    const updateHTML=()=>{
        return(
            <div>
                <ToastContainer/>
                <h3>Chỉnh sửa bài viết</h3>
                <Form onSubmit={''}>
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
                                    value={blog.title}
                                    onChange={(event) => handleChange(event, 'title')}
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
                                    value={blog.description}
                                    onChange={(event) => handleChange(event, 'description')}
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
                                    value={blog.author}
                                    onChange={(event) => handleChange(event, 'author')}
                                />
                            </div>
                            <select className="form-select"
                                    aria-label="Default select example"
                                    name="category"
                                    onChange={(e) => setCategory(e.target.value)}>
                                <option>Chọn thể loại:</option>
                                {allCategorys.map((c) => (
                                    <option selected={category && category.value === c.value}
                                            key={c.id} value={c.value}>
                                        {c.value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-3 col">
                            <Label for="img">Chọn ảnh cho bài viết</Label>
                            <Input
                                id="img"
                                type="file"
                                placeholder="Chọn file"
                                autoFocus
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                        deleteImage(img);
                                        handleUpload(e.target.files[0], setImg);
                                    } else {
                                        setImg(blog.img);
                                    }
                                }}
                            />
                            <br/>
                            <img width={290} src={img} alt={"anh"}/>
                        </div>
                    </div>
                    <div className="my-3">
                        <Label for="content">Nội dung bài viết</Label>
                        <JoditEditor
                            ref={editor}
                            value={blog.content}
                            onChange={newContext => setBlog({...blog, content: newContext})}
                        />
                    </div>



                    <Container className="text-center">
                        <Button type="submit" className="rounded-0" color="primary" onClick={updateBlog}>Chỉnh
                            sửa</Button>
                        <Link to="/admin/blog-management"><Button className="rounded-0 ms-2" color="danger">Trở
                            về</Button></Link>
                    </Container>


                </Form>
                {/*{content}*/}
            </div>
        )
    }

    return (
        <div>
            {blog && updateHTML()}
        </div>

    )
}