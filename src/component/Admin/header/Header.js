import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import {googleLogout} from "@react-oauth/google";
import RootPathApi from "../../../route/RootPathApi";

const Header = () => {
  const baseUrl=RootPathApi()
  const navigate =useNavigate()
  const user = JSON.parse(sessionStorage.getItem("user"))
  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/api/v1/auth/logout`);
      // Xóa token khỏi localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");
      console.log("Đã đăng xuất thành công");
      googleLogout()
      navigate('/login'); // Chuyển hướng đến trang đăng nhập hoặc trang chính
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  }
  return (
      <>
        <nav className="navbar navbar-expand fixed-top be-top-header">
          <div className="container-fluid">
            <div className="be-navbar-header">
              <Link className="navbar-brand" to="/admin"></Link>
            </div>
            <div className="page-title"><span>Admin Panel</span></div>
            <div className="be-right-navbar">
              <ul className="nav navbar-nav float-right be-user-nav">
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" to="#" data-toggle="dropdown" role="button"
                        aria-expanded="false"><img src="/admin/assets/img/avatar.png" alt="Avatar"/><span
                      className="user-name">{user.fullname}</span></Link>
                  <div className="dropdown-menu" role="menu">
                    <div className="user-info">
                      <div className="user-name">{user.fullname}</div>
                      <div className="user-position online">Available</div>
                    </div>
                    <Link className="dropdown-item" to="/"><span className="icon mdi mdi-face"></span>Trang chủ</Link>
                    <Link className="dropdown-item" to="" onClick={handleLogout}><span className="icon mdi mdi-power"></span>Đăng xuất</Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="be-left-sidebar">
          <div className="left-sidebar-wrapper">
            <Link className="left-sidebar-toggle" to="/admin">Dashboard</Link>
            <div className="left-sidebar-spacer">
              <div className="left-sidebar-scroll">
                <div className="left-sidebar-content">
                  <ul className="sidebar-elements">
                    <li className="divider">Menu</li>
                    <li>
                      <Link to="/admin"><i className="icon mdi mdi-home"></i><span>Tổng quan</span></Link>
                    </li>
                    <li>
                      <Link to="/admin/user-management"><i className="icon mdi mdi-account"></i><span>User</span></Link>
                    </li>
                    <li>
                      <Link to="/admin/product-management"><i className="icon mdi mdi-shopping-basket"></i><span>Sản phẩm</span></Link>
                    </li>
                    <li>
                      <Link to="/admin/order-management"><i
                          className="icon mdi mdi-shopping-basket"></i><span>Đơn hàng</span></Link>
                    </li>
                    <li>
                      <Link to="/admin/comment-management"><i
                          className="icon mdi mdi-shopping-basket"></i><span>Bình luân</span></Link>
                    </li>
                    {/* Other menu items */}
                  </ul>
                </div>
              </div>
            </div>
            <div className="progress-widget">
              <div className="progress-data"><span className="progress-value">60%</span><span className="name">Current Project</span>
              </div>
              <div className="progress">
                <div className="progress-bar progress-bar-primary" style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>
        </div>
        <nav className="be-right-sidebar">
          {/* Right sidebar content */}
        </nav>
      </>
  );
}

export default Header;