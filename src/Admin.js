import {Outlet} from "react-router-dom";

import './App.css';
import Header from "./component/Admin/header/Header";
import JSLinkAd from "./component/Admin/library/JSLinkAd";
import CSSLinkAd from "./component/Admin/library/CSSLinkAd";
import React from "react";
import SidebarLeft from "./component/Admin/SidebarLeft/SidebarLeft";
import Store from "./pages/User/Cart/Redux/Store";
import {Provider} from "react-redux";


function Admin() {
    return (

        <Provider store={Store}>

            <CSSLinkAd/>
            <div className="be-wrapper be-fixed-sidebar">
                <Header/>
                <SidebarLeft/>
                <div className="be-content">

                    <div className="main-content container-fluid">
                        <Outlet/>

                    </div>
                </div>
                {/*<nav className="be-right-sidebar">*/}
                {/*    /!* Right sidebar content *!/*/}
                {/*</nav>*/}

                <JSLinkAd/>
            </div>

        </Provider>

    );
}

export default Admin;
