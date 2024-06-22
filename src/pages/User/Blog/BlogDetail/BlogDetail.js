import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../../../component/User/Breadcrumb/Breadcrumb";
import RootPathApi from "../../../../route/RootPathApi";

function BlogDetail(){
    const {id} = useParams();
    const [blog, setBlog] = useState(null);
    const baseUrl = RootPathApi()
    


    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/blogs/${id}`)
            .then(response => {
                setBlog(response.data);
                console.log(response.data)
                console.log(id)
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [id]);

    const printDate=(number)=>{
        return new Date(number).toLocaleString();
    }
    return(
        <div>
            {blog && (
                <div>
                    <div className="wrapper">

                        <Breadcrumb title={'Chi tiết bài viết'}/>
                        <div className="single-blog ptb-0  ptb-sm-60" >
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-9 order-1 order-lg-2">
                                        <div className="single-sidebar-desc mb-all-40">
                                            <div className="sidebar-post-content">
                                                <h3 className="sidebar-lg-title">{blog.title}</h3>
                                                <ul className="post-meta d-sm-inline-flex">
                                                    <li><span>Tác giả: </span> {blog.author}</li>
                                                    <li><span>Ngày tạo: {printDate(blog.dataCreate)}</span></li>
                                                </ul>
                                                <span className="text-muted">{blog.description}</span>
                                            </div>
                                            <div className="sidebar-img">
                                                {/*<img src={blog.img1} className="img-1" alt="single-blog-img"  />*/}
                                            </div>


                                            <div className="sidebar-desc mb-50" dangerouslySetInnerHTML={{__html:blog.content}}>
                                                {/*<p>{blog.content}</p>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
        </div>
    )
}
export default BlogDetail;