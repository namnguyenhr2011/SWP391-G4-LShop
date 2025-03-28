import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Form, Row, Col, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { updateAds, adsDetail } from "../../../Service/Admin/AdsServices";

const { TextArea } = Input;

const UpdateAds = ({ adsId, onClose, fetchData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAdDetails = async () => {
            try {
                const data = await adsDetail(adsId);
                if (data.ads) {
                    form.setFieldsValue({
                        title: data.ads.title,
                        description: data.ads.description,
                        image: data.ads.image,
                        link: data.ads.link,
                        start: data.ads.start ? dayjs(data.ads.start) : null,
                        end: data.ads.end ? dayjs(data.ads.end) : null
                    });
                } else {
                    message.error(data.message || 'Failed to fetch ad details');
                }
            } catch (error) {
                message.error('Error fetching ad details:', error);
            }
        };

        if (adsId) {
            fetchAdDetails();
        }
    }, [adsId, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const updatedData = {
                ...values,
                start: values.start ? values.start.toISOString() : null,
                end: values.end ? values.end.toISOString() : null
            };

            const response = await updateAds(adsId, updatedData);
            if (response.ads) {
                message.success(response.message || 'Ad updated successfully!');
                fetchData();
                onClose();
            } else {
                message.error(response.message || 'Update failed');
            }
        } catch (error) {
            message.error('Error updating ad:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                        Update Ads
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

UpdateAds.propTypes = {
    adsId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired
};

export default UpdateAds;
