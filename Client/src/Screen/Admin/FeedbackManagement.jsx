import { Table, Button, Modal, message, Input } from "antd";
import { useState, useEffect } from "react";
import {
  getAllFeedback,
  toggleFeedbackVisibility,
} from "../../service/admin/AdminServices";
import { SearchOutlined } from "@ant-design/icons";

const { confirm } = Modal;
const { Search } = Input;

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [sortRatingOrder, setSortRatingOrder] = useState(null); // Thêm state riêng cho rating
  const [sortEmailOrder, setSortEmailOrder] = useState(null);
  const [commentSearch, setCommentSearch] = useState({});

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const groupFeedbacksByUser = (feedbacks) => {
    const userMap = {};
    feedbacks.forEach((feedback) => {
      const userId = feedback.userId?._id || "unknown";
      if (!userMap[userId]) {
        userMap[userId] = {
          userId: feedback.userId || {
            _id: "unknown",
            userName: "N/A",
            email: "N/A",
          },
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

  const handleSortByFeedbackCount = () => {
    const newOrder = sortOrder === "ascend" ? "descend" : "ascend";
    setSortOrder(newOrder);

    setFeedbacks((prevFeedbacks) =>
      [...prevFeedbacks].sort((a, b) =>
        newOrder === "ascend"
          ? a.feedbacks.length - b.feedbacks.length
          : b.feedbacks.length - a.feedbacks.length
      )
    );
  };

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
        dataIndex: "rating",
        sorter: (a, b) => a.rating - b.rating,
        sortOrder: sortRatingOrder,
        onHeaderCell: () => ({
          onClick: () => {
            setSortRatingOrder(
              sortRatingOrder === "ascend" ? "descend" : "ascend"
            );
            setFeedbacks((prevFeedbacks) =>
              prevFeedbacks.map((group) => ({
                ...group,
                feedbacks: [...group.feedbacks].sort((a, b) =>
                  sortRatingOrder === "ascend"
                    ? b.rating - a.rating
                    : a.rating - b.rating
                ),
              }))
            );
          },
        }),
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
      <div>
        <Input
          placeholder="Search comments"
          onChange={(e) =>
            setCommentSearch((prev) => ({
              ...prev,
              [record.userId._id]: e.target.value,
            }))
          }
          style={{ width: 200, marginBottom: 16 }}
          prefix={<SearchOutlined />}
        />
        <Table
          columns={feedbackColumns}
          dataSource={record.feedbacks.filter((feedback) =>
            feedback.comment
              .toLowerCase()
              .includes((commentSearch[record.userId._id] || "").toLowerCase())
          )}
          rowKey="_id"
          pagination={false}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Input
        placeholder="Search by username"
        onChange={(e) => setSearchUser(e.target.value)}
        style={{ width: 200, marginBottom: 16 }}
        prefix={<SearchOutlined />}
      />
      <Table
        columns={[
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
            sorter: (a, b) => a.userId?.email.localeCompare(b.userId?.email),
            sortOrder: sortEmailOrder,
            onHeaderCell: () => ({
              onClick: () =>
                setSortEmailOrder(
                  sortEmailOrder === "ascend" ? "descend" : "ascend"
                ),
            }),
          },
          {
            title: "Số Feedback",
            key: "feedbackCount",
            render: (record) => record.feedbacks.length,
            sorter: true, // Kích hoạt sorting
            sortOrder: sortOrder,
            onHeaderCell: () => ({
              onClick: handleSortByFeedbackCount, // Gọi hàm khi click vào tiêu đề cột
            }),
          },
        ]}
        dataSource={feedbacks.filter((record) =>
          record.userId?.userName
            .toLowerCase()
            .includes(searchUser.toLowerCase())
        )}
        rowKey={(record) => record.userId?._id || "unknown"}
        loading={loading}
        expandable={{ expandedRowRender }}
      />
    </div>
  );
};

export default FeedbackManagement;
