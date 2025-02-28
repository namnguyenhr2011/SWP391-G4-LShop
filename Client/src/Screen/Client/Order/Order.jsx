import React from "react";
import { Card, Typography, Button } from "antd";
import { Image } from "react-bootstrap";

const { Title, Text } = Typography;

const MyOrder = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Title level={3} style={{ textAlign: "center" }}>Đơn hàng của tôi</Title>
      <Card>
        <div style={{ marginBottom: "10px" }}>
          <Text strong style={{ color: "red" }}>Giao hàng:</Text> Chưa giao hàng
          <br />
          <Text strong style={{ color: "red" }}>Thanh toán:</Text> Đã thanh toán
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="https://via.placeholder.com/60"
            alt="Ipad"
            thumbnail
            style={{ marginRight: "10px" }}
          />
          <div>
            <Text strong>Ipad</Text>
            <br />
            <Text>200.000 VND</Text>
          </div>
        </div>
        <div style={{ marginTop: "10px", textAlign: "right" }}>
          <Text strong>Tổng tiền: </Text>
          <Text style={{ color: "red", fontWeight: "bold" }}>210.000 VND</Text>
        </div>
        <div style={{ marginTop: "10px", textAlign: "right" }}>
          <Button variant="danger" style={{ marginRight: "10px" }}>Hủy đơn hàng</Button>
          <Button variant="primary">Xem chi tiết</Button>
        </div>
      </Card>
    </div>
  );
};

export default MyOrder;
