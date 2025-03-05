import { Result, Button } from "antd";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Button type="primary" onClick={() => navigate("/")}>
                        Back Home
                    </Button>
                }
            />
        </Container>
    );
};

export default NotFound;
