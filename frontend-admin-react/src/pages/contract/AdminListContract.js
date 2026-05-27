
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import Script from "../../components/Script";
import { useNavigate } from "react-router-dom";

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [sidebarColor, setSidebarColor] = useState("bg-white");
  const navigate = useNavigate();

  // ===== FILTER =====
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [studentFilter, setStudentFilter] = useState("");

  // 🔥 Modal từ chối / hủy
  const [actionModal, setActionModal] = useState({
    show: false,
    contractId: null,
    type: "",
    reasonType: "",
    customReason: ""
  });

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) return;
    reload();
  }, [token]);

  // ===== FILTER LOGIC =====
  useEffect(() => {
    let result = [...contracts];

    // lọc trạng thái
    if (statusFilter !== "ALL") {
      result = result.filter(c => c.status === statusFilter);
    }

    // lọc tên sinh viên
    if (studentFilter.trim() !== "") {
      result = result.filter(c =>
        c.studentName
          ?.toLowerCase()
          .includes(studentFilter.toLowerCase())
      );
    }

    setFilteredContracts(result);
  }, [contracts, statusFilter, studentFilter]);

  const reload = () => {
    fetch("http://localhost:8080/api/admin/contracts", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => {
        setContracts(data);
        setFilteredContracts(data);
      });
  };

  // ===== APPROVE =====
  const handleApprove = (id) => {
    window.showPopup(
      "Bạn có chắc muốn duyệt hợp đồng này?",
      false,
      true,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/admin/contracts/approve/${id}`,
            {
              method: "PUT",
              headers: { Authorization: "Bearer " + token },
            }
          );

          const message = await res.text();

          if (res.ok) {
            window.showPopup(message || "Duyệt thành công!");
            reload();
          } else {
            window.showPopup(message, true);
          }
        } catch {
          window.showPopup("Lỗi server!", true);
        }
      }
    );
  };

  // ===== OPEN MODAL =====
  const openActionModal = (id, type) => {
    setActionModal({
      show: true,
      contractId: id,
      type,
      reasonType: "",
      customReason: ""
    });
  };

  // ===== CONFIRM =====
  const confirmAction = async () => {
    const { contractId, type, reasonType, customReason } = actionModal;

    const reason = reasonType === "Khác"
      ? customReason
      : reasonType;

    if (!reason) {
      return window.showPopup("Vui lòng nhập lý do!", true);
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/contracts/${type}/${contractId}?reason=${encodeURIComponent(reason)}`,
        {
          method: "PUT",
          headers: { Authorization: "Bearer " + token },
        }
      );

      const message = await res.text();

      if (res.ok) {
        window.showPopup(message);

        setActionModal({
          show: false,
          contractId: null,
          type: "",
          reasonType: "",
          customReason: ""
        });

        reload();
      } else {
        window.showPopup(message, true);
      }
    } catch {
      window.showPopup("Lỗi server!", true);
    }
  };

  // ===== STATUS =====
  const renderStatus = (status) => {
    const map = {
      PENDING: {
        text: "Chờ duyệt",
        class: "text-warning"
      },
      ACTIVE: {
        text: "Đã duyệt",
        class: "text-success"
      },
      REJECTED: {
        text: "Đã từ chối",
        class: "text-danger"
      },
      CANCELED: {
        text: "Đã hủy",
        class: "text-danger"
      },
      EXPIRED: {
        text: "Hết hạn",
        class: "text-secondary"
      },
    };

    const s = map[status] || {
      text: status,
      class: ""
    };

    return (
      <span className={`fw-bold ${s.class}`}>
        {s.text}
      </span>
    );
  };

  return (
    <div className="g-sidenav-show">
      <Sidebar color={sidebarColor} />

      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">

        {/* NAVBAR */}
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
                  Quản lý hợp đồng
                </li>
              </ol>
            </nav>
          </div>
        </nav>

        {/* TABLE */}
        <div className="container-fluid py-2">
          <div className="card my-4">

            {/* HEADER */}
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">
                  Danh sách hợp đồng
                </h6>
              </div>
            </div>

            {/* FILTER */}
            <div className="d-flex justify-content-between align-items-center px-4 pt-4 flex-wrap gap-2">

              <div className="d-flex gap-2 flex-wrap">

                {/* TÊN SINH VIÊN */}
                <input
                  type="text"
                  placeholder="Tìm theo tên sinh viên..."
                  className="form-control border border-dark"
                  style={{ width: "250px" }}
                  value={studentFilter}
                  onChange={(e) =>
                    setStudentFilter(e.target.value)
                  }
                />

                {/* TRẠNG THÁI */}
                <select
                  className="form-select border border-dark"
                  style={{ width: "220px" }}
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="PENDING">Chờ duyệt</option>
                  <option value="ACTIVE">Đã duyệt</option>
                  <option value="REJECTED">Đã từ chối</option>
                  <option value="CANCELED">Đã hủy</option>
                  <option value="EXPIRED">Hết hạn</option>
                </select>

              </div>
            </div>

            <div className="card-body p-0">
              <table className="table text-center">
                <thead>
                  <tr>
                    <th>Sinh viên</th>
                    <th>Phòng</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContracts.length > 0 ? (
                    filteredContracts.map(c => (
                      <tr key={c.id}>
                        <td>{c.studentName}</td>
                        <td>{c.roomName}</td>
                        <td>{c.startDate}</td>
                        <td>{c.endDate}</td>
                        <td>{renderStatus(c.status)}</td>

                        <td>
                        {/* XEM */}
                        <i
                          className="fa-solid fa-eye text-info me-3"
                          style={{ cursor: "pointer" }}
                          title="Xem chi tiết"
                          onClick={() =>
                            navigate(`/admin/contract-detail?id=${c.id}`)
                          }
                        ></i>

                        {/* DUYỆT */}
                        {c.status === "PENDING" && (
                          <>
                            <i
                              className="fa-solid fa-check text-success me-3"
                              style={{ cursor: "pointer" }}
                              title="Duyệt hợp đồng"
                              onClick={() => handleApprove(c.id)}
                            ></i>

                            <i
                              className="fa-solid fa-xmark text-danger"
                              style={{ cursor: "pointer" }}
                              title="Từ chối hợp đồng"
                              onClick={() => openActionModal(c.id, "reject")}
                            ></i>
                          </>
                        )}

                        {/* HỦY */}
                        {c.status === "ACTIVE" && (
                          <i
                            className="fa-solid fa-ban text-warning"
                            style={{ cursor: "pointer" }}
                            title="Hủy hợp đồng"
                            onClick={() => openActionModal(c.id, "cancel")}
                          ></i>
                        )}
                      </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {actionModal.show && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header bg-danger text-white">
                <h5
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    width: "100%"
                  }}
                >
                  {actionModal.type === "reject"
                    ? "Từ chối hợp đồng"
                    : "Hủy hợp đồng"}
                </h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setActionModal({ show: false })
                  }
                ></button>
              </div>

              <div className="modal-body">
                <select
                  className="form-select mb-3"
                  value={actionModal.reasonType}
                  onChange={(e) =>
                    setActionModal(prev => ({
                      ...prev,
                      reasonType: e.target.value
                    }))
                  }
                >
                  <option value="">
                    -- Chọn lý do --
                  </option>

                  <option value="Không đủ điều kiện">
                    Không đủ điều kiện
                  </option>

                  <option value="Hết phòng">
                    Hết phòng
                  </option>

                  <option value="Sai thông tin">
                    Sai thông tin
                  </option>

                  <option value="Khác">
                    Khác
                  </option>
                </select>

                {actionModal.reasonType === "Khác" && (
                  <textarea
                    className="form-control"
                    placeholder="Nhập lý do..."
                    value={actionModal.customReason}
                    onChange={(e) =>
                      setActionModal(prev => ({
                        ...prev,
                        customReason: e.target.value
                      }))
                    }
                  />
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setActionModal({ show: false })
                  }
                >
                  Hủy
                </button>

                <button
                  className="btn btn-danger"
                  onClick={confirmAction}
                >
                  Xác nhận
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <SettingsPanel
        sidebarColor={sidebarColor}
        setSidebarColor={setSidebarColor}
      />

      <Script />
    </div>
  );
}

