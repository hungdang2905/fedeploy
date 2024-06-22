import {useEffect, useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {clearCart} from "../Cart/Redux/CartSlice";
import Breadcrumb from "../../../component/User/Breadcrumb/Breadcrumb";
import CurrencyFormatter from "../../../util/CurrencyFormatter";
import {Input} from "reactstrap";
import {notify} from "../../../util/notify/Notify";
import RootPathApi from "../../../route/RootPathApi";

const Checkout = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [total, setTotal] = useState(0);
    const [reward, setReward] = useState(0);
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');

    const [note, setNote] = useState('');
    const [phone, setPhone] = useState('');
    const [numberHouse, setNumberHouse] = useState('');
    const [error, setError] = useState('');
    const [errorPoint, setErrorPoint] = useState('');
    const cart = useSelector((state) => state.cart.cart);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery'); // Mặc định chọn thanh toán khi nhận hàng
    const navigate = useNavigate();
    const [account, setAccount] = useState([]);

    const baseUrl = RootPathApi();

    const user = JSON.parse(sessionStorage.getItem("user"))
    useEffect(() => {
        if (user === null) {
            navigate("/login")
        }
    }, [user]);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/user/get`, {params: {email: user.email}})
                setAccount(res.data)
                console.log(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchUser()
    }, [user.email]);
    useEffect(() => {
        // axios.get(`https://vapi.vnappmob.com/api/province/district/${selectedProvince}`)
        axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: {
                "token": "ec8c84b8-f7f8-11ee-b1d4-92b443b7a897"
            }
        })
            .then(response => {
                setProvinces(response.data.data);
                console.log(selectedProvince)
            })
            .catch(error => {
                console.error('khong tim thay', error);
            });

    }, [selectedProvince]);

    useEffect(() => {
        if (selectedProvince) {
            axios.post('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district', {
                "province_id": parseInt(selectedProvince)
            }, {
                headers: {
                    "token": "ec8c84b8-f7f8-11ee-b1d4-92b443b7a897" // Use an environment variable for the API token
                }
            })
                .then(response => {
                    // Filter out districts with IDs 2 and 3
                    setDistricts(response.data.data);
                    console.log(selectedProvince)
                })
                .catch(error => {
                    console.error('Could not find districts', error);
                });
        }
    }, [selectedProvince]);


    useEffect(() => {
        if (selectedDistrict) {
            // axios.get(`https://vapi.vnappmob.com/api/province/district/${selectedProvince}`)
            axios.post('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
                "district_id": parseInt(selectedDistrict)
            }, {
                headers: {
                    "token": "ec8c84b8-f7f8-11ee-b1d4-92b443b7a897"
                }
            })
                .then(response => {
                    setWards(response.data.data);
                    console.log(selectedProvince)
                })
                .catch(error => {
                    console.error('khong tim thay', error);
                });
        }
    }, [selectedDistrict]);

    const [paymentProcessed, setPaymentProcessed] = useState(false);
    useEffect(() => {
        if (selectedProvince) {
            const p = provinces.find(
                (province) => province.ProvinceID === parseInt(selectedProvince)
            );
            const d = districts.find(
                (district) => district.DistrictID === parseInt(selectedDistrict)
            );
            const w = wards.find(
                (ward) => ward.WardCode === selectedWard
            );
            if (p) {
                const provinceName = p.ProvinceName;
                setProvince(provinceName);
            }
            if (d) {
                const districtName = d.DistrictName;
                setDistrict(districtName);
            }
            if (w) {
                const wardname = w.WardName;
                setWard(wardname);
            }
        }

        console.log(ward)
    }, [district, districts, province, provinces, selectedDistrict, selectedProvince, selectedWard, ward, wards]);

    function generateUniqueRandomNumber() {
        // Lấy phần dư để giới hạn timestamp trong khoảng 8 chữ số
        return new Date().getTime();
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        const idOrder = JSON.stringify(generateUniqueRandomNumber())
        // Kiểm tra nếu thanh toán đã được xử lý thì không cần xử lý lại
        if (paymentProcessed) {
            return;
        }

        if (selectedProvince === "" || selectedDistrict === "" || selectedWard === "" || phone === "") {
            setError("Vui lòng nhập đầy đủ thông tin có dấu * đỏ");
            return;
        }

        const products = cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
        }));


        if (paymentMethod === "vnpay") {
            try {
                const data = {
                    amount: total>0?total:totalPrice,
                    orderInfo: idOrder
                };
                const dataOrder = {
                    id: idOrder,
                    fullname: user.fullname,
                    numberHouse: numberHouse,
                    province: province,
                    district: district,
                    ward: ward,
                    payMethod: "online",
                    paied: true,
                    note: note,
                    status: 0,
                    products: products,
                    rewardPoints:reward,
                    user: user
                };
                const response = await axios.post(`${baseUrl}/api/v1/payment/create_payment`, data);

                const status = response.data.status;
                if (status === "Ok") {
                    sessionStorage.setItem("order", JSON.stringify(dataOrder));
                    window.location.href = response.data.url;
                }
            } catch (error) {
                setError("Thanh toán thất bại");
            }
        } else if (paymentMethod === "cashOnDelivery") {
            const dataOrder = {
                id: idOrder,
                fullname: user.fullname,
                numberHouse: numberHouse,
                province: province,
                district: district,
                ward: ward,
                payMethod: "offline",
                paied: false,
                note: note,
                status: 0,
                products: products,
                rewardPoints:reward,
                user: user
            };
            console.log(dataOrder)
            await axios.post(`${baseUrl}/api/v1/order/create`, dataOrder).then(r => {
                dispatch(clearCart());
                navigate("/checkout/successfully");
            });
        }

        // Cập nhật biến flag để chỉ cho phép xử lý 1 lần
        setPaymentProcessed(true);
    };
    const point=account.rewardPoints;
    const handleRewardPoint = (e) => {

        const value = e.target.value;
        if (value > point) {
            setErrorPoint(`Giá trị không vượt quá ${point}`);
        }
        else if (value <0) {
            setErrorPoint(`Giá trị không nhỏ hơn 0`);
        }
        else{
            setTotal(totalPrice-(100*value))
            setErrorPoint("")
        }
    }

    console.log(paymentMethod)
    return (
        <div className="wrapper">
            <Breadcrumb title={"Thanh Toán"}/>
            <div className="checkout-area pb-100 pt-15 pb-sm-60">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="checkbox-form mb-sm-40">
                                <h3>Chi tiết thanh toán</h3>
                                {cart === null ? "" : (<form onSubmit={handlePayment}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="checkout-form-list mb-20">
                                                <label>Số nhà<span className="required">*</span></label>
                                                <input type="text" name="houseNumber"
                                                       onChange={(e) => setNumberHouse(e.target.value)}
                                                       placeholder="Vui lòng nhập tên đường, số nhà,..."/>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list mb-20">
                                                <label>Tỉnh <span className="required">*</span></label>
                                                <select name="province" id="province" className={"form-control"}
                                                        onChange={(e) => setSelectedProvince(e.target.value)}>
                                                    <option>Chọn tỉnh/ thành phố</option>
                                                    {provinces.map(province => (
                                                        <option key={province.ProvinceID}
                                                                value={province.ProvinceID}>{province.ProvinceName}</option>
                                                    ))}
                                                    {/*{provinces.map(province => (*/}
                                                    {/*    <option key={province.province_id}*/}
                                                    {/*            value={province.province_id}>{province.province_name}</option>*/}
                                                    {/*))}*/}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list mb-30">
                                                <label> Quận/ Huyện <span className="required">*</span></label>
                                                <select name="district" className={"form-control"} id="district"
                                                        onChange={(e) => setSelectedDistrict(e.target.value)}>
                                                    <option value="">chọn quận/ huyện</option>
                                                    {districts.map(district => (
                                                        <option key={district.DistrictID}
                                                                value={district.DistrictID}>{district.DistrictName}</option>
                                                    ))}
                                                    {/*{districts.map(district => (*/}
                                                    {/*    <option key={district.district_id}*/}
                                                    {/*            value={district.district_id}>{district.district_name}</option>*/}
                                                    {/*))}*/}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list mb-20">
                                                <label>Xã/ phường<span className="required">*</span></label>
                                                <select name="ward" className={"form-control"} id="ward"
                                                        onChange={(e) => setSelectedWard(e.target.value)}>
                                                    <option value="">chọn xã/ phường</option>
                                                    {/*{wards.map(ward => (*/}
                                                    {/*    <option key={ward.ward_id}*/}
                                                    {/*            value={ward.ward_id}>{ward.ward_name}</option>*/}
                                                    {/*))}*/}
                                                    {wards.map(ward => (
                                                        <option key={ward.WardCode}
                                                                value={ward.WardCode}>{ward.WardName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list mb-20">
                                                <div className={"mb-3"}><label>Số điện thoại<span
                                                    className="required">*</span></label>
                                                </div>
                                                <Input type="number" name="phone"
                                                       onChange={(e) => setPhone(e.target.value)}
                                                       placeholder="Số điện thoại"/>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list mb-20">
                                                <label><img width={30} src={"/assets/img/icon/coin.webp"}
                                                            alt={"coin"}/> Đổi điểm <span className={"fst-"}>(1 xu = 100₫)</span></label>
                                                <Input type="number" name="phone" min={0} max={account.rewardPoints} readOnly={point < 1}
                                                       onChange={(e) => {
                                                           setReward(e.target.value)
                                                           handleRewardPoint(e)
                                                       }}
                                                       placeholder="Đổi điểm"/>
                                                {errorPoint && <p style={{ color: 'red' }}>{errorPoint}</p>}
                                                <p style={{
                                                    color: "#7d7d7d",
                                                    fontSize: "13px",
                                                    fontStyle: "italic"
                                                }}>Điểm của bạn: {account.rewardPoints}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="checkout-form-list mb-20">
                                                <label>Ghi chú</label>
                                                <input type="text" name="note" onChange={(e) => setNote(e.target.value)}
                                                       placeholder="Hãy để lời nhắn cho chúng tôi nếu bạn muốn!"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="checkout-form-list mb-20">
                                            <label>Phương thức thanh toán<span className="required">*</span></label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                id="inThere"
                                                checked={paymentMethod === 'cashOnDelivery'} // Kiểm tra nếu phương thức thanh toán là khi nhận hàng
                                                onChange={() => setPaymentMethod('cashOnDelivery')} // Cập nhật state khi người dùng chọn
                                            />

                                            <label className="form-check-label" htmlFor="inThere">
                                                Thanh toán khi nhận hàng
                                            </label>
                                        </div>
                                        <div className="form-check mb-4">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                id="vnpay"
                                                checked={paymentMethod === 'vnpay'} // Kiểm tra nếu phương thức thanh toán là VNPay
                                                onChange={() => setPaymentMethod('vnpay')} style={{marginTop: "30px"}}/>
                                            <label className="form-check-label" htmlFor="vnpay">
                                                VN Pay <img src="/assets/img/logo/vnpay.jpg" alt={""}
                                                            style={{width: '30%', height: 'auto'}}/>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="different-address">
                                        <div className="order-notes">

                                            <div className="checkout-form-list">
                                                <h5>
                                                    {error === null ? "" : (
                                                        <span className={"text-danger"}>{error}</span>
                                                    )}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="checkout-form-list mb-30">
                                            <input type="submit" className={"btn btn-primary"} value="Đặt hàng"/>
                                        </div>
                                    </div>
                                </form>)}
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="your-order">
                                <h3>Đơn đặt hàng của bạn</h3>
                                <div className="your-order-table table-responsive">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th className="product-name">Sản phẩm</th>
                                            <th className="product-total">Số lượng</th>
                                            <th className="product-total">Giá</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {cart.map((item) => (
                                            <tr className="cart_item">
                                                <td className="product-name">
                                                    {item.product.title}
                                                    <span
                                                        className="product-quantity">{item.quantity}</span>
                                                </td>
                                                <td className="product-name">
                                                    <span
                                                        className="product-quantity">{item.quantity}</span>
                                                </td>
                                                <td className="product-total">
                                                                    <span
                                                                        className="amount"> <CurrencyFormatter
                                                                        value={item.product.price * item.quantity}/>₫</span>

                                                </td>
                                            </tr>
                                        ))}


                                        </tbody>
                                        <tfoot>
                                        {total>0? (<tr>
                                            <th>Giảm:</th>
                                            <td>
                                            </td>

                                            <td>
                                                <del className=" total amount"><CurrencyFormatter
                                                    value={totalPrice-total}/>₫
                                                </del>

                                            </td>

                                        </tr>):""}
                                        <tr className="order-total">
                                            <th>Tổng tiền:</th>
                                            <td>
                                            </td>

                                            <td>
                                                <span className=" total amount"><CurrencyFormatter
                                                    value={total > 0 ? total : totalPrice}/>₫</span>

                                            </td>

                                        </tr>
                                        </tfoot>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Checkout