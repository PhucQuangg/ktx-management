import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import Script from "../../components/Script";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateStudent() {
  const [sidebarColor, setSidebarColor] = useState("bg-white");
  const navigate = useNavigate();
  const { id } = useParams(); // 👉 lấy id từ URL

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    className: "",
    dateOfBirth: "",
    gender: false,
    password: "",
    role: "STUDENT",
  });

  const token = localStorage.getItem("admin_token");

  // ✅ Load dữ liệu student
  useEffect(() => {
    fetch(`http://localhost:8080/api/admin/students/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          ...data,
          dateOfBirth: data.dateOfBirth
            ? data.dateOfBirth.split("T")[0]
            : "",
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  // ✅ handle change
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]: type === "radio" ? value === "true" : value,
    });
  };

  // ✅ submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/students/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(form),
        }
      );

      const message = await res.text();

      if (res.ok) {
        window.showPopup("Cập nhật thành công!");

        setTimeout(() => {
          navigate("/admin/students");
        }, 1000);
      } else {
        window.showPopup(message || "Cập nhật thất bại!", true);
      }
    } catch (err) {
      console.error(err);
      window.showPopup("Lỗi server!", true);
    }
  };

  return (
    <div className="g-sidenav-show">
      <Sidebar color={sidebarColor} />

      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <div className="container-fluid py-4">
          <div className="card p-4">
            <h3 className="text-center">Cập nhật sinh viên</h3>

            <form onSubmit={handleSubmit}>
              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control border border-dark"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Mã số sinh viên</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control border border-dark"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control border border-dark"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control border border-dark"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Lớp</label>
                  <input
                    type="text"
                    name="className"
                    className="form-control border border-dark"
                    value={form.className}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Ngày sinh</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control border border-dark"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Giới tính</label>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      value="false"
                      checked={form.gender === false}
                      onChange={handleChange}
                    /> Nam
                    <input
                      type="radio"
                      name="gender"
                      value="true"
                      className="ms-3"
                      checked={form.gender === true}
                      onChange={handleChange}
                    /> Nữ
                  </div>
                </div>

              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button type="submit" className="btn btn-dark">
                  Cập nhật
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary fw-bold"
                  onClick={() => navigate("/admin/students")}
                >
                  Trở về
                </button>
              </div>
            </form>
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
