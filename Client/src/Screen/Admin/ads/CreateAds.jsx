import { useState } from 'react';
import PropTypes from 'prop-types';
import { addAds } from '../../../Service/Admin/AdsServices';
import { Input, Button, Form, Row, Col, DatePicker, message } from 'antd';
import { Container } from 'react-bootstrap';


const { TextArea } = Input;

const CreateAds = ({ fetchData, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const data = {
                ...values,
                start: values.start ? values.start.toISOString() : null,
                end: values.end ? values.end.toISOString() : null,
            };

            console.log("Data response:", data);
            await addAds(data);

            message.success('Ad created successfully!');
            fetchData();
            onClose();
        } catch (error) {
            message.error(error.response?.data?.message || 'Create ads failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Title is required' }]}>
                            <Input placeholder="Enter the ad title" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Description is required' }]}>
                            <TextArea placeholder="Enter the ad description" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Image URL" name="image" rules={[{ required: true, message: 'Image URL is required' }]}>
                            <Input placeholder="Enter the image URL" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Link" name="link" rules={[{ required: true, message: 'Ad link is required' }]}>
                            <Input placeholder="Enter the ad link" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Start Date" name="start" rules={[{ required: true, message: 'Start date is required' }]}>
                            <DatePicker style={{ width: '100%' }} placeholder="Select the start date" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="End Date" name="end" rules={[{ required: true, message: 'End date is required' }]}>
                            <DatePicker style={{ width: '100%' }} placeholder="Select the end date" />
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%' }}
                            loading={loading}
                        >
                            Create Ads
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

CreateAds.propTypes = {
    fetchData: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CreateAds;
