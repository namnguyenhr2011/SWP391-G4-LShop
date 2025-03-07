import { useEffect, useState } from "react";
import { Typography } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import ProductCard from "./ProductCard";
import { getTop8 } from "../Service/Client/ApiProduct";

const { Title } = Typography;

const FeaturedProducts = ({ isDarkMode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getTop8();
        setProducts(response.products);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
