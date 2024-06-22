import React, {useState} from 'react';
import Sidebar from "../../../component/User/profile/Sidebar";
import MyOrder from "../MyOrder/MyOrder";
import Breadcrumb from "../../../component/User/Breadcrumb/Breadcrumb";
import Profile from "../Profile/Profile";
import StatusOrders from "../../../component/User/profile/StatusOrders";

function Account() {
    const [activeComponent, setActiveComponent] = useState('Orders');
    const renderComponent = () => {
        switch (activeComponent) {
            case 'Profile':
                return <Profile/>;
            case 'StatusOrder':
                return <StatusOrders/>;
            case 'HistoryOrder':
                return <MyOrder/>;
            default:
                return <Profile/>;
        }
    };

    return (
        <div className={"container"}>
            <Breadcrumb title={'Lịch sử mua hàng'}/>

            <div className="d-flex ml-3 ">
                <Sidebar setActiveComponent={setActiveComponent}/>
                <div className="flex-grow-1 p-3" style={{width:"75%"}}>
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
}

export default Account