import {useState} from "react";

import Data from "./DataPages";
import Category from "./DataCategory";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useSelector} from "react-redux";
import AutoCompleteSearch from "./AutoCompleteSearch";
import {googleLogout} from "@react-oauth/google";
import {Nav, NavDropdown} from "react-bootstrap";
import RootPathApi from "../../../route/RootPathApi";
import HeaderData from "./DataPages";

export default function Header() {
    const [showCategory, setShowCategory] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const showAutoCompleteSearch = location.pathname === '/products';
    const cart = useSelector((state) => state.cart.totalCart);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const baseUrl =RootPathApi()

    const filteredData = Data.filter(data => {
        // Check if user from session is null and data.name is "trang cá nhân"
        return !(sessionStorage.getItem('user') === null && data.path === '/profile');
    });
    const toggleCategory = () => {
        setShowCategory(!showCategory);
    };
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    // Hàm kiểm tra xem một NavLink có nên được active hay không
    const handleLogout = async () => {
        try {
            await axios.post(`${baseUrl}/api/v1/auth/logout`);
            // Xóa token khỏi localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            sessionStorage.removeItem("user");
            console.log("Đã đăng xuất thành công");
            googleLogout()
            navigate('/'); // Chuyển hướng đến trang đăng nhập hoặc trang chính
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    }


    return (
        <div>
            <header>
                <div className="header-middle ptb-15">
                    <div className="container">
                        <div className="row align-items-center no-gutters">
                            <div className="col-lg-3 col-md-12">
                                <div className="logo mb-all-30">
                                    <a href="/Home"><img src="/assets/img/logo/logo.png" alt="logo-image"/></a>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-8 ml-auto mr-auto col-10" >
                                {showAutoCompleteSearch && <AutoCompleteSearch />}
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="cart-box mt-all-30">
                                    <ul className="d-flex justify-content-lg-end justify-content-center align-items-center">
                                        <li className={"ml-3"}><Link to={"/cart"} className={"ml-0"}><i
                                            className="lnr lnr-cart"></i><span
                                            className="my-cart"><span
                                            className="total-pro">{cart}</span><span>Giỏ hàng</span></span></Link>
                                        </li>
                                        {user === null ? <li>
                                                <Link to={"/login"} className={"ml-2"}>
                                                    <i className="lnr lnr-user"></i><span
                                                    className={"my-cart"}><span> <strong>Đăng nhập</strong></span><span> đăng kí</span></span>
                                                </Link>
                                            </li> :
                                            <>
                                                <li>
                                                    <Nav className={"my-cart"}>
                                                        <NavDropdown
                                                            title={<span
                                                                className="my-cart text-dark "><i
                                                                className="lnr lnr-user" style={{fontSize:"30px"}}></i><strong className={"ms-2"}> {user.fullname}</strong>
                                            </span>
                                                            }>

                                                            <NavDropdown.Item
                                                                > <Link to={"/account"} style={{color:"black"}}>Thông tin tài khoản</Link> </NavDropdown.Item>
                                                            {user.roles === "USER" ? "" :
                                                                <li>
                                                                    <NavDropdown.Item><Link to={"/admin"} style={{color:"black"}}>Quản lý Admin</Link></NavDropdown.Item>

                                                                </li>
                                                            }
                                                            <NavDropdown.Divider/>
                                                            <NavDropdown.Item onClick={handleLogout}>
                                                                Đăng xuất
                                                            </NavDropdown.Item>

                                                        </NavDropdown>
                                                    </Nav>

                                                </li>
                                            </>
                                        }


                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-bottom  header-sticky">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-3 col-lg-4 col-md-6 vertical-menu d-none d-lg-block"
                                 onClick={toggleCategory}>
                                <span className="categorie-title">Danh mục sản phẩm</span>
                            </div>
                            <div className="col-xl-9 col-lg-8 col-md-12 ">
                                <nav className="d-none d-lg-block">
                                    <ul className="header-bottom-list d-flex">
                                        {filteredData.map((data, index) => (
                                            <li key={index}>
                                                <NavLink
                                                    to={data.path}
                                                    style={({ isActive }) =>
                                                        isActive ? { color: 'red' } : null
                                                    }
                                                >
                                                    {data.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                                <div className="mobile-menu d-block d-lg-none mb-2" onClick={toggleMenu}>
                                    <br/>
                                    <br/>
                                    <nav>
                                        <ul className={`ml-3 ${showMenu ? '' : 'menu-hidden'}`}>
                                            {filteredData.map((data, index) => (
                                                <li key={index}>
                                                    <NavLink
                                                        to={data.path}
                                                        style={({ isActive }) =>
                                                            isActive ? { color: 'red' } : null
                                                        }
                                                    >
                                                        {data.name}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container d-block d-lg-none">
                    <div className="vertical-menu mt-30">
                        <span className="categorie-title mobile-categorei-menu" onClick={toggleCategory}>Danh mục sản phẩm</span>
                        <nav>
                            <div id="cate-mobile-toggle"
                                 className={`category-menu sidebar-menu sidbar-style mobile-categorei-menu-list ${showCategory ? '' : 'menu-hidden'}`}>
                                <ul>
                                    {Category.map((data, index) => (
                                        <li>
                                            <NavLink key={index} to={data.path}>
                                                + {data.name}
                                            </NavLink>
                                        </li>

                                    ))}

                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
            <div className="container">
                <div className="row">
                    <div className="col-xl-3 col-lg-4 d-none d-lg-block">
                        <div className="vertical-menu mb-all-30">
                            <nav>
                                <ul className={`vertical-menu-list ${showCategory ? '' : 'menu-hidden'} ml-3`}>

                                    {Category.map((data, index) => (
                                        <li>
                                            <NavLink key={index} to={data.path}>
                                                + {data.name}
                                            </NavLink>
                                        </li>

                                    ))}

                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}