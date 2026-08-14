import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import "../../css/AdminContractList.css";

const initialActionModal = {
  show: false,
  contractId: null,
  type: "",
  reasonType: "",
  customReason: "",
};

const initialOpenSemesterModal = {
  show: false,
  semesterId: "",
};

export default function ContractList() {
  const navigate = useNavigate();
  const location = useLocation();

  const token =
    sessionStorage.getItem("admin_token") ||
    localStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [contracts, setContracts] = useState([]);

  const [filteredContracts, setFilteredContracts] = useState([]);

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [studentFilter, setStudentFilter] = useState("");

  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState(false);

  const [actionModal, setActionModal] = useState(initialActionModal);

  const [semesterRegistrations, setSemesterRegistrations] = useState([]);

  const [semesterTimes, setSemesterTimes] = useState([]);

  const [activeSemester, setActiveSemester] = useState(null);

  const [showSemesterTimeModal, setShowSemesterTimeModal] = useState(false);

  const [openSemesterModal, setOpenSemesterModal] = useState(
    initialOpenSemesterModal
  );

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (location.state) {
      setStatusFilter(location.state.statusFilter || "ALL");

      setStudentFilter(location.state.studentFilter || "");
    }

    reload();
    loadSemesterRegistrations();
    loadActiveSemester();
  }, [token]);

  useEffect(() => {
    let result = [...contracts];

    if (statusFilter !== "ALL") {
      result = result.filter((contract) => contract.status === statusFilter);
    }

    if (studentFilter.trim()) {
      const keyword = studentFilter.trim().toLowerCase();

      result = result.filter((contract) =>
        contract.studentName?.toLowerCase().includes(keyword)
      );
    }

    setFilteredContracts(result);
  }, [contracts, statusFilter, studentFilter]);

  const reload = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/admin/contracts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();

      let data = [];

      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch {
        data = [];
      }

      if (!response.ok) {
        throw new Error(
          responseText || "Không thể tải danh sách đăng ký phòng."
        );
      }

      setContracts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải danh sách đăng ký phòng:", error);

      window.showPopup?.(
        error.message || "Lỗi khi tải danh sách đăng ký phòng.",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  const createDateString = (month, day, year) => {
    if (!month || !day) {
      return "";
    }

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const prepareSemesterTimes = (semesterList) => {
    const currentYear = new Date().getFullYear();

    return semesterList.map((semester) => {
      let startYear = currentYear;

      let endYear = currentYear;

      if (semester.registerEndMonth < semester.registerStartMonth) {
        endYear = currentYear + 1;
      }

      return {
        ...semester,

        registerStartDate: createDateString(
          semester.registerStartMonth,
          semester.registerStartDay,
          startYear
        ),

        registerEndDate: createDateString(
          semester.registerEndMonth,
          semester.registerEndDay,
          endYear
        ),
      };
    });
  };

  const loadSemesterRegistrations = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/semester-registration",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Không thể tải danh sách học kỳ.");
      }

      const data = text ? JSON.parse(text) : [];

      const list = Array.isArray(data) ? data : [];

      setSemesterRegistrations(list);

      setSemesterTimes(prepareSemesterTimes(list));
    } catch (error) {
      console.error("Lỗi tải học kỳ:", error);
    }
  };

  const loadActiveSemester = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/semester-registration/active",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204 || response.status === 404) {
        setActiveSemester(null);
        return;
      }

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Không thể tải học kỳ đang mở.");
      }

      const data = text ? JSON.parse(text) : null;

      if (Array.isArray(data)) {
        setActiveSemester(data.length > 0 ? data[0] : null);

        return;
      }

      setActiveSemester(data);
    } catch (error) {
      console.error("Lỗi tải học kỳ đang mở:", error);

      setActiveSemester(null);
    }
  };

  const handleShowSemesterTimeModal = async () => {
    await loadSemesterRegistrations();

    setShowSemesterTimeModal(true);
  };

  const closeSemesterTimeModal = () => {
    if (processing) {
      return;
    }

    setShowSemesterTimeModal(false);

    setSemesterTimes(prepareSemesterTimes(semesterRegistrations));
  };

  const handleSemesterDateChange = (semesterId, field, value) => {
    setSemesterTimes((previous) =>
      previous.map((semester) => {
        if (semester.id !== semesterId) {
          return semester;
        }

        return {
          ...semester,
          [field]: value,
        };
      })
    );
  };

  const validateSemesterTimes = () => {
    for (const semester of semesterTimes) {
      if (!semester.registerStartDate || !semester.registerEndDate) {
        window.showPopup?.(
          `Vui lòng nhập đầy đủ thời gian đăng ký cho ${semester.name}.`,
          true
        );

        return false;
      }

      const startDate = new Date(`${semester.registerStartDate}T00:00:00`);

      const endDate = new Date(`${semester.registerEndDate}T00:00:00`);

      if (endDate < startDate) {
        window.showPopup?.(
          `Ngày kết thúc của ${semester.name} phải sau ngày bắt đầu.`,
          true
        );

        return false;
      }
    }

    return true;
  };

  const handleSaveSemesterTimes = async () => {
    if (!validateSemesterTimes()) {
      return;
    }
  
    try {
      setProcessing(true);
  
      for (const semester of semesterTimes) {
        const [, startMonth, startDay] =
          semester.registerStartDate
            .split("-")
            .map(Number);
  
        const [, endMonth, endDay] =
          semester.registerEndDate
            .split("-")
            .map(Number);
  
        const payload = {
          registerStartMonth: startMonth,
          registerStartDay: startDay,
  
          registerEndMonth: endMonth,
          registerEndDay: endDay,
        };
  
  
        const response = await fetch(
          `http://localhost:8080/api/admin/semester-registration/${semester.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
  
        const message =
          await response.text();
  
        if (!response.ok) {
          throw new Error(
            message ||
              `Không thể cập nhật ${semester.name}.`
          );
        }
      }
  
      setShowSemesterTimeModal(false);
  
      await loadSemesterRegistrations();
      await loadActiveSemester();
  
      setTimeout(() => {
        window.showPopup?.(
          "Cập nhật thời gian đăng ký thành công."
        );
      }, 350);
  
    } catch (error) {
      console.error(
        "Lỗi cập nhật thời gian:",
        error
      );
  
      setTimeout(() => {
        window.showPopup?.(
          error.message ||
            "Không thể cập nhật thời gian đăng ký.",
          true
        );
      }, 350);
  
    } finally {
      setProcessing(false);
    }
  };

  const showOpenSemesterModal = () => {
    setOpenSemesterModal({
      show: true,
      semesterId: "",
    });
  };

  const closeOpenSemesterModal = () => {
    if (processing) {
      return;
    }

    setOpenSemesterModal(initialOpenSemesterModal);
  };

  const handleOpenRegistration = async () => {
    if (!openSemesterModal.semesterId) {
      window.showPopup?.("Vui lòng chọn học kỳ cần mở đăng ký.", true);

      return;
    }

    const semester = semesterRegistrations.find(
      (item) => String(item.id) === String(openSemesterModal.semesterId)
    );

    if (!semester) {
      window.showPopup?.("Không tìm thấy học kỳ.", true);

      return;
    }

    window.showPopup?.(
      `Bạn có chắc muốn mở đăng ký phòng cho ${semester.name}?`,
      false,
      true,
      async () => {
        try {
          setProcessing(true);

          const response = await fetch(
            `http://localhost:8080/api/admin/semester-registration/open/${semester.id}`,
            {
              method: "PUT",

              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await response.text();

          if (!response.ok) {
            throw new Error(message || "Không thể mở đăng ký phòng.");
          }

          window.showPopup?.(message || "Mở đăng ký phòng thành công.");

          setOpenSemesterModal(initialOpenSemesterModal);

          await loadSemesterRegistrations();
          await loadActiveSemester();
        } catch (error) {
          console.error("Lỗi mở đăng ký:", error);

          window.showPopup?.(
            error.message || "Lỗi khi mở đăng ký phòng.",
            true
          );
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  const handleCloseRegistration = () => {
    if (!activeSemester) {
      return;
    }

    window.showPopup?.(
      `Bạn có chắc muốn đóng đăng ký phòng cho ${activeSemester.name}?`,
      false,
      true,
      async () => {
        try {
          setProcessing(true);

          const response = await fetch(
            `http://localhost:8080/api/admin/semester-registration/close/${activeSemester.id}`,
            {
              method: "PUT",

              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await response.text();

          if (!response.ok) {
            throw new Error(message || "Không thể đóng đăng ký phòng.");
          }

          window.showPopup?.(message || "Đã đóng đăng ký phòng.");

          await loadSemesterRegistrations();
          await loadActiveSemester();
        } catch (error) {
          console.error("Lỗi đóng đăng ký:", error);

          window.showPopup?.(
            error.message || "Lỗi khi đóng đăng ký phòng.",
            true
          );
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  const handleApprove = (id) => {
    window.showPopup?.(
      "Bạn có chắc muốn duyệt đăng ký phòng này?",
      false,
      true,
      async () => {
        try {
          setProcessing(true);

          const response = await fetch(
            `http://localhost:8080/api/admin/contracts/approve/${id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await response.text();

          if (!response.ok) {
            throw new Error(message || "Không thể duyệt đăng ký phòng.");
          }

          // Cập nhật lại danh sách trước
          await reload();

          // Đợi popup xác nhận đóng hẳn
          setTimeout(() => {
            window.showPopup?.(message || "Duyệt đăng ký phòng thành công.");
          }, 350);
        } catch (error) {
          console.error("Lỗi duyệt đăng ký phòng:", error);

          setTimeout(() => {
            window.showPopup?.(
              error.message || "Lỗi khi duyệt đăng ký phòng.",
              true
            );
          }, 350);
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  const openActionModal = (contractId, type) => {
    setActionModal({
      show: true,
      contractId,
      type,
      reasonType: "",
      customReason: "",
    });
  };

  const closeActionModal = () => {
    if (processing) {
      return;
    }

    setActionModal(initialActionModal);
  };

  const confirmAction = async () => {
    const { contractId, type, reasonType, customReason } = actionModal;

    const reason = reasonType === "Khác" ? customReason.trim() : reasonType;

    if (!reason) {
      window.showPopup?.("Vui lòng chọn hoặc nhập lý do.", true);

      return;
    }

    try {
      setProcessing(true);

      const response = await fetch(
        `http://localhost:8080/api/admin/contracts/${type}/${contractId}?reason=${encodeURIComponent(
          reason
        )}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const message = await response.text();

      if (!response.ok) {
        throw new Error(
          message ||
            (type === "reject"
              ? "Không thể từ chối đăng ký phòng."
              : "Không thể hủy hợp đồng nội trú.")
        );
      }

      window.showPopup?.(
        message ||
          (type === "reject"
            ? "Từ chối đăng ký phòng thành công."
            : "Hủy hợp đồng nội trú thành công.")
      );

      setActionModal(initialActionModal);

      await reload();
    } catch (error) {
      console.error("Lỗi xử lý đăng ký phòng:", error);

      window.showPopup?.(
        error.message ||
          (type === "reject"
            ? "Lỗi khi từ chối đăng ký phòng."
            : "Lỗi khi hủy hợp đồng nội trú."),
        true
      );
    } finally {
      setProcessing(false);
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

  const formatSemesterDate = (month, day) => {
    if (!month || !day) {
      return "--/--";
    }

    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Chờ duyệt",
      ACTIVE: "Đã duyệt",
      REJECTED: "Đã từ chối",
      CANCELED: "Đã hủy",
      EXPIRED: "Hết hạn",
    };

    return statusMap[status] || status || "Chưa xác định";
  };

  const getRecordLabel = (contract) => {
    if (contract.status === "PENDING" || contract.status === "REJECTED") {
      return `Đăng ký #${contract.id}`;
    }

    return `Hợp đồng #${contract.id}`;
  };

  const countByStatus = (status) =>
    contracts.filter((contract) => contract.status === status).length;

  const clearFilters = () => {
    setStatusFilter("ALL");
    setStudentFilter("");
  };

  const isRejectAction = actionModal.type === "reject";

  return (
    <div className="admin-contract-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`admin-contract-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="contract-list-banner">
          <div>
            <div className="contract-list-banner-badge">
              <i className="fa fa-bed"></i>
              Quản lý đăng ký phòng
            </div>

            <h1>Danh sách đăng ký phòng</h1>

            <p>
              Theo dõi, xét duyệt, từ chối và xử lý các yêu cầu đăng ký phòng
              nội trú của sinh viên.
            </p>
          </div>

          <div className="contract-list-banner-icon">
            <i className="fa fa-door-open"></i>
          </div>
        </section>

        <section className="semester-management-panel">
          <div className="semester-management-info">
            <div className="semester-management-icon">
              <i className="fa fa-calendar"></i>
            </div>

            <div>
              <h2>Quản lý thời gian đăng ký</h2>

              {activeSemester ? (
                <p>
                  <strong>{activeSemester.name}</strong>
                  {" đang mở từ "}
                  {formatSemesterDate(
                    activeSemester.registerStartMonth,
                    activeSemester.registerStartDay
                  )}
                  {" đến "}
                  {formatSemesterDate(
                    activeSemester.registerEndMonth,
                    activeSemester.registerEndDay
                  )}
                  .
                </p>
              ) : (
                <p>Hiện tại hệ thống chưa mở đăng ký phòng.</p>
              )}
            </div>
          </div>

          <div className="semester-management-actions">
            <button
              type="button"
              className="semester-time-button"
              onClick={handleShowSemesterTimeModal}
              disabled={processing}
            >
              <i className="fa fa-calendar-alt"></i>
              Thời gian đăng ký
            </button>

            {activeSemester ? (
              <button
                type="button"
                className="semester-close-button"
                onClick={handleCloseRegistration}
                disabled={processing}
              >
                <i className="fa fa-lock"></i>
                Đóng đăng ký
              </button>
            ) : (
              <button
                type="button"
                className="semester-open-button"
                onClick={showOpenSemesterModal}
                disabled={processing}
              >
                <i className="fa fa-lock-open"></i>
                Mở đăng ký
              </button>
            )}
          </div>
        </section>

        <section className="contract-summary-grid">
          <div className="contract-summary-card total">
            <div className="contract-summary-icon">
              <i className="fa fa-list-alt"></i>
            </div>

            <div>
              <span>Tổng đăng ký phòng</span>

              <strong>{contracts.length}</strong>
            </div>
          </div>

          <div className="contract-summary-card pending">
            <div className="contract-summary-icon">
              <i className="fa fa-clock"></i>
            </div>

            <div>
              <span>Chờ duyệt</span>

              <strong>{countByStatus("PENDING")}</strong>
            </div>
          </div>

          <div className="contract-summary-card active">
            <div className="contract-summary-icon">
              <i className="fa fa-check-circle"></i>
            </div>

            <div>
              <span>Đã duyệt</span>

              <strong>{countByStatus("ACTIVE")}</strong>
            </div>
          </div>

          <div className="contract-summary-card ended">
            <div className="contract-summary-icon">
              <i className="fa fa-ban"></i>
            </div>

            <div>
              <span>Đã xử lý</span>

              <strong>
                {countByStatus("REJECTED") +
                  countByStatus("CANCELED") +
                  countByStatus("EXPIRED")}
              </strong>
            </div>
          </div>
        </section>

        <section className="contract-list-section">
          <div className="contract-list-toolbar">
            <div>
              <h2>Danh sách đăng ký phòng</h2>

              <p>Lọc đăng ký phòng theo sinh viên hoặc trạng thái xử lý.</p>
            </div>

            <span className="contract-result-count">
              {filteredContracts.length} kết quả
            </span>
          </div>

          <div className="contract-filter-panel">
            <div className="contract-filter-group">
              <label htmlFor="student-filter">Sinh viên</label>

              <div className="contract-search-input">
                <i className="fa fa-search"></i>

                <input
                  id="student-filter"
                  type="text"
                  placeholder="Nhập tên sinh viên..."
                  value={studentFilter}
                  onChange={(event) => setStudentFilter(event.target.value)}
                />
              </div>
            </div>

            <div className="contract-filter-group">
              <label htmlFor="status-filter">Trạng thái</label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>

                <option value="PENDING">Chờ duyệt</option>

                <option value="ACTIVE">Đã duyệt</option>

                <option value="REJECTED">Đã từ chối</option>

                <option value="CANCELED">Đã hủy</option>

                <option value="EXPIRED">Hết hạn</option>
              </select>
            </div>

            {(statusFilter !== "ALL" || studentFilter) && (
              <button
                type="button"
                className="contract-clear-filter"
                onClick={clearFilters}
              >
                <i className="fa fa-times"></i>
                Xóa bộ lọc
              </button>
            )}
          </div>

          {loading ? (
            <div className="contract-list-loading">
              <i className="fa fa-spinner fa-spin"></i>

              <p>Đang tải danh sách đăng ký phòng...</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="contract-list-empty">
              <div className="contract-empty-icon">
                <i className="fa fa-folder-open"></i>
              </div>

              <h3>Không có đăng ký phòng phù hợp</h3>

              <p>Không tìm thấy đăng ký phòng theo điều kiện lọc hiện tại.</p>
            </div>
          ) : (
            <div className="contract-table-wrapper">
              <table className="contract-table">
                <thead>
                  <tr>
                    <th>Sinh viên</th>

                    <th>Phòng đăng ký</th>

                    <th>Ngày bắt đầu</th>

                    <th>Ngày kết thúc</th>

                    <th>Trạng thái</th>

                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id}>
                      <td>
                        <div className="contract-student-cell">
                          <div className="contract-student-avatar">
                            {contract.studentName
                              ? contract.studentName
                                  .trim()
                                  .charAt(0)
                                  .toUpperCase()
                              : "S"}
                          </div>

                          <div>
                            <strong>
                              {contract.studentName || "Chưa cập nhật"}
                            </strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="contract-room-badge">
                          <i className="fa fa-door-open"></i>

                          {contract.roomName || "Chưa có phòng"}
                        </span>
                      </td>

                      <td>{formatDate(contract.startDate)}</td>

                      <td>{formatDate(contract.endDate)}</td>

                      <td>
                        <span
                          className={`contract-status-badge ${
                            contract.status ? contract.status.toLowerCase() : ""
                          }`}
                        >
                          {getStatusText(contract.status)}
                        </span>
                      </td>

                      <td>
                        <div className="contract-action-buttons">
                          <button
                            type="button"
                            className="contract-detail-button"
                            onClick={() =>
                              navigate(
                                `/admin/contract-detail?id=${contract.id}`,
                                {
                                  state: {
                                    statusFilter,
                                    studentFilter,
                                  },
                                }
                              )
                            }
                          >
                            <i className="fa fa-eye"></i>
                            Chi tiết
                          </button>

                          {contract.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                className="contract-approve-button"
                                disabled={processing}
                                onClick={() => handleApprove(contract.id)}
                              >
                                <i className="fa fa-check"></i>
                                Duyệt
                              </button>

                              <button
                                type="button"
                                className="contract-reject-button"
                                disabled={processing}
                                onClick={() =>
                                  openActionModal(contract.id, "reject")
                                }
                              >
                                <i className="fa fa-times"></i>
                                Từ chối
                              </button>
                            </>
                          )}

                          {contract.status === "ACTIVE" && (
                            <button
                              type="button"
                              className="contract-cancel-button"
                              disabled={processing}
                              onClick={() =>
                                openActionModal(contract.id, "cancel")
                              }
                            >
                              <i className="fa fa-ban"></i>
                              Hủy hợp đồng
                            </button>
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
      </main>

      {showSemesterTimeModal && (
        <div
          className="contract-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSemesterTimeModal();
            }
          }}
        >
          <div className="semester-time-modal">
            <div className="semester-time-modal-header">
              <div>
                <span>Quản lý đăng ký phòng</span>

                <h2>Thời gian đăng ký</h2>
              </div>

              <button
                type="button"
                onClick={closeSemesterTimeModal}
                disabled={processing}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="semester-time-modal-body">
              <div className="semester-time-note">
                <i className="fa fa-info-circle"></i>

                <p>
                  Thiết lập khoảng thời gian sinh viên được phép đăng ký phòng
                  cho từng học kỳ.
                </p>
              </div>

              {semesterTimes.map((semester) => (
                <div key={semester.id} className="semester-time-card">
                  <div className="semester-time-card-title">
                    <div>
                      <i className="fa fa-graduation-cap"></i>

                      <h3>{semester.name}</h3>
                    </div>

                    {semester.active && (
                      <span className="semester-card-active">Đang mở</span>
                    )}
                  </div>

                  <div className="semester-time-grid">
                    <div className="semester-time-group">
                      <label>Ngày bắt đầu</label>

                      <input
                        type="date"
                        value={semester.registerStartDate}
                        onChange={(event) =>
                          handleSemesterDateChange(
                            semester.id,
                            "registerStartDate",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="semester-time-group">
                      <label>Ngày kết thúc</label>

                      <input
                        type="date"
                        min={semester.registerStartDate || undefined}
                        value={semester.registerEndDate}
                        onChange={(event) =>
                          handleSemesterDateChange(
                            semester.id,
                            "registerEndDate",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="semester-contract-info">
                    <i className="fa fa-file-text"></i>

                    <span>Thời gian hợp đồng:</span>

                    <strong>
                      {formatSemesterDate(
                        semester.contractStartMonth,
                        semester.contractStartDay
                      )}
                      {" - "}
                      {formatSemesterDate(
                        semester.contractEndMonth,
                        semester.contractEndDay
                      )}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="semester-time-modal-footer">
              <button
                type="button"
                className="semester-time-cancel"
                onClick={closeSemesterTimeModal}
                disabled={processing}
              >
                Hủy
              </button>

              <button
                type="button"
                className="semester-time-save"
                onClick={handleSaveSemesterTimes}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="fa fa-save"></i>
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {openSemesterModal.show && (
        <div
          className="contract-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeOpenSemesterModal();
            }
          }}
        >
          <div className="contract-action-modal">
            <div className="contract-modal-header semester">
              <div>
                <span>Quản lý đăng ký phòng</span>

                <h2>Mở đăng ký</h2>
              </div>

              <button
                type="button"
                className="contract-modal-close"
                onClick={closeOpenSemesterModal}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="contract-modal-body">
              <div className="contract-modal-warning semester-warning">
                <div>
                  <i className="fa fa-calendar"></i>
                </div>

                <p>
                  Chọn học kỳ muốn mở đăng ký. Sinh viên chỉ đăng ký được trong
                  thời gian đã thiết lập.
                </p>
              </div>

              <div className="contract-modal-form-group">
                <label>
                  Học kỳ
                  <span>*</span>
                </label>

                <select
                  value={openSemesterModal.semesterId}
                  onChange={(event) =>
                    setOpenSemesterModal((previous) => ({
                      ...previous,

                      semesterId: event.target.value,
                    }))
                  }
                >
                  <option value="">-- Chọn học kỳ --</option>

                  {semesterRegistrations.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </div>

              {openSemesterModal.semesterId && (
                <div className="open-semester-preview">
                  {(() => {
                    const semester = semesterRegistrations.find(
                      (item) =>
                        String(item.id) === String(openSemesterModal.semesterId)
                    );

                    if (!semester) {
                      return null;
                    }

                    return (
                      <>
                        <div>
                          <span>Thời gian đăng ký</span>

                          <strong>
                            {formatSemesterDate(
                              semester.registerStartMonth,
                              semester.registerStartDay
                            )}
                            {" - "}
                            {formatSemesterDate(
                              semester.registerEndMonth,
                              semester.registerEndDay
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Thời gian hợp đồng</span>

                          <strong>
                            {formatSemesterDate(
                              semester.contractStartMonth,
                              semester.contractStartDay
                            )}
                            {" - "}
                            {formatSemesterDate(
                              semester.contractEndMonth,
                              semester.contractEndDay
                            )}
                          </strong>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="contract-modal-footer">
              <button
                type="button"
                className="contract-modal-cancel-button"
                onClick={closeOpenSemesterModal}
              >
                Hủy
              </button>

              <button
                type="button"
                className="semester-open-confirm-button"
                onClick={handleOpenRegistration}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fa fa-lock-open"></i>
                    Mở đăng ký
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {actionModal.show && (
        <div
          className="contract-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeActionModal();
            }
          }}
        >
          <div className="contract-action-modal">
            <div
              className={`contract-modal-header ${
                actionModal.type === "cancel" ? "cancel" : "reject"
              }`}
            >
              <div>
                <span>
                  {isRejectAction
                    ? "Xử lý đăng ký phòng"
                    : "Xử lý hợp đồng nội trú"}
                </span>

                <h2>
                  {isRejectAction
                    ? "Từ chối đăng ký phòng"
                    : "Hủy hợp đồng nội trú"}
                </h2>
              </div>

              <button
                type="button"
                className="contract-modal-close"
                onClick={closeActionModal}
                disabled={processing}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="contract-modal-body">
              <div className="contract-modal-warning">
                <div>
                  <i className="fa fa-exclamation-triangle"></i>
                </div>

                <p>
                  {isRejectAction
                    ? "Đăng ký phòng sẽ bị từ chối và sinh viên sẽ nhận được thông báo."
                    : "Hợp đồng nội trú đang hiệu lực sẽ bị hủy. Vui lòng kiểm tra kỹ trước khi xác nhận."}
                </p>
              </div>

              <div className="contract-modal-form-group">
                <label>
                  Lý do
                  <span>*</span>
                </label>

                <select
                  value={actionModal.reasonType}
                  onChange={(event) =>
                    setActionModal((previous) => ({
                      ...previous,

                      reasonType: event.target.value,

                      customReason:
                        event.target.value === "Khác"
                          ? previous.customReason
                          : "",
                    }))
                  }
                >
                  <option value="">-- Chọn lý do --</option>

                  {isRejectAction ? (
                    <>
                      <option value="Không đủ điều kiện">
                        Không đủ điều kiện đăng ký phòng
                      </option>

                      <option value="Hết phòng">Ký túc xá đã hết phòng</option>

                      <option value="Sai thông tin">
                        Thông tin đăng ký không chính xác
                      </option>

                      <option value="Phòng đang bảo trì">
                        Phòng đang bảo trì
                      </option>

                      <option value="Khác">Lý do khác</option>
                    </>
                  ) : (
                    <>
                      <option value="Sinh viên yêu cầu hủy">
                        Sinh viên yêu cầu hủy
                      </option>

                      <option value="Vi phạm nội quy ký túc xá">
                        Vi phạm nội quy ký túc xá
                      </option>

                      <option value="Không hoàn thành nghĩa vụ thanh toán">
                        Không hoàn thành nghĩa vụ thanh toán
                      </option>

                      <option value="Kết thúc lưu trú trước thời hạn">
                        Kết thúc lưu trú trước thời hạn
                      </option>

                      <option value="Khác">Lý do khác</option>
                    </>
                  )}
                </select>
              </div>

              {actionModal.reasonType === "Khác" && (
                <div className="contract-modal-form-group">
                  <label>
                    Nhập lý do khác
                    <span>*</span>
                  </label>

                  <textarea
                    rows="5"
                    maxLength="500"
                    value={actionModal.customReason}
                    onChange={(event) =>
                      setActionModal((previous) => ({
                        ...previous,

                        customReason: event.target.value,
                      }))
                    }
                  />

                  <small>
                    {actionModal.customReason.length}
                    /500 ký tự
                  </small>
                </div>
              )}
            </div>

            <div className="contract-modal-footer">
              <button
                type="button"
                className="contract-modal-cancel-button"
                onClick={closeActionModal}
                disabled={processing}
              >
                Đóng
              </button>

              <button
                type="button"
                className="contract-modal-confirm-button"
                onClick={confirmAction}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i
                      className={`fa ${
                        isRejectAction ? "fa-times-circle" : "fa-ban"
                      }`}
                    ></i>

                    {isRejectAction
                      ? "Xác nhận từ chối"
                      : "Xác nhận hủy hợp đồng"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
