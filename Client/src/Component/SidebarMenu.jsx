import { useEffect, useState } from "react";
import { Menu } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getAllCategory } from "../Service/Client/ApiProduct";

const SidebarMenuAntd = ({ onClick }) => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        setCategories(response.categories || []);
        console.log(response);
      } catch (error) {
        console.error("Lỗi khi lấy category:", error);
      }
    };

    fetchCategories();
  }, []);

  const items = categories.map((category) => ({
    key: category._id,
    label: category.name,
    icon: <SettingOutlined />,
    children:
      category.subCategories?.map((sub) => ({
        key: sub.id,
        label: sub.name,
      })) || [],
  }));

  return (
    <Menu
      onClick={onClick}
      style={{
        borderRadius: "10px",
        border: isDarkMode ? "1px solid #3a3f44" : "1px solid #d9d9d9",
        width: "100%",
        height: "500px",
        backgroundColor: isDarkMode ? "#1e2a3c" : "#f4f6f9",
        boxShadow: isDarkMode
          ? "0 4px 12px rgba(0, 0, 0, 0.4)"
          : "0 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "10px 0",
        transition: "all 0.3s ease",
        overflow: "auto",
      }}
      mode="vertical"
      items={items}
    />
  );
};

export default SidebarMenuAntd;
