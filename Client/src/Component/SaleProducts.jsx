import { useEffect, useState } from "react";
import { Typography, Spin } from "antd";
import { FireOutlined } from "@ant-design/icons";
import SaleProductCard from "./SaleProductCard.jsx";
import { getAllProductsWithSale } from "../service/client/ApiProduct";
import { useTranslation } from "react-i18next";
const { Title } = Typography;

const SaleProducts = ({ isDarkMode }) => {
  const { t } = useTranslation('saleProduct');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProductsWithSale();
        const filteredSaleProducts = response.products.filter(
          (product) =>
            product.sale &&
            typeof product.sale === "object" &&
            product.sale.isSale === true &&
            product.sale.startDate &&
            product.sale.endDate
        );
        setProducts(filteredSaleProducts);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm giảm giá:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div
      style={{
        marginBottom: "40px",
        padding: "20px",
        borderRadius: "12px",
        background: isDarkMode ? "#252830" : "#fff5f5",
        boxShadow: isDarkMode
          ? "0 4px 12px rgba(0, 0, 0, 0.3)"
          : "0 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <FireOutlined
          style={{
            fontSize: "24px",
            color: "#ff4d4f",
            marginRight: "10px",
            animation: "blink 1.5s infinite alternate",
          }}
        />
        <Title
          level={4}
          style={{
            margin: 0,
            color: isDarkMode ? "#e6edf3" : "#1c1e21",
            fontWeight: "bold",
          }}
        >
          {t("Discount")}
        </Title>
      </div>

      {loading ? (
        <Spin
          size="large"
          style={{
            display: "block",
            margin: "30px auto",
          }}
        />
      ) : (
        <SaleProductCard products={products} loading={loading} />
      )}
    </div>
  );
};

export default SaleProducts;
