import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    if (e.key === "Productdashboard") {
      navigate("/Productdashboard");
    } else if (e.key === "addProduct") {
      navigate("/addProduct");
    } else if (e.key === "deleteProduct") {
      navigate("/deleteproduct");
    } else if (e.key === "updateProduct") {
      navigate("/update-product");
    } else if (e.key === "updateQuantity") {
      navigate("/update-quantity");
    } else if("/addCategory") {
      navigate("/addCategory");
    }
  };

  return (
    <Sider width={200} style={{ background: "#f8f9fa", padding: "10px" }}>
      <Menu mode="vertical" defaultSelectedKeys={["Productdashboard"]} onClick={handleMenuClick}>
        <Menu.Item key="Productdashboard">Dashboard</Menu.Item>
        <Menu.Item key="addProduct">Add Product</Menu.Item>
        <Menu.Item key="deleteProduct">Delete Product</Menu.Item>
        <Menu.Item key="updateProduct">Update Product</Menu.Item>
        <Menu.Item key="updateQuantity">Update Quantity</Menu.Item>
        <Menu.Item key="addCategory">Add Category</Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
