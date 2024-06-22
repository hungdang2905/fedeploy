import {Link} from "react-router-dom";
import React from "react";
import BookIcon from '@mui/icons-material/Book';

const SidebarLeft = () => {
  return(
      <>
          <div className="be-left-sidebar">
              <div className="left-sidebar-wrapper">
                  <Link className="left-sidebar-toggle" to="/admin">Dashboard</Link>
                  <div className="left-sidebar-spacer">
                      <div className="left-sidebar-scroll">
                          <div className="left-sidebar-content">
                              <ul className="sidebar-elements">
                                  <li className="divider">Menu</li>
                                  <li>
                                      <Link to="/admin"><i
                                          className="icon mdi mdi-home"></i><span>Tổng quan</span></Link>
                                  </li>
                                  <li>
                                      <Link to="/admin/user-management"><i
                                          className="icon mdi mdi-account"></i><span>User</span></Link>
                                  </li>
                                  <li>
                                      <Link to="/admin/product-management"><i
                                          className="icon mdi mdi-shopping-basket"></i><span>Sản phẩm</span></Link>
                                  </li>
                                  <li>
                                      <Link to="/admin/order-management"><i
                                          className="icon mdi mdi-shopping-basket"></i><span>Đơn hàng</span></Link>
                                  </li>
                                  <li>
                                      <Link to="/admin/blog-management"><BookIcon/> <span>      Bài viết</span></Link>
                                  </li>
                                  <li>
                                      <Link to="/admin/comment-management"><i
                                          className="icon mdi mdi-shopping-basket"></i><span>Bình luân</span></Link>
                                  </li>
                                  {/*<li>*/}
                                  {/*    <Link to="/admin/evaluate-management"><i*/}
                                  {/*        className="icon mdi mdi-shopping-basket"></i><span>Đánh giá đơn hàng</span></Link>*/}
                                  {/*</li>*/}
                                  <li>
                                      <Link to="/admin/review-management"><i
                                          className="icon mdi mdi-shopping-basket"></i><span>Đánh giá sản phẩm</span></Link>
                                  </li>
                                  <li>
                                      <Link to="/admin/category-management"><i className="icon mdi mdi-account-box-mail"></i><span>Danh mục</span></Link>
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
                          <div className="progress-bar progress-bar-primary" style={{width: "60%"}}></div>
                      </div>
                  </div>
              </div>
          </div>
      </>
  )
}
export default SidebarLeft