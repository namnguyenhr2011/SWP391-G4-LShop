import React, { useEffect, useState } from "react";
import { activeAds } from "../Service/Admin/AdsServices";

const LeftAdsBanner = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await activeAds();
        setAds(data.ads || []);
        if (data.ads.length > 0) {
          setCurrentIndex(Math.floor(Math.random() * data.ads.length));
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ads.length > 0) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * ads.length);
        } while (randomIndex === currentIndex);
        setCurrentIndex(randomIndex);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [ads, currentIndex]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 15000);
  };

  if (!isVisible || ads.length === 0) return null;

  return (
    <div style={styles.banner}>
      <button style={styles.closeButton} onClick={handleClose}>
        ×
      </button>
      <a
        href={ads[currentIndex]?.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={ads[currentIndex]?.image}
          alt="Left Ad Banner"
          style={styles.image}
        />
      </a>
    </div>
  );
};

const styles = {
  banner: {
    position: "fixed",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    height: "70vh",
    width: "15vw",
    backgroundColor: "#fff",
    textAlign: "center",
    boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
    padding: "10px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    borderRadius: "0 10px 10px 0",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    color: "red",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
};

export default LeftAdsBanner;
