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
        setCategories(response.categories);
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
    children: category.subCategories.map((sub) => ({
      key: sub.id, // ID của subcategory
      label: sub.name, // Tên của subcategory
    })),
  }));

  return (
    <Menu
      onClick={onClick}
      style={{
        borderRadius: "10px",
        width: "100%",
        height: "100%",
        backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
      mode="vertical"
      items={items}
    />
  );
};

export default SidebarMenuAntd;
