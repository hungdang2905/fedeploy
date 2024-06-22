import {Link, useLocation} from 'react-router-dom';
import {useDispatch} from "react-redux";
import axios from "axios";
import {clearCart} from "../Cart/Redux/CartSlice";
import {useEffect} from "react";
import moment from "moment";
import CurrencyFormatter from "../../../util/CurrencyFormatter";
import RootPathApi from "../../../route/RootPathApi";

export default function PaymentResultPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const vnp_Amount = queryParams.get('vnp_Amount');
    const vnp_OrderInfo = queryParams.get('vnp_OrderInfo');
    const vnp_BankCode = queryParams.get('vnp_BankCode');
    const vnp_PayDate = queryParams.get('vnp_PayDate');
    const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');
    const PayDate = moment(vnp_PayDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
    //insert order into db
    const baseUrl =RootPathApi();

    const dispatch = useDispatch();

    const order = sessionStorage.getItem("order");
    useEffect(() => {
        if (order !== null && vnp_ResponseCode === "00") {
            const parsedOrder = JSON.parse(order);
            try {
                axios.post(`${baseUrl}/api/v1/order/create`, parsedOrder).then((r) => {
                    dispatch(clearCart());
                    sessionStorage.removeItem("order");
                });
                console.log(order)
            } catch (error) {
                console.error("Error creating order:", error);
            }
        }
    }, []);

    return (
        <div>
            <div className="error404-area ptb-100 ptb-sm-60">
                <div className="container">
                    <div className="col">
                        <div className="col-md-12">
                            <div className=" text-center">
                                <div className="error-text">
                                    <h2>Thanh toán thành công đơn hàng</h2>

                                    <div className="d-flex justify-content-center text-left">
                                        <table className="table table-hover" style={{width: "50%"}}>
                                            <thead>
                                            <tr>
                                                <th scope="col">Thông tin đơn hàng:</th>
                                                <th scope="col">{vnp_OrderInfo}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <th scope="row">Ngân hàng:</th>
                                                <td>{vnp_BankCode}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Tổng thanh toán:</th>
                                                <td><CurrencyFormatter value={vnp_Amount/100}
                                                /> VNĐ
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Ngày thanh toán:</th>
                                                <td>{PayDate}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="error-button">
                                    <Link to={"/products"} className="btn btn-primary">Quay về trang chủ</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}