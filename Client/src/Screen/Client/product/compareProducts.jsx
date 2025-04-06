import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Typography, Spin, Button } from "antd";
import { toast } from "react-toastify";
import { compareProducts } from "../../../Service/Client/ApiProduct";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { useSelector } from "react-redux";  // Import useSelector for Redux

const { Title } = Typography;

const CompareProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const product1Id = query.get("product1");
  const product2Id = query.get("product2");
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the dark mode value from Redux state
  const isDarkMode = useSelector((state) => state.user.darkMode);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);

      try {
        const response = await compareProducts(product1Id, product2Id);
        if (response && response.data) {
          setComparisonData(response.data.result);
        } else {
          throw new Error("Không có dữ liệu so sánh.");
        }
      } catch (error) {
        console.error("Lỗi khi so sánh sản phẩm:", error);
        toast.error("Không thể lấy dữ liệu so sánh.");
      } finally {
        setLoading(false);
      }
    };

    if (product1Id && product2Id) {
      fetchComparison();
    }
  }, [product1Id, product2Id]);

  if (loading) return <Spin size="large" style={{ display: "block", marginTop: "50px" }} />;

  // Kiểm tra nếu comparisonData là null hoặc không có dữ liệu
  if (!comparisonData) {
    return (
      <div className={isDarkMode ? "dark-mode" : ""}>
        <Header />
        <Title level={3} style={{ textAlign: "center" }}>Không có dữ liệu so sánh.</Title>
        <Button
          type="primary"
          onClick={() => navigate("/")}
          style={{ marginTop: "20px", display: "block", marginLeft: "auto" }}
        >
          Quay lại
        </Button>
        <Footer />
      </div>
    );
  }

  const { product1, product2, betterProduct } = comparisonData;

  const data = [
    {
      key: "1",
      attribute: "Giá",
      product1: product1.price.toLocaleString() + " đ",
      product2: product2.price.toLocaleString() + " đ",
      highlight: betterProduct.price === "product1" ? "Sản phẩm 1 tốt hơn về giá" : "Sản phẩm 2 tốt hơn về giá",
    },
    {
      key: "2",
      attribute: "Số lượng còn",
      product1: product1.quantity,
      product2: product2.quantity,
      highlight: betterProduct.quantity === "product1" ? "Sản phẩm 1 tốt hơn về số lượng" : "Sản phẩm 2 tốt hơn về số lượng",
    },
    {
      key: "3",
      attribute: "Đã bán",
      product1: product1.sold,
      product2: product2.sold,
      highlight: betterProduct.sold === "product1" ? "Sản phẩm 1 tốt hơn về đã bán" : "Sản phẩm 2 tốt hơn về đã bán",
    },
    {
      key: "4",
      attribute: "Đánh giá",
      product1: product1.numReviews,
      product2: product2.numReviews,
      highlight: betterProduct.rating === "product1" ? "Sản phẩm 1 tốt hơn về đánh giá" : "Sản phẩm 2 tốt hơn về đánh giá",
    }, {
      key: "5",
      attribute: "Ảnh",
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
      highlight: betterProduct.image === "product1" ? "Sản phẩm 1 tốt hơn về ảnh" : "Sản phẩm 2 tốt hơn về ảnh",
    }
  ];

  const columns = [
    {
      title: "Thuộc tính",
      dataIndex: "attribute",
    },
    {
      title: product1.name,
      dataIndex: "product1",
      render: (text, record) => (
        <span style={{ fontWeight: record.highlight.includes("Sản phẩm 1") ? "bold" : "normal" }}>
          {text}
        </span>
      ),
    },
    {
      title: product2.name,
      dataIndex: "product2",
      render: (text, record) => (
        <span style={{ fontWeight: record.highlight.includes("Sản phẩm 2") ? "bold" : "normal" }}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <Header />
      <div style={{ padding: 24 }}>
        <Title level={3}>So sánh sản phẩm</Title>
        <Table dataSource={data} columns={columns} pagination={false} />
        <Button
          type="primary"
          onClick={() => navigate("/")}
          style={{ marginTop: "20px", display: "block", marginLeft: "auto" }}
        >
          Quay lại
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default CompareProducts;
