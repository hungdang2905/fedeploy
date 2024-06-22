import {Link} from "react-router-dom";

const CheckoutSuccess = () => {
  console.log("laanf 1")
    // Trigger the asynchronous operation within useEffect

    return (
        <>
            <div className="error404-area ptb-100 ptb-sm-60">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="error-wrapper text-center">
                                <div className="error-text">
                                    <h2>Tạo đơn hàng thành công</h2>
                                    <p>Cảm ơn bạn đã tin tưởng và đặt hàng! Đơn hàng sẽ được giao sớm nhất có thể.</p>
                                    <h3>Trân trọng!</h3>
                                </div>
                                <div className="search-error">
                                    <form id="search-form" action="#">
                                        <input type="text" placeholder="Search"/>
                                        <button type="submit"><i className="fa fa-search"></i></button>
                                    </form>
                                </div>
                                <div className="error-button">
                                    <Link to={"/products"} className="btn btn-primary">Quay về trang chủ</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutSuccess;
