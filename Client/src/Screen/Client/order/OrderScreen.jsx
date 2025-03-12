<<<<<<< HEAD

=======
import { Container, Row, Col } from "react-bootstrap";
import { Card, Button } from "antd";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
>>>>>>> duc

const OrderScreen = () => {
  return (
    <div>
<<<<<<< HEAD
      
    </div>
  )
}

export default OrderScreen
=======
      <Header />
      <Container>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <Card title="Order Screen" bordered={false} style={{ marginTop: 20 }}>
              <p>Welcome to the Order Screen. Please place your order below.</p>
              <Button type="primary">Place Order</Button>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default OrderScreen;

>>>>>>> duc
