import { useState, useEffect } from "react";
import { getProductWithSaleID, updateSalePrice, deleteSale } from "../../Service/sale/ApiSale";
import { Button, Input, Table, Select, message, Spin } from "antd";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogout } from "../../Store/reducer/userReducer";

const { Option } = Select;

const SaleScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductWithSaleID();
        const updatedProducts = response.products.map((product) => ({
          ...product,
          saleId: product.sale?.saleID || null,
        }));
        setProducts(updatedProducts);
      } catch {
        message.error("Không thể lấy dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    dispatch(doLogout());
    message.success("Đã đăng xuất thành công!");
    navigate("/");
  };

  const handleAddSale = (product) => {
    navigate("/sale/add", { state: { product } }); // Chuyển hướng sang AddSaleScreen
  };

  const handleUpdateSale = (product) => {
    navigate("/sale/update", { state: { product } });
  };

  const handleDelete = async (saleId) => {
    if (!saleId) {
      message.error("Không tìm thấy sale để xóa.");
      return;
    }
    try {
      const response = await deleteSale(saleId);
      if (response.message) {
        message.success(response.message);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.sale?.saleID === saleId ? { ...product, sale: null, saleId: null } : product
          )
        );
      } else {
        message.error("Lỗi không xác định từ API.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error("Có lỗi xảy ra: " + errorMessage);
    }
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "desc" ? b.price - a.price : sortOrder === "asc" ? a.price - b.price : 0
    );

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="product"
          style={{ width: 60, height: 60, borderRadius: "8px", objectFit: "cover" }}
        />
      ),
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", className: "fw-bold" },
    { title: "Giá gốc", dataIndex: "price", key: "price", render: (price) => `${price.toLocaleString()} VND` },
    {
      title: "Giá sale",
      dataIndex: "sale",
      key: "salePrice",
      render: (sale) =>
        sale?.salePrice ? `${sale.salePrice.toLocaleString()} VND` : <span style={{ color: "#999" }}>Chưa có</span>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="d-flex gap-2">
          <Button
            type="primary"
            size="middle"
            style={{ borderRadius: "8px" }}
            onClick={() => handleAddSale(record)}
          >
            Thêm giá sale
          </Button>
          <Button
            type="primary"
            size="middle"
            style={{ borderRadius: "8px", backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            onClick={() => handleUpdateSale(record)}
            disabled={!record.sale}
          >
            Cập nhật
          </Button>
          <Button
            type="primary"
            danger
            size="middle"
            style={{ borderRadius: "8px" }}
            onClick={() => handleDelete(record.sale?.saleID)}
            disabled={!record.sale}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container
      className="mt-4 p-4"
      style={{
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        borderRadius: "16px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        color: "white",
      }}
    >
      <Row className="justify-content-between align-items-center mb-4">
        <Col>
          <h2
            className="mb-0 text-center"
            style={{ fontSize: "1.8rem", fontWeight: 600, textShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }}
          >
            Sale Manager
          </h2>
        </Col>
        <Col xs="auto">
          <Button
            type="primary"
            danger
            size="large"
            style={{ borderRadius: "8px", fontWeight: 500 }}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={9} xs={12}>
          <Input
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded"
            style={{ padding: "0.5rem" }}
          />
        </Col>
        <Col md={3} xs={12} className="mt-2 mt-md-0">
          <Select
            defaultValue="default"
            onChange={setSortOrder}
            className="w-100 rounded"
            style={{ borderRadius: "8px" }}
          >
            <Option value="default">Mặc định</Option>
            <Option value="desc">Giá giảm dần</Option>
            <Option value="asc">Giá tăng dần</Option>
          </Select>
        </Col>
      </Row>
      {loading ? (
        <div className="text-center py-4">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="_id"
          bordered
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          className="table-striped"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            position: ["bottomCenter"],
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
          }}
        />
      )}
    </Container>
  );
};

export default SaleScreen;