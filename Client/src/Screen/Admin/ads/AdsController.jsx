import React, { useEffect, useState } from 'react';
import { getAds, inactiveAds, deleteAds } from '../../../Service/Admin/AdsServices';
import { Button, Modal, message, Table, Space, Image } from 'antd';
import { toast } from 'react-toastify';
import CreateAds from './CreateAds';
import UpdateAds from './UpdateAds';
import dayjs from 'dayjs';

const AdsController = () => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState('');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAds();
      if (response && response.ads) {
        setAds(response.ads);
        setError('');
      } else {
        setError('No ads available.');
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      setError('Failed to fetch ads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAds = () => {
    setIsCreateModalVisible(true);
  };

  const handleUpdateAds = (adId) => {
    setSelectedAdId(adId);
    setIsUpdateModalVisible(true);
  };

  const handleClose = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    fetchData();
  };

  const handleDelete = async (adsId) => {
    try {
      const response = await deleteAds(adsId);
      if (response.status === 200) {
        toast.success('Ad deleted successfully');
        fetchData();
      } else {
        toast.error(response.message || 'Failed to delete ad');
      }
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('An error occurred while deleting the ad');
    }
  };

  const handleInactive = async (adsId) => {
    try {
      const response = await inactiveAds(adsId);
      toast.success(response.message);
      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad._id === adsId ? { ...ad, inactive: !ad.inactive } : ad
        )
      );
    } catch (error) {
      console.error('Error updating ad status:', error);
      toast.error('An error occurred while updating the ad status');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (src) => <Image src={src} alt="Ad Image" width={100} height={60} style={{ objectFit: 'cover' }} />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <span style={{ maxWidth: 200, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      render: (link) => <a href={link} target="_blank" rel="noopener noreferrer">View Ad</a>,
    },
    {
      title: 'Start Date',
      dataIndex: 'start',
      key: 'start',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'End Date',
      dataIndex: 'end',
      key: 'end',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleUpdateAds(record._id)}>Edit</Button>
          <Button type="default" danger onClick={() => handleDelete(record._id)}>Delete</Button>
          <Button type="dashed" onClick={() => handleInactive(record._id)}>
            {record.inactive ? 'Activate' : 'Deactivate'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header với tiêu đề căn giữa và nút "Create Ads" ở bên phải */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ textAlign: 'center', flex: 1 }}>Ads Management</h2>
        <Button type="primary" onClick={handleCreateAds}>Create Ads</Button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading ads...</p>
      ) : ads.length > 0 ? (
        <Table
          dataSource={ads}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      ) : (
        <p>No ads available.</p>
      )}

      {/* Modal to create ads */}
      <Modal
        title="Create Ads"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        width={800}
      >
        <CreateAds fetchData={fetchData} onClose={handleClose} />
      </Modal>

      {/* Modal to update ads */}
      <Modal
        title="Update Ads"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedAdId && <UpdateAds adsId={selectedAdId} onClose={handleClose} fetchData={fetchData} />}
      </Modal>
    </div>
  );
};

export default AdsController;
