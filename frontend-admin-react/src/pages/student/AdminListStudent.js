import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import "../../css/AdminStudentList.css";

export default function UserList() {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchStudents();
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const timeout = setTimeout(() => {
      fetchStudents();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fullName, className]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (fullName.trim()) {
        params.append("fullName", fullName.trim());
      }

      if (className.trim()) {
        params.append("className", className.trim());
      }

      const url = `http://localhost:8080/api/admin/students/filter?${params.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseText = await res.text();

      let data = [];

      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch {
        data = [];
      }

      if (!res.ok) {
        throw new Error(responseText || "Không thể tải danh sách sinh viên.");
      }

      const filteredData = (data || []).filter(
        (user) => user.role === "STUDENT"
      );

      setStudents(filteredData);
    } catch (error) {
      console.error(error);

      window.showPopup?.(
        error.message || "Lỗi khi tải danh sách sinh viên.",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    window.showPopup?.(
      "Bạn có chắc chắn muốn xóa sinh viên này không?",
      false,
      true,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/admin/students/${studentId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await res.text();

          if (!res.ok) {
            throw new Error(message || "Không thể xóa sinh viên.");
          }

          setStudents((prev) =>
            prev.filter((student) => student.id !== studentId)
          );

          setTimeout(() => {
            window.showPopup?.(message || "Xóa sinh viên thành công.");
          }, 200);
        } catch (error) {
          console.error(error);

          setTimeout(() => {
            window.showPopup?.(error.message || "Lỗi khi xóa sinh viên.", true);
          }, 200);
        }
      }
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Chưa cập nhật";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("vi-VN");
  };

  const clearFilters = () => {
    setFullName("");
    setClassName("");
  };

  return (
    <div className="admin-student-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`admin-student-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="student-list-banner">
          <div>
            <div className="student-list-badge">
              <i className="fa fa-user-graduate"></i>
              Quản lý sinh viên
            </div>

            <h1>Danh sách sinh viên</h1>

            <p>
              Theo dõi, tìm kiếm, cập nhật và quản lý thông tin sinh viên đang
              sử dụng hệ thống ký túc xá.
            </p>
          </div>

          <div className="student-list-banner-icon">
            <i className="fa fa-users"></i>
          </div>
        </section>

        <section className="student-list-section">
          <div className="student-list-toolbar">
            <div>
              <h2>Danh sách sinh viên</h2>

              <p>Nhập họ tên hoặc lớp để lọc danh sách sinh viên.</p>
            </div>

            <button
              type="button"
              className="student-add-button"
              onClick={() => navigate("/admin/students/add")}
            >
              <i className="fa fa-plus"></i>
              Thêm sinh viên
            </button>
          </div>

          <div className="student-filter-panel">
            <div className="student-filter-group">
              <label htmlFor="student-name-filter">Họ và tên</label>

              <div className="student-filter-input">
                <i className="fa fa-search"></i>

                <input
                  id="student-name-filter"
                  type="text"
                  placeholder="Nhập tên sinh viên..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="student-filter-group">
              <label htmlFor="student-class-filter">Lớp</label>

              <div className="student-filter-input">
                <i className="fa fa-school"></i>

                <input
                  id="student-class-filter"
                  type="text"
                  placeholder="Nhập tên lớp..."
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
            </div>

            {(fullName || className) && (
              <button
                type="button"
                className="student-clear-filter"
                onClick={clearFilters}
              >
                <i className="fa fa-times"></i>
                Xóa bộ lọc
              </button>
            )}
          </div>

          {loading ? (
            <div className="student-list-loading">
              <i className="fa fa-spinner fa-spin"></i>

              <p>Đang tải danh sách sinh viên...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="student-list-empty">
              <div className="student-empty-icon">
                <i className="fa fa-user-slash"></i>
              </div>

              <h3>Không tìm thấy sinh viên</h3>

              <p>
                Không có sinh viên nào phù hợp với điều kiện tìm kiếm hiện tại.
              </p>
            </div>
          ) : (
            <div className="student-table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Sinh viên</th>
                    <th>Ngày sinh</th>
                    <th>Lớp</th>
                    <th>Giới tính</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-name-cell">
                          <div className="student-avatar">
                            {student.fullName
                              ? student.fullName.trim().charAt(0).toUpperCase()
                              : "S"}
                          </div>

                          <div>
                            <strong>
                              {student.fullName || "Chưa cập nhật"}
                            </strong>

                            <span>MSSV: {student.username || "—"}</span>
                          </div>
                        </div>
                      </td>

                      <td>{formatDate(student.dateOfBirth)}</td>

                      <td>
                        <span className="student-class-badge">
                          {student.className || "Chưa cập nhật"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`student-gender-badge ${
                            student.gender === true ? "female" : "male"
                          }`}
                        >
                          <i
                            className={`fa ${
                              student.gender === true ? "fa-venus" : "fa-mars"
                            }`}
                          ></i>

                          {student.gender === true ? "Nữ" : "Nam"}
                        </span>
                      </td>

                      <td className="student-email-cell">
                        {student.email || "—"}
                      </td>

                      <td>{student.phone || "Chưa cập nhật"}</td>

                      <td>
                        {formatDate(student.created_at || student.createdAt)}
                      </td>

                      <td>
                        <div className="student-action-buttons">
                          <button
                            type="button"
                            className="student-edit-button"
                            title="Cập nhật sinh viên"
                            onClick={() =>
                              navigate(`/admin/update-student?id=${student.id}`)
                            }
                          >
                            <i className="fa fa-eye"></i>
                            Xem
                          </button>

                          <button
                            type="button"
                            className="student-delete-button"
                            title="Xóa sinh viên"
                            onClick={() => handleDelete(student.id)}
                          >
                            <i className="fa fa-trash"></i>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
