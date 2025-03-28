import {
  Layout,
  Row,
  Col,
  Typography,
  Card,
  Space,
  Tag,
  Divider,
  Input,
  Button,
  message,
  Spin,
} from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  ClockCircleOutlined,
  EyeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Header from "../../layout/Header";
import AppFooter from "../../layout/Footer";
import { useState, useEffect } from "react";
import { getBlogById, addComment } from "../../../Service/Admin/BlogServices";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const BlogDetail = () => {
  const { t } = useTranslation("blog");
  const { id } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.user.darkMode) || false;
  const token = useSelector((state) => state.user.user.token);
  const user = useSelector((state) => state.user.user);
  console.log("User Info:", user);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const data = await getBlogById(id);
        if (data && data._id) {
          setPost(data);
          setComments(data.comments || []);
        } else {
          throw new Error("Blog post not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPost();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      message.warning(t("Please enter a comment"));
      return;
    }
    if (!token) {
      message.error(t("Please login to comment"));
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const commentData = {
        text: newComment,
        author: { username: user.username }, // Lấy username từ Redux
      };
      const response = await addComment(id, commentData, token);
      setComments([...comments, response.comment]);
      setNewComment("");
      message.success(t("Comment added successfully"));
    } catch (err) {
      console.error("Frontend error:", err.message); // Thêm log
      message.error(err.message || t("Failed to add comment"));
    } finally {
      setSubmitting(false);
    }
  };

  const contentStyle = {
    backgroundColor: isDarkMode ? "#0d1117" : "#ffffff",
    color: isDarkMode ? "#c9d1d9" : "#000000",
    minHeight: "calc(100vh - 128px)",
    padding: "40px 20px",
    paddingTop: "120px", // Thêm khoảng cách từ trên xuống
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const cardStyle = {
    backgroundColor: isDarkMode ? "#161b22" : "#ffffff",
    borderColor: isDarkMode ? "#30363d" : "#d9d9d9",
    color: isDarkMode ? "#c9d1d9" : "#000000",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div>
        {t("Error")}: {error}
      </div>
    );

  return (
    <Layout>
      <Header />
      <Content style={contentStyle}>
        <Row justify="center">
          <Col xs={22} sm={20} md={18} lg={16}>
            <Card style={cardStyle} bodyStyle={{ padding: "30px" }}>
              <Title
                level={2}
                style={{ color: isDarkMode ? "#ffffff" : "#001529" }}
              >
                {post.title}
              </Title>
              <Space style={{ marginBottom: "20px" }}>
                <Text style={{ color: isDarkMode ? "#8b949e" : "#8c8c8c" }}>
                  <ClockCircleOutlined />{" "}
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </Text>
                <Text style={{ color: isDarkMode ? "#8b949e" : "#8c8c8c" }}>
                  <EyeOutlined /> {post.views} {t("views")}
                </Text>
              </Space>
              <div style={{ marginBottom: "20px" }}>
                {post.tags.map((tag) => (
                  <Tag
                    key={tag}
                    color={isDarkMode ? "blue" : "default"}
                    style={{ marginRight: "8px" }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
              <Paragraph style={{ color: isDarkMode ? "#c9d1d9" : "#595959" }}>
                {post.content}
              </Paragraph>
            </Card>

            {/* Comments Section */}
            <Card
              style={{ ...cardStyle, marginTop: "20px" }}
              bodyStyle={{ padding: "20px" }}
              title={
                <Title
                  level={4}
                  style={{ color: isDarkMode ? "#ffffff" : "#001529" }}
                >
                  <CommentOutlined /> {t("Comments")} ({comments.length})
                </Title>
              }
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id || comment.id}>
                      <Text
                        strong
                        style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                      >
                        {comment.author?.username || "Anonymous"}{" "}
                        {/* Hiển thị username */}
                      </Text>
                      <Paragraph
                        style={{ color: isDarkMode ? "#c9d1d9" : "#595959" }}
                      >
                        {comment.text}
                      </Paragraph>
                      <Divider
                        style={{
                          borderColor: isDarkMode ? "#30363d" : "#d9d9d9",
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <Text style={{ color: isDarkMode ? "#c9d1d9" : "#595959" }}>
                    {t("No comments yet")}
                  </Text>
                )}
                <TextArea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t("Write a comment...")}
                  style={{ borderRadius: "6px" }}
                  disabled={submitting}
                />
                <Button
                  type="primary"
                  onClick={handleCommentSubmit}
                  loading={submitting}
                  disabled={!newComment.trim() || submitting}
                  style={{
                    borderRadius: "6px",
                    marginTop: "10px",
                    boxShadow: "none",
                  }}
                >
                  {t("Submit Comment")}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default BlogDetail;
