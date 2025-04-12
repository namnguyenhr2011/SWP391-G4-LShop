import { Table, message, Button, Input, Tag, Space } from "antd";
import { useState, useEffect } from "react";
import {
  getAllOrder,
  getAllUser,
} from "../../service/admin/AdminServices";
import { getProductById } from "../../service/client/ApiProduct";
import { DeleteOutlined } from "@ant-design/icons";
import { acceptOrder, cancelOrder, completeOrder } from "../../Service/shipper/ApiShipper";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchSales();
  }, []);

  useEffect(() => {
    const lowerSearch = searchText.toLowerCase();
    setFilteredOrders(
      orders.filter((order) =>
        order.userId?.userName?.toLowerCase().includes(lowerSearch) ||
        order.address?.toLowerCase().includes(lowerSearch) ||
        order.phone?.toLowerCase().includes(lowerSearch)
      )
    );
  }, [searchText, orders]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await getAllOrder();
      setOrders(data.orders || []);
    } catch (error) {
      message.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchSales = async () => {
    setLoadingSales(true);
    try {
      const data = await getAllUser();
      const salesData = data.users.filter(
        (user) => user.role.toLowerCase() === "sale"
      );
      setSales(salesData || []);
    } catch (error) {
      message.error("Failed to fetch sales data");
      setSales([]);
    } finally {
      setLoadingSales(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptOrder(orderId);
      message.success("Order accepted successfully!");
      await fetchOrders();
    } catch (error) {
      message.error(error.message || "Unable to accept order");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId);
      message.success("Order completed successfully!");
      await fetchOrders();
    } catch (error) {
      message.error(error.message || "Unable to complete order");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      message.success("Order cancelled successfully!");
      await fetchOrders();
    } catch (error) {
      message.error(error.message || "Unable to cancel order");
    }
  };



  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "stt",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Username",
      dataIndex: "userId",
      key: "customer",
      render: (user) => user?.userName || "Unknown",
      sorter: (a, b) =>
        (a.userId?.userName || "").localeCompare(b.userId?.userName || ""),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      filters: [
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
        { text: "Pending", value: "pending" },
      ],
      onFilter: (value, record) =>
        record.paymentStatus?.toLowerCase() === value.toLowerCase(),
      render: (status) => {
        let color;
        switch (status.toLowerCase()) {
          case "completed":
            color = "green";
            break;
          case "cancelled":
            color = "red";
            break;
          case "pending":
            color = "orange";
            break;
          default:
            color = "blue";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      sorter: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod),
    },
    { title: "Phonenumber", dataIndex: "phone", key: "phone" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(amount),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
        { text: "Pending", value: "pending" },
        { text: "Processing", value: "processing" },
      ],
      onFilter: (value, record) =>
        record.status?.toLowerCase() === value.toLowerCase(),
      render: (status) => {
        let color;
        switch (status?.toLowerCase()) {
          case "processing":
            color = "blue";
            break;
          case "pending":
            color = "orange";
            break;
          case "completed":
            color = "green";
            break;
          case "cancelled":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      filters: [
        { text: "Actionable", value: "enabled" },
        { text: "Not Actionable", value: "disabled" },
      ],
      onFilter: (value, record) => {
        const status = record.status?.toLowerCase();
        const paymentStatus = record.paymentStatus?.toLowerCase();

        const isPaymentPending = paymentStatus === "pending";
        const isPaymentFailed = paymentStatus === "failed";

        const canAccept = status === "pending"; // luôn cho "Process" khi pending
        const canComplete = status === "processing" && !isPaymentPending;
        const canCancel =
          (status === "pending" || status === "processing") &&
          (paymentStatus === "completed" || paymentStatus === "failed");

        const isActionable =
          isPaymentFailed || canAccept || canComplete || canCancel;

        return value === "enabled" ? isActionable : !isActionable;
      },
      render: (_, record) => {
        const status = record.status?.toLowerCase();
        const paymentStatus = record.paymentStatus?.toLowerCase();
        // const isPaymentPending = paymentStatus === "pending";

        const canAcceptOrCancel = status === "pending";
        const canCompleteOrCancel = status === "processing";

        const isPaymentFailed = paymentStatus === "failed";

        return (
          <Space>
            {isPaymentFailed ? (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleCancelOrder(record._id)}
                size="middle"
              />
            ) : (
              <>
                {canAcceptOrCancel && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleAcceptOrder(record._id)}
                      size="middle"
                    >
                      Process
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleCancelOrder(record._id)}
                      size="middle"
                    />
                  </>
                )}
                {canCompleteOrCancel && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleCompleteOrder(record._id)}
                      size="middle"
                    >
                      Complete
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleCancelOrder(record._id)}
                      size="middle"
                    />
                  </>
                )}
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const ProductDetailsTable = ({ products }) => {
    const [productDetails, setProductDetails] = useState([]);

    useEffect(() => {
      const fetchProductNames = async () => {
        try {
          const details = await Promise.all(
            products.map(async (item) => {
              const product = await getProductById(item.productId);
              console.log("Product data:", product);
              return {
                ...item,
                productName: product?.product?.name || "Unknown",
                productImage: product?.product?.image || "",
                productPrice: product?.product?.price || 0, // Lấy giá sản phẩm
              };
            })
          );
          setProductDetails(details);
        } catch (error) {
          message.error("Failed to fetch product names");
        }
      };

      fetchProductNames();
    }, [products]);

    return (
      <Table
        columns={[
          {
            title: "Hình ảnh",
            dataIndex: "productImage",
            key: "productImage",
            render: (image) =>
              image ? (
                <img
                  src={image}
                  alt="Product"
                  style={{ width: 80, height: 70 }}
                />
              ) : (
                "No Image"
              ),
          },
          {
            title: "Tên sản phẩm",
            dataIndex: "productName",
            key: "productName",
          },
          { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
          {
            title: "Giá",
            dataIndex: "productPrice",
            key: "productPrice",
            render: (price) =>
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
              }).format(price),
          },
        ]}
        dataSource={productDetails}
        pagination={false}
        rowKey={(item) => item._id || item.productId}
      />
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <Input
          placeholder="Search by username, address, phone"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={fetchOrders} disabled={loadingOrders}>
          Refresh
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
        loading={loadingOrders}
        expandable={{
          expandedRowRender: (record) => (
            <ProductDetailsTable products={record.products} />
          ),
          rowExpandable: (record) =>
            record.products && record.products.length > 0,
        }}
      />
    </div>
  );
};

export default OrderManagement;
