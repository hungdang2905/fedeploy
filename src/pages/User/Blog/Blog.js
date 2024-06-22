
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Breadcrumb from "../../../component/User/Breadcrumb/Breadcrumb";
import RootPathApi from "../../../route/RootPathApi";

function Blog(){
    const [blogs, setBlogs] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(8);

    // Lấy danh sách bài viết cho trang hiện tại
    const indexOfLast = currentPage * itemPerPage;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);
    const baseUrl = RootPathApi()
    // Chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(blogs.length / itemPerPage); i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/blogs`)
            .then(response => {
                setBlogs(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
            });
    }, []);
    return (
        <div>
            <div className="wrapper">
                <div className="popup_banner">
                    <span className="popup_off_banner">×</span>
                    <div className="banner_popup_area">
                        <img src="img/banner/pop-banner.jpg" alt=""/>
                    </div>
                </div>
                <div className="popup_wrapper">
                    <div className="test">
                        <span className="popup_off">Close</span>
                        <div className="subscribe_area text-center mt-60">
                            <h2>Newsletter</h2>
                            <p>Subscribe to the Truemart mailing list to receive updates on new arrivals, special offers
                                and other discount information.</p>
                            <div className="subscribe-form-group">  
                                <form action="#">
                                    <input autoComplete="off" type="text" name="message" id="message"
                                           placeholder="Enter your email address"/>
                                    <button type="submit">subscribe</button>
                                </form>
                            </div>
                            <div className="subscribe-bottom mt-15">
                                <input type="checkbox" id="newsletter-permission"/>
                                <label htmlFor="newsletter-permission">Don't show this popup again</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main-page-banner home-3">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 d-none d-lg-block">
                                <div className="vertical-menu mb-all-30">
                                    <nav>
                                        <ul className="vertical-menu-list">
                                            <li className=""><a href="shop.html"><span><img
                                                src="img/vertical-menu/1.png" alt="menu-icon"/></span>Automotive &
                                                Motorcycle<i className="fa fa-angle-right" aria-hidden="true"></i></a>

                                                <ul className="ht-dropdown mega-child">
                                                    <li><a href="shop.html">Office chair <i
                                                        className="fa fa-angle-right"></i></a>
                                                        <ul className="ht-dropdown mega-child">
                                                            <li><a href="shop.html">Bibendum Cursus</a></li>
                                                            <li><a href="shop.html">Dignissim Turpis</a></li>
                                                            <li><a href="shop.html">Dining room</a></li>
                                                            <li><a href="shop.html">Dining room</a></li>
                                                        </ul>
                                                    </li>
                                                    <li><a href="shop.html">Purus Lacus <i
                                                        className="fa fa-angle-right"></i></a>
                                                        <ul className="ht-dropdown mega-child">
                                                            <li><a href="shop.html">Magna Pellentesq</a></li>
                                                            <li><a href="shop.html">Molestie Tortor</a></li>
                                                            <li><a href="shop.html">Vehicula Element</a></li>
                                                            <li><a href="shop.html">Sagittis Blandit</a></li>
                                                        </ul>
                                                    </li>
                                                    <li><a href="shop.html">Sagittis Eget</a></li>
                                                    <li><a href="shop.html">Sagittis Eget</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="shop.html"><span><img src="img/vertical-menu/3.png"
                                                                               alt="menu-icon"/></span>Sports &
                                                Outdoors<i className="fa fa-angle-right" aria-hidden="true"></i></a>
                                                <ul className="ht-dropdown megamenu first-megamenu">
                                                    <li className="single-megamenu">
                                                        <ul>
                                                            <li className="menu-tile">Cameras</li>
                                                            <li><a href="shop.html">Cords and Cables</a></li>
                                                            <li><a href="shop.html">gps accessories</a></li>
                                                            <li><a href="shop.html">Microphones</a></li>
                                                            <li><a href="shop.html">Wireless Transmitters</a></li>
                                                        </ul>
                                                        <ul>
                                                            <li className="menu-tile">GamePad</li>
                                                            <li><a href="shop.html">real game hd</a></li>
                                                            <li><a href="shop.html">fighting game</a></li>
                                                            <li><a href="shop.html">racing pad</a></li>
                                                            <li><a href="shop.html">puzzle pad</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="single-megamenu">
                                                        <ul>
                                                            <li className="menu-tile">Digital Cameras</li>
                                                            <li><a href="shop.html">Camera one</a></li>
                                                            <li><a href="shop.html">Camera two</a></li>
                                                            <li><a href="shop.html">Camera three</a></li>
                                                            <li><a href="shop.html">Camera four</a></li>
                                                        </ul>
                                                        <ul>
                                                            <li className="menu-tile">Virtual Reality</li>
                                                            <li><a href="shop.html">Reality one</a></li>
                                                            <li><a href="shop.html">Reality two</a></li>
                                                            <li><a href="shop.html">Reality three</a></li>
                                                            <li><a href="shop.html">Reality four</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="megamenu-img">
                                                        <a href="shop.html"><img src="img/vertical-menu/sub-img1.jpg"
                                                                                 alt="menu-image"/></a>
                                                        <a href="shop.html"><img src="img/vertical-menu/sub-img2.jpg"
                                                                                 alt="menu-image"/></a>
                                                        <a href="shop.html"><img src="img/vertical-menu/sub-img3.jpg"
                                                                                 alt="menu-image"/></a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li><a href="shop.html"><span><img src="img/vertical-menu/6.png"
                                                                               alt="menu-icon"/></span>Fashion<i
                                                className="fa fa-angle-right" aria-hidden="true"></i></a>
                                                <ul className="ht-dropdown megamenu megamenu-two">
                                                    <li className="single-megamenu">
                                                        <ul>
                                                            <li className="menu-tile">Men’s Fashion</li>
                                                            <li><a href="shop.html">Blazers</a></li>
                                                            <li><a href="shop.html">Boots</a></li>
                                                            <li><a href="shop.html">pants</a></li>
                                                            <li><a href="shop.html">Tops & Tees</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="single-megamenu">
                                                        <ul>
                                                            <li className="menu-tile">Women’s Fashion</li>
                                                            <li><a href="shop.html">Bags</a></li>
                                                            <li><a href="shop.html">Bottoms</a></li>
                                                            <li><a href="shop.html">Shirts</a></li>
                                                            <li><a href="shop.html">Tailored</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li><a href="shop.html"><span><img src="img/vertical-menu/7.png"
                                                                               alt="menu-icon"/></span>Home & Kitchen<i
                                                className="fa fa-angle-right" aria-hidden="true"></i></a>
                                                <ul className="ht-dropdown megamenu megamenu-two">
                                                    <li className="single-megamenu">
                                                        <ul>
                                                            <li className="menu-tile">Large Appliances</li>
                                                            <li><a href="shop.html">Armchairs</a></li>
                                                            <li><a href="shop.html">Bunk Bed</a></li>
                                                            <li><a href="shop.html">Mattress</a></li>
                                                            <li><a href="shop.html">Sideboard</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="single-megamenu">
                                                        <ul>
                                                            <li className="menu-tile">Small Appliances</li>
                                                            <li><a href="shop.html">Bootees Bags</a></li>
                                                            <li><a href="shop.html">Jackets</a></li>
                                                            <li><a href="shop.html">Shelf</a></li>
                                                            <li><a href="shop.html">Shoes</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li><a href="shop.html"><span><img src="img/vertical-menu/4.png"
                                                                               alt="menu-icon"/></span>Phones & Tablets<i
                                                className="fa fa-angle-right" aria-hidden="true"></i>
                                            </a>
                                                <ul className="ht-dropdown megamenu megamenu-two">
                                                    <li className="single-megamenu">
                                                        <ul>
                                                            <li className="menu-tile">Tablet</li>
                                                            <li><a href="shop.html">tablet one</a></li>
                                                            <li><a href="shop.html">tablet two</a></li>
                                                            <li><a href="shop.html">tablet three</a></li>
                                                            <li><a href="shop.html">tablet four</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="single-megamenu">
                                                        <ul>
                                                            <li className="menu-tile">Smartphone</li>
                                                            <li><a href="shop.html">phone one</a></li>
                                                            <li><a href="shop.html">phone two</a></li>
                                                            <li><a href="shop.html">phone three</a></li>
                                                            <li><a href="shop.html">phone four</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li><a href="shop.html"><span><img src="img/vertical-menu/6.png"
                                                                               alt="menu-icon"/></span>TV & Video<i
                                                className="fa fa-angle-right" aria-hidden="true"></i></a>
                                                <ul className="ht-dropdown megamenu megamenu-two">
                                                    <li className="single-megamenu">
                                                        <ul>
                                                            <li className="menu-tile">Gaming Desktops</li>
                                                            <li><a href="shop.html">Alpha Desktop</a></li>
                                                            <li><a href="shop.html">rober Desktop</a></li>
                                                            <li><a href="shop.html">Ultra Desktop </a></li>
                                                            <li><a href="shop.html">beta desktop</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="single-megamenu">
                                                        <ul>
                                                            <li className="menu-tile">Women’s Fashion</li>
                                                            <li><a href="shop.html">3D-Capable</a></li>
                                                            <li><a href="shop.html">Clearance</a></li>
                                                            <li><a href="shop.html">Free Shipping Eligible</a></li>
                                                            <li><a href="shop.html">On Sale</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li><a href="shop.html"><span><img src="img/vertical-menu/5.png"
                                                                               alt="menu-icon"/></span>Beauty</a>
                                            </li>
                                            <li><a href="shop.html"><span><img src="img/vertical-menu/8.png"
                                                                               alt="menu-icon"/></span>Fruits &
                                                Veggies</a></li>
                                            <li><a href="shop.html"><span><img src="img/vertical-menu/9.png"
                                                                               alt="menu-icon"/></span>Computer & Laptop</a>
                                            </li>
                                            <li><a href="shop.html"><span><img src="img/vertical-menu/10.png"
                                                                               alt="menu-icon"/></span>Meat & Seafood</a>
                                            </li>
                                            <li id="cate-toggle" className="category-menu v-cat-menu">
                                                <ul>
                                                    <li className="has-sub"><a href="#">More Categories</a>
                                                        <ul className="category-sub">
                                                            <li><a href="shop.html"><span><img
                                                                src="img/vertical-menu/11.png" alt="menu-icon"/></span>Accessories</a>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Breadcrumb title={'Bài viết'}/>
                <div className="blog ptb-100  ptb-sm-60">
                    <div className="container">
                        <div className="main-blog">
                            <div className="row">
                                {currentBlogs.map(blog => (
                                    <div key={blog.id} className="col-lg-6 col-sm-12">
                                        <div className="single-latest-blog" style={{ width: '570px', height: '270px' }}>
                                            <div className="blog-img">
                                                <a href="single-blog.html"><img src={blog.img} alt="blog-image"/></a>
                                            </div>
                                            <div className="blog-desc">
                                                <h4><a href="single-blog.html">{blog.title}</a></h4>
                                                <ul className="meta-box d-flex">
                                                    <li><a href="#">By Truemart</a></li>
                                                </ul>
                                                <p style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3, /* Số dòng tối đa hiển thị */
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>{blog.description}</p>
                                                <Link to={`/blog/detail/${blog.id}`} className="readmore">Đọc bài viết</Link>
                                            </div>
                                            <div className="blog-date">
                                                <span>{blog.dateCreate}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="pro-pagination">
                                        <ul className="blog-pagination">
                                            {pageNumbers.map(number => (
                                                <li key={number} className={number === currentPage ? 'active' : ''}>
                                                    <Link onClick={() => paginate(number)} >
                                                        {number}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="product-pagination">
                                            <span className="grid-item-list">
                        Hiển thị {indexOfFirst + 1} đến {indexOfLast > blogs.length ? blogs.length : indexOfLast} của {blogs.length} bài viết ( {pageNumbers.length} trang)
                    </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Blog;