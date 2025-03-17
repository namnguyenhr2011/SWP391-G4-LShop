import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Spin, message } from 'antd';
import { getOrders, cancelOrder } from '../../../Service/Client/ApiOrder';
import { useNavigate } from 'react-router-dom';
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      setOrders(response.data.orders);
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

  const columns = [
    { title: 'Order ID', dataIndex: '_id', key: '_id' },
    { title: 'Total Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: amount => `$${amount}` },
    { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus', render: status => <Tag color={status === 'Completed' ? 'green' : 'red'}>{status}</Tag> },
    { title: 'Order Status', dataIndex: 'status', key: 'status', render: status => <Tag color={status === 'Pending' ? 'orange' : 'blue'}>{status}</Tag> },
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
        {loading ? <Spin /> : <Table dataSource={orders} columns={columns} rowKey="_id" />}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;


