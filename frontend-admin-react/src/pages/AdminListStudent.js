import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SettingsPanel from "../components/SettingsPanel";
import Script from "../components/Script";

export default function UserList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [sidebarColor, setSidebarColor] = useState("bg-white");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    fetch("http://localhost:8080/api/admin/students", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.text();
          window.showPopup(err || "Lỗi khi tải dữ liệu", true);
          return;
        }
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setFilteredStudents(data);
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
  }, []);

  // Lọc danh sách khi thay đổi role
  useEffect(() => {
    if (selectedRole === "ALL") {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter((u) => u.role === selectedRole));
    }
  }, [selectedRole, students]);

  return (
    <div className="g-sidenav-show">
      {/* Sidebar */}
      <Sidebar color={sidebarColor} />

      {/* Nội dung chính */}
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        {/* Navbar */}
        <nav
          className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl"
          id="navbarBlur"
          data-scroll="true"
        >
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                <li className="breadcrumb-item text-sm">
                  <a className="opacity-5 text-dark" href="#">
                    Trang
                  </a>
                </li>
                <li
                  className="breadcrumb-item text-sm text-dark active"
                  aria-current="page"
                >
                  Danh sách người dùng
                </li>
              </ol>
            </nav>

            <ul className="navbar-nav d-flex align-items-center justify-content-end">
              <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                <a href="#" className="nav-link text-body p-0" id="iconNavbarSidenav">
                  <div className="sidenav-toggler-inner">
                    <i className="sidenav-toggler-line"></i>
                    <i className="sidenav-toggler-line"></i>
                    <i className="sidenav-toggler-line"></i>
                  </div>
                </a>
              </li>

              <li className="nav-item px-3 d-flex align-items-center">
                <a href="#" className="nav-link text-body p-0">
                  <i className="material-symbols-rounded fixed-plugin-button-nav">
                    settings
                  </i>
                </a>
              </li>

              <li className="nav-item d-flex align-items-center">
                <a
                  href="http://localhost:3000/login"
                  className="nav-link text-body font-weight-bold px-0"
                >
                  <i className="material-symbols-rounded">account_circle</i>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        {/* End Navbar */}

        <div className="container-fluid py-2">
          <div className="row">
            <div className="col-12">
              <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                    <h6 className="text-white text-capitalize ps-3">
                      Bảng người dùng
                    </h6>
                  </div>
                </div>

                <div className="card-body px-0 pb-2">
                  <div className="table-responsive p-0">
                    <div className="d-flex justify-content-between align-items-center px-4 pt-3">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="form-select w-auto"
                      >
                        <option value="ALL">Tất cả</option>
                        <option value="ADMIN">Admin</option>
                        <option value="STUDENT">Student</option>
                      </select>
                    </div>

                    <table className="table align-middle mb-0">
                      <thead className="text-center">
                        <tr>
                          <th>
                            Họ và tên
                          </th>
                          <th>
                            Tên đăng nhập
                          </th>
                          <th>
                            Email
                          </th>
                          <th>
                            Số điện thoại
                          </th>
                          <th>
                            Ngày tạo
                          </th>
                          <th>
                            Vai trò
                          </th>
                          <th className="text-secondary opacity-7"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((stu, idx) => (
                            <tr key={idx}  className="text-center">
                              <td>{stu.fullName}</td>
                              <td>{stu.username}</td>
                              <td>{stu.email}</td>
                              <td>{stu.phone || "Chưa cập nhật"}</td>
                              <td>{stu.created_at || "Chưa cập nhật"}</td>
                              <td>{stu.role}</td>
                              <td className="text-center">Active</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-3">
                              Không có dữ liệu
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings & Script */}
      <SettingsPanel
        sidebarColor={sidebarColor}
        setSidebarColor={setSidebarColor}
      />
      <Script />
    </div>
  );
}
