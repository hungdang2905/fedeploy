import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

const Sidebar = ({ setActiveComponent }) => {
    return (
        <div className=" pr-7 pt-3" style={{ width: '23%',marginTop:"12px" }}>
            <ListGroup>
                <ListGroupItem onClick={() => setActiveComponent('Profile')}>Tài Khoản Của Tôi</ListGroupItem>
                <ListGroupItem onClick={() => setActiveComponent('StatusOrder')}>Đơn Mua</ListGroupItem>
                <ListGroupItem onClick={() => setActiveComponent('HistoryOrder')}>Lịch sử mua hàng</ListGroupItem>
            </ListGroup>
        </div>
    );
};

export default Sidebar;
