import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import Script from "../../components/Script";

export default function UpdateStudent() {
  const [sidebarColor, setSidebarColor] = useState("bg-white");
  const [editMode, setEditMode] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("id");

  const token = localStorage.getItem("admin_token");

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

  // ✅ load student
  useEffect(() => {
    if (!studentId) return;
    loadStudent(studentId);
  }, [studentId]);

  const loadStudent = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/students/edit/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.text();
        window.showPopup(err, true);
        return;
      }

      const data = await res.json();

      setForm({
        ...data,
        dateOfBirth: data.dateOfBirth
          ? data.dateOfBirth.split("T")[0]
          : "",
      });
    } catch (err) {
      console.error(err);
      window.showPopup("Lỗi khi tải sinh viên", true);
    }
  };

  // ✅ change
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]: type === "radio" ? value === "true" : value,
    });
  };

  // ✅ save update
  const saveStudent = async () => {
    if (!form.fullName || !form.username || !form.email) {
      window.showPopup("Vui lòng nhập đầy đủ thông tin!", true);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/students/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        window.showPopup(err, true);
        return;
      }

      window.showPopup("Cập nhật sinh viên thành công!");
      setEditMode(false);
      loadStudent(studentId);
    } catch (err) {
      console.error(err);
      window.showPopup("Lỗi khi cập nhật!", true);
    }
  };

  return (
    <div className="g-sidenav-show">
      <Sidebar color={sidebarColor} />

      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <div className="container-fluid py-4">
          <div className="card p-4">
            <h3 className="text-center">Cập nhật sinh viên</h3>

            <div className="row">
              {/* giống UI cũ nhưng thêm readOnly */}
              
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control border border-dark"
                  value={form.fullName}
                  onChange={handleChange}
                  readOnly={!editMode}
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
                  readOnly={!editMode}
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
                  readOnly={!editMode}
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
                  readOnly={!editMode}
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
                  readOnly={!editMode}
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
                  readOnly={!editMode}
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
                    disabled={!editMode}
                  /> Nam
                  <input
                    type="radio"
                    name="gender"
                    value="true"
                    className="ms-3"
                    checked={form.gender === true}
                    onChange={handleChange}
                    disabled={!editMode}
                  /> Nữ
                </div>
              </div>
            </div>

            {/* Buttons giống UpdateRoom */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              {!editMode && (
                <button
                  className="btn btn-warning fw-bold"
                  onClick={() => setEditMode(true)}
                >
                  Cập nhật
                </button>
              )}

              {editMode && (
                <button
                  className="btn btn-success fw-bold"
                  onClick={saveStudent}
                >
                  Lưu
                </button>
              )}

              {editMode && (
                <button
                  className="btn btn-outline-secondary fw-bold"
                  onClick={() => {
                    setEditMode(false);
                    loadStudent(studentId);
                  }}
                >
                  Hủy
                </button>
              )}

              <button
                className="btn btn-outline-secondary fw-bold"
                onClick={() => window.history.back()}
              >
                Trở về
              </button>
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
