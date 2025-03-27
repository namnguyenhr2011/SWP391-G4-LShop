import { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Table, Spin, message, Typography } from "antd";
import { Pie } from "@ant-design/plots";
import { getAssignedOrders, getProductWithSaleID } from "../../Service/sale/ApiSale"; // Thêm getProductWithSaleID

const { Title } = Typography;

const SaleDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // State cho sản phẩm sale
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
    activeSales: 0, // Thêm thống kê sản phẩm đang sale
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy danh sách đơn hàng
      const orderData = await getAssignedOrders();
      const orderList = orderData.orders || [];
      setOrders(orderList);

      // Lấy danh sách sản phẩm có sale
      const productData = await getProductWithSaleID();
      const productList = productData.products.map((product) => ({
        ...product,
        saleId: product.sale?.saleID || null,
      }));
      setProducts(productList);

      // Tính toán thống kê
      calculateStats(orderList, productList);
    } catch (error) {
      message.error("Unable to fetch data for dashboard");
      setOrders([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders, products) => {
    // Thống kê đơn hàng
    const orderStats = orders.reduce(
      (acc, order) => {
        acc[order.status.toLowerCase()] += 1;
        acc.total += 1;
        return acc;
      },
      { pending: 0, processing: 0, completed: 0, cancelled: 0, total: 0 }
    );

    // Thống kê sản phẩm đang trong thời gian sale
    const currentDate = new Date();
    const activeSales = products.filter((product) => {
      if (!product.sale) return false;
      const startDate = new Date(product.sale.startDate);
      const endDate = new Date(product.sale.endDate);
      return startDate <= currentDate && currentDate <= endDate;
    }).length;

    setStats({ ...orderStats, activeSales });
  };

  // Cấu hình cho biểu đồ Pie
  const pieConfig = {
    appendPadding: 10,
    data: [
      { type: "Pending", value: stats.pending },
      { type: "Processing", value: stats.processing },
      { type: "Completed", value: stats.completed },
      { type: "Cancelled", value: stats.cancelled },
    ],
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    color: ["#faad14", "#1890ff", "#52c41a", "#ff4d4f"],
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [{ type: "element-active" }],
  };

  const columns = [
    {
      title: "No.",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Customer Name",
      dataIndex: "userId",
      render: (user) => user?.userName || "Unknown",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      render: (totalAmount) => `${totalAmount.toLocaleString()} VND`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Processing") color = "blue";
        if (status === "Completed") color = "green";
        if (status === "Cancelled") color = "red";
        return <span style={{ fontWeight: "bold", color }}>{status}</span>;
      },
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        background: "linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "calc(90vh - 50px)",
        borderRadius: "15px",
      }}
    >
      <Title level={2} style={{ color: "#1e3c72", marginBottom: "20px" }}>
        Sale Dashboard
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Thống kê nhanh */}
          <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
            <Col xs={24} sm={12} md={4}>
              <Card>
                <Statistic
                  title="Pending Orders"
                  value={stats.pending}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Card>
                <Statistic
                  title="Processing Orders"
                  value={stats.processing}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Card>
                <Statistic
                  title="Completed Orders"
                  value={stats.completed}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Card>
                <Statistic
                  title="Cancelled Orders"
                  value={stats.cancelled}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Card>
                <Statistic
                  title="Active Sales"
                  value={stats.activeSales}
                  valueStyle={{ color: "#722ed1" }} // Màu tím cho sản phẩm sale
                />
              </Card>
            </Col>
          </Row>

          {/* Biểu đồ phân bố trạng thái */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Order Status Distribution" style={{ height: "100%" }}>
                <Pie {...pieConfig} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Recent Orders" style={{ height: "100%" }}>
                <Table
                  columns={columns}
                  dataSource={orders.slice(0, 5)}
                  pagination={false}
                  rowKey="_id"
                  scroll={{ x: "max-content" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Bảng danh sách tất cả đơn hàng */}
          <Card title="All Orders" style={{ marginTop: "20px" }}>
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="_id"
              bordered
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} orders`,
              }}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default SaleDashboard;