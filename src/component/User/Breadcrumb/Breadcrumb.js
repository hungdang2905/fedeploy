const Breadcrumb=({title})=>{

    return (
        <div className="breadcrumb-area mt-30">
            <div className="container">
                <div className="breadcrumb">
                    <ul className="d-flex align-items-center">
                        <li><a href="/">Trang chủ</a></li>
                        <li className="active"><a href={`/${title}`}>{title}</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default Breadcrumb