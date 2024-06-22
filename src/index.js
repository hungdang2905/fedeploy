import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Router from "./route/Router";
import {GoogleOAuthProvider} from "@react-oauth/google";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <GoogleOAuthProvider clientId="156369584980-bdl09p477j7felg4l814q40ret6vushj.apps.googleusercontent.com">

        <RouterProvider router={Router}/>

    </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
