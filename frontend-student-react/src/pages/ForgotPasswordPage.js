import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setMessage("Vui lòng nhập Email.");
      setMessageColor("red");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/forgot-password?email=${trimmedEmail}`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setMessage("Liên kết đặt lại mật khẩu đã được gửi đến Email của bạn.");

        setMessageColor("green");
      } else {
        const text = await res.text();

        setMessage(text);

        setMessageColor("red");
      }
    } catch {
      setMessage("Không thể kết nối tới máy chủ.");

      setMessageColor("red");
    }
  };

  return (
    <div className="login-page">
      <Container fluid>
        <Row className="min-vh-100 align-items-center justify-content-center">
          <Col
            lg={7}
            className="d-none d-lg-flex justify-content-center align-items-center"
          >
            <div className="left-panel" style={{ marginTop: 0 }}>
              <img
                src="/assets/images/small-logos/Logo_STU.png"
                className="stu-logo"
                alt=""
              />

              <h1>HỆ THỐNG KÝ TÚC XÁ SINH VIÊN</h1>
            </div>
          </Col>

          <Col
            lg={5}
            className="d-flex justify-content-center align-items-center"
          >
            <Card className="login-card shadow-lg">
              <Card.Body>
                <div className="text-center mb-4">
                  <i
                    className="bi bi-envelope-lock-fill"
                    style={{
                      fontSize: "90px",
                      color: "#0d6efd",
                    }}
                  ></i>

                  <h2 className="mt-3 fw-bold">Quên mật khẩu</h2>

                  <p className="text-muted">
                    Nhập Email để nhận liên kết đặt lại mật khẩu
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email</Form.Label>

                    <Form.Control
                      type="email"
                      placeholder="Nhập Email của bạn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  {message && (
                    <div
                      className={`alert ${
                        messageColor === "green"
                          ? "alert-success"
                          : "alert-danger"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div className="d-grid">
                    <Button type="submit" className="login-btn">
                      Gửi liên kết
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-decoration-none fw-semibold"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Quay lại đăng nhập
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ForgotPassword;
