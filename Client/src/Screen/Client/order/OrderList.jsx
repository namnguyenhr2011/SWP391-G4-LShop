import React, { useState, useEffect } from "react";
import { Table, Spin, Tag } from "antd";
import { Container, Row, Col } from "react-bootstrap";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      setOrders([
        { id: 1, customer: "Nguyễn Văn A", total: 500000, status: "Đã giao" },
        { id: 2, customer: "Trần Thị B", total: 1200000, status: "Chờ xử lý" },
        { id: 3, customer: "Lê Văn C", total: 750000, status: "Đang giao" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    {
      title: "Tổng tiền (VND)",
      dataIndex: "total",
      key: "total",
      render: (text) => text.toLocaleString() + " ₫",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status === "Đã giao" ? "green" : status === "Đang giao" ? "blue" : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Danh sách đơn hàng</h2>
          {loading ? <Spin size="large" /> : <Table dataSource={orders} columns={columns} rowKey="id" bordered />}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderList;
