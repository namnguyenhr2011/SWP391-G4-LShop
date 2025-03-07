import { Table, Button, Popconfirm } from "antd";
import { useState } from "react";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([
    {
      key: "1",
      user: "John Doe",
      message: "Great service!",
      status: "Reviewed",
    },
    {
      key: "2",
      user: "Jane Smith",
      message: "Needs improvement.",
      status: "Pending",
    },
  ]);

  const handleDelete = (key) => {
    setFeedbacks(feedbacks.filter((feedback) => feedback.key !== key));
  };

  const columns = [
    { title: "User", dataIndex: "user", key: "user" },
    { title: "Message", dataIndex: "message", key: "message" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.key)}
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Table columns={columns} dataSource={feedbacks} />
    </div>
  );
};

export default FeedbackManagement;
