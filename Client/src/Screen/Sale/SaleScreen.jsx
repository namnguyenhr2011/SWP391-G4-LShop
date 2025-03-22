import { useState, useEffect } from "react";
import { getProductWithSaleID, deleteSale } from "../../Service/sale/ApiSale";
import { Button, Input, Table, Select, message, Spin } from "antd";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogout } from "../../store/reducer/userReducer";

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
    }}
  >
    <Container fluid>
      <Navbar.Brand
        style={{
          color: "#ffd700",
          fontSize: "1.5rem",
          fontWeight: "700",
          textShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        Sale Manager
      </Navbar.Brand>
      <Button
        type="primary"
        danger
        size="middle"
        onClick={onLogout}
        style={{
          borderRadius: "8px",
          padding: "0.3rem 1.5rem",
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
const Sidebar = ({ activeView, onViewSalePrice, onViewOrder }) => (
  <div
    style={{
      background: "linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)",
      padding: "2rem",
      borderRadius: "15px",
      boxShadow: "4px 0 12px rgba(0, 0, 0, 0.15)",
      color: "#ffffff",
      height: "calc(90vh - 50px)",
      minWidth: "250px",
      maxWidth: "250px", 
      overflowY: "auto",
      overflowX: "hidden", 
      position: "sticky",
      top: "50px", 
    }}
  >
    <h4
      style={{
        color: "#ffd700",
        fontWeight: "600",
        fontSize: "1.4rem",
        marginBottom: "1.5rem",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      Navigation
    </h4>
    <Nav className="flex-column">
      <Nav.Link
        onClick={onViewSalePrice}
        style={{
          color: "#ffffff",
          fontSize: "1.2rem",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          backgroundColor: !activeView ? "#28a745" : "transparent",
          marginBottom: "1rem",
          transition: "all 0.3s",
          textAlign: "center",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = !activeView
            ? "#28a745"
            : "transparent")
        }
      >
        Sale Management
      </Nav.Link>
      <Nav.Link
        onClick={onViewOrder}
        style={{
          color: "#ffffff",
          fontSize: "1.2rem",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          backgroundColor: activeView ? "#007bff" : "transparent",
          transition: "all 0.3s",
          textAlign: "center",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = activeView
            ? "#007bff"
            : "transparent")
        }
      >
        Order Management
      </Nav.Link>
    </Nav>
  </div>
);

const MainContent = ({
  products,
  loading,
  searchTerm,
  sortOrder,
  onSearchChange,
  onSortChange,
  columns,
  showOrderDescription,
}) => (
  <div
    style={{
      padding: "1.5rem",
      background: "linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)",
      borderRadius: "15px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      height: "calc(90vh - 50px)", 
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}
  >
    {showOrderDescription ? (
      <div style={{ padding: "1.5rem" }}>
        <h3
          style={{
            color: "#1e3c72",
            fontWeight: "600",
            fontSize: "1.6rem",
            marginBottom: "1.5rem",
          }}
        >
          Order Description
        </h3>
        <p style={{ color: "#444", fontSize: "1.1rem", lineHeight: "1.6" }}>
          This section allows sellers to view and manage order details
          efficiently, providing a clear overview of all order-related
          information.
        </p>
      </div>
    ) : (
      <>
        <Row className="mb-4" align="middle">
          <Col md={8} xs={12}>
            <Input
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={onSearchChange}
              style={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                fontSize: "1rem",
                width: "90%",
              }}
            />
          </Col>
          <Col md={4} xs={12} className="mt-2 mt-md-0">
            <Select
              defaultValue="default"
              onChange={onSortChange}
              style={{ width: "100%", fontSize: "1.1rem" }}
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
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} products`,
              }}
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
  const [showOrderDescription, setShowOrderDescription] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
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
        message.error("Unable to fetch product data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
    if (!saleId) return message.error("No sale found to delete.");
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
            width: 80,
            height: 80,
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      ),
    },
    { title: "Product Name", dataIndex: "name", key: "name" },
    {
      title: "Original Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Sale Price",
      dataIndex: "sale",
      key: "salePrice",
      render: (sale) =>
        sale?.salePrice
          ? `${sale.salePrice.toLocaleString()} VND`
          : "Not Available",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            size="middle"
            type="primary"
            onClick={() => handleAddSale(record)}
          >
            Add Sale
          </Button>
          <Button
            size="middle"
            type="primary"
            onClick={() => handleUpdateSale(record)}
            disabled={!record.sale}
          >
            Update
          </Button>
          <Button
            size="middle"
            type="primary"
            danger
            onClick={() => handleDelete(record.sale?.saleID)}
            disabled={!record.sale}
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
      <Container
        style={{
          width: "90%",
          maxWidth: "1800px",
          margin: "0 auto",
        }}
      >
        <Row>
          <Col md={2} xs={12}>
            <Sidebar
              activeView={showOrderDescription}
              onViewSalePrice={() => setShowOrderDescription(false)}
              onViewOrder={() => setShowOrderDescription(true)}
            />
          </Col>
          <Col md={10} xs={12}>
            <MainContent
              products={filteredProducts}
              loading={loading}
              searchTerm={searchTerm}
              sortOrder={sortOrder}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              onSortChange={setSortOrder}
              columns={columns}
              showOrderDescription={showOrderDescription}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SaleScreen;
