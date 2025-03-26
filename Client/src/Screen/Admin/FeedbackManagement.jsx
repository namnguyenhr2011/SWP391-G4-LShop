import { Table, Button, Modal, message } from "antd";
import { useState, useEffect } from "react";
import {
  getAllFeedback,
  toggleFeedbackVisibility,
} from "../../service/admin/AdminServices";

const { confirm } = Modal;

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Hàm nhóm feedback theo userId
  const groupFeedbacksByUser = (feedbacks) => {
    const userMap = {};
    feedbacks.forEach((feedback) => {
      const userId = feedback.userId?._id || "unknown"; // Sử dụng "unknown" nếu không có userId
      if (!userMap[userId]) {
        userMap[userId] = {
          userId: feedback.userId || {
            _id: "unknown",
            userName: "N/A",
            email: "N/A",
          }, // Xử lý trường hợp không có userId
          feedbacks: [],
        };
      }
      userMap[userId].feedbacks.push(feedback);
    });
    return Object.values(userMap);
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await getAllFeedback();
      if (response.success) {
        const groupedData = groupFeedbacksByUser(response.feedbacks);
        setFeedbacks(groupedData);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeedback = async (id) => {
    try {
      const response = await toggleFeedbackVisibility(id);
      if (response.success) {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((group) => ({
            ...group,
            feedbacks: group.feedbacks.map((feedback) =>
              feedback._id === id
                ? { ...feedback, isHidden: response.feedback.isHidden }
                : feedback
            ),
          }))
        );
        message.success("Feedback visibility changed successfully!");
      }
    } catch (error) {
      console.error("Error toggling feedback:", error);
      message.error("Failed to change feedback visibility.");
    }
  };

  const showConfirmToggle = (id, isCurrentlyHidden) => {
    confirm({
      title: `Are you sure you want to ${
        isCurrentlyHidden ? "show" : "hide"
      } this feedback?`,
      content: "This action will change the visibility of the feedback.",
      okText: "Confirm",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleToggleFeedback(id);
      },
    });
  };

  // Cột cho bảng chính (danh sách người dùng)
  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Username",
      key: "userName",
      render: (record) => record.userId?.userName || "N/A",
    },
    {
      title: "Email",
      key: "email",
      render: (record) => record.userId?.email || "N/A",
    },
    {
      title: "Số Feedback",
      key: "feedbackCount",
      render: (record) => record.feedbacks.length,
    },
  ];

  // Cột cho bảng chi tiết (danh sách feedback của từng người dùng)
  const expandedRowRender = (record) => {
    const feedbackColumns = [
      {
        title: "STT",
        key: "index",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Product Name",
        key: "productName",
        render: (feedback) => feedback.productId?.name || "N/A",
      },
      {
        title: "Rate",
        key: "rating",
        render: (feedback) => `${feedback.rating} / 5`,
      },
      {
        title: "Comment",
        key: "comment",
        dataIndex: "comment",
      },
      {
        title: "Action",
        key: "action",
        render: (_, feedback) => (
          <Button
            type="primary"
            danger={!feedback.isHidden}
            onClick={() => showConfirmToggle(feedback._id, feedback.isHidden)}
          >
            {feedback.isHidden ? "Show" : "Hide"}
          </Button>
        ),
      },
    ];
    return (
      <Table
        columns={feedbackColumns}
        dataSource={record.feedbacks}
        rowKey="_id"
        pagination={false}
      />
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Table
        columns={columns}
        dataSource={feedbacks}
        rowKey={(record) => record.userId?._id || "unknown"}
        loading={loading}
        expandable={{ expandedRowRender }}
      />
    </div>
  );
};

export default FeedbackManagement;
