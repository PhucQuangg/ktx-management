import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Login.css"; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errText = await response.text();
        setError(errText || "Đăng nhập thất bại!");
        return;
      }

      const data = await response.json();

      if (data.role === "STUDENT") {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role);
        window.location.href = `http://localhost:3000/?fromLogin=true&role=${data.role}`;
      } else if (data.role === "ADMIN") {
        window.location.href = `http://localhost:3001/?token=${data.token}`;
      } else {
        setError("Không xác định được vai trò tài khoản!");
      }
    } catch (err) {
      setError("Lỗi kết nối server!");
      console.error(err);
    }
  };

  return (
    
    <div className="login-body">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center mb-5 mb-md-0">
            <a href="/">
              <img
                src="/assets/images/dormitory.png"
                alt="Dormitory"
                className="img-fluid w-75"
                style={{ width: "100%", height: "auto" }}
              />
            </a>
          </Col>
          <Col md={6}>
            <div className="text-center mb-3">
              <i className="bi bi-person-circle" style={{ fontSize: "12rem", color: "#007bff" }}></i>
            </div>
            <h2 className="login-heading">Đăng nhập</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Control
                type="text"
                placeholder="Tên Đăng nhập"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="custom-input"
              />
              <Form.Control
                type="password"
                placeholder="Mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input mt-4"
              />
              {error && <p className="text-danger text-center mt-3 fw-bold">{error}</p>}
              <Button type="submit" className="btn-login mt-4 fw-bold">
                Đăng nhập
              </Button>
            </Form>
            <div className="login-links mt-4">
              <a href="/forgot-password">
                Quên mật khẩu?
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;