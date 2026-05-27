import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import Script from "../../components/Script";

export default function UserList() {
  const [students, setStudents] = useState([]);
  const [sidebarColor, setSidebarColor] = useState("bg-white");

  // 👉 FILTER
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  // 👉 LOAD DATA
  // 👉 LOAD DATA
const fetchStudents = () => {
  if (!token) return;

  let url = `http://localhost:8080/api/admin/students/filter?fullName=${fullName}&className=${className}`;

  fetch(url, {
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

      // 👉 chỉ lấy STUDENT
      const filteredData = (data || []).filter(
        (user) => user.role === "STUDENT"
      );

      setStudents(filteredData);
    })
    .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
};

// 👉 AUTO FILTER KHI NHẬP
useEffect(() => {
  const timeout = setTimeout(() => {
    fetchStudents();
  }, 300);

  return () => clearTimeout(timeout);

}, [fullName, className]);

  useEffect(() => {
    fetchStudents();
  }, [token]);

  // 👉 DELETE
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

          if (res.ok) {
            setStudents((prev) =>
              prev.filter((s) => s.id !== studentId)
            );

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

      {/* Main */}
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">

        {/* NAVBAR */}
        <nav
          className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl"
          id="navbarBlur"
        >
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0">
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
          </div>
        </nav>

        {/* CONTENT */}
        <div className="container-fluid py-2">
          <div className="row">
            <div className="col-12">

              <div className="card my-4">

                {/* HEADER */}
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                    <h6 className="text-white text-capitalize ps-3">
                      Danh sách sinh viên
                    </h6>
                  </div>
                </div>

                <div className="card-body px-0 pb-2">

                  {/* FILTER */}
                  <div className="d-flex justify-content-between align-items-center px-4 pt-3 flex-wrap gap-2">

                    <div className="d-flex gap-2">

                      {/* FILTER NAME */}
                      <input
                        type="text"
                        placeholder="Tìm theo tên..."
                        className="form-control border border-dark"
                        style={{ width: "220px" }}
                        value={fullName}
                        onChange={(e) =>
                          setFullName(e.target.value)
                        }
                      />

                      {/* FILTER CLASS */}
                      <input
                        type="text"
                        placeholder="Tìm theo lớp..."
                        className="form-control border border-dark"
                        style={{ width: "180px" }}
                        value={className}
                        onChange={(e) =>
                          setClassName(e.target.value)
                        }
                      />

                    </div>

                    {/* ADD */}
                    <button
                      className="btn btn-dark mb-0"
                      onClick={() =>
                        navigate("/admin/students/add")
                      }
                    >
                      + Thêm sinh viên
                    </button>
                  </div>

                  {/* TABLE */}
                  <div className="table-responsive p-0">
                    <table className="table align-middle mb-0">

                      <thead className="text-center">
                        <tr>
                          <th>Họ và tên</th>
                          <th>Ngày sinh</th>
                          <th>Lớp</th>
                          <th>Giới tính</th>
                          <th>Email</th>
                          <th>Số điện thoại</th>
                          <th>Ngày tạo</th>
                          <th style={{ width: "100px" }}>
                            Hành động
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {students.length > 0 ? (
                          students.map((stu, idx) => (
                            <tr
                              key={idx}
                              className="text-center"
                            >
                              <td>{stu.fullName}</td>

                              <td>
                                {stu.dateOfBirth
                                  ? new Date(
                                      stu.dateOfBirth
                                    ).toLocaleDateString("vi-VN")
                                  : ""}
                              </td>

                              <td>{stu.className}</td>

                              <td>
                                {stu.gender ? "Nữ" : "Nam"}
                              </td>

                              <td>{stu.email}</td>

                              <td>
                                {stu.phone || "Chưa cập nhật"}
                              </td>

                              <td>
                                {stu.created_at
                                  ? new Date(
                                      stu.created_at
                                    ).toLocaleDateString("vi-VN")
                                  : "Chưa cập nhật"}
                              </td>

                              <td>
                                {/* EDIT */}
                                <i
                                  className="fa-regular fa-pen-to-square text-secondary me-3"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    navigate(
                                      `/admin/update-student?id=${stu.id}`
                                    )
                                  }
                                ></i>

                                {/* DELETE */}
                                <i
                                  className="fa-solid fa-trash text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    handleDelete(stu.id)
                                  }
                                ></i>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              className="text-center py-3"
                            >
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

      {/* SETTINGS */}
      <SettingsPanel
        sidebarColor={sidebarColor}
        setSidebarColor={setSidebarColor}
      />

      <Script />
    </div>
  );
}