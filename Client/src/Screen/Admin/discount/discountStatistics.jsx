import { useEffect, useState } from 'react';
import { Table, Card, Spin, Alert, Row, Col, DatePicker, Button, Select } from 'antd';
import { Container, Card as BootstrapCard } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { LoadingOutlined } from '@ant-design/icons';
import {
  getUserDiscountActivity,
  getActiveDiscountsOverview,
  getDiscountTypeDistribution,
  getDiscountUsageStats
} from '../../../Service/Admin/DiscountServices';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const { Option } = Select;

const DiscountStatistics = () => {
  const [userDiscountActivity, setUserDiscountActivity] = useState([]);
  const [activeDiscountsOverview, setActiveDiscountsOverview] = useState([]);
  const [discountTypeDistribution, setDiscountTypeDistribution] = useState([]);
  const [discountUsageStats, setDiscountUsageStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState('days');

  const fetchDiscountStatistics = async () => {
    try {
      setLoading(true);
      let usageStatsParams = {};

      if (selectedDate) {
        const currentDate = new Date();
        const selected = new Date(selectedDate);

        if (filterType === 'days') {
          const daysDiff = Math.floor((currentDate - selected) / (1000 * 60 * 60 * 24));
          usageStatsParams = { days: daysDiff >= 0 ? daysDiff : 0 };
        } else if (filterType === 'months') {
          const monthsDiff =
            (currentDate.getFullYear() - selected.getFullYear()) * 12 +
            (currentDate.getMonth() - selected.getMonth());
          usageStatsParams = { months: monthsDiff >= 0 ? monthsDiff : 0 };
        } else if (filterType === 'years') {
          const yearsDiff = currentDate.getFullYear() - selected.getFullYear();
          usageStatsParams = { years: yearsDiff >= 0 ? yearsDiff : 0 };
        }
      } else {
        usageStatsParams = { days: 30 };
      }

      const [
        userActivityResponse,
        activeDiscountsResponse,
        typeDistributionResponse,
        usageStatsResponse,
      ] = await Promise.all([
        getUserDiscountActivity(),
        getActiveDiscountsOverview(),
        getDiscountTypeDistribution(),
        getDiscountUsageStats(usageStatsParams),
      ]);

      setUserDiscountActivity(userActivityResponse.data || []);
      setActiveDiscountsOverview(activeDiscountsResponse.data || []);
      setDiscountTypeDistribution(typeDistributionResponse.data || []);
      setDiscountUsageStats(usageStatsResponse.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching discount statistics:', error);
      setError(error.message || 'Failed to fetch discount statistics');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountStatistics();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setSelectedDate(null);
  };

  const handleFilter = () => {
    fetchDiscountStatistics();
  };

  const activeDiscountsColumns = [
    { title: 'Discount ID', dataIndex: 'discountId', key: 'discountId' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Type', dataIndex: 'discountType', key: 'discountType' },
    {
      title: 'Value',
      dataIndex: 'discountValue',
      key: 'discountValue',
      render: (value, record) =>
        record.discountType === 'Percentage' ? `${value}%` : `$${value}`,
    },
    { title: 'Rate (%)', dataIndex: 'rate', key: 'rate' },
    { title: 'Days Remaining', dataIndex: 'daysRemaining', key: 'daysRemaining' },
    {
      title: 'Start At',
      dataIndex: 'startAt',
      key: 'startAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'End At',
      dataIndex: 'endAt',
      key: 'endAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const usageStatsColumns = [
    { title: 'Discount ID', dataIndex: 'discountId', key: 'discountId' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Type', dataIndex: 'discountType', key: 'discountType' },
    { title: 'Value', dataIndex: 'discountValue', key: 'discountValue' },
    { title: 'Total Assigned', dataIndex: 'totalAssignments', key: 'totalAssignments' },
    { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (val) => val ? 'Yes' : 'No' },
  ];

  const userActivityChartData = {
    labels: userDiscountActivity.map((user) => user.email),
    datasets: [
      {
        label: 'Total Discounts',
        data: userDiscountActivity.map((user) => user.totalDiscounts),
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        borderWidth: 1,
      },
      {
        label: 'Active Discounts',
        data: userDiscountActivity.map((user) => user.activeDiscountCount),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
      {
        label: 'Expired Discounts',
        data: userDiscountActivity.map((user) => user.expiredDiscountCount),
        backgroundColor: '#4BC0C0',
        borderColor: '#4BC0C0',
        borderWidth: 1,
      },
    ],
  };

  const typeDistributionChartData = {
    labels: discountTypeDistribution.map((type) => type.discountType || 'Unknown'),
    datasets: [
      {
        label: 'Total Assignments',
        data: discountTypeDistribution.map((type) => type.totalAssignments || 0),
        backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
        borderColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container fluid className="py-5" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <style>
        {`
          .dashboard-header {
            background: linear-gradient(90deg, #1890ff 0%, #40c4ff 100%);
            border-radius: 12px;
            padding: 40px 20px;
            margin-bottom: 30px;
            color: white;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }
          .dashboard-header:hover {
            transform: translateY(-5px);
          }
          .filter-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s ease;
          }
          .filter-card:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }
          .ant-card {
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .ant-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }
          .ant-card-head {
            background: #fafafa;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            font-size: 18px;
            font-weight: 600;
            color: #1a3c6d;
          }
          .ant-table {
            border-radius: 8px;
            overflow: hidden;
          }
          .ant-table-thead > tr > th {
            background: #1a3c6d;
            color: white;
            font-weight: 600;
          }
          .ant-table-tbody > tr:nth-child(odd) {
            background: #f9f9f9;
          }
          .ant-table-tbody > tr:hover > td {
            background: #e6f7ff;
          }
          .ant-select-selector, .ant-picker {
            border-radius: 8px !important;
          }
          .ant-btn-primary {
            border-radius: 8px;
            background: #1890ff;
            border: none;
            transition: background 0.3s ease;
          }
          .ant-btn-primary:hover {
            background: #40c4ff;
          }
          .no-data {
            text-align: center;
            color: #888;
            font-size: 16px;
            padding: 20px;
          }
          @media (max-width: 768px) {
            .dashboard-header {
              padding: 20px;
            }
            .filter-card {
              padding: 15px;
            }
            .ant-col {
              margin-bottom: 16px;
            }
          }
        `}
      </style>

      <BootstrapCard className="dashboard-header">
        <h1 style={{ fontSize: '32px', margin: 0, fontWeight: 700 }}>Discount Dashboard</h1>
        <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>Analyze and explore your discount statistics</p>
      </BootstrapCard>

      <Card className="filter-card">
        <Row gutter={[16, 16]} align="middle" justify="center">
          <Col xs={24} sm={8} md={6}>
            <Select
              defaultValue="days"
              onChange={handleFilterTypeChange}
              style={{ width: '100%' }}
            >
              <Option value="days">Day</Option>
              <Option value="months">Month</Option>
              <Option value="years">Year</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <DatePicker
              picker={filterType}
              onChange={handleDateChange}
              value={selectedDate}
              placeholder={`Select ${filterType}`}
              style={{ width: '100%' }}
              disabledDate={(current) => current && current > moment().endOf('day')}
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Button
              type="primary"
              onClick={handleFilter}
              disabled={!selectedDate}
              block
            >
              Filter
            </Button>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : error ? (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title="User Discount Activity"
              bordered={false}
              hoverable
            >
              <div style={{ height: '350px', padding: '16px' }}>
                {userDiscountActivity.length > 0 ? (
                  <Bar
                    data={userActivityChartData}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: 'Count', font: { size: 14 } },
                          grid: { color: '#e8ecef' },
                        },
                        x: {
                          title: { display: true, text: 'User Email', font: { size: 14 } },
                          grid: { display: false },
                        },
                      },
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                          labels: { font: { size: 12 }, color: '#1a3c6d' },
                        },
                        tooltip: { backgroundColor: '#1a3c6d', titleFont: { size: 12 }, bodyFont: { size: 12 } },
                      },
                    }}
                    style={{
                      filter: 'none',
                      borderRadius: 0,
                      boxShadow: 'none',
                      clipPath: 'none',
                    }}
                  />
                ) : (
                  <p className="no-data">No data available</p>
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title="Active Discounts Overview"
              bordered={false}
              hoverable
            >
              <Table
                columns={activeDiscountsColumns}
                dataSource={activeDiscountsOverview}
                rowKey="discountId"
                pagination={{ pageSize: 5 }}
                scroll={{ x: true }}
                rowClassName={() => 'table-row'}
              />
            </Card>
          </Col>

          {discountTypeDistribution.length > 0 && (
            <Col xs={24} lg={12}>
              <Card
                title="Discount Type Distribution"
                bordered={false}
                hoverable
              >
                <div style={{ height: '350px', padding: '16px' }}>
                  <Pie
                    data={typeDistributionChartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: { font: { size: 12 }, color: '#1a3c6d' },
                        },
                        tooltip: { backgroundColor: '#1a3c6d', titleFont: { size: 12 }, bodyFont: { size: 12 } },
                      },
                    }}
                    style={{
                      filter: 'none',
                      borderRadius: 0,
                      boxShadow: 'none',
                      clipPath: 'none',
                    }}
                  />
                </div>
              </Card>
            </Col>
          )}

          <Col xs={24}>
            <Card
              title="Discount Usage Statistics"
              bordered={false}
              hoverable
            >
              <Table
                columns={usageStatsColumns}
                dataSource={discountUsageStats}
                rowKey="discountId"
                pagination={{ pageSize: 5 }}
                scroll={{ x: true }}
                rowClassName={() => 'table-row'}
              />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default DiscountStatistics;
