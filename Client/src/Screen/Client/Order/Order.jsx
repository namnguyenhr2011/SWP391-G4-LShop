import { useEffect, useState } from 'react';
import { Table, Button, Tag, Spin, message } from 'antd';
import { getOrders, cancelOrder } from '../../../Service/Client/ApiOrder';
import { useNavigate } from 'react-router-dom';
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      
      if (response && response.data.orders) {
        const sortedOrders = response.data.orders
          .filter(order => order.createdAt)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setOrders(sortedOrders);
      } else {
        message.error("No orders found.");
      }
    } catch (error) {
      message.error('Failed to fetch orders');
    }
    setLoading(false);
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order/orderDetail/${orderId}`);
  };

  const handleCancelOrder = async (id) => {
    try {
      await cancelOrder(id);
      message.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      message.error('Failed to cancel order');
    }
  };

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const columns = [
    { 
      title: 'Order Number', 
      key: 'orderNumber', 
      render: (text, record, index) => `Order ${index + 1 + (pagination.current - 1) * pagination.pageSize}` 
    },
    { 
      title: 'Total Amount', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount', 
      render: amount => formatCurrency(amount) 
    },
    { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { 
      title: 'Payment Status', 
      dataIndex: 'paymentStatus', 
      key: 'paymentStatus', 
      render: status => <Tag color={status === 'Completed' ? 'green' : 'red'}>{status}</Tag> 
    },
    { 
      title: 'Order Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: status => <Tag color={status === 'Pending' ? 'orange' : 'blue'}>{status}</Tag> 
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleViewDetails(record._id)}>View</Button>
          {record.status !== 'Cancelled' && <Button type="link" danger onClick={() => handleCancelOrder(record._id)}>Cancel</Button>}
        </>
      )
    }
  ];

  return (
    <>
      <Header />
      <div style={{ padding: 20 }}>
        <h2>My Orders</h2>
        {loading ? <Spin /> : (
          <Table 
            dataSource={orders} 
            columns={columns} 
            rowKey="_id" 
            pagination={pagination}
            onChange={(p) => setPagination(p)}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
