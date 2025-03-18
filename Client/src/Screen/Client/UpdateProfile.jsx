import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form, Card, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { editProfile } from "../../Service/Client/ApiServices";
import Header from "../layout/Header";
import AppFooter from "../layout/Footer";
import { toast } from "react-toastify";

const ProfileEditor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleUpload = (info) => {
        if (info.file.status === "done") {
            message.success(`${info.file.name} uploaded successfully.`);
            setFileList([info.file]);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} upload failed.`);
        }
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const { name, phone, address } = values;
            const res = await editProfile(name, phone, address);
            console.log("Response:", res.data);
            toast.success("Profile updated successfully!");
            navigate("/");
        } catch (error) {
            console.error("Profile update failed:", error);
            message.error("Profile update failed! " + (error.message || ""));
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Header />
            <div className="container mt-4" style={{ height: "60vh" }}>
                <div className="row" style={{ marginTop: "20vh" }}>
                    {/* Avatar */}
                    <div className="col-md-7">
                        <Card title="Profile Picture" bordered={true}>
                            <Upload
                                fileList={fileList}
                                showUploadList={false}
                                customRequest={({ file, onSuccess }) => {
                                    setTimeout(() => {
                                        onSuccess("ok");
                                        setFileList([file]);
                                    }, 1000);
                                }}
                                onChange={handleUpload}
                            >
                                <Button type="primary" icon={<UploadOutlined />}>
                                    Update Avatar
                                </Button>
                            </Upload>
                        </Card>
                    </div>

                    {/* Edit Profile */}
                    <div className="col-md-5">
                        <Card title="Edit Profile" bordered={true}>
                            <Form form={form} onFinish={onFinish} layout="vertical">
                                <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter your name" }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Please enter your phone number" }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter your address" }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item className="d-flex justify-content-between">
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        Confirm
                                    </Button>
                                    <Button type="primary" onClick={() => navigate("/change-password")}>
                                        Change Password
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>
            <AppFooter />
        </>
    );
};

export default ProfileEditor;
