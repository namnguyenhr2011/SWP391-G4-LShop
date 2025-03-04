import { useEffect, useState } from "react";
import { Menu, Spin, message } from "antd";
import { SettingOutlined, LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getAllCategory } from "../Service/Client/ApiProduct";

// CSS tĩnh không phụ thuộc isDarkMode
const customStyles = `
  .custom-sidebar-menu .ant-menu-item,
  .custom-sidebar-menu .ant-menu-submenu-title {
    border-radius: 8px;
    margin: 4px 8px;
    transition: all 0.3s ease;
  }
  .custom-sidebar-menu .ant-menu-item:hover,
  .custom-sidebar-menu .ant-menu-submenu-title:hover {
    background-color: #e6f0fa;
    color: #1890ff;
  }
  .custom-sidebar-menu .ant-menu-item-selected {
    background-color: #e6f0fa;
    color: #1890ff;
  }
`;

const SidebarMenuAntd = ({ onClick }) => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategory();
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        message.error("Không thể tải danh mục. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        tip="Đang tải danh mục..."
        style={{ display: "block", textAlign: "center", padding: "20px" }}
      />
    );
  }

  return (
    <>
      <style>{customStyles}</style> {/* Chèn CSS tĩnh */}
      <Menu
        onClick={onClick}
        style={{
          borderRadius: "10px",
          width: "100%",
          minHeight: "500px",
          backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
          color: isDarkMode ? "#e6edf3" : "#1c1e21",
          transition: "background-color 0.3s ease, color 0.3s ease",
          border: isDarkMode ? "1px solid #30363d" : "1px solid #e4e7eb",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        mode="vertical"
        items={items}
        defaultOpenKeys={categories.length ? [categories[0]._id] : []}
        selectable={true}
        theme={isDarkMode ? "dark" : "light"}
        className="custom-sidebar-menu"
      />
    </>
  );
};

export default SidebarMenuAntd;
