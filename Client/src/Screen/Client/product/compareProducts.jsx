import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Typography, Spin, Button } from "antd";
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

  if (loading) {
    return <Spin size="large" style={{ display: "block", marginTop: "50px" }} />;
  }

  if (!comparisonData) {
    return (
      <div className={isDarkMode ? "dark-mode" : ""}>
        <Header />
        <Title level={3} style={{ textAlign: "center" }}>{t("noData")}</Title>
        <Button
          type="primary"
          onClick={() => navigate("/")}
          style={{ marginTop: "20px", display: "block", marginLeft: "auto" }}
        >
          {t("back")}
        </Button>
        <Footer />
      </div>
    );
  }

  const { product1, product2, betterProduct } = comparisonData;

  const data = [
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
          style={{ width: "100px", height: "auto", borderRadius: "8px" }}
        />
      ),
      product2: (
        <img
          src={product2.image}
          alt={product2.name}
          style={{ width: "100px", height: "auto", borderRadius: "8px" }}
        />
      ),
      highlight: betterProduct.image === "product1" ? t("better.image1") : t("better.image2"),
    }
  ];

  const columns = [
    {
      title: t("attribute"),
      dataIndex: "attribute",
    },
    {
      title: product1.name,
      dataIndex: "product1",
      render: (text, record) => (
        <span style={{ fontWeight: record.highlight.includes("Sản phẩm 1") || record.highlight.includes("Product 1") ? "bold" : "normal" }}>
          {text}
        </span>
      ),
    },
    {
      title: product2.name,
      dataIndex: "product2",
      render: (text, record) => (
        <span style={{ fontWeight: record.highlight.includes("Sản phẩm 2") || record.highlight.includes("Product 2") ? "bold" : "normal" }}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <Header />
      <div style={{ padding: 24 }}>
        <Title level={3}>{t("title")}</Title>
        <Table dataSource={data} columns={columns} pagination={false} />
        <Button
          type="primary"
          onClick={() => navigate("/")}
          style={{ marginTop: "20px", display: "block", marginLeft: "auto" }}
        >
          {t("back")}
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default CompareProducts;
