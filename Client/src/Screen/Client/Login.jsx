import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../service/client/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { doLogin } from "../../store/reducer/userReducer";
import { Form, Button, Container, Row, Col, Card, InputGroup } from "react-bootstrap";
import { EyeOutlined, EyeInvisibleOutlined, HomeOutlined } from "@ant-design/icons";
import { useSpring, animated } from "react-spring";
import { useTranslation } from "react-i18next";
import { Image } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { t } = useTranslation(); // 

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error(t("Please fill in all fields"));
      return;
    }

    try {
      const res = await userLogin(email.trim(), password.trim());

      if (
        !res ||
        typeof res !== "object" ||
        !("code" in res) ||
        !("message" in res)
      ) {
        throw new Error("Invalid response format from server");
      }

      if (res.code === 402) {
        toast.error(res.message);
        return;
      }

      if (res.code === 200) {
        toast.success(res.message);
        dispatch(doLogin({ _id: res.id, token: res.token, role: res.role }));
        switch (res.role) {
          case "user":
            navigate("/");
            break;
          case "productManager":
            navigate("/Productdashboard");
            break;
          case "admin":
            navigate("/admin");
            break;
          case "sale":
            navigate("/sale");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("An error occurred. Please try again."));
    }
  };

  const cardProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light position-relative"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <Button
        variant="link"
        onClick={() => navigate("/")}
        className="position-absolute top-0 start-0 mt-3 ms-3 p-0"
        style={{ zIndex: 1000 }}
        aria-label="Back to home"
      >
        <HomeOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </Button>

      <Row className="w-100" >
        {/* Image Section */}
        <Col md={6} lg={5} className="d-none d-md-block">
          <Image
            width="100%"
            src="/L.png"
            alt={t("Login Illustration")}
            preview={false}
            style={{
              objectFit: "cover",
              maxHeight: "55vh",
              maxWidth: "100%",
              marginLeft: "120px"
            }}
          />
        </Col>

        {/* Login Form Section */}
        <Col md={6} lg={5} className="mx-auto" >
          <animated.div style={cardProps}>
            <Card className="shadow-lg p-4 border-0 rounded-lg">
              <Card.Body>
                <h3 className="text-center text-primary mb-4">{t("Sign In")}</h3>
                <Form onSubmit={handleLogin}>
                  {/* Email Field */}
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="fw-bold">{t("Email Address")}</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={t("Enter your email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control-lg"
                      required
                    />
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="fw-bold">{t("Password")}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder={t("Enter your password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control-lg"
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        className="px-3"
                      >
                        {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      </Button>
                    </InputGroup>
                    <Link
                      to="/forgot"
                      className="text-decoration-none text-primary mt-2 d-block"
                    >
                      {t("Forgot Password?")}
                    </Link>
                  </Form.Group>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 py-2 mt-3 text-uppercase"
                  >
                    {t("Sign In")}
                  </Button>

                  {/* Sign Up Button */}
                  <Button
                    variant="outline-secondary"
                    className="w-100 mt-3 py-2 text-uppercase"
                    onClick={() => navigate("/register")}
                  >
                    {t("Don't have an account? Sign Up")}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </animated.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
