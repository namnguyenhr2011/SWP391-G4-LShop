import { useState, useEffect } from "react";
import { Form, Input, Button, message, Tag, Space } from "antd";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, updateBlog } from "../../Service/Admin/BlogServices";

const { TextArea } = Input;

const UpdateBlog = () => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.user.token); // Lấy token từ Redux
  const { id } = useParams(); // Lấy blog ID từ URL
  const navigate = useNavigate();

  // Fetch dữ liệu blog khi component mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id);
        if (data) {
          form.setFieldsValue({
            title: data.title,
            description: data.description,
            content: data.content,
          });
          setTags(data.tags || []);
        } else {
          message.error("Blog not found");
          navigate("/admin/blog-list");
        }
      } catch (error) {
        message.error("Failed to fetch blog details");
        navigate("/admin/blog-list");
      }
    };
    fetchBlog();
  }, [id, form, navigate]);

  // Xử lý thêm tag
  const handleAddTag = () => {
    console.log("tagInput:", tagInput); // Kiểm tra giá trị nhập
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      console.log("Adding tag:", tagInput.trim());
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Xử lý xóa tag
  const handleRemoveTag = (removedTag) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

  // Xử lý submit form
  const onFinish = async (values) => {
    if (!token) {
      message.error("Please login to update a blog");
      navigate("/login");
      return;
    }

    const blogData = {
      title: values.title,
      description: values.description,
      content: values.content,
      tags,
    };

    setLoading(true);
    try {
      await updateBlog(id, blogData, token); // Gửi token cùng dữ liệu
      message.success("Blog updated successfully");
      navigate("/admin/blog-list"); // Chuyển về danh sách blog
    } catch (error) {
      message.error(error.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Update Blog</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ title: "", description: "", content: "" }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the blog title" }]}
        >
          <Input placeholder="Enter blog title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input placeholder="Enter blog description" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please enter the content" }]}
        >
          <TextArea rows={6} placeholder="Enter blog content" />
        </Form.Item>

        <Form.Item label="Tags">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <Input
                placeholder="Enter a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onPressEnter={handleAddTag}
                style={{ width: 200 }}
              />
              <Button onClick={handleAddTag}>Add Tag</Button>
            </Space>
            <Space wrap>
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  color="blue"
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%" }}
          >
            Update Blog
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateBlog;
