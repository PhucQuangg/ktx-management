import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        setError(err);
        return;
      }

      const data = await response.json();

      if (data.role === "STUDENT") {
        sessionStorage.setItem("token", data.token);

        window.location.href = "http://localhost:3000";
      } else {
        sessionStorage.setItem("admin_token", data.token);

        sessionStorage.setItem("admin_fullName", data.fullname);

        window.location.href = `http://localhost:3001/?token=${
          data.token
        }&fullName=${encodeURIComponent(data.fullname)}`;
      }
    } catch {
      setError("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="login-page">
      <Container fluid>
        <Row className="min-vh-100 align-items-center">
          <Col
            lg={7}
            className="d-none d-lg-flex justify-content-center align-items-center"
          >
            <div
              className="left-panel"
              onClick={() => (window.location.href = "/")}
              style={{ cursor: "pointer" }}
            >
              <img
                src="/assets/images/small-logos/Logo_STU.png"
                className="stu-logo"
                alt=""
              />

              <h1>HỆ THỐNG KÝ TÚC XÁ SINH VIÊN</h1>
            </div>
          </Col>

          <Col lg={5}>
            <Card className="login-card shadow">
              <Card.Body>
                <div className="text-center">
                  <i
                    className="bi bi-person-circle"
                    style={{
                      fontSize: 110,
                      color: "#0d6efd",
                    }}
                  />

                  <h2 className="mt-3">Đăng nhập</h2>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên đăng nhập</Form.Label>

                    <Form.Control
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên đăng nhập"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Mật khẩu</Form.Label>

                    <div style={{ position: "relative" }}>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        style={{
                          paddingRight: "45px",
                        }}
                      />

                      <i
                        className={
                          showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                        }
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          fontSize: "20px",
                          color: "#6c757d",
                          zIndex: 2,
                        }}
                      />
                    </div>
                  </Form.Group>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <Button type="submit" className="w-100 login-btn">
                    Đăng nhập
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <a href="/forgot-password">Quên mật khẩu?</a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
