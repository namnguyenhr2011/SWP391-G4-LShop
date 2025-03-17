// import React, { useEffect, useState } from 'react';
// import { Table, Button, Tag, Modal, Spin, message } from 'antd';
// import { getOrders, cancelOrder } from '../../../Service/Client/ApiOrder';
// import Header from "../../layout/Header"
// import Footer from "../../layout/Footer"

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await getOrders();
//       console.log(response)
//       setOrders(response.data.orders);
//     } catch (error) {
//       message.error('Failed to fetch orders');
//     }
//     setLoading(false);
//   };

//   const handleCancelOrder = async (id) => {
//     try {
//       await cancelOrder(id);
//       message.success('Order cancelled successfully');
//       fetchOrders();
//     } catch (error) {
//       message.error('Failed to cancel order');
//     }
//   };

//   const columns = [
//     { title: 'Order ID', dataIndex: '_id', key: '_id' },
//     { title: 'Total Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: amount => `$${amount}` },
//     { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus', render: status => <Tag color={status === 'Paid' ? 'green' : 'red'}>{status}</Tag> },
//     { title: 'Order Status', dataIndex: 'orderStatus', key: 'orderStatus', render: status => <Tag color={status === 'Completed' ? 'blue' : 'orange'}>{status}</Tag> },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (text, record) => (
//         <>
//           <Button type="link" onClick={() => { setSelectedOrder(record); setModalVisible(true); }}>View</Button>
//           {record.orderStatus !== 'Cancelled' && <Button type="link" danger onClick={() => handleCancelOrder(record._id)}>Cancel</Button>}
//         </>
//       )
//     }
//   ];

//   return (
//     <>
//       <Header />
//       <div style={{ padding: 20 }}>
//         <h2>My Orders</h2>
//         {loading ? <Spin /> : <Table dataSource={orders} columns={columns} rowKey="_id" />}
//         <Modal
//           title="Order Details"
//           visible={modalVisible}
//           onCancel={() => setModalVisible(false)}
//           footer={null}
//         >
//           {selectedOrder && (
//             <div>
//               <p><strong>Order ID:</strong> {selectedOrder._id}</p>
//               <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount}</p>
//               <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
//               <p><strong>Order Status:</strong> {selectedOrder.orderStatus}</p>
//             </div>
//           )}
//         </Modal>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default MyOrders;
import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Spin, message } from 'antd';
import { getOrders, cancelOrder } from '../../../Service/Client/ApiOrder';
import { useNavigate } from 'react-router-dom';
import Header from "../../layout/Header"
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
    { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus', render: status => <Tag color={status === 'Paid' ? 'green' : 'red'}>{status}</Tag> },
    { title: 'Order Status', dataIndex: 'orderStatus', key: 'orderStatus', render: status => <Tag color={status === 'Completed' ? 'blue' : 'orange'}>{status}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
      
        return (
          <>
            <Button type="link" onClick={() => handleViewDetails(record._id)}>View</Button>
            {record.orderStatus !== 'Cancelled' && <Button type="link" danger onClick={() => handleCancelOrder(record._id)}>Cancel</Button>}
          </>
        )
      }
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

