import { Table, Select, message, Skeleton, Button, Input, Tag } from "antd";
import { useState, useEffect } from "react";
import {
  getAllOrder,
  getAllUser,
  assignSalerToOrder,
} from "../../service/admin/AdminServices";
import { getProductById } from "../../service/client/ApiProduct";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchSales();
  }, []);

  useEffect(() => {
    setFilteredOrders(
      orders.filter((order) =>
        order.userId?.userName?.toLowerCase().includes(searchText.toLowerCase())
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

  const handleSalerChange = async (orderId, salerId) => {
    try {
      await assignSalerToOrder(orderId, salerId);
      message.success("Saler assigned successfully!");
      await fetchOrders();
    } catch (error) {
      message.error(error.message || "Failed to assign saler");
    }
  };

  const handleAutoAssignSalers = async () => {
    if (!sales.length) {
      message.error("No salers available to assign!");
      return;
    }

    setAssigning(true);
    try {
      const unassignedOrders = orders.filter(
        (order) => !order.saleClaim?.salerId
      );

      if (unassignedOrders.length === 0) {
        message.info("All orders already have salers!");
        setAssigning(false);
        return;
      }

      const salerOrderCount = sales.map((saler) => {
        const pendingCount = orders.filter(
          (order) =>
            order.saleClaim?.salerId === saler._id &&
            order.status.toLowerCase() === "pending"
        ).length;
        return { salerId: saler._id, pendingCount };
      });

      salerOrderCount.sort((a, b) => a.pendingCount - b.pendingCount);

      const assignPromises = [];
      const salerQueue = [...salerOrderCount];

      unassignedOrders.forEach((order) => {
        const assignedSaler = salerQueue.shift();
        assignPromises.push(
          assignSalerToOrder(order._id, assignedSaler.salerId)
        );

        assignedSaler.pendingCount += 1;
        salerQueue.push(assignedSaler);
        salerQueue.sort((a, b) => a.pendingCount - b.pendingCount);
      });

      await Promise.all(assignPromises);
      message.success(
        `Successfully assigned salers to ${unassignedOrders.length} orders evenly!`
      );
      await fetchOrders();
    } catch (error) {
      message.error("Failed to auto-assign salers");
    } finally {
      setAssigning(false);
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
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
      title: "Saler",
      dataIndex: "saleClaim",
      key: "saler",
      render: (saleClaim, record) => {
        const selectedSalerId = saleClaim?.salerId || null;
        return (
          <Select
            style={{ width: 150 }}
            value={selectedSalerId}
            onChange={(value) => handleSalerChange(record._id, value)}
            placeholder="Select a saler"
            disabled={loadingSales}
            loading={loadingSales}
          >
            {sales.map((s) => (
              <Select.Option key={s._id} value={s._id}>
                {s.userName}
              </Select.Option>
            ))}
          </Select>
        );
      },
      sorter: (a, b) => {
        const salerA = a.saleClaim?.salerId || "";
        const salerB = b.saleClaim?.salerId || "";
        return salerA.localeCompare(salerB);
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
          placeholder="Search by username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={fetchOrders} disabled={loadingOrders}>
          Refresh
        </Button>
        <Button
          type="primary"
          onClick={handleAutoAssignSalers}
          loading={assigning}
          disabled={loadingSales || loadingOrders}
        >
          Auto Assign Salers Evenly
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
