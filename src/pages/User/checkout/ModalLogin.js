import {Link} from "react-router-dom";

export default function ModalLogin({id}){
    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Thông báo</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        ...
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <Link to={"/login"}>
                            <button type="button" className="btn btn-primary">Đăng nhập</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}