import {Outlet} from "react-router-dom";

import './App.css';
import Header from "./component/User/Header/Header";
import {Provider} from "react-redux";
import Store from "./pages/User/Cart/Redux/Store";
import Footer from "./component/User/Footer/Footer";
import CSSLink from "./component/User/library/CSSLink";
import JSLink from "./component/User/library/JSLink";
import {SearchProvider} from "./component/User/Header/SearchContext";

import 'react-multi-carousel/lib/styles.css';
function App() {


    return (
        <Provider store={Store}>
            <CSSLink/>
            <div>
                <SearchProvider>
                    <Header/>
                    <div>
                        <Outlet />
                    </div>
                    <Footer/>
                </SearchProvider>
            </div>
            <JSLink/>
        </Provider>

    );
}

export default App;
