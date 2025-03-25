import React, { useState } from 'react';
import { uploadAvatar } from '../Service/Client/ApiServices'
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';

const UploadProductImage = () => {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [loading, setLoading] = useState(false);

    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleBeforeUpload = async (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ hỗ trợ tải lên file ảnh!');
            return Upload.LIST_IGNORE;
        }
    
        const isLt10MB = file.size / 1024 / 1024 < 10; 
        if (!isLt10MB) {
            message.error('Dung lượng ảnh không được vượt quá 10MB!');
            return Upload.LIST_IGNORE;
        }
    
        const base64Image = await convertImageToBase64(file);
        setImagePreview(base64Image);
        setImageBase64(base64Image);
        return false; // Ngăn Ant Design tự động tải lên
    };
    


    const handleSubmit = async () => {
        if (!imageBase64) {
            message.error('Vui lòng chọn một hình ảnh trước khi tải lên.');
            return;
        }

        setLoading(true);

        try {
            await uploadAvatar(imageBase64);
            message.success('Tải ảnh lên thành công!');
            navigate('/userProfile');
        } catch (error) {
            message.error('Tải ảnh lên thất bại!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-3 border rounded bg-light">
            <label className="form-label fw-bold">Chọn ảnh sản phẩm:</label>
            <Upload beforeUpload={handleBeforeUpload} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {imagePreview && (
                <div className="mt-3 text-center">
                    <Image src={imagePreview} alt="Preview" thumbnail fluid className="shadow" />
                </div>
            )}
            <div className="mt-3 text-center">
                <Button type="primary" onClick={handleSubmit} disabled={!imageBase64 || loading} loading={loading}>
                    {loading ? 'Đang tải...' : 'Tải lên'}
                </Button>
            </div>
        </div>
    );
};

export default UploadProductImage;
