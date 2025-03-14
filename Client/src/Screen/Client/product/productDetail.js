import React, { useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { Card, Tag, Countdown } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const ProductDetail = () => {
  const images = [
    "/images/keyboard1.png",
    "/images/keyboard2.png",
    "/images/keyboard3.png",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Container>
      <Row className="mt-4">
        {/* Image Section */}
        <Col md={6} className="text-center position-relative">
          <Button variant="light" className="position-absolute start-0 top-50" onClick={handlePrev}>
            <LeftOutlined />
          </Button>
          <Image src={images[currentImage]} fluid rounded />
          <Button variant="light" className="position-absolute end-0 top-50" onClick={handleNext}>
            <RightOutlined />
          </Button>
          <div className="d-flex justify-content-center mt-2">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                width={50}
                className={`m-1 ${currentImage === index ? "border border-primary" : ""}`}
                onClick={() => setCurrentImage(index)}
                rounded
              />
            ))}
          </div>
        </Col>

        {/* Product Info Section */}
        <Col md={6}>
          <h4>Bàn phím gaming Mountain Everest 60 Black Tactile55 Switch</h4>
          <Tag color="red">FLASH SALE</Tag>
          <h3 className="text-danger">1.090.000₫</h3>
          <p className="text-muted text-decoration-line-through">1.390.000₫</p>
          <Tag color="blue">-22%</Tag>
          <Countdown title="Kết thúc trong" value={Date.now() + 1000 * 60 * 60 * 3} format="HH:mm:ss" />
          <Button variant="danger" size="lg" className="mt-3 w-100">
            MUA NGAY
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
