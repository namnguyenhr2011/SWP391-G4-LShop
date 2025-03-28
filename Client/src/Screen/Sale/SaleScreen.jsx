import { useState, useEffect } from "react";
import { getProductWithSaleID, deleteSale } from "../../Service/sale/ApiSale";
import { Button, Input, Table, Select, message, Spin } from "antd";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogout } from "../../store/reducer/userReducer";
import SaleOrderManagement from "./SaleOrderManagement";
import SaleDashboard from "./SaleDashboard";

const { Option } = Select;

// Header Component
const Header = ({ onLogout }) => (
  <Navbar
    expand="lg"
    style={{
      background: "linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)",
      padding: "0.5rem 1.5rem",
      borderRadius: "15px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      width: "90%",
      maxWidth: "1800px",
      margin: "20px auto 20px",
      position: "fixed",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
    }}
  >
    <Container fluid>
      <Navbar.Brand
        style={{
          color: "#ffd700",
          fontSize: "1.6rem", // Tăng từ 1.3rem lên 1.6rem
          fontWeight: "700",
          textShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        Sale Manager
      </Navbar.Brand>
      <Button
        type="primary"
        danger
        size="middle" // Tăng từ small lên middle
        onClick={onLogout}
        style={{
          borderRadius: "8px",
          padding: "0.3rem 1.2rem",
          fontSize: "14px", // Tăng từ 12px lên 14px
          fontWeight: "600",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
      >
        Logout
      </Button>
    </Container>
  </Navbar>
);

// Sidebar Component
const Sidebar = ({ activeView, onViewSalePrice, onViewOrder, onViewDashboard }) => (
  <div
    style={{
      background: "linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)",
      padding: "1.5rem",
      borderRadius: "15px",
      boxShadow: "4px 0 12px rgba(0, 0, 0, 0.15)",
      color: "#ffffff",
      height: "calc(100vh - 100px)", // Trừ header
      minWidth: "200px",
      maxWidth: "200px",
      overflowY: "auto",
      overflowX: "hidden",
      position: "fixed",
      top: "100px", // Dưới header
      left: "20px",
    }}
  >
    <h4
      style={{
        color: "#ffd700",
        fontWeight: "600",
        fontSize: "1.4rem", // Tăng từ 1.2rem lên 1.4rem
        marginBottom: "1rem",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      Navigation
    </h4>
    <Nav className="flex-column">
      <Nav.Link
        onClick={onViewDashboard}
        style={{
          color: "#ffffff",
          fontSize: "1.2rem", // Tăng từ 1rem lên 1.2rem
          padding: "0.5rem 0.75rem",
          borderRadius: "8px",
          backgroundColor: activeView === "dashboard" ? "#17a2b8" : "transparent",
          transition: "all 0.3s",
          textAlign: "center",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#138496")}
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = activeView === "dashboard" ? "#17a2b8" : "transparent")
        }
      >
        Dashboard
      </Nav.Link>
      <Nav.Link
        onClick={onViewSalePrice}
        style={{
          color: "#ffffff",
          fontSize: "1.2rem", // Tăng từ 1rem lên 1.2rem
          padding: "0.5rem 0.75rem",
          borderRadius: "8px",
          backgroundColor: activeView === "sale" ? "#28a745" : "transparent",
          marginBottom: "0.75rem",
          transition: "all 0.3s",
          textAlign: "center",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = activeView === "sale" ? "#28a745" : "transparent")
        }
      >
        Sale Management
      </Nav.Link>
      <Nav.Link
        onClick={onViewOrder}
        style={{
          color: "#ffffff",
          fontSize: "1.2rem", // Tăng từ 1rem lên 1.2rem
          padding: "0.5rem 0.75rem",
          borderRadius: "8px",
          backgroundColor: activeView === "order" ? "#007bff" : "transparent",
          marginBottom: "0.75rem",
          transition: "all 0.3s",
          textAlign: "center",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = activeView === "order" ? "#007bff" : "transparent")
        }
      >
        Order Management
      </Nav.Link>
    </Nav>
  </div>
);

// MainContent Component
const MainContent = ({
  products,
  loading,
  searchTerm,
  sortOrder,
  onSearchChange,
  onSortChange,
  columns,
  activeView,
  setLoading,
}) => (
  <div
    style={{
      padding: "1rem",
      background: "linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)",
      borderRadius: "15px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      height: "calc(100vh - 100px)", // Trừ header
      marginLeft: "240px", // Khoảng cách với sidebar
      marginTop: "100px", // Dưới header
      marginRight: "20px",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}
  >
    {activeView === "order" ? (
      <SaleOrderManagement loading={loading} setLoading={setLoading} />
    ) : activeView === "dashboard" ? (
      <SaleDashboard />
    ) : (
      <>
        <Row className="mb-3" align="middle">
          <Col md={8} xs={12}>
            <Input
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={onSearchChange}
              style={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                fontSize: "1.1rem", // Tăng từ 0.9rem lên 1.1rem
                width: "90%",
              }}
            />
          </Col>
          <Col md={4} xs={12} className="mt-2 mt-md-0">
            <Select
              defaultValue="default"
              onChange={onSortChange}
              style={{ width: "100%", fontSize: "1.1rem" }} // Tăng từ 0.9rem lên 1.1rem
            >
              <Option value="default">Default</Option>
              <Option value="desc">Price: High to Low</Option>
              <Option value="asc">Price: Low to High</Option>
            </Select>
          </Col>
        </Row>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <Table
              columns={columns}
              dataSource={products}
              rowKey="_id"
              bordered
              style={{
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: 5,
                position: ["bottomCenter"],
                showTotal: (total, range) => (
                  <span style={{ fontSize: "14px" }}>{`${range[0]}-${range[1]} of ${total} products`}</span> // Tăng từ mặc định lên 14px
                ),
              }}
              className="small-font-table"
            />
          </div>
        )}
      </>
    )}
  </div>
);

const SaleScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [activeView, setActiveView] = useState("sale"); // "sale", "order", "dashboard"
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeView === "sale") {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await getProductWithSaleID();
          const updatedProducts = response.products.map((product) => ({
            ...product,
            saleId: product.sale?.saleID || null,
          }));
          setProducts(updatedProducts);
        } catch {
          message.error("Unable to fetch product data");
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [activeView]);

  const handleLogout = () => {
    dispatch(doLogout());
    message.success("Logged out successfully!");
    navigate("/");
  };

  const handleAddSale = (product) =>
    navigate("/sale/add", { state: { product } });
  const handleUpdateSale = (product) =>
    navigate("/sale/update", { state: { product } });

  const handleDelete = async (saleId) => {
    if (!saleId) return message.error("No sale found to delete");
    try {
      setLoading(true);
      const response = await deleteSale(saleId);
      message.success(response.message);
      setProducts((prev) =>
        prev.map((product) =>
          product.sale?.saleID === saleId
            ? { ...product, sale: null, saleId: null }
            : product
        )
      );
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "desc"
        ? b.price - a.price
        : sortOrder === "asc"
        ? a.price - b.price
        : 0
    );

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="product"
          style={{
            width: 60,
            height: 60,
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span style={{ fontSize: "14px", whiteSpace: "normal", wordBreak: "break-word" }}> {/* Tăng từ 12px lên 14px */}
          {text}
        </span>
      ),
    },
    {
      title: "Original Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span style={{ fontSize: "14px" }}> {/* Tăng từ 12px lên 14px */}
          {price.toLocaleString()} VND
        </span>
      ),
    },
    {
      title: "Sale Price",
      dataIndex: "sale",
      key: "salePrice",
      render: (sale) => (
        <span style={{ fontSize: "14px" }}> {/* Tăng từ 12px lên 14px */}
          {sale?.salePrice
            ? `${sale.salePrice.toLocaleString()} VND`
            : "Not Available"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          <Button
            size="middle" // Tăng từ small lên middle
            type="primary"
            onClick={() => handleAddSale(record)}
            style={{ fontSize: "14px", padding: "0 10px" }} // Tăng từ 12px lên 14px
          >
            Add Sale
          </Button>
          <Button
            size="middle" // Tăng từ small lên middle
            type="primary"
            onClick={() => handleUpdateSale(record)}
            disabled={!record.sale}
            style={{ fontSize: "14px", padding: "0 10px" }} // Tăng từ 12px lên 14px
          >
            Update
          </Button>
          <Button
            size="middle" // Tăng từ small lên middle
            type="primary"
            danger
            onClick={() => handleDelete(record.sale?.saleID)}
            disabled={!record.sale}
            style={{ fontSize: "14px", padding: "0 10px" }} // Tăng từ 12px lên 14px
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#e9ecef",
        padding: "20px",
      }}
    >
      <Header onLogout={handleLogout} />
      <Sidebar
        activeView={activeView}
        onViewSalePrice={() => setActiveView("sale")}
        onViewOrder={() => setActiveView("order")}
        onViewDashboard={() => setActiveView("dashboard")}
      />
      <MainContent
        products={filteredProducts}
        loading={loading}
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSortChange={setSortOrder}
        columns={columns}
        activeView={activeView}
        setLoading={setLoading}
      />
    </div>
  );
};

// Add some custom CSS to adjust font sizes in the table
const styles = `
  .small-font-table .ant-table-thead > tr > th,
  .small-font-table .ant-table-tbody > tr > td {
    font-size: 14px !important; /* Tăng từ 12px lên 14px */
    padding: 10px !important; /* Tăng padding từ 8px lên 10px */
  }
  .small-font-table .ant-select-selector {
    font-size: 14px !important; /* Tăng từ 12px lên 14px */
  }
  .small-font-table .ant-select-item {
    font-size: 14px !important; /* Tăng từ 12px lên 14px */
  }
`;

// Inject the styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default SaleScreen;