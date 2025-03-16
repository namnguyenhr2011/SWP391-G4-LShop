import { useEffect, useState } from "react";
import { Menu } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCategory } from "../Service/Client/ApiProduct";

const SidebarMenuAntd = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        console.log("Categories Data:", JSON.stringify(response, null, 2)); // Log chi tiết
        if (response && Array.isArray(response.categories)) {
          setCategories(response.categories);
        } else {
          console.error("Invalid categories data:", response);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const items = categories.length > 0
    ? categories.map((category) => {
        const subCategories = category.subCategories || [];
        return {
          key: category._id,
          label: category.name,
          icon: <SettingOutlined />,
          children: subCategories.length > 0
            ? subCategories.map((sub, index) => {
                // Kiểm tra _id, nếu không có thì cảnh báo và dùng tạm index
                const subId = sub._id || sub.id || `tmp-${index}`;
                if (!sub._id && !sub.id) {
                  console.warn(`Subcategory "${sub.name}" is missing _id in category "${category.name}"`);
                }
                return {
                  key: subId,
                  label: sub.name || "Unnamed Subcategory",
                };
              })
            : null,
        };
      }).filter(item => item.children) // Loại bỏ category không có subcategory
    : [{ key: "no-data", label: "Không có danh mục", disabled: true }];

  const handleMenuClick = (e) => {
    const selectedSubcategoryId = e.key;
    console.log("Selected Subcategory ID:", selectedSubcategoryId); // Debug
    if (selectedSubcategoryId && selectedSubcategoryId.match(/^[0-9a-fA-F]{24}$/)) {
      navigate(`/product-list/${selectedSubcategoryId}`, { replace: true });
    } else {
      console.warn("Subcategory ID is not a valid MongoDB ID:", selectedSubcategoryId);
      // Có thể hiển thị thông báo lỗi cho người dùng nếu cần
    }
  };

  return (
    <Menu
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
      onClick={handleMenuClick}
      selectedKeys={[]}
    />
  );
};

export default SidebarMenuAntd;