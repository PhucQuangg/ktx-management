import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AuthStyles.css";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [validLink, setValidLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");

    if (!tokenParam) {
      setMessage("Liên kết không hợp lệ!");
      setMessageColor("red");
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    setToken(tokenParam);

    // ✅ Kiểm tra token hợp lệ
    fetch(`http://localhost:8080/api/auth/reset-password?token=${tokenParam}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.status === "success") {
          setValidLink(true);
          window.history.replaceState({}, document.title, window.location.pathname);

        } else {
          setValidLink(false);
          setMessage("Liên kết đã hết hạn hoặc không hợp lệ!");
          setMessageColor("red");
        }
      })
      .catch(() => {
        setValidLink(false);
        setMessage("Lỗi khi kiểm tra liên kết!");
        setMessageColor("red");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.trim().length < 5) {
      setMessage("Mật khẩu phải có ít nhất 5 ký tự!");
      setMessageColor("red");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      setMessageColor("red");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/reset-password?token=${token}&newPassword=${newPassword}`,
        { method: "POST" }
      );

      if (res.ok) {
        setMessage("✅ Mật khẩu đã được cập nhật thành công!");
        setMessageColor("green");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const text = await res.text();
        setMessage(text || "Có lỗi xảy ra!");
        setMessageColor("red");
      }
    } catch (err) {
      console.error(err);
      setMessage("Lỗi kết nối server!");
      setMessageColor("red");
    }
  };

  return (
    <div className="auth-body">
      <div className="container">
        <div className="row align-items-center">
          {/* Cột ảnh */}
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <Link to="/">
              <img
                src="/assets/images/dormitory.png"
                alt="Dormitory"
                className="img-fluid w-75"
                style={{ width: "100%", height: "auto" }}
              />
            </Link>
          </div>

          {/* Cột form */}
          <div className="col-md-6">
            <div className="text-center mb-3">
              <i className="bi bi-shield-lock auth-icon"></i>
            </div>
            <h2 className="auth-heading">Đặt Lại Mật Khẩu</h2>

            {loading ? (
              <p className="text-center fw-bold">⏳ Đang kiểm tra liên kết...</p>
            ) : validLink ? (
              <form onSubmit={handleSubmit}>
                <input
                  type="password"
                  className="form-control auth-input mb-3"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control auth-input mb-3"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <p
                  className="text-center mt-3 fw-bold"
                  style={{ color: messageColor }}
                >
                  {message}
                </p>

                <button type="submit" className="btn-auth mt-4 fw-bold">
                  Xác nhận
                </button>
              </form>
            ) : (
              <p className="text-center fw-bold" style={{ color: messageColor }}>
                {message}
              </p>
            )}

        
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
