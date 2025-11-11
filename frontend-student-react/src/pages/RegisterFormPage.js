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
  const [gender, setGender] = useState(false); // false = Nam, true = Nữ
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // Nếu token đã lưu trong sessionStorage, disable form
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

    // Validate
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
      role: "STUDENT"
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
        // reset form
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

      <div className="content-wrapper" style={{ backgroundColor: "#ecf0f5" }}>
        <section className="content-header" style={{ textAlign: "center", marginBottom: "10px" }}>
          <h1 className="text-danger text-uppercase">
            Biểu mẫu đăng ký nội trú ký túc xá
          </h1>
        </section>

        <section className="content">
          <div className="container mt-3 mb-5 p-4 shadow rounded bg-white">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Họ và tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={disabled}
                  />
                </div>
                <div className="col">
                  <label className="form-label">Mã sinh viên (MSSV)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={disabled}
                  />
                </div>
                <div className="col">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    disabled={disabled}
                  />
                </div>
                <div className="col">
                  <label className="form-label d-block">Giới tính</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      checked={gender === false}
                      onChange={() => setGender(false)}
                      disabled={disabled}
                    />
                    <label className="form-check-label">Nam</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      checked={gender === true}
                      onChange={() => setGender(true)}
                      disabled={disabled}
                    />
                    <label className="form-check-label">Nữ</label>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Lớp</label>
                  <input
                    type="text"
                    className="form-control"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    disabled={disabled}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={disabled}>
                Gửi đăng ký
              </button>

              {message && (
                <div className="mt-3 text-center fw-bold" style={{ color: messageColor }}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </section>
      </div>

      <Script />
    </div>
  );
}
