import { useEffect, useState } from "react";
import { Menu } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCategory } from "../service/client/ApiProduct";

const SidebarMenu = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Hàm tạo slug từ tên subcategory
  const createSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
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

  const items =
    categories.length > 0
      ? categories
          .map((category) => {
            const subCategories = category.subCategories || [];
            return {
              key: category._id,
              label: category.name,
              icon: <SettingOutlined />,
              children:
                subCategories.length > 0
                  ? subCategories.map((sub, index) => {
                      const subId = sub._id || sub.id || `tmp-${index}`;
                      if (!sub._id && !sub.id) {
                        console.warn(
                          `Subcategory "${sub.name}" is missing _id in category "${category.name}"`
                        );
                      }
                      return {
                        key: subId,
                        label: sub.name || "Unnamed Subcategory",
                        slug: createSlug(sub.name || "unnamed-subcategory"), // Lưu slug
                      };
                    })
                  : null,
            };
          })
          .filter((item) => item.children)
      : [{ key: "no-data", label: "Không có danh mục", disabled: true }];

  const handleMenuClick = (e) => {
    const selectedSubcategoryId = e.key;
    console.log("Selected Subcategory ID:", selectedSubcategoryId);

    // Tìm subcategory dựa trên ID
    let selectedSubcategory = null;
    for (const category of categories) {
      selectedSubcategory = category.subCategories.find(
        (sub) => (sub._id || sub.id) === selectedSubcategoryId
      );
      if (selectedSubcategory) break;
    }

    if (selectedSubcategory) {
      const slug = createSlug(
        selectedSubcategory.name || "unnamed-subcategory"
      );
      navigate(`/product-list/${slug}`, {
        state: { subcategoryId: selectedSubcategoryId }, // Truyền ID qua state
        replace: true,
      });
    } else {
      console.warn("Subcategory not found for ID:", selectedSubcategoryId);
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

export default SidebarMenu;
