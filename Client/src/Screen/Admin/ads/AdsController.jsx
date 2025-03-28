import React, { useEffect, useState } from 'react';
import { getAds, addAds, updateAds, deleteAds, inactiveAds } from '../../../Service/Admin/AdsServices';

const AdsController = () => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAds();
      setAds(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching ads:', error);
      setError('Failed to fetch ads. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Ads Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {ads.length > 0 ? (
        <ul>
          {ads.map((ad) => (
            <li key={ad._id}>
              <h4>{ad.title}</h4>
              <p>{ad.description}</p>
              <a href={ad.link} target="_blank" rel="noopener noreferrer">View Ad</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ads available.</p>
      )}
    </div>
  );
};

export default AdsController;
