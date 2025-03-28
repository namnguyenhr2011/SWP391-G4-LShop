import React, { useEffect, useState } from "react";
import { activeAds } from "../Service/Admin/AdsServices";

const BottomAdsBanner = () => {
    const [ads, setAds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const data = await activeAds();
                setAds(data.ads || []);
            } catch (error) {
                console.error("Error fetching ads:", error);
            }
        };
        fetchAds();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (ads.length ? (prevIndex + 1) % ads.length : 0));
        }, 2000);
        return () => clearInterval(interval);
    }, [ads]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setIsVisible(true), 15000);
    };

    if (!isVisible || ads.length === 0) return null;

    return (
        <div style={styles.banner}>
            <button style={styles.closeButton} onClick={handleClose}>×</button>
            <a href={ads[currentIndex]?.link} target="_blank" rel="noopener noreferrer">
                <img src={ads[currentIndex]?.image} alt="Ad Banner" style={styles.image} />
            </a>
        </div>
    );
};

const styles = {
    banner: {
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        backgroundColor: "#fff",
        textAlign: "center",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        padding: "10px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    image: {
        width: "100%",
        maxHeight: "80px",
        objectFit: "contain",
    },
    closeButton: {
        position: "absolute",
        top: "5px",
        right: "10px",
        background: "transparent",
        color: "red",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
    },
};

export default BottomAdsBanner;