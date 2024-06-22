import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Footer from "../../../component/User/Footer/Footer";
import Breadcrumb from "../../../component/User/Breadcrumb/Breadcrumb";
import ProductItem from "../../User/Product/ProductItem/ProductItem";
import { Link } from 'react-router-dom';
import SearchContext from "../../../component/User/Header/SearchContext";
import ProductList from "./ProductItem/ProductList";
import RootPathApi from "../../../route/RootPathApi";


const Product = () => {
    const {searchTermLocal, rowData} = useContext(SearchContext);
    const [products, setProducts] = useState([]);
    const [type, setType] = useState("all");
    const baseUrl = RootPathApi()
// Sort by price
    const [sortBy, setSortBy] = useState("asc");

// Pagination
    const [productsPerPage, setProductsPerPage] = useState(10);

// Vị trí trang đang đứng
    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(0); // Thêm biến state totalPages
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/category/all`)
            .then(response => {
                // Giả sử API trả về dữ liệu như: [{ id: 1, name: 'Laptop' }, ...]
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);
    useEffect(() => {
        if (rowData && rowData.title) {
            axios.get(`${baseUrl}/api/v1/search?page=${currentPage}&size=${productsPerPage}&keyword=${rowData.title}`)
                .then(response => {
                    setProducts(response.data.content);
                    setTotalPages(response.data.totalPages);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                });
        } else {
            axios.get(`${baseUrl}/api/v1/products?page=${currentPage}&size=${productsPerPage}&category=${type}&sort=${sortBy}`)
                .then(response => {
                    setProducts(response.data.content);
                    setTotalPages(response.data.totalPages);
                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                });
        }
    }, [searchTermLocal, rowData, currentPage, productsPerPage, type, sortBy]);


    const handlePageChange = (e, pageNumber) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a> (chuyển trang)
        setCurrentPage(pageNumber); // Cập nhật giá trị của currentPage với số trang được chọn
    };
    // Call fetchProducts function here

    return (
        <div>
            <div className="wrapper">
                <Breadcrumb title={'Danh sách sản phẩm'}/>
                <div className="popup_banner">
                    <span className="popup_off_banner">×</span>
                    <div className="banner_popup_area">
                        <img src="#" alt=""/>
                    </div>
                </div>
                <div className="main-shop-page pt-100 pb-100 ptb-sm-60">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 order-2 order-lg-1">
                                <div className="sidebar">
                                    <div className="electronics mb-40">
                                        <h3 className="sidebar-title">Loại sản phẩm</h3>
                                        <div id="shop-cate-toggle" className="category-menu sidebar-menu sidbar-style">
                                            <ul>
                                                <li className="has-sub">
                                                    <div className="form-check">
                                                        <input className="form-check-input active" type="radio"
                                                               name="flexRadioDefault" id="flexRadioDefault1"
                                                               onClick={()=> setType("all")}
                                                        />
                                                        <label className="form-check-label"
                                                               htmlFor="flexRadioDefault1">
                                                            Tất Cả
                                                        </label>
                                                    </div>
                                                </li>
                                                {categories.map(category => (
                                                    <li className="has-sub" key={category.id}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id={`flexRadioDefault${category.id}`} onClick={() => setType(category.name)} />
                                                            <label className="form-check-label" htmlFor={`flexRadioDefault${category.id}`}>
                                                                {category.name}
                                                            </label>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-9 order-1 order-lg-2">
                                <div
                                    className="grid-list-top border-default universal-padding d-md-flex justify-content-md-between align-items-center mb-30">
                                    <div className="grid-list-view  mb-sm-15">
                                        <ul className="nav tabs-area d-flex align-items-center">
                                            <li><a className="active" data-toggle="tab" href="#grid-view"><i
                                                className="fa fa-th"></i></a></li>
                                            <li><a data-toggle="tab" href="#list-view"><i className="fa fa-list-ul"></i></a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="main-toolbar-sorter clearfix">
                                        <div className="toolbar-sorter d-flex align-items-center">
                                            <label>Sort By:</label>
                                            <select className="sorter wide" onChange={(e) => setSortBy(e.target.value)}>
                                                <option value="">sắp xếp</option>
                                                <option value="desc">Giá giảm dần</option>
                                                <option value="asc">Giá tăng dần</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="main-toolbar-sorter clearfix">
                                        <div className="toolbar-sorter d-flex align-items-center">
                                            <label>Hiển thị:</label>
                                            <select className="sorter wide" value={productsPerPage} onChange={(e) => {
                                                setProductsPerPage(parseInt(e.target.value));
                                                console.log('Số sản phẩm mỗi trang:', parseInt(e.target.value));
                                            }}>
                                                <option value="10">10</option>
                                                <option value="15">15</option>
                                                <option value="20">20</option>
                                                <option value="30">30</option>
                                            </select>

                                        </div>
                                    </div>
                                </div>
                                <div className="main-categorie mb-all-40">
                                    <div className="tab-content fix">
                                        <div id="grid-view" className="tab-pane fade show active">
                                            <div className="row">
                                                {products.map(p => (
                                                    <ProductItem key={p.id} product={p}/>
                                                ))}
                                            </div>
                                        </div>
                                        <div id="list-view" className="tab-pane fade">
                                            <div className="single-product">
                                                {products.map(p => (
                                                    <ProductList key={p.id} product={p}/>
                                                ))}

                                            </div>

                                        </div>
                                        <div className="pro-pagination">
                                            <ul className="blog-pagination">
                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                                                        <Link to="#" onClick={(e) => handlePageChange(e, i + 1)}>
                                                            {i + 1}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="product-pagination">
                                                <span className="grid-item-list">Hiển thị {((currentPage - 1) * productsPerPage) + 1} đến {Math.min(currentPage * productsPerPage, products.length)} ({totalPages} trang)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
};
export default Product;

