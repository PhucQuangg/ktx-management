import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import "../css/DormitoryRegistrationAdmin.css";

export default function DormitoryRegistration() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  const [detailModal, setDetailModal] = useState({
    show: false,
    student: null,
  });

  const [rejectModalData, setRejectModalData] = useState({
    show: false,
    studentId: null,
    reasonType: "",
    customReason: "",
  });

  const token = sessionStorage.getItem("admin_token");

  useEffect(() => {
    fetchStudents();
  }, [token]);

  useEffect(() => {
    if (selectedStatus === "ALL") {
      setFilteredStudents(students);
      return;
    }

    setFilteredStudents(
      students.filter((student) => student.approvalStatus === selectedStatus)
    );
  }, [selectedStatus, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/admin/accounts/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const message = await res.text();

        throw new Error(message || "Không thể tải danh sách đăng ký nội trú.");
      }

      const data = await res.json();

      const studentList = data.filter((student) => student.role === "STUDENT");

      setStudents(studentList);
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

  const approveStudent = async (id) => {
    window.showPopup?.(
      "Xác nhận duyệt đơn đăng ký nội trú này?",
      false,
      true,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/admin/accounts/approve/${id}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await res.text();

          if (!res.ok) {
            throw new Error(message || "Không thể duyệt đơn đăng ký.");
          }

          window.showPopup?.(message || "Duyệt đơn đăng ký thành công.");

          setStudents((prev) =>
            prev.map((student) =>
              student.id === id
                ? {
                    ...student,
                    approvalStatus: "APPROVED",
                  }
                : student
            )
          );

          setDetailModal({
            show: false,
            student: null,
          });
          setTimeout(() => {
            window.showPopup?.(message || "Duyệt đơn đăng ký thành công.");
          }, 300);
        } catch (error) {
          console.error(error);

          window.showPopup?.(error.message || "Lỗi khi duyệt sinh viên.", true);
        }
      }
    );
  };

  const openRejectModal = (id) => {
    setRejectModalData({
      show: true,
      studentId: id,
      reasonType: "",
      customReason: "",
    });
  };

  const closeRejectModal = () => {
    setRejectModalData({
      show: false,
      studentId: null,
      reasonType: "",
      customReason: "",
    });
  };

  const confirmReject = async () => {
    const { studentId, reasonType, customReason } = rejectModalData;

    const reason = reasonType === "Khác" ? customReason.trim() : reasonType;

    if (!reason) {
      window.showPopup?.("Vui lòng chọn hoặc nhập lý do từ chối.", true);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/accounts/reject/${studentId}?reason=${encodeURIComponent(
          reason
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const message = await res.text();

      if (!res.ok) {
        throw new Error(message || "Không thể từ chối đơn đăng ký.");
      }

      window.showPopup?.(message || "Đã từ chối đơn đăng ký nội trú.");

      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentId
            ? {
                ...student,
                approvalStatus: "REJECTED",
              }
            : student
        )
      );

      closeRejectModal();
      setTimeout(() => {
        window.showPopup?.(message || "Đã từ chối đơn đăng ký nội trú.");
      }, 300);
    } catch (error) {
      console.error(error);

      window.showPopup?.(error.message || "Lỗi khi từ chối sinh viên.", true);
    }
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

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";

      case "APPROVED":
        return "Đã duyệt";

      case "REJECTED":
        return "Đã từ chối";

      default:
        return status || "Chưa xác định";
    }
  };

  const countByStatus = (status) =>
    students.filter((student) => student.approvalStatus === status).length;
  return (
    <div className="admin-registration-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`admin-registration-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="registration-banner">
          <div>
            <div className="registration-banner-badge">
              <i className="fa fa-file-signature"></i>
              Quản lý nội trú
            </div>

            <h1>Đăng ký nội trú</h1>

            <p>
              Theo dõi, kiểm tra và xét duyệt hồ sơ đăng ký nội trú của sinh
              viên.
            </p>
          </div>

          <div className="registration-banner-icon">
            <i className="fa fa-user-check"></i>
          </div>
        </section>

        <section className="registration-statistics">
          <div className="registration-stat-card total">
            <div className="stat-icon">
              <i className="fa fa-users"></i>
            </div>

            <div>
              <span>Tổng hồ sơ</span>
              <strong>{students.length}</strong>
            </div>
          </div>

          <div className="registration-stat-card pending">
            <div className="stat-icon">
              <i className="fa fa-clock"></i>
            </div>

            <div>
              <span>Chờ duyệt</span>
              <strong>{countByStatus("PENDING")}</strong>
            </div>
          </div>

          <div className="registration-stat-card approved">
            <div className="stat-icon">
              <i className="fa fa-check-circle"></i>
            </div>

            <div>
              <span>Đã duyệt</span>
              <strong>{countByStatus("APPROVED")}</strong>
            </div>
          </div>

          <div className="registration-stat-card rejected">
            <div className="stat-icon">
              <i className="fa fa-times-circle"></i>
            </div>

            <div>
              <span>Đã từ chối</span>
              <strong>{countByStatus("REJECTED")}</strong>
            </div>
          </div>
        </section>

        <section className="registration-list-section">
          <div className="registration-toolbar">
            <div>
              <h2>Danh sách hồ sơ đăng ký</h2>

              <p>
                Lọc hồ sơ theo trạng thái và xem thông tin chi tiết của sinh
                viên.
              </p>
            </div>

            <div className="registration-filter">
              <label htmlFor="registration-status-filter">Trạng thái</label>

              <select
                id="registration-status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">Tất cả hồ sơ</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Đã từ chối</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="registration-loading">
              <i className="fa fa-spinner fa-spin"></i>

              <p>Đang tải danh sách hồ sơ...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="registration-empty">
              <div className="registration-empty-icon">
                <i className="fa fa-folder-open"></i>
              </div>

              <h3>Không có hồ sơ phù hợp</h3>

              <p>
                Hiện tại chưa có hồ sơ đăng ký nội trú theo trạng thái đã chọn.
              </p>
            </div>
          ) : (
            <div className="registration-table-wrapper">
              <table className="registration-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>MSSV</th>
                    <th>Lớp</th>
                    <th>Email</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="registration-student-cell">
                          <div className="registration-avatar">
                            {student.fullName
                              ? student.fullName.trim().charAt(0).toUpperCase()
                              : "S"}
                          </div>

                          <div>
                            <strong>
                              {student.fullName || "Chưa cập nhật"}
                            </strong>

                            <span>
                              {student.phone || "Chưa có số điện thoại"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>{student.username || "—"}</td>

                      <td>{student.className || "—"}</td>

                      <td className="registration-email-cell">
                        {student.email || "—"}
                      </td>

                      <td>
                        <span
                          className={`registration-status-badge ${
                            student.approvalStatus
                              ? student.approvalStatus.toLowerCase()
                              : ""
                          }`}
                        >
                          {getStatusText(student.approvalStatus)}
                        </span>
                      </td>

                      <td>
                        <div className="registration-actions">
                          <button
                            type="button"
                            className="registration-detail-button"
                            onClick={() =>
                              setDetailModal({
                                show: true,
                                student,
                              })
                            }
                          >
                            <i className="fa fa-eye"></i>
                            Chi tiết
                          </button>

                          {student.approvalStatus === "PENDING" && (
                            <>
                              <button
                                type="button"
                                className="registration-approve-button"
                                onClick={() => approveStudent(student.id)}
                              >
                                <i className="fa fa-check"></i>
                                Duyệt
                              </button>

                              <button
                                type="button"
                                className="registration-reject-button"
                                onClick={() => openRejectModal(student.id)}
                              >
                                <i className="fa fa-times"></i>
                                Từ chối
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {detailModal.show && detailModal.student && (
          <div
            className="registration-modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setDetailModal({
                  show: false,
                  student: null,
                });
              }
            }}
          >
            <div className="registration-detail-modal">
              <div className="registration-modal-header">
                <div>
                  <span className="registration-modal-label">
                    Hồ sơ đăng ký nội trú
                  </span>

                  <h2>Thông tin sinh viên</h2>
                </div>

                <button
                  type="button"
                  className="registration-modal-close"
                  onClick={() =>
                    setDetailModal({
                      show: false,
                      student: null,
                    })
                  }
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>

              <div className="registration-modal-body">
                <section className="registration-detail-section">
                  <div className="registration-detail-title">
                    <div className="detail-title-icon">
                      <i className="fa fa-user-graduate"></i>
                    </div>

                    <div>
                      <h3>Thông tin sinh viên</h3>
                      <p>Thông tin tài khoản và hồ sơ cá nhân</p>
                    </div>
                  </div>

                  <div className="registration-detail-grid">
                    <div className="registration-detail-row">
                      <label>Họ và tên</label>
                      <span>
                        {detailModal.student.fullName || "Chưa cập nhật"}
                      </span>
                    </div>

                    <div className="registration-detail-row">
                      <label>Mã số sinh viên</label>
                      <span>{detailModal.student.username || "—"}</span>
                    </div>

                    <div className="registration-detail-row">
                      <label>Lớp</label>
                      <span>{detailModal.student.className || "—"}</span>
                    </div>

                    <div className="registration-detail-row">
                      <label>Email</label>
                      <span>{detailModal.student.email || "—"}</span>
                    </div>

                    <div className="registration-detail-row">
                      <label>Số điện thoại</label>
                      <span>
                        {detailModal.student.phone || "Chưa cập nhật"}
                      </span>
                    </div>

                    <div className="registration-detail-row">
                      <label>Giới tính</label>
                      <span>
                        {detailModal.student.gender === true
                          ? "Nữ"
                          : detailModal.student.gender === false
                          ? "Nam"
                          : "Chưa cập nhật"}
                      </span>
                    </div>

                    <div className="registration-detail-row">
                      <label>Ngày sinh</label>
                      <span>{formatDate(detailModal.student.dateOfBirth)}</span>
                    </div>

                    <div className="registration-detail-row">
                      <label>Trạng thái hồ sơ</label>

                      <span
                        className={`registration-status-badge ${
                          detailModal.student.approvalStatus
                            ? detailModal.student.approvalStatus.toLowerCase()
                            : ""
                        }`}
                      >
                        {getStatusText(detailModal.student.approvalStatus)}
                      </span>
                    </div>
                  </div>
                </section>

                <section className="registration-detail-section">
                  <div className="registration-detail-title">
                    <div className="detail-title-icon residence">
                      <i className="fa fa-id-card"></i>
                    </div>

                    <div>
                      <h3>Thông tin cư trú</h3>
                      <p>Thông tin căn cước và địa chỉ thường trú</p>
                    </div>
                  </div>

                  {detailModal.student.residenceInfo ? (
                    <div className="registration-detail-grid">
                      <div className="registration-detail-row">
                        <label>Số CCCD</label>
                        <span>
                          {detailModal.student.residenceInfo.identityNumber ||
                            "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="registration-detail-row">
                        <label>Ngày cấp</label>
                        <span>
                          {formatDate(
                            detailModal.student.residenceInfo.identityIssueDate
                          )}
                        </span>
                      </div>

                      <div className="registration-detail-row">
                        <label>Nơi cấp</label>
                        <span>
                          {detailModal.student.residenceInfo
                            .identityIssuePlace || "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="registration-detail-row">
                        <label>Quốc tịch</label>
                        <span>
                          {detailModal.student.residenceInfo.nationality ||
                            "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="registration-detail-row">
                        <label>Nơi sinh</label>
                        <span>
                          {detailModal.student.residenceInfo.placeOfBirth ||
                            "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="registration-detail-row">
                        <label>Dân tộc</label>
                        <span>
                          {detailModal.student.residenceInfo.ethnicity ||
                            "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="registration-detail-row">
                        <label>Tôn giáo</label>
                        <span>
                          {detailModal.student.residenceInfo.religion ||
                            "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="registration-detail-row">
                        <label>Tỉnh / Thành phố</label>
                        <span>
                          {detailModal.student.residenceInfo.province ||
                            "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="registration-detail-row">
                        <label>Quận / Huyện</label>
                        <span>
                          {detailModal.student.residenceInfo.district ||
                            "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="registration-detail-row">
                        <label>Phường / Xã</label>
                        <span>
                          {detailModal.student.residenceInfo.ward ||
                            "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="registration-detail-row full-width">
                        <label>Địa chỉ</label>
                        <span>
                          {detailModal.student.residenceInfo.address ||
                            "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="registration-no-residence">
                      <i className="fa fa-address-card"></i>

                      <p>Sinh viên chưa cập nhật thông tin cư trú.</p>
                    </div>
                  )}
                </section>
              </div>

              <div className="registration-modal-footer">
                <button
                  type="button"
                  className="registration-close-button"
                  onClick={() =>
                    setDetailModal({
                      show: false,
                      student: null,
                    })
                  }
                >
                  Đóng
                </button>

                {detailModal.student.approvalStatus === "PENDING" && (
                  <>
                    <button
                      type="button"
                      className="registration-reject-button"
                      onClick={() => {
                        const studentId = detailModal.student.id;

                        setDetailModal({
                          show: false,
                          student: null,
                        });

                        openRejectModal(studentId);
                      }}
                    >
                      <i className="fa fa-times"></i>
                      Từ chối
                    </button>

                    <button
                      type="button"
                      className="registration-approve-button"
                      onClick={() => approveStudent(detailModal.student.id)}
                    >
                      <i className="fa fa-check"></i>
                      Duyệt hồ sơ
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {rejectModalData.show && (
          <div
            className="registration-modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeRejectModal();
              }
            }}
          >
            <div className="registration-reject-modal">
              <div className="registration-modal-header reject">
                <div>
                  <span className="registration-modal-label">Xử lý hồ sơ</span>

                  <h2>Từ chối đăng ký nội trú</h2>
                </div>

                <button
                  type="button"
                  className="registration-modal-close"
                  onClick={closeRejectModal}
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>

              <div className="registration-modal-body">
                <div className="registration-reject-warning">
                  <div className="reject-warning-icon">
                    <i className="fa fa-exclamation-triangle"></i>
                  </div>

                  <div>
                    <h3>Xác nhận từ chối hồ sơ</h3>

                    <p>
                      Vui lòng chọn lý do phù hợp. Nội dung này sẽ được gửi đến
                      sinh viên qua email.
                    </p>
                  </div>
                </div>

                <div className="reject-form-group">
                  <label
                    htmlFor="reject-reason"
                    className="reject-select-label"
                  >
                    <i className="fa fa-list-alt"></i>

                    <span>Lý do từ chối</span>

                    <span className="required">*</span>
                  </label>

                  <div className="reject-select-wrapper">
                    <select
                      id="reject-reason"
                      className="reject-select"
                      value={rejectModalData.reasonType}
                      onChange={(e) =>
                        setRejectModalData((prev) => ({
                          ...prev,
                          reasonType: e.target.value,
                          customReason:
                            e.target.value === "Khác" ? prev.customReason : "",
                        }))
                      }
                    >
                      <option value="">-- Chọn lý do từ chối --</option>

                      <option value="Không đủ điều kiện nội trú">
                        Không đủ điều kiện nội trú
                      </option>

                      <option value="Ký túc xá đã hết chỗ">
                        Ký túc xá đã hết chỗ
                      </option>

                      <option value="Thiếu hoặc sai thông tin hồ sơ">
                        Thiếu hoặc sai thông tin hồ sơ
                      </option>

                      <option value="Sinh viên đã từng vi phạm nội quy KTX">
                        Sinh viên đã từng vi phạm nội quy KTX
                      </option>

                      <option value="Đăng ký quá hạn">Đăng ký quá hạn</option>

                      <option value="Khác">Lý do khác</option>
                    </select>

                    <i className="fa fa-chevron-down select-arrow"></i>
                  </div>
                </div>

                {rejectModalData.reasonType === "Khác" && (
                  <div className="registration-form-group">
                    <label htmlFor="custom-reject-reason">
                      Nhập lý do khác
                      <span>*</span>
                    </label>

                    <textarea
                      id="custom-reject-reason"
                      className="reject-custom-textarea"
                      rows="5"
                      maxLength="500"
                      value={rejectModalData.customReason}
                      onChange={(e) =>
                        setRejectModalData((prev) => ({
                          ...prev,
                          customReason: e.target.value,
                        }))
                      }
                      placeholder="Nhập nội dung lý do từ chối..."
                    />

                    <div className="reject-textarea-footer">
                      <span>
                        {rejectModalData.customReason.length}/500 ký tự
                      </span>
                    </div>

                    <div className="registration-character-count">
                      {rejectModalData.customReason.length}/500 ký tự
                    </div>
                  </div>
                )}
              </div>

              <div className="registration-modal-footer">
                <button
                  type="button"
                  className="registration-close-button"
                  onClick={closeRejectModal}
                >
                  Hủy
                </button>

                <button
                  type="button"
                  className="registration-confirm-reject-button"
                  onClick={confirmReject}
                >
                  <i className="fa fa-times-circle"></i>
                  Xác nhận từ chối
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
