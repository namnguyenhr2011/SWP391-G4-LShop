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
import UpdateProfile from "./Screen/Client/UpdateProfile";
import ChangePassword from "./Screen/Client/ChangePassword"; // Thêm import

import Cart from "./Screen/Client/cart/cart";
import ProductManagerScreen from "./Screen/ProductManager/ProductManagerScreen";
import SaleScreen from "./Screen/Sale/SaleScreen";
import AdminScreen from "./Screen/Admin/AdminScreen";
import OrderScreen from "./Screen/Client/Order/Order";

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
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/change-password" element={<ChangePassword />} /> {/* Thêm route */}

        <Route path="/cart" element={<Cart />} />
        <Route path="/productManager" element={<ProductManagerScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/sale" element={<SaleScreen />} />
        <Route path="/order" element={<OrderScreen />} />

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

