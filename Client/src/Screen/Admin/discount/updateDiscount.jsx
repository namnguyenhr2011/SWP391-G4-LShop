import React, { useState, useEffect } from 'react';
import { updateDiscount, getDiscountById } from '../../../Service/Admin/DiscountServices';
import { Container } from 'react-bootstrap';
import { Form, InputNumber, Select, Button, Alert, Spin, Space } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';

const { Option } = Select;

const UpdateDiscount = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const { discountId } = useParams();

    useEffect(() => {
        const fetchDiscount = async () => {
            try {
                if (!discountId) {
                    setError("Discount ID is missing.");
                    return;
                }
                const response = await getDiscountById(discountId);
                const discount = response;  
                if (discount) {
                    form.setFieldsValue({
                        discountType: discount.discountType,
                        discountValue: discount.discountValue,
                        rate: discount.rate,
                    });
                } else {
                    setError('Discount not found');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchDiscount();
    }, [discountId, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await updateDiscount(discountId, values);
            console.log(response);
            setSuccess('Discount updated successfully!');
            toast.success('Discount updated successfully!');
            setTimeout(() => navigate(-1), 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update discount';
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
                <h2 style={{ margin: 0, color: '#1d39c4' }}>Update Discount</h2>
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
                    <Spin size="large" tip="Updating discount..." />
                </div>
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={loading}
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
                            {loading ? 'Updating...' : 'Update Discount'}
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

export default UpdateDiscount;
