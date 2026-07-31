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
        marginTop: "50px",
        background: "#FFF8E7",
        minHeight: "100vh",
        padding: "30px 15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "950px",
        }}
      >
        <div
          className="form-container"
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 10px 30px rgba(0,0,0,.12)",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontWeight: "700",
              color: "#2c3e50",
              marginBottom: "35px",
              borderBottom: "2px solid #4BA3FF",
              paddingBottom: "12px",
            }}
          >
            <i
              className="fa fa-edit"
              style={{
                color: "#4BA3FF",
                marginRight: "10px",
              }}
            ></i>

            Đăng ký nội trú ký túc xá
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Họ và Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={disabled}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>MSSV</label>
                  <input
                    type="text"
                    className="form-control"
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
              <div className="col-md-6">
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    className="form-control"
                    max={new Date().toISOString().split("T")[0]}
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    disabled={disabled}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Lớp</label>
                  <input
                    type="text"
                    className="form-control"
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
                className="form-control"
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
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={disabled}
                style={inputStyle}
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>Giới tính</label>

              <div style={{ marginTop: "8px" }}>
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

                <label
                  className="radio-inline"
                  style={{ marginLeft: "25px" }}
                >
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
            </div>

            <button
              type="submit"
              className="btn"
              style={submitStyle}
              disabled={disabled}
            >
              Gửi đăng ký
            </button>

            {message && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: messageColor,
                  fontWeight: "600",
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>

    <Script />
    <style>{`
        .content-wrapper {
          background: #FFF8E7 !important;
          min-height: 100vh !important;
      }
      `}</style>
  </div>
);
}

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
