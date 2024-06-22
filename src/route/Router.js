import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../pages/User/Home/Home";
import Product from "../pages/User/Product/Product";
import Profile from "../pages/User/Profile/Profile";
import Login from "../pages/User/Login/Login";
import Register from "../pages/User/Register/Register";
import ProductDetail from "../pages/User/ProductDetail/ProductDetail";
import Cart from "../pages/User/Cart/Cart";
import Checkout from "../pages/User/checkout/Checkout";
import CheckoutOffSuccess from "../pages/User/checkout/CheckoutOffSuccess";
import PaymentResultPage from "../pages/User/checkout/PaymentResultPage";
import Admin from "../Admin";
import Dashboard from "../pages/Admin/dashboard/Dashboard";
import OrderManagement from "../pages/Admin/order/OrderManagement";
import Blog from "../pages/User/Blog/Blog";
import BlogDetail from "../pages/User/Blog/BlogDetail/BlogDetail";
import OrderDetail from "../pages/Admin/order/detail/OrderDetail";
import ProductManagement from "../pages/Admin/product/ProductManagement";
import ProductManagementAdd from "../pages/Admin/product/ProductManagementAdd";
import ProductManagementUpdate from "../pages/Admin/product/ProductManagementUpdate";
import MyOrder from "../pages/User/MyOrder/MyOrder";
import ForgetPass from "../pages/User/ForgetPassword/ForgetPass";
import Confirm from "../pages/User/ForgetPassword/Confirm";
import ChangePassword from "../pages/User/ForgetPassword/ChangePassword";
import React from "react";
import CommentManagement from "../pages/Admin/comment/CommentManagement";
import BlogManagementAdd from "../pages/Admin/blog/BlogManagementAdd";
import BlogManagement from "../pages/Admin/blog/BlogManagement";
import Account from "../pages/User/Account/Account";
import BlogManagementUpdate from "../pages/Admin/blog/BlogManagementUpdate";
import UserManagementAdd from "../pages/Admin/user/UserManagementAdd";
import UserManagement from "../pages/Admin/user/UserManagement";
import ErrorPage from "../pages/User/Error/ErrorPage";
import ProtectedRoute from "./ProtectedRoute";
import ReviewManagement from "../pages/Admin/review/ReviewManagement";
import CategoryManagement from "../pages/Admin/category/CategoryManagement";
import UserManagementUpdate from "../pages/Admin/user/UserManagementUpdate";


const Router = createBrowserRouter([{
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
        {path: '/', element: <Home/>},
        {path: '/login', element: <Login/>},
        {path: '/forget', element: <ForgetPass/>},
        {path: '/confirm', element: <Confirm/>},
        {path: '/changepassword', element: <ChangePassword/>},
        {path: '/register', element: <Register/>},
        {path: '/products', element: <Product/>},
        {path: '/products/:id', element: <ProductDetail/>},
        {path: '/profile', element: <Profile/>},
        {path: '/account', element: <Account/>},
        {path: '/blog', element: <Blog/>},
        {path: 'blog/detail/:id', element: <BlogDetail/>},
        {path: '/cart', element: <Cart/>},
        {path: '/checkout', element: <Checkout/>},
        {path: '/payment-result', element: <PaymentResultPage/>},
        {path: '/history', element: <MyOrder/>},
        {path: '/checkout/successfully', element: <CheckoutOffSuccess/>}
    ]
}, {
    path: '/admin',
    errorElement: <ErrorPage/>,
    element:  <Admin/>,
    children: [
        {path: '/admin', element: <ProtectedRoute component={Dashboard}/>},
        {path: '/admin/user-management', element: <ProtectedRoute component={UserManagement}/>},
        {path: '/admin/user-management/add', element: <ProtectedRoute component={UserManagementAdd}/>},
        {path: '/admin/user-management/update/:id', element: <ProtectedRoute component={UserManagementUpdate}/>},
        {path: '/admin/order-management', element: <ProtectedRoute component={OrderManagement}/>},
        {path: '/admin/order-management/order/:id', element: <ProtectedRoute component={OrderDetail}/>},
        {path: '/admin/product-management', element: <ProtectedRoute component={ProductManagement}/>},
        {path: '/admin/product-management/add', element: <ProtectedRoute component={ProductManagementAdd}/>},
        {path: '/admin/product-management/update/:id', element: <ProtectedRoute component={ProductManagementUpdate}/>},
        {path: '/admin/comment-management', element: <ProtectedRoute component={CommentManagement}/>},
        {path: '/admin/blog-management', element: <ProtectedRoute component={BlogManagement}/>},
        {path: '/admin/blog-management/add', element: <ProtectedRoute component={BlogManagementAdd}/>},
        {path: '/admin/blog-management/update/:id', element: <ProtectedRoute component={BlogManagementUpdate}/>},
        {path: '/admin/review-management',element:<ProtectedRoute component={ReviewManagement}/>},
        {path: '/admin/category-management',element:<ProtectedRoute component={CategoryManagement}/>}
    ]
}]);

export default Router;
