import { I18nextProvider } from "react-i18next";
import i18n from "./Service/locales/i18n";
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
import UpdateProfile from "./Screen/Client/UpdateProfile";
import ChangePassword from "./Screen/Client/ChangePassword";

import OrderDetails from "./Screen/Client/Order/OrderDetail";
import OrderScreen from "./Screen/Cient/Order/Order";

import DashBoard from "./Screen/ProductManager/DashBoard";
import AddProduct from "./Screen/ProductManager/AddProduct";
import AddCategory from "./Screen/ProductManager/AddCategory";
import DeleteProduct from "./Screen/ProductManager/DelteProduct";
import UpdateProduct from "./Screen/ProductManager/UpadateProduct";
import ViewProduct from "./Screen/ProductManager/ViewProudct";
import ProductDetail from "./Screen/Client/product/productDetail";
import AddSubCategory  from "./Screen/ProductManager/AddSubCategory";
import ViewCategory from "./Screen/ProductManager/ViewCategory";

//Admin Page
import AdminLayout from "./Screen/Admin/AdminLayout";
import AdminDashboard from "./Screen/Admin/AdminDashboard";
import UserManagement from "./Screen/Admin/UserManagement";
import SaleManagement from "./Screen/Admin/SaleManagement";
import OrderManagement from "./Screen/Admin/OrderManagement";
import ManagerProductManagement from "./Screen/Admin/ManagerProductManagement";
import FeedbackManagement from "./Screen/Admin/FeedbackManagement";

//sale
import SaleScreen from "./Screen/Sale/SaleScreen";
import AddSaleScreen from "./Screen/Sale/AddSaleScreen";
import UpdateSaleScreen from "./Screen/Sale/UpdateSale";
import ProductList from "./Screen/Client/product/productList";
import ProductSaleDetail from "./Screen/Client/product/productSaleDetail";
import SaleProductCard from "./Component/SaleProductCard";
import SaleOrderManagement from "./Screen/Sale/SaleOrderManagement";
import SaleDashboard from "./Screen/Sale/SaleDashboard";


const App = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  return (
    <I18nextProvider i18n={i18n}>
      <ToastContainer position="top-right" autoClose={3000} />
      <ConfigProvider
        theme={{
          token: {
            colorText: isDarkMode ? "#ffffff" : "#1c1e21",
            colorBgBase: isDarkMode ? "#1e2a3c" : "#fff",
            colorBorder: isDarkMode ? "#3a3f44" : "#d9d9d9",
            colorTextPlaceholder: isDarkMode ? "#b0c4de" : "#8c8c8c",
          },
          components: {
            Menu: {
              colorText: isDarkMode ? "#ffffff" : "#1c1e21",
              colorBgBase: isDarkMode ? "#1e2a3c" : "#fff",
            },
          },
        }}
      >
        <Router>
          <Routes>
            {/* duc */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/verify" element={<VerifyScreen />} />
            <Route path="/otp/:email" element={<Otp />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/cart">
              <Route index element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="returnQR" element={<ReturnQR />} />
            </Route>
            {/* an */}
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/order">
              <Route index element={<OrderScreen />} />
              <Route path="orderDetail/:id" element={<OrderDetails />} />
            </Route>

            {/* huy */}
            <Route path="/Productdashboard" element={<DashBoard />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/addCategory" element={<AddCategory />} />
            <Route path="/deleteproduct" element={<DeleteProduct />} />
            <Route path="/updateproduct" element={<UpdateProduct />} />
            <Route path="/viewproduct" element={<ViewProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/addSubCategory" element={<AddSubCategory />} />
            <Route path="/viewCategory" element={<ViewCategory />} />
            
            {/* nam */}
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
              <Route
                path="manage-productmanager"
                element={<ManagerProductManagement />}
              />
              <Route path="manage-feedback" element={<FeedbackManagement />} />
            </Route>

            {/* tuan */}
            <Route path="/all-products" element={<ProductList />} />
            <Route path="/product-list/:subcategoryId" element={<ProductList />} />
            <Route path="/sale" element={<SaleScreen />} />
            <Route path="/sale/add" element={<AddSaleScreen />} />
            <Route path="/sale/update" element={<UpdateSaleScreen />} />
            <Route path="/sale/orders" element={<SaleOrderManagement />} />
            <Route path="/product-sale/:id" element={<ProductSaleDetail />} />;
            <Route path="/products-sale" element={<SaleProductCard />} />;
            <Route path="/sale/dashboard" element={<SaleScreen />} />

            {/* end */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </I18nextProvider>
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

// const SaleProtectedRoute = ({ children }) => {
//   const user = useSelector((state) => state.user.user);

//   if (!user || user.role !== "sale") {
//     return <NotFound />;
//   }

//   return children;
// };

// SaleProtectedRoute.propTypes = {
//   children: PropTypes.node.isRequired,
// };

export default App;
