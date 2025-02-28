import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Screen/Client/Login";
import Register from "./Screen/Client/Register";
import Forgot from "./Screen/Client/Forgot";
import Home from "./Screen/Home";
import VerifyScreen from "./Screen/Client/Verify";
import Otp from "./Screen/Client/Otp";
import ResetPassword from "./Screen/Client/ResetPassword";
import NotFound from "./Screen/Error/NotFound";

import UserProfile from "./Screen/Client/UserProfile";

import Cart from "./Screen/Client/cart/cart";


import DashBoard from "./Screen/ProductManager/DashBoard";
import AddProduct from "./Screen/ProductManager/AddProduct";
import AddCategory from "./Screen/ProductManager/AddCategory";
import SaleScreen from "./Screen/Sale/SaleScreen";
import AdminScreen from "./Screen/Admin/AdminScreen";
import DeleteProduct from "./Screen/ProductManager/DelteProduct";


const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/verify" element={<VerifyScreen />} />
        <Route path="/otp/:email" element={<Otp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />


        <Route path="/userProfile" element={<UserProfile />} />


        <Route path="/cart" element={<Cart />} />



        <Route path="/Productdashboard" element={<DashBoard />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/addCategory" element={<AddCategory />} />
        <Route path="/deleteproduct" element={<DeleteProduct />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/sale" element={<SaleScreen />} />


        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
