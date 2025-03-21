import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    if (e.key === "Productdashboard") {
      navigate("/Productdashboard");
    } else if (e.key === "viewProduct") {
      navigate("/viewProduct");
    } else if (e.key === "addProduct") {
      navigate("/addProduct");
    } else if (e.key === "deleteProduct") {
      navigate("/deleteproduct");
    } else if (e.key === "updateProduct") {
      navigate("/updateproduct");
    } else if (e.key === "addCategory") { 
      navigate("/addCategory");
    } else if (e.key === "addSubCategory") { 
      navigate("/addSubCategory");
    } else if (e.key === "viewCategory") {
      navigate("/viewCategory");
    }
  };
  

  return (
    <Sider 
            width={220} 
            style={{ background: "#fff", minHeight: "100vh", position: "fixed", left: 0, borderRight: "1px solid #ddd" }}
        >
      <Menu mode="vertical" defaultSelectedKeys={["Productdashboard"]} onClick={handleMenuClick}>
        <Menu.Item key="Productdashboard">Dashboard</Menu.Item>
        <Menu.Item key="viewProduct">View Product</Menu.Item>
        <Menu.Item key="addProduct">Add Product</Menu.Item>
        <Menu.Item key="deleteProduct">Delete Product</Menu.Item>
        <Menu.Item key="updateProduct">Update Product</Menu.Item>
        <Menu.Item key="addCategory">Add Category</Menu.Item>
        <Menu.Item key="addSubCategory">Add Subcategory</Menu.Item>
        <Menu.Item key="viewCategory">View Category</Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
