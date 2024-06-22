import Data from "../Header/DataPages";
import {NavLink} from "react-router-dom";
import Category from "../Header/DataCategory";

const Footer = () => {
    return (
        <>
            <div className="support-area bdr-top">
                <div className="container">
                    <div className="d-flex flex-wrap text-center">
                        <div className="single-support">
                            <div className="support-icon">
                                <i className="lnr lnr-gift"></i>
                            </div>
                            <div className="support-desc">
                                <h6>Quà tặng</h6>
                                <span>Nhiều phần quà tặng kèm hấp dẫn khi mua sắm.</span>
                            </div>
                        </div>
                        <div className="single-support">
                            <div className="support-icon">
                                <i className="lnr lnr-rocket"></i>
                            </div>
                            <div className="support-desc">
                                <h6>Giao hàng</h6>
                                <span>Miễn phí giao hàng trong phạm vi bán kính 10km.</span>
                            </div>
                        </div>
                        <div className="single-support">
                            <div className="support-icon">
                                <i className="lnr lnr-lock"></i>
                            </div>
                            <div className="support-desc">
                                <h6>Thanh toán an toàn</h6>
                                <span>Áp dụng nhiều phương thức thanh toán an toàn.</span>
                            </div>
                        </div>
                        <div className="single-support">
                            <div className="support-icon">
                                <i className="lnr lnr-enter-down"></i>
                            </div>
                            <div className="support-desc">
                                <h6>Tự tin mua sắm</h6>
                                <span>Thoải mái mua sắm với sản phẩm đa dạng.</span>
                            </div>
                        </div>
                        <div className="single-support">
                            <div className="support-icon">
                                <i className="lnr lnr-users"></i>
                            </div>
                            <div className="support-desc">
                                <h6>Hỗ trợ khách hàng 24/7</h6>
                                <span>Đội ngũ nhân viên tư vấn và hỗ trợ 24/7.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="off-white-bg2 pt-95 bdr-top">
                <div className="footer-top">
                    <div className="container">
                        <div className="row mb-60">
                            <div className="col-xl-7 col-lg-7 ml-auto mr-auto col-md-8">
                                <div className="news-desc text-center mb-30">
                                    <h3>ĐĂNG KÍ ĐẶT HÀNG</h3>
                                    <p>Hãy là người tiêu dùng thông minh. Nhanh tay đặt hàng để nhận các quà tặng khuyến
                                        mãi
                                        lớn.</p>
                                </div>
                                <div className="newsletter-box">
                                    <form action="#">
                                        <input className="subscribe" placeholder="Nhập email của bạn..." name="email"
                                               id="subscribe" type="text"/>
                                        <button type="submit" className="submit">Đăng ký!</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-2 col-md-4 col-sm-6">
                                <div className="single-footer mb-sm-40">
                                    <h3 className="footer-title">THÔNG TIN</h3>
                                    <div className="footer-content">
                                        <ul className="footer-list">
                                            <li><a href="deliverypolicy.jsp">Chính sách giao hàng</a></li>
                                            <li><a href="privacy.html">Chính sách bảo mật</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-6">
                                <div className="single-footer mb-sm-40">
                                    <h3 className="footer-title">SẢN PHẨM</h3>
                                    <div className="footer-content">
                                        <ul className="footer-list">
                                            {Category.map((data, index) => (
                                                <li>
                                                    <NavLink key={index} to={data.path}>
                                                        {data.name}
                                                    </NavLink>
                                                </li>

                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-6">
                                <div className="single-footer mb-sm-40">
                                    <h3 className="footer-title">DỊCH VỤ</h3>
                                    <div className="footer-content">
                                        <ul className="footer-list">
                                            {Data.map((data, index) => (
                                                <li>
                                                    <NavLink key={index} to={data.path}>
                                                        {data.name}
                                                    </NavLink>
                                                </li>

                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/*<div className="col-lg-2 col-md-4 col-sm-6">
                                <div className="single-footer mb-sm-40">

                                </div>
                            </div>*/}
                            <div className="col-lg-4 col-md-6 col-sm-6">
                                <div className="single-footer mb-sm-40">
                                    <h3 className="footer-title">Liên hệ</h3>
                                    <div className="footer-content">
                                        <ul className="footer-list address-content">
                                            <li><i className="lnr lnr-map-marker"></i> Địa chỉ: Phường Linh Trung,
                                                TP.Thủ Đức,
                                                TP.HCM
                                            </li>
                                            <li><i className="lnr lnr-envelope"></i>
                                                <a> EMAIL:
                                                vphanhchinh@hcmuaf.edu.vn </a></li>
                                            <li>
                                                <i className="lnr lnr-phone-handset"></i> SĐT: (84-28) 3896 6780
                                            </li>
                                        </ul>
                                        <div className="payment mt-25 bdr-top pt-30">
                                            <a href="#"><img className="img" src="/assets/img/payment/1.png"
                                                             alt="payment-image"/></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-middle text-center">
                    <div className="container">
                        <div className="footer-middle-content pt-20 pb-30">
                            <ul className="social-footer">
                                <li><a href="https://www.facebook.com/"><i className="fa fa-facebook"></i></a></li>
                                <li><a href="https://twitter.com/"><i className="fa fa-twitter"></i></a></li>
                                <li><a href="https://plus.google.com/"><i className="fa fa-google-plus"></i></a></li>
                                <li><a href="https://www.linkedin.com/"><i className="fa fa-linkedin"></i></a></li>
                                <li>
                                    <a href="#"><img src="/assets/img/icon/social-img1.png" alt="google play"/></a>
                                </li>
                                <li>
                                    <a href="#"><img src="/assets/img/icon/social-img2.png" alt="app store"/></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom pb-30">
                    <div className="container">

                        <div className="copyright-text text-center">
                            <p>Copyright © 2022 <a target="_blank" href="#">Truemart</a> đã đăng ký bản quyền.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
export default Footer