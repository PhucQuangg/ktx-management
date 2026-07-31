import React, { useEffect, useState } from "react";

function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    className: "",
  });
  const [editing, setEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    document.head.appendChild(link);
    loadProfile();
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const getToken = () => sessionStorage.getItem("token");

  // 🔹 Load thông tin sinh viên
  const loadProfile = async () => {
    const token = getToken();
    if (!token) {
      window.showPopup("Vui lòng đăng nhập lại!", true);
      window.location.href = "http://localhost:3000/login";
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/profile", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Không thể tải thông tin sinh viên");
      const data = await res.json();
      setProfile({
        fullName: data.fullName || "",
        email: data.email || "",
        gender: data.gender?.toString() ?? "",
        dateOfBirth: data.dateOfBirth || "",
        phone: data.phone || "",
        className: data.className || "",
      });
    } catch (e) {
      console.error(e);
      window.showPopup("❌ Lỗi khi tải thông tin cá nhân!", true);
    }
  };

  // 🔹 Bắt đầu chỉnh sửa
  const handleEdit = () => setEditing(true);

  // 🔹 Hủy chỉnh sửa
  const handleCancel = () => {
    setEditing(false);
    loadProfile();
  };

  // 🔹 Lưu cập nhật
  const handleSave = async () => {
    const token = getToken();
    const { fullName, email, gender, dateOfBirth, phone, className } = profile;

    if (!fullName || !email || !dateOfBirth || !phone || !className || gender === "") {
      window.showPopup("❌ Vui lòng nhập đầy đủ các trường thông tin!", true);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          fullName,
          email,
          gender: gender === "true",
          dateOfBirth,
          phone,
          className,
        }),
      });
      if (!res.ok) throw new Error();
      window.showPopup("✅ Cập nhật thông tin thành công!");
      setEditing(false);
      setTimeout(() => window.location.reload(), 2000);
    } catch {
      window.showPopup("❌ Lỗi khi cập nhật thông tin!", true);
    }
  };

  // 🔹 Đổi mật khẩu
  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;
    const token = getToken();

    if (!oldPassword || !newPassword || !confirmPassword) {
      window.showPopup("❌ Vui lòng nhập đầy đủ các trường!", true);
      return;
    }
    if (newPassword !== confirmPassword) {
      window.showPopup("❌ Mật khẩu xác nhận không khớp!", true);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!res.ok) throw new Error();
      window.showPopup("🔒 Đổi mật khẩu thành công!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordSection(false);
    } catch {
      window.showPopup("❌ Lỗi khi đổi mật khẩu!", true);
    }
  };

  return (
    <div className="container py-5">
      <style>{`
        :root{
          --accent: #2563eb;
          --card-bg: #ffffff;
        }
        body{
          background: linear-gradient(180deg,#f6f8fb 0%, #eef2f6 100%);
          color:#0f172a;
        }
        .topbar{
          background: linear-gradient(90deg, rgba(37,99,235,0.09), rgba(245,158,11,0.06));
          border-radius: 12px;
          padding: 40px;
          display:flex;
          align-items:center;
          gap:16px;
          box-shadow: 0 6px 18px rgba(15,23,42,0.06);
        }
        .stu-logo {
          width: 170px;
          height: auto;
          object-fit: contain;
          margin-left: 10px;
        }
        .card-modern{
          border:0;
          border-radius:12px;
          background: linear-gradient(180deg, rgba(255,255,255,0.95), var(--card-bg));
          box-shadow: 0 12px 30px rgba(2,6,23,0.08);
        }
 
      `}</style>

      {/* Header */}
      <div className="topbar mb-4">
        <div className="brand">
          <img src="/assets/images/small-logos/Logo_STU.png" alt="STU Logo" className="stu-logo img-fluid" />
          <h1 className="fs-2 fst-italic text-uppercase">Đại Học Công Nghệ Sài Gòn</h1>
        </div>
      </div>

      {/* Card */}
    <div className="card card-modern p-4">
        <div className="row g-4 align-items-center">
            {/* Avatar */}
            <div className="col-md-3 text-center">
            <i className="bi bi-person-circle" style={{ fontSize: "18rem", color: "#2563eb" }}></i>
            </div>

            {/* Info Form */}
            <div className="col-md-9">
            <form className="row g-4">
                {[
                { id: "fullName", label: "Họ và tên", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "dob", label: "Ngày sinh", type: "date" },
                { id: "phone", label: "Số điện thoại", type: "text" },
                { id: "className", label: "Lớp", type: "text" },
                ].map((field) => (
                <div key={field.id} className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: "1.5rem" }}>{field.label}</label>
                    <input
                    type={field.type}
                    className="form-control"
                    max={new Date().toISOString().split("T")[0]}
                    style={{ fontSize: "1.5rem", padding: "0.75rem 1rem" }}
                    value={profile[field.id === "dob" ? "dateOfBirth" : field.id]}
                    readOnly={!editing}
                    onChange={(e) =>
                        setProfile({
                        ...profile,
                        [field.id === "dob" ? "dateOfBirth" : field.id]: e.target.value,
                        })
                    }
                    />
                </div>
                ))}

                {/* Gender */}
                <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: "1.5rem" }}>Giới tính</label>
                <select
                    className="form-select"
                    style={{ fontSize: "1.2rem", padding: "0.75rem 1rem" }}
                    value={profile.gender}
                    disabled={!editing}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                >
                    <option value="">--Chọn--</option>
                    <option value="true">Nữ</option>
                    <option value="false">Nam</option>
                </select>
                </div>

                {/* Buttons */}
                <div className="col-12 d-flex justify-content-center gap-3 mt-4 flex-wrap">
                {!editing ? (
                    <>
                        <button
                        key="back"
                        type="button"
                        onClick={() => (window.location.href = "/")}
                        className="btn btn-outline-primary"
                        style={{ fontSize: "1.5rem", padding: "0.75rem 1.5rem" }}
                        >
                        <i className="bi bi-arrow-left"></i> Trở về
                        </button>

                        <button
                        key="edit"
                        onClick={handleEdit}
                        className="btn btn-warning fw-bold"
                        style={{ fontSize: "1.5rem", padding: "0.75rem 1.5rem" }}
                        >
                        Cập nhật thông tin
                        </button>

                        <button
                        key="password"
                        type="button"
                        onClick={() => setShowPasswordSection(true)}
                        className="btn btn-danger fw-bold"
                        style={{ fontSize: "1.5rem", padding: "0.75rem 1.5rem" }}
                        >
                        Đổi mật khẩu
                        </button>
                    </>
                    ) : (
                    <>
                        <button
                        key="save"
                        onClick={handleSave}
                        type="button"
                        className="btn btn-success fw-bold"
                        style={{ fontSize: "1.5rem", padding: "0.75rem 1.5rem" }}
                        >
                        Lưu
                        </button>
                        <button
                        key="cancel"
                        onClick={handleCancel}
                        type="button"
                        className="btn btn-outline-secondary fw-bold"
                        style={{ fontSize: "1.5rem", padding: "0.75rem 1.5rem" }}
                        >
                        Hủy
                        </button>
                    </>
                    )}

                </div>
            </form>
            </div>
        </div>


        {/* Đổi mật khẩu */}
        {showPasswordSection && (
        <div className="mt-4">
            <div className="card p-4 shadow-sm rounded-3" style={{ background: "#f8f9fa" }}>
            <h4 className="mb-3 text-primary fw-bold">
                <i className="bi bi-key me-2"></i>Đổi mật khẩu
            </h4>
            <div className="row g-3">
                {["oldPassword", "newPassword", "confirmPassword"].map((id, idx) => (
                <div key={id} className="col-md-4 col-12">
                    <input
                    type="password"
                    id={id}
                    className="form-control form-control-lg"
                    placeholder={
                        id === "oldPassword"
                        ? "Nhập mật khẩu hiện tại"
                        : id === "newPassword"
                        ? "Nhập mật khẩu mới"
                        : "Xác nhận mật khẩu"
                    }
                    value={passwords[id]}
                    onChange={(e) => setPasswords({ ...passwords, [id]: e.target.value })}
                    />
                </div>
                ))}
            </div>

            <div className="mt-3 d-flex flex-wrap gap-2 justify-content-end">
                <button
                onClick={() =>
                    ["oldPassword", "newPassword", "confirmPassword"].forEach((id) => {
                    const field = document.getElementById(id);
                    field.type = field.type === "password" ? "text" : "password";
                    })
                }
                className="btn btn-outline-secondary btn-lg"
                >
                <i className="bi bi-eye"></i>
                </button>
                <button onClick={handlePasswordChange} className="btn btn-success btn-lg">
                Xác nhận
                </button>
                <button onClick={() => setShowPasswordSection(false)} className="btn btn-secondary btn-lg">
                Hủy
                </button>
            </div>
            </div>
        </div>
        )}

      </div>
    </div>
  );
}

export default ProfilePage;
