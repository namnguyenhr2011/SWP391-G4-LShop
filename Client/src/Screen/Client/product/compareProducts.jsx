import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Typography, Spin, Button, Card } from "antd";
import { toast } from "react-toastify";
import { compareProducts } from "../../../Service/Client/ApiProduct";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const CompareProducts = () => {
  const { t } = useTranslation("compare");
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const product1Id = query.get("product1");
  const product2Id = query.get("product2");
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDarkMode = useSelector((state) => state.user.darkMode);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const response = await compareProducts(product1Id, product2Id);
        if (response && response.data) {
          setComparisonData(response.data.result);
        } else {
          throw new Error(t("noData"));
        }
      } catch (error) {
        console.error(t("fetchError"), error);
        toast.error(t("toastError"));
      } finally {
        setLoading(false);
      }
    };

    if (product1Id && product2Id) {
      fetchComparison();
    }
  }, [product1Id, product2Id, t]);

  const data = useMemo(() => {
    if (!comparisonData) return [];
    const { product1, product2, betterProduct } = comparisonData;

    return [
      {
        key: "1",
        attribute: t("price"),
        product1: product1.price.toLocaleString() + " đ",
        product2: product2.price.toLocaleString() + " đ",
        highlight: betterProduct.price === "product1" ? t("better.price1") : t("better.price2"),
      },
      {
        key: "2",
        attribute: t("quantity"),
        product1: product1.quantity,
        product2: product2.quantity,
        highlight: betterProduct.quantity === "product1" ? t("better.quantity1") : t("better.quantity2"),
      },
      {
        key: "3",
        attribute: t("sold"),
        product1: product1.sold,
        product2: product2.sold,
        highlight: betterProduct.sold === "product1" ? t("better.sold1") : t("better.sold2"),
      },
      {
        key: "4",
        attribute: t("reviews"),
        product1: product1.numReviews,
        product2: product2.numReviews,
        highlight: betterProduct.rating === "product1" ? t("better.rating1") : t("better.rating2"),
      },
      {
        key: "5",
        attribute: t("image"),
        product1: (
          <img
            src={product1.image}
            alt={product1.name}
            style={{ width: "100%", maxWidth: "120px", aspectRatio: "1/1", objectFit: "cover", borderRadius: "8px" }}
          />
        ),
        product2: (
          <img
            src={product2.image}
            alt={product2.name}
            style={{ width: "100%", maxWidth: "120px", aspectRatio: "1/1", objectFit: "cover", borderRadius: "8px" }}
          />
        ),
        highlight: betterProduct.image === "product1" ? t("better.image1") : t("better.image2"),
      },
    ];
  }, [comparisonData, t]);

  const columns = useMemo(
    () => [
      {
        title: t("attribute"),
        dataIndex: "attribute",
        width: "30%",
        render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
      },
      {
        title: comparisonData?.product1.name || t("product1"),
        dataIndex: "product1",
        width: "35%",
        render: (text, record) => (
          <span
            style={{
              fontWeight: record.highlight.includes("Sản phẩm 1") || record.highlight.includes("Product 1") ? 600 : 400,
              color: isDarkMode ? "#fff" : "#000",
            }}
          >
            {text}
          </span>
        ),
      },
      {
        title: comparisonData?.product2.name || t("product2"),
        dataIndex: "product2",
        width: "35%",
        render: (text, record) => (
          <span
            style={{
              fontWeight: record.highlight.includes("Sản phẩm 2") || record.highlight.includes("Product 2") ? 600 : 400,
              color: isDarkMode ? "#fff" : "#000",
            }}
          >
            {text}
          </span>
        ),
      },
    ],
    [comparisonData, isDarkMode, t]
  );

  if (loading) {
    return (
      <div className="compare-loading" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className={isDarkMode ? "dark-mode" : "light-mode"} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
            {t("noData")}
          </Title>
          <Button type="primary" onClick={() => navigate("/")} size="large">
            {t("back")}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, padding: "24px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "32px" }}>
          {t("title")}
        </Title>
        <Card
          bordered={false}
          style={{
            boxShadow: isDarkMode ? "0 4px 12px rgba(255,255,255,0.1)" : "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            rowClassName={() => "compare-table-row"}
            style={{ borderRadius: "12px" }}
            scroll={{ x: true }}
          />
        </Card>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "24px" }}>
          <Button type="primary" onClick={() => navigate(`/product/${product1Id}`)} size="large">
            {comparisonData.product1.name}
          </Button>
          <Button type="primary" onClick={() => navigate(`/product/${product2Id}`)} size="large">
            {comparisonData.product2.name}
          </Button>
          <Button onClick={() => navigate("/")} size="large">
            {t("back")}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompareProducts;
