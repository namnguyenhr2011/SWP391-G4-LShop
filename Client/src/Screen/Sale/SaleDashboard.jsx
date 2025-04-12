import { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Table, Spin, message, Typography, Select } from "antd";
import { Pie } from "@ant-design/plots";
import { getAssignedOrders, getProductWithSaleID } from "../../Service/sale/ApiSale";

const { Title } = Typography;
const { Option } = Select;

const SaleDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
    completedRevenue: 0,
    totalSoldProducts: 0,
    completionRate: 0,
    topProducts: [],
  });

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const orderData = await getAssignedOrders();
      const productData = await getProductWithSaleID();
      
      let orderList = orderData.orders || [];
      const productList = productData.products.map((product) => ({
        ...product,
        saleId: product.sale?.saleID || null,
      }));

      // Lọc đơn hàng theo thời gian
      const currentDate = new Date();
      if (timeFilter === "day") {
        orderList = orderList.filter((order) => 
          new Date(order.createdAt).toDateString() === currentDate.toDateString()
        );
      } else if (timeFilter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 7);
        orderList = orderList.filter((order) => 
          new Date(order.createdAt) >= oneWeekAgo
        );
      } else if (timeFilter === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);
        orderList = orderList.filter((order) => 
          new Date(order.createdAt) >= oneMonthAgo
        );
      }

      setOrders(orderList);
      setProducts(productList);
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

        if (order.status === "Completed") {
          acc.completedRevenue += order.totalAmount;
          order.products.forEach((item) => {
            const productId = item.productId?._id;
            acc.productSales[productId] = (acc.productSales[productId] || 0) + item.quantity;
          });
          acc.totalSoldProducts += order.products.reduce((sum, item) => sum + item.quantity, 0);
        }
        return acc;
      },
      {
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
        total: 0,
        completedRevenue: 0,
        totalSoldProducts: 0,
        productSales: {},
      }
    );

    // Tính top 3 sản phẩm bán chạy
    const topProducts = Object.entries(orderStats.productSales)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p._id === productId);
        return { name: product?.name || "Unknown", quantity };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);

    // Tính tỷ lệ hoàn thành
    const completionRate = orderStats.total > 0 
      ? ((orderStats.completed / orderStats.total) * 100).toFixed(1) 
      : 0;

    setStats({
      ...orderStats,
      completionRate,
      topProducts,
    });
  };

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
      style: { fontSize: 14, textAlign: "center" },
    },
    interactions: [{ type: "element-active" }],
  };

  const orderColumns = [
    { title: "No.", render: (_, __, index) => index + 1 },
    { title: "Customer Name", dataIndex: "userId", render: (user) => user?.userName || "Unknown" },
    { title: "Total Amount", dataIndex: "totalAmount", render: (totalAmount) => `${totalAmount.toLocaleString()} VND` },
    { title: "Payment Method", dataIndex: "paymentMethod" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = status === "Pending" ? "orange" : status === "Processing" ? "blue" : status === "Completed" ? "green" : "red";
        return <span style={{ fontWeight: "bold", color }}>{status}</span>;
      },
    },
  ];

  const topProductColumns = [
    { title: "Product Name", dataIndex: "name" },
    { title: "Quantity Sold", dataIndex: "quantity" },
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
      <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
        <Col>
          <Title level={2} style={{ color: "#1e3c72", margin: 0 }}>
            Sale Dashboard
          </Title>
        </Col>
        <Col>
          <Select defaultValue="all" onChange={setTimeFilter} style={{ width: 120 }}>
            <Option value="all">All Time</Option>
            <Option value="day">Today</Option>
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
          </Select>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Thống kê nhanh */}
          <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
            <Col xs={24} sm={12} md={6}>
              <Card><Statistic title="Pending Orders" value={stats.pending} valueStyle={{ color: "#faad14" }} /></Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card><Statistic title="Processing Orders" value={stats.processing} valueStyle={{ color: "#1890ff" }} /></Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card><Statistic title="Completed Orders" value={stats.completed} valueStyle={{ color: "#52c41a" }} /></Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card><Statistic title="Cancelled Orders" value={stats.cancelled} valueStyle={{ color: "#ff4d4f" }} /></Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card><Statistic title="Completed Revenue" value={stats.completedRevenue} precision={0} suffix=" VND" valueStyle={{ color: "#13c2c2" }} /></Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card><Statistic title="Total Sold Products" value={stats.totalSoldProducts} valueStyle={{ color: "#eb2f96" }} /></Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card><Statistic title="Completion Rate" value={stats.completionRate} suffix="%" valueStyle={{ color: "#389e0d" }} /></Card>
            </Col>
          </Row>

          {/* Biểu đồ và thông tin bổ sung */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Order Status Distribution" style={{ height: "100%" }}>
                <Pie {...pieConfig} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Top Selling Products" style={{ height: "100%" }}>
                <Table
                  columns={topProductColumns}
                  dataSource={stats.topProducts}
                  pagination={false}
                  rowKey="name"
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Recent Orders" style={{ height: "100%" }}>
                <Table
                  columns={orderColumns}
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
              columns={orderColumns}
              dataSource={orders}
              rowKey="_id"
              bordered
              scroll={{ x: "max-content" }}
              pagination={{ pageSize: 10, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders` }}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default SaleDashboard;