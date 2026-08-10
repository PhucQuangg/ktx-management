import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Login.css";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [validLink, setValidLink] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("danger");

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const tokenParam = params.get("token");

    if (!tokenParam) {
      setMessage("Liên kết không hợp lệ.");

      setMessageColor("danger");

      setLoading(false);

      setTimeout(() => navigate("/login"), 2000);

      return;
    }

    setToken(tokenParam);

    fetch(`http://localhost:8080/api/auth/reset-password?token=${tokenParam}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.status === "success") {
          setValidLink(true);

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } else {
          setMessage("Liên kết đã hết hạn hoặc không hợp lệ.");

          setMessageColor("danger");
        }
      })
      .catch(() => {
        setMessage("Không thể kết nối máy chủ.");

        setMessageColor("danger");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 5) {
      setMessage("Mật khẩu phải có ít nhất 5 ký tự.");

      setMessageColor("danger");

      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");

      setMessageColor("danger");

      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/reset-password?token=${token}&newPassword=${newPassword}`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setMessage("Đặt lại mật khẩu thành công.");

        setMessageColor("success");

        setTimeout(() => navigate("/login"), 2000);
      } else {
        const txt = await res.text();

        setMessage(txt);

        setMessageColor("danger");
      }
    } catch {
      setMessage("Không thể kết nối máy chủ.");

      setMessageColor("danger");
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
            <div className="left-panel">
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
                <div className="text-center mb-4">
                  <i
                    className="bi bi-shield-lock-fill"
                    style={{
                      fontSize: "90px",
                      color: "#0d6efd",
                    }}
                  />

                  <h2 className="mt-3">Đặt lại mật khẩu</h2>

                  <p className="text-muted">Nhập mật khẩu mới cho tài khoản</p>
                </div>

                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" />

                    <p>Đang kiểm tra liên kết...</p>
                  </div>
                ) : validLink ? (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mật khẩu mới</Form.Label>

                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Xác nhận mật khẩu</Form.Label>

                      <Form.Control
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>

                    {message && (
                      <div className={`alert alert-${messageColor} mt-4`}>
                        {message}
                      </div>
                    )}

                    <div className="text-center">
                      <Button type="submit" className="login-btn">
                        Cập nhật mật khẩu
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div className={`alert alert-${messageColor}`}>{message}</div>
                )}

                <div className="text-center mt-4">
                  <Link to="/login" className="text-decoration-none">
                    ← Quay lại đăng nhập
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

export default ResetPassword;
