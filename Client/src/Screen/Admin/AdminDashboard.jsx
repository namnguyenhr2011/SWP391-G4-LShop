import { Card, Row, Col, Statistic, Spin, message } from "antd";
import { UserOutlined, ShopOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getAllUser } from "../../Service/Admin/AdminServices";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserCounts();
  }, []);

  const fetchUserCounts = async () => {
    setLoading(true);
    try {
      const data = await getAllUser();
      setTotalUsers(data.users.length);
      setTotalSales(
        data.users.filter((user) => user.role.toLowerCase() === "sale").length
      );
    } catch (error) {
      message.error("Failed to fetch user counts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total Users"
                value={totalUsers}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total Sales"
                value={totalSales}
                prefix={<ShopOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AdminDashboard;
