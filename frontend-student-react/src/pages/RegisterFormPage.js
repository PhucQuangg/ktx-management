import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

export default function DormitoryRegistration() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [className, setClassName] = useState("");
  const [gender, setGender] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setDisabled(true);
      setMessage("Không thể đăng ký nội trú mới khi tài khoản đã tồn tại.");
      setMessageColor("blue");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!fullName || !username || !email || !phone || !className || !dateOfBirth) {
      setMessage("Vui lòng nhập đầy đủ tất cả các trường!");
      setMessageColor("red");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setMessage("Email không hợp lệ! Vui lòng nhập đúng định dạng (ví dụ: ten@gmail.com).");
      setMessageColor("red");
      return;
    }

    const data = {
      username,
      fullName,
      email,
      phone,
      className,
      gender,
      dateOfBirth,
      password: "12345678",
      role: "STUDENT",
    };

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage("Đăng ký thành công! Vui lòng chờ admin duyệt và gửi thông báo qua email.");
        setMessageColor("green");

        setFullName("");
        setUsername("");
        setEmail("");
        setPhone("");
        setClassName("");
        setGender(false);
        setDateOfBirth("");
      } else {
        const err = await response.text();
        setMessage(err);
        setMessageColor("red");
      }
    } catch (error) {
      console.error(error);
      setMessage("Không thể kết nối đến máy chủ! Vui lòng thử lại sau.");
      setMessageColor("red");
    }
  };

  return (
    <div className="wrapper">
      <Header />
      <Sidebar />

      <div
        className="content-wrapper"
        style={{
          background: "#FFF8E7",

          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",        }}
      >
        <div
          className="form-container"
          style={{
            background: "rgba(255,255,255,0.2)",
            padding: "40px",
            borderRadius: "10px",
            width: "70%",
            maxWidth: "900px",
            boxShadow: "0 0 20px rgba(0,0,0,0.1)",
            fontFamily: "Arial",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "30px",
              fontWeight: "600",
              color: "#2d4f7c",
            }}
          >
            Biểu mẫu đăng ký nội trú ký túc xá
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Họ và Tên</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={disabled}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>MSSV</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={disabled}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    className="form-control custom-input"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    disabled={disabled}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Lớp</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    disabled={disabled}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={disabled}
                style={inputStyle}
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                className="form-control custom-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={disabled}
                style={inputStyle}
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>Giới tính</label> <br />
              <label className="radio-inline">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === false}
                  onChange={() => setGender(false)}
                  disabled={disabled}
                />{" "}
                Nam
              </label>
              <label className="radio-inline" style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  name="gender"
                  checked={gender === true}
                  onChange={() => setGender(true)}
                  disabled={disabled}
                />{" "}
                Nữ
              </label>
            </div>

            <button type="submit" className="btn submit-btn" style={submitStyle} disabled={disabled}>
              Gửi đăng ký
            </button>

            {message && (
              <div className="mt-3 text-center fw-bold" style={{ color: messageColor }}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>

      <Script />
    </div>
  );
}

/* Style tách riêng giống HTML */
const inputStyle = {
  border: "none",
  borderBottom: "1px solid #555",
  borderRadius: 0,
  background: "transparent",
  boxShadow: "none",
  paddingLeft: 0,
  fontSize: "16px",
};

const submitStyle = {
  width: "200px",
  margin: "20px auto 0",
  display: "block",
  background: "#4ba3ff",
  color: "#fff",
  fontSize: "18px",
  padding: "10px",
  borderRadius: "6px",
};
