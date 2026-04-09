import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import Script from "../../components/Script";

export default function UserList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const [sidebarColor, setSidebarColor] = useState("bg-white");
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
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
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
  }, [token]);

  
  const handleDelete = async (studentId) => {
    window.showPopup(
      "Bạn có chắc chắn muốn xoá sinh viên này không?",
      false,
      true,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/admin/students/${studentId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
  
          const message = await res.text();
  
          console.log("STATUS:", res.status);
          console.log("MESSAGE:", message);
  
          if (res.ok) {
            setStudents((prev) => prev.filter((s) => s.id !== studentId));
  
            setTimeout(() => {
              window.showPopup("Xoá sinh viên thành công!");
            }, 200);
  
          } else {
            setTimeout(() => {
              window.showPopup(
                message || "Không thể xoá sinh viên!",
                true
              );
            }, 200);
          }
        } catch (err) {
          console.error(err);
          setTimeout(() => {
            window.showPopup("Lỗi kết nối server!", true);
          }, 200);
        }
      }
    );
  };
  

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
                  Quản lý sinh viên
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
                      Danh sách sinh viên
                    </h6>
                  </div>
                </div>

                <div className="card-body px-0 pb-2">
                  <div className="table-responsive p-0">
                    <div className="d-flex justify-content-between align-items-center px-4 pt-3">
                      
                      <button
                        className="btn btn-dark ms-auto"
                        onClick={() => navigate("/admin/students/add")}
                      >
                        + Thêm sinh viên
                      </button>
                    </div>

                    <table className="table align-middle mb-0">
                      <thead className="text-center">
                        <tr>
                          <th>
                            Họ và tên
                          </th>
                          <th>
                            Ngày sinh
                          </th>
                          <th>
                            Lớp
                          </th>
                          <th>
                            Giới tính
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
                    
                          <th style={{ width: "100px" }}>Hành động</th>
                        </tr>
                      </thead>

                      <tbody>
                        {students.length > 0 ? (
                          students.map((stu, idx) => (
                            <tr key={idx}  className="text-center">
                              <td>{stu.fullName}</td>
                              <td>{stu.dateOfBirth}</td>
                              <td>{stu.className}</td>
                              <td>{stu.gender ? "Nữ" : "Nam"}</td>
                              <td>{stu.email}</td>
                              <td>{stu.phone || "Chưa cập nhật"}</td>
                              <td>{stu.created_at || "Chưa cập nhật"}</td>
                              <td>
                                <i
                                  className="fa-regular fa-pen-to-square text-secondary me-2"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => navigate(`/admin/update-student?id=${stu.id}`)}
                                ></i>
                               <i
                                  className="fa-solid fa-trash text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDelete(stu.id)}
                                ></i>
                              </td>
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
