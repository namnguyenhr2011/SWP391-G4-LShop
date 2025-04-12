import React, { useState, useEffect } from "react";
import { Button, Input, Select, message, DatePicker } from "antd";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { updateSalePrice } from "../../Service/sale/ApiSale";

const { Option } = Select;

const UpdateSaleScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};

  const [saleId, setSaleId] = useState(product?.sale?.saleID || null);
  const [salePrice, setSalePrice] = useState(product?.sale?.salePrice || "");
  const [startDate, setStartDate] = useState(
    product?.sale?.startDate ? new Date(product.sale.startDate) : null
  );
  const [endDate, setEndDate] = useState(
    product?.sale?.endDate ? new Date(product.sale.endDate) : null
  );
  const [discountType, setDiscountType] = useState(product?.sale?.discountType || "fixed");

  useEffect(() => {
    if (!product || !product.sale) {
      message.error("No sale information found to update.");
      navigate("/sale");
    }
  }, [product, navigate]);

  const handleStartDateChange = (date) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      setStartDate(newDate);
    } else {
      setStartDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(23, 59, 59, 999);
      setEndDate(newDate);
    } else {
      setEndDate(null);
    }
  };

  const handleSubmit = async () => {
    if (!salePrice || isNaN(salePrice) || salePrice <= 0) {
      message.warning("Please enter a valid price.");
      return;
    }
    if (!startDate || !endDate) {
      message.warning("Please select start and end dates.");
      return;
    }
    if (startDate > endDate) {
      message.warning("Start date must be before end date.");
      return;
    }

    try {
      const priceValue = parseInt(salePrice, 10);
      if (discountType === "percentage" && (priceValue <= 0 || priceValue > 100)) {
        message.warning("Discount percentage must be between 1 and 100.");
        return;
      }

      const saleData = {
        productId: product._id,
        salePrice: priceValue,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        discountType,
      };

      if (!saleId) {
        message.error("No sale found to update.");
        return;
      }

      const response = await updateSalePrice(saleId, saleData);
      if (response.message) {
        message.success(response.message);
        navigate("/sale");
      } else {
        message.error("An unknown error occurred from the API.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error("An error occurred: " + errorMessage);
    }
  };

  return (
    <Container
      className="mt-5 p-5"
      style={{
        background: "linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)",
        borderRadius: "20px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
        color: "#ffffff",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <Row className="mb-4">
        <Col>
          <h2
            className="text-center"
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#ffd700",
              textShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            Update Sale Price
          </h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <p
            className="fw-bold mb-2"
            style={{ color: "#e0e0e0", fontSize: "1.1rem" }}
          >
            Product Name:
          </p>
          <Input
            value={product?.name || ""}
            disabled
            style={{
              marginBottom: "1.5rem",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              color: "#333",
              fontWeight: "600",
              padding: "0.5rem",
              border: "none",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          />
          <p
            className="fw-bold mb-2"
            style={{ color: "#e0e0e0", fontSize: "1.1rem" }}
          >
            Enter New Sale Price:
          </p>
          <Input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            placeholder="Enter sale price"
            style={{
              marginBottom: "1.5rem",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              color: "#333",
              padding: "0.5rem",
              border: "none",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          />
          <p
            className="fw-bold mb-2"
            style={{ color: "#e0e0e0", fontSize: "1.1rem" }}
          >
            Discount Type:
          </p>
          <Select
            value={discountType}
            onChange={setDiscountType}
            style={{
              width: "100%",
              marginBottom: "1.5rem",
              borderRadius: "10px",
            }}
          >
            <Option value="fixed">Fixed Price</Option>
            <Option value="percentage">Percentage</Option>
          </Select>
          <p
            className="fw-bold mb-2"
            style={{ color: "#e0e0e0", fontSize: "1.1rem" }}
          >
            Start Date:
          </p>
          {startDate && (
            <p
              style={{
                color: "#b0c4de",
                marginBottom: "0.5rem",
                fontStyle: "italic",
              }}
            >
              Selected: {startDate.toLocaleString()}
            </p>
          )}
          <DatePicker
            onChange={handleStartDateChange}
            style={{
              width: "100%",
              marginBottom: "1.5rem",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              padding: "0.5rem",
              border: "none",
            }}
            showTime
          />
          <p
            className="fw-bold mb-2"
            style={{ color: "#e0e0e0", fontSize: "1.1rem" }}
          >
            End Date:
          </p>
          {endDate && (
            <p
              style={{
                color: "#b0c4de",
                marginBottom: "0.5rem",
                fontStyle: "italic",
              }}
            >
              Selected: {endDate.toLocaleString()}
            </p>
          )}
          <DatePicker
            onChange={handleEndDateChange}
            style={{
              width: "100%",
              marginBottom: "1.5rem",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              padding: "0.5rem",
              border: "none",
            }}
            showTime
          />
        </Col>
      </Row>
      <Row className="mt-4 justify-content-center">
        <Col xs="auto">
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            style={{
              borderRadius: "10px",
              backgroundColor: "#007bff",
              borderColor: "#007bff",
              padding: "0.5rem 2rem",
              fontWeight: "600",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Update
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            type="default"
            size="large"
            onClick={() => navigate("/sale")}
            style={{
              borderRadius: "10px",
              backgroundColor: "#dc3545",
              borderColor: "#dc3545",
              color: "#ffffff",
              padding: "0.5rem 2rem",
              fontWeight: "600",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateSaleScreen;