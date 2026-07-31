import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SettingsPanel from "../components/SettingsPanel";
import Script from "../components/Script";

export default function AdminProfile() {

  const token = sessionStorage.getItem("admin_token");

  const [sidebarColor, setSidebarColor] = useState("bg-white");

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    createdAt: ""
  });



  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    try {

      const res = await fetch(
        "http://localhost:8080/api/profile",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const data = await res.json();

      setForm(data);

    } catch {

      window.showPopup("Không tải được thông tin!", true);

    }

  };

  const handleChange = e => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };

  const saveProfile = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/api/profile/update",
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      if (!res.ok) {
        const err = await res.text();
        window.showPopup(err, true);
        return;
      }

      window.showPopup("Cập nhật thành công!");

      setEditMode(false);

      loadProfile();

    } finally {

      setLoading(false);

    }

  };
  const handlePasswordChange = async () => {

    const { oldPassword, newPassword, confirmPassword } = passwords;
  
    if (!oldPassword || !newPassword || !confirmPassword) {
      window.showPopup("Vui lòng nhập đầy đủ thông tin!", true);
      return;
    }
  
    if (newPassword !== confirmPassword) {
      window.showPopup("Mật khẩu xác nhận không khớp!", true);
      return;
    }
  
    try {
  
      const res = await fetch(
        "http://localhost:8080/api/change-password",
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            oldPassword,
            newPassword
          })
        }
      );
  
      const message = await res.text();
  
      if (!res.ok) {
        window.showPopup(message || "Đổi mật khẩu thất bại!", true);
        return;
      }
  
      window.showPopup(message || "Đổi mật khẩu thành công!");
  
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
  
      setShowPassword(false);
  
    } catch {
  
      window.showPopup("Lỗi kết nối server!", true);
  
    }
  
  };
  return (

    <div className="g-sidenav-show">

      <Sidebar color={sidebarColor} />

      <main className="main-content position-relative">

        <div className="container-fluid py-4">

          <div className="card shadow-lg border-0">

            <div
              className="card-header text-center"
              style={{
                background: "#34495E",
                color: "#fff"
              }}
            >

              <img
                src="/assets/images/team-1.jpg"
                width="120"
                height="120"
                style={{
                  borderRadius: "50%",
                  border: "4px solid white",
                  objectFit: "cover"
                }}
              />

              <h3
                className="mt-3"
                style={{ color: "#fff" }}
              >
                {form.fullName}
              </h3>

              <p>Quản trị hệ thống</p>

            </div>

            <div className="card-body p-5">

              <div className="row">

                <div className="col-md-6 mb-4">

                  <label>Họ và tên</label>

                  <input
                    className="form-control border border-dark"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />

                </div>

                <div className="col-md-6 mb-4">

                  <label>Email</label>

                  <input
                    className="form-control border border-dark"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />

                </div>

                <div className="col-md-6 mb-4">

                  <label>Tên đăng nhập</label>

                  <input
                    className="form-control border border-dark"
                    value={form.username}
                    readOnly
                  />

                </div>

                <div className="col-md-6 mb-4">

                  <label>Số điện thoại</label>

                  <input
                    className="form-control border border-dark"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />

                </div>

                <div className="col-md-6 mb-4">

                  <label>Vai trò</label>

                  <input
                    className="form-control border border-dark"
                    value={form.role}
                    readOnly
                  />

                </div>

               

              </div>

              <div className="text-center mt-4">

                {!editMode ? (

                  <>
                    <button
                      className="btn btn-warning me-3"
                      onClick={() => setEditMode(true)}
                    >
                      Cập nhật
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      Đổi mật khẩu
                    </button>
                  </>

                ) : (

                  <>
                    <button
                      className="btn btn-success me-3"
                      onClick={saveProfile}
                    >
                      {loading ? "Đang lưu..." : "Lưu"}
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditMode(false);
                        loadProfile();
                      }}
                    >
                      Hủy
                    </button>
                  </>

                )}

              </div>

              {showPassword && (

<div className="card mt-5 shadow-sm">

    <div className="card-header bg-light">

        <h5 className="mb-0">
            Đổi mật khẩu
        </h5>

    </div>

    <div className="card-body">

        <div className="mb-3">

            <input
                type="password"
                className="form-control"
                placeholder="Mật khẩu hiện tại"
                value={passwords.oldPassword}
                onChange={(e)=>
                    setPasswords({
                        ...passwords,
                        oldPassword:e.target.value
                    })
                }
            />

        </div>

        <div className="mb-3">

            <input
                type="password"
                className="form-control"
                placeholder="Mật khẩu mới"
                value={passwords.newPassword}
                onChange={(e)=>
                    setPasswords({
                        ...passwords,
                        newPassword:e.target.value
                    })
                }
            />

        </div>

        <div className="mb-4">

            <input
                type="password"
                className="form-control"
                placeholder="Xác nhận mật khẩu"
                value={passwords.confirmPassword}
                onChange={(e)=>
                    setPasswords({
                        ...passwords,
                        confirmPassword:e.target.value
                    })
                }
            />

        </div>

        <button
            className="btn btn-success me-2"
            onClick={handlePasswordChange}
        >
            Lưu mật khẩu
        </button>

        <button
            className="btn btn-secondary"
            onClick={()=>{
                setShowPassword(false);

                setPasswords({
                    oldPassword:"",
                    newPassword:"",
                    confirmPassword:""
                });

            }}
        >
            Hủy
        </button>

    </div>

</div>

)}

            </div>

          </div>

        </div>

      </main>

      <SettingsPanel
        sidebarColor={sidebarColor}
        setSidebarColor={setSidebarColor}
      />

      <Script />

    </div>

  );

}