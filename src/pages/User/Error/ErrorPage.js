export default function ErrorPage(){
    return(
        <div className="wrapper">
            <div className="error404-area ptb-100 ptb-sm-60">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="error-wrapper text-center">
                                <div className="error-text">
                                    <h1>404</h1>
                                    <h2>Opps! không tìm thấy trang</h2>
                                    <p>Xin lỗi nhưng trang bạn đang tìm không tồn tại, đã bị xóa, đổi tên hoặc tạm thời không có.</p>
                                </div>
                                <div className="error-button">
                                    <a href="/">Quay về trang chủ</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}