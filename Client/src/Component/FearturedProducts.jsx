// src/Component/FearturedProducts.jsx
import { useEffect, useState } from "react";
import { Typography } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import ProductCard from "./ProductCard";
import { getTopView } from "../service/client/ApiProduct";

const { Title } = Typography;

const FeaturedProducts = ({ isDarkMode }) => {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getTopView();
        setProducts(response.products);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Hàm xử lý khi click vào sản phẩm
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <ThunderboltOutlined
          style={{ fontSize: "24px", color: "#ff4d4f", marginRight: "10px" }}
        />
        <Title
          level={4}
          style={{ margin: 0, color: isDarkMode ? "#e6edf3" : "#1c1e21" }}
        >
          Sản phẩm nổi bật
        </Title>
      </div>
      <ProductCard products={products} loading={loading} />
    </div>
  );
};

export default FeaturedProducts;
