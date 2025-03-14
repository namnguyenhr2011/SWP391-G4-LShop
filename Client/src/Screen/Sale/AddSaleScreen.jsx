import React, { useState } from "react";
import { Button, Input, Select, message, DatePicker } from "antd";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { addSalePrice } from "../../Service/sale/ApiSale";

const { Option } = Select;

const AddSaleScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};

  const [salePrice, setSalePrice] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [discountType, setDiscountType] = useState("fixed");

  const handleStartDateChange = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      setStartDate(date);
    } else {
      setStartDate(null);
    }
  };

  const handleEndDateChange = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      date.setHours(23, 59, 59, 999);
      setEndDate(date);
    } else {
      setEndDate(null);
    }
  };

  const handleSubmit = async () => {
    if (!salePrice || isNaN(salePrice) || salePrice <= 0) {
      message.warning("Vui lòng nhập giá hợp lệ.");
      return;
    }
    if (!startDate || !endDate) {
      message.warning("Vui lòng chọn ngày bắt đầu và kết thúc.");
      return;
    }
    if (startDate > endDate) {
      message.warning("Ngày bắt đầu phải trước ngày kết thúc.");
      return;
    }

    try {
      const priceValue = parseInt(salePrice, 10);
      if (discountType === "percentage" && (priceValue <= 0 || priceValue > 100)) {
        message.warning("Phần trăm giảm giá phải từ 1 đến 100.");
        return;
      }

      const saleData = {
        productId: product._id,
        salePrice: priceValue,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        discountType,
      };

      const response = await addSalePrice(saleData);
      if (response.message) {
        message.success(response.message);
        navigate("/sale");
      } else {
        message.error("Lỗi không xác định từ API.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error("Có lỗi xảy ra: " + errorMessage);
    }
  };

  return (
    <Container
      className="mt-5 p-5"
      style={{
        background: "linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)", // Gradient xanh đậm sang xanh nhạt
        borderRadius: "20px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", // Bóng đổ mềm mại
        color: "#ffffff",
        maxWidth: "600px", // Giới hạn chiều rộng cho gọn gàng
        margin: "0 auto", // Căn giữa container
      }}
    >
      <Row className="mb-4">
        <Col>
          <h2
            className="text-center"
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#ffd700", // Vàng nhạt cho tiêu đề
              textShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)", // Bóng chữ nhẹ
            }}
          >
            Thêm Giá Sale
          </h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <p
            className="fw-bold mb-2"
            style={{ color: "#e0e0e0", fontSize: "1.1rem" }} // Xám nhạt cho nhãn
          >
            Tên sản phẩm:
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
            Nhập giá sale mới:
          </p>
          <Input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            placeholder="Nhập giá sale"
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
            Loại giảm giá:
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
            <Option value="fixed">Giá cố định</Option>
            <Option value="percentage">Phần trăm</Option>
          </Select>
          <p
            className="fw-bold mb-2"
            style={{ color: "#e0e0e0", fontSize: "1.1rem" }}
          >
            Ngày bắt đầu:
          </p>
          {startDate && (
            <p
              style={{
                color: "#b0c4de", // Xanh nhạt cho ngày đã chọn
                marginBottom: "0.5rem",
                fontStyle: "italic",
              }}
            >
              Đã chọn: {startDate.toLocaleString()}
            </p>
          )}
          <DatePicker
            onChange={(_, dateString) => handleStartDateChange(dateString)}
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
            Ngày kết thúc:
          </p>
          {endDate && (
            <p
              style={{
                color: "#b0c4de",
                marginBottom: "0.5rem",
                fontStyle: "italic",
              }}
            >
              Đã chọn: {endDate.toLocaleString()}
            </p>
          )}
          <DatePicker
            onChange={(_, dateString) => handleEndDateChange(dateString)}
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
              backgroundColor: "#28a745", // Xanh lá cho nút "Thêm"
              borderColor: "#28a745",
              padding: "0.5rem 2rem",
              fontWeight: "600",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")} // Hover effect
            onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
          >
            Thêm
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            type="default"
            size="large"
            onClick={() => navigate("/sale")}
            style={{
              borderRadius: "10px",
              backgroundColor: "#dc3545", // Đỏ cho nút "Hủy"
              borderColor: "#dc3545",
              color: "#ffffff",
              padding: "0.5rem 2rem",
              fontWeight: "600",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")} // Hover effect
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
          >
            Hủy
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AddSaleScreen;