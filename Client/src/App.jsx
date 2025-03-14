import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
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
import Checkout from "./Screen/Client/cart/checkout";
import ReturnQR from "./Screen/Client/cart/ReturnQR";

import ProductManagerScreen from "./Screen/ProductManager/ProductManagerScreen";
import SaleScreen from "./Screen/Sale/SaleScreen";

import AdminLayout from "./screen/admin/AdminLayout";
import AdminDashboard from "./screen/admin/AdminDashboard";
import UserManagement from "./screen/admin/UserManagement";
import SaleManagement from "./screen/admin/SaleManagement";
import OrderManagement from "./screen/admin/OrderManagement";
import FeedbackManagement from "./Screen/Admin/FeedbackManagement";

const App = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: isDarkMode ? "#ffffff" : "#1c1e21", // Chữ trắng trong dark mode
          colorBgBase: isDarkMode ? "#1e2a3c" : "#fff", // Nền phù hợp
          colorBorder: isDarkMode ? "#3a3f44" : "#d9d9d9", // Viền phù hợp
          colorTextPlaceholder: isDarkMode ? "#b0c4de" : "#8c8c8c", // Placeholder
        },
        components: {
          Menu: {
            colorText: isDarkMode ? "#ffffff" : "#1c1e21", // Đảm bảo chữ trong Menu là trắng
            colorBgBase: isDarkMode ? "#1e2a3c" : "#fff", // Nền của Menu
          },
        },
      }}
    >
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

          <Route path="/cart">
            <Route index element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="returnQR" element={<ReturnQR />} />
          </Route>

          <Route path="/productManager" element={<ProductManagerScreen />} />

          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="manage-user" element={<UserManagement />} />
            <Route path="saler-list" element={<SaleManagement />} />
            <Route path="order-list" element={<OrderManagement />} />
            <Route path="manage-feedback" element={<FeedbackManagement />} />
          </Route>

          <Route path="/sale" element={<SaleScreen />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const AdminProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  if (!user || user.role !== "admin") {
    return <NotFound />;
  }

  return children;
};

AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
