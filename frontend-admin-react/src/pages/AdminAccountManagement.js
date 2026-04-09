import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SettingsPanel from "../components/SettingsPanel";
import Script from "../components/Script";

export default function DormitoryRegistration() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [sidebarColor, setSidebarColor] = useState("bg-white");

  // Modal chi tiết sinh viên
  const [detailModal, setDetailModal] = useState({
    show: false,
    student: null
  });

  // Modal từ chối
  const [rejectModalData, setRejectModalData] = useState({
    show: false,
    studentId: null,
    reasonType: "",
    customReason: ""
  });

  const token = localStorage.getItem("admin_token");

  // Lấy dữ liệu sinh viên
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/admin/accounts/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setFilteredStudents(data.filter(s => s.approvalStatus === "PENDING"));
        setSelectedRole("PENDING");
      })
      .catch(err => console.error(err));
  }, [token]);

  useEffect(() => {
    if (selectedRole === "ALL") setFilteredStudents(students);
    else setFilteredStudents(students.filter(s => s.approvalStatus === selectedRole));
  }, [selectedRole, students]);

  // DUYỆT
  const approveStudent = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/accounts/approve/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        window.showPopup("Email thông báo đã được gửi cho sinh viên.");
        setStudents(prev => prev.filter(s => s.id !== id));
      } else {
        const err = await res.text();
        window.showPopup(err,true);
      }
    } catch (err) {
      console.error(err);
      window.showPopup("Lỗi khi duyệt sinh viên",true);
    }
  };

  // Mở modal từ chối
  const openRejectModal = (id) => {
    setRejectModalData({
      show: true,
      studentId: id,
      reasonType: "",
      customReason: ""
    });
  };

  // Xác nhận từ chối
  const confirmReject = async () => {
    const { studentId, reasonType, customReason } = rejectModalData;
    const reason = reasonType === "Khác" ? customReason : reasonType;
    if (!reason) return window.showPopup("Vui lòng chọn hoặc nhập lý do từ chối!",true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/accounts/reject/${studentId}?reason=${encodeURIComponent(reason)}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        window.showPopup("Đã gửi thông báo từ chối đến sinh viên.");
        setRejectModalData({ show: false, studentId: null, reasonType: "", customReason: "" });
        setStudents(prev => prev.filter(s => s.id !== studentId));
      } else {
        const err = await res.text();
        window.showPopup(err,true);
      }
    } catch (err) {
      console.error(err);
      window.showPopup("Lỗi khi từ chối sinh viên!",true);
    }
  };


  return (
    <div className="g-sidenav-show">
      <Sidebar color={sidebarColor} />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">

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
                  Quản lý tài khoản
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

        {/* CONTENT */}
        <div className="container-fluid py-2">
          <div className="row">
            <div className="col-12">
              <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                    <h6 className="text-white text-capitalize ps-3">Danh sách tài khoản</h6>
                  </div>
                </div>

                <div className="card-body px-0 pb-2">
                  <div className="table-responsive p-0">

                    {/* FILTER */}
                    <div className="d-flex justify-content-between align-items-center px-4 pt-3">
                      <select className="form-select w-auto" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                        <option value="ALL">Tất cả</option>
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="APPROVED">Đã duyệt</option>
                        <option value="REJECTED">Từ chối</option>
                      </select>
                    </div>

                    {/* TABLE */}
                    <table className="table align-middle mb-0 text-center">
                      <thead>
                        <tr>
                          <th>Họ và tên</th>
                          <th>Tên đăng nhập</th>
                          <th>Lớp</th>
                          <th>Email</th>
                          <th>Vai trò</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map(s => (
                            <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => setDetailModal({ show: true, student: s })}>
                              <td>{s.fullName}</td>
                              <td>{s.username}</td>
                              <td>{s.className}</td>
                              <td>{s.email}</td>
                              <td>{s.role}</td>
                              <td>
                                {s.approvalStatus === "PENDING" && <span className="text-warning">Chờ duyệt</span>}
                                {s.approvalStatus === "APPROVED" && <span className="text-success fw-bold">Đã duyệt</span>}
                                {s.approvalStatus === "REJECTED" && <span className="text-danger fw-bold">Từ chối</span>}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-3">Không có dữ liệu</td>
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

      {/* ================= MODAL CHI TIẾT SINH VIÊN ================= */}
      {detailModal.show && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title" style={{ color: "#FFF" }}>Thông tin sinh viên</h5>
                <button type="button" className="btn-close white"  onClick={() => setDetailModal({ show: false, student: null })}></button>
              </div>

              <div className="modal-body">
                <table className="table">
                  <tbody>
                    <tr><th>Họ tên:</th><td>{detailModal.student.fullName}</td></tr>
                    <tr><th>MSSV:</th><td>{detailModal.student.username}</td></tr>
                    <tr><th>Lớp:</th><td>{detailModal.student.className}</td></tr>
                    <tr><th>Email:</th><td>{detailModal.student.email}</td></tr>
                    <tr><th>Số điện thoại:</th><td>{detailModal.student.phone || "Chưa cập nhật"}</td></tr>
                    <tr><th>Giới tính:</th><td>{detailModal.student.gender ? "Nữ" : "Nam"}</td></tr>
                    <tr><th>Ngày sinh:</th><td>{detailModal.student.dateOfBirth}</td></tr>
                    <tr>
                      <th>Trạng thái:</th>
                      <td>
                        {detailModal.student.approvalStatus === "PENDING" && <span className="text-warning">Chờ duyệt</span>}
                        {detailModal.student.approvalStatus === "APPROVED" && <span className="text-success">Đã duyệt</span>}
                        {detailModal.student.approvalStatus === "REJECTED" && <span className="text-danger">Từ chối</span>}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="modal-footer">
                {detailModal.student.approvalStatus === "PENDING" && (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        approveStudent(detailModal.student.id);
                        setDetailModal({ show: false, student: null });
                      }}
                    >
                      Duyệt sinh viên
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setDetailModal({ show: false, student: null });
                        openRejectModal(detailModal.student.id);
                      }}
                    >
                      Từ chối
                    </button>
                  </>
                )}

                <button className="btn btn-secondary" onClick={() => setDetailModal({ show: false, student: null })}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TỪ CHỐI ================= */}
      {rejectModalData.show && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title" style={{ color: "#FFF" }}>Từ chối đăng ký nội trú</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setRejectModalData({ show: false, studentId: null, reasonType: "", customReason: "" })}
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label fw-bold">Chọn lý do từ chối</label>
                <select
                  className="form-select mb-3"
                  value={rejectModalData.reasonType}
                  onChange={(e) => setRejectModalData(prev => ({ ...prev, reasonType: e.target.value }))}
                >
                  <option value="">-- Chọn lý do --</option>
                  <option value="Không đủ điều kiện nội trú">Không đủ điều kiện nội trú</option>
                  <option value="Ký túc xá đã hết chỗ">Ký túc xá đã hết chỗ</option>
                  <option value="Thiếu hoặc sai thông tin hồ sơ">Thiếu hoặc sai thông tin hồ sơ</option>
                  <option value="Sinh viên đã từng vi phạm nội quy KTX">Sinh viên đã từng vi phạm nội quy KTX</option>
                  <option value="Đăng ký quá hạn">Đăng ký quá hạn</option>
                  <option value="Khác">Khác</option>
                </select>

                {rejectModalData.reasonType === "Khác" && (
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Nhập lý do khác..."
                    value={rejectModalData.customReason}
                    onChange={(e) => setRejectModalData(prev => ({ ...prev, customReason: e.target.value }))}
                  />
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary"
                  onClick={() => setRejectModalData({ show: false, studentId: null, reasonType: "", customReason: "" })}
                >
                  Hủy
                </button>

                <button className="btn btn-danger" onClick={confirmReject}>
                  Xác nhận từ chối
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <SettingsPanel sidebarColor={sidebarColor} setSidebarColor={setSidebarColor} />
      <Script />
    </div>
  );
}
