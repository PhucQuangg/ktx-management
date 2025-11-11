import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AuthStyles.css"; 

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setMessage("Vui lòng nhập Email !");
      setMessageColor("red");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/forgot-password?email=${trimmedEmail}`,
        { method: "POST" }
      );

      if (res.ok) {
        setMessage("Liên kết reset đã được gửi tới email của bạn !");
        setMessageColor("green");
      } else {
        const text = await res.text();
        setMessage(text);
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
              <i className="bi bi-person-circle auth-icon"></i>
            </div>
            <h2 className="auth-heading">Quên Mật Khẩu</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control auth-input mb-3"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
            <p className="text-center mt-3 fw-bold" style={{ color: messageColor }}>
              {message}
            </p>
              <button type="submit" className="btn-auth mt-4 fw-bold">
                Xác nhận
              </button>
            </form>


            <div className="login-links mt-4">
              <span>Trở lại trang đăng nhập ?</span>{" "}
              <Link to="/login">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;