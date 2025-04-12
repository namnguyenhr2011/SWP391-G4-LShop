import React, { useState } from 'react';
import { createDiscount } from '../../../Service/Admin/DiscountServices';
import { Container } from 'react-bootstrap';
import { Form, InputNumber, Select, DatePicker, Button, Alert, Spin, Space } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateDiscount = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate(); // Sửa typo từ "naivigate" thành "navigate"

    const handleSubmit = async (values) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await createDiscount(values);
            console.log(response);
            setSuccess('Discount created successfully!');
            form.resetFields();
            toast.success('Discount created successfully!');
            setTimeout(() => navigate(-1), 1500); // Quay lại sau 1.5s khi thành công
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create discount';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: '#1d39c4' }}>Create New Discount</h2>
                <Button
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    style={{ borderRadius: '6px' }}
                >
                    Back
                </Button>
            </div>

            {error && <Alert message="Error" description={error} type="error" showIcon className="mb-4" />}
            {success && <Alert message="Success" description={success} type="success" showIcon className="mb-4" />}

            {loading && (
                <div className="text-center mb-4">
                    <Spin size="large" tip="Creating discount..." />
                </div>
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    discountType: '',
                    discountValue: '',
                    rate: '',
                    startAt: null,
                    endAt: null,
                }}
                disabled={loading} // Disable toàn bộ form khi loading
                style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <Form.Item
                    label="Discount Type"
                    name="discountType"
                    rules={[{ required: true, message: 'Please select discount type!' }]}
                >
                    <Select placeholder="Select discount type" size="large">
                        <Option value="Percentage">Percentage</Option>
                        <Option value="Fixed">Fixed Amount</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Discount Value"
                    name="discountValue"
                    rules={[
                        { required: true, message: 'Please enter discount value!' },
                        { type: 'number', min: 0, message: 'Value must be greater than or equal to 0!' },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter discount value"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Rate (0-100)"
                    name="rate"
                    rules={[
                        { required: true, message: 'Please enter rate!' },
                        { type: 'number', min: 0, max: 100, message: 'Rate must be between 0 and 100!' },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter rate"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Start Date"
                    name="startAt"
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        placeholder="Select start date"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="End Date"
                    name="endAt"
                    rules={[{ required: true, message: 'Please select end date!' }]}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        placeholder="Select end date"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                            size="large"
                            style={{ background: '#1d39c4', borderColor: '#1d39c4' }}
                        >
                            {loading ? 'Creating...' : 'Create Discount'}
                        </Button>
                        <Button
                            type="default"
                            onClick={handleBack}
                            size="large"
                        >
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Container>
    );
};

export default CreateDiscount;