import { useState, useEffect } from "react";
import { getProductWithSaleID, deleteSale } from "../../Service/sale/ApiSale";
import { Button, Input, Table, Select, message, Spin } from "antd";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogout } from "../../Store/reducer/userReducer";

const { Option } = Select;

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

  const handleAddSale = (product) => {
    navigate("/sale/add", { state: { product } });
  };

  const handleUpdateSale = (product) => {
    navigate("/sale/update", { state: { product } });
  };

  const handleDelete = async (saleId) => {
    if (!saleId) {
      message.error("No sale found to delete.");
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
        message.error("An unknown error occurred from the API.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error("An error occurred: " + errorMessage);
    }
  };

  const handleViewSalePrice = () => {
    setShowOrderDescription(false);
  };

  const handleViewOrder = () => {
    setShowOrderDescription(true);
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "desc" ? b.price - a.price : sortOrder === "asc" ? a.price - b.price : 0
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
          style={{ width: 80, height: 80, borderRadius: "8px", objectFit: "cover" }}
        />
      ),
    },
    { title: "Product Name", dataIndex: "name", key: "name", className: "fw-bold" },
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
        sale?.salePrice ? (
          `${sale.salePrice.toLocaleString()} VND`
        ) : (
          <span style={{ color: "#999" }}>Not Available</span>
        ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="d-flex gap-2">
          <Button
            type="primary"
            size="middle"
            style={{
              borderRadius: "8px",
              backgroundColor: "#28a745",
              borderColor: "#28a745",
            }}
            onClick={() => handleAddSale(record)}
          >
            Add Sale Price
          </Button>
          <Button
            type="primary"
            size="middle"
            style={{
              borderRadius: "8px",
              backgroundColor: "#007bff",
              borderColor: "#007bff",
            }}
            onClick={() => handleUpdateSale(record)}
            disabled={!record.sale}
          >
            Update
          </Button>
          <Button
            type="primary"
            danger
            size="middle"
            style={{ borderRadius: "8px" }}
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
    <>
      <Navbar
        expand="lg"
        fixed="top"
        style={{
          background: "linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)",
          padding: "1rem 2rem",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Container fluid>
          <Navbar.Brand
            style={{
              color: "#ffd700",
              fontSize: "1.8rem",
              fontWeight: "700",
              textShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            Sale Manager
          </Navbar.Brand>
          <Button
            type="primary"
            danger
            size="large"
            style={{
              borderRadius: "10px",
              padding: "0.5rem 2rem",
              fontWeight: "600",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s",
            }}
            onClick={handleLogout}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
          >
            Logout
          </Button>
        </Container>
      </Navbar>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "250px",
            background: "linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)",
            padding: "2rem",
            borderRadius: "0 20px 20px 0",
            boxShadow: "4px 0 12px rgba(0, 0, 0, 0.15)",
            color: "#ffffff",
            position: "fixed",
            height: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
        >
          <h4
            style={{
              color: "#ffd700",
              fontWeight: "600",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Navigation
          </h4>
          <Nav className="flex-column">
            <Nav.Link
              onClick={handleViewSalePrice}
              style={{
                color: "#ffffff",
                fontSize: "1.2rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                backgroundColor: showOrderDescription ? "transparent" : "#28a745",
                marginBottom: "1rem",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = showOrderDescription ? "transparent" : "#28a745")
              }
            >
              View Sale Price
            </Nav.Link>
            <Nav.Link
              onClick={handleViewOrder}
              style={{
                color: "#ffffff",
                fontSize: "1.2rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                backgroundColor: showOrderDescription ? "#007bff" : "transparent",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = showOrderDescription ? "#007bff" : "transparent")
              }
            >
              View Order
            </Nav.Link>
          </Nav>
        </div>

        <Container
          className="mt-5 pt-5 pb-5"
          style={{
            marginLeft: "260px",
            background: "linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)",
            borderRadius: "20px",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
            color: "#ffffff",
            flex: "1",
          }}
        >
          {showOrderDescription ? (
            <div
              style={{ color: "#e0e0e0", fontSize: "1.2rem", lineHeight: "1.6", padding: "2rem" }}
            >
              <h3 style={{ color: "#ffd700", fontWeight: "600" }}>View Order Description</h3>
              <p>
                This use case describes the process by which a Seller views the details of an order
                in the system. This functionality allows the Seller to track and manage orders
                efficiently.
              </p>
            </div>
          ) : (
            <>
              <Row className="mb-4">
                <Col md={9} xs={12}>
                  <Input
                    placeholder="🔍 Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded"
                    style={{
                      padding: "0.5rem",
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      color: "#333",
                      border: "none",
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </Col>
                <Col md={3} xs={12} className="mt-2 mt-md-0">
                  <Select
                    defaultValue="default"
                    onChange={setSortOrder}
                    className="w-100 rounded"
                    style={{ borderRadius: "10px" }}
                  >
                    <Option value="default">Default</Option>
                    <Option value="desc">Price (High to Low)</Option>
                    <Option value="asc">Price (Low to High)</Option>
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
                    background: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  className="table-striped"
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    position: ["bottomCenter"],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,
                  }}
                />
              )}
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default SaleScreen;