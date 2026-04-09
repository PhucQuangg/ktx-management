import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import Script from "../../components/Script";
import { useNavigate } from "react-router-dom";


export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [sidebarColor, setSidebarColor] = useState("bg-white");
  const navigate = useNavigate();


  // 🔥 Modal từ chối / hủy
  const [actionModal, setActionModal] = useState({
    show: false,
    contractId: null,
    type: "", // reject | cancel
    reasonType: "",
    customReason: ""
  });

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) return;
    reload();
  }, [token]);

  const reload = () => {
    fetch("http://localhost:8080/api/admin/contracts", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => setContracts(data));
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

  // ===== CONFIRM REJECT / CANCEL =====
  const confirmAction = async () => {
    const { contractId, type, reasonType, customReason } = actionModal;

    const reason = reasonType === "Khác" ? customReason : reasonType;

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
      PENDING: { text: "Chờ duyệt", class: "text-warning" },
      ACTIVE: { text: "Đã duyệt", class: "text-success" },
      REJECTED: { text: "Đã từ chối", class: "text-danger" },
      CANCELED: { text: "Đã hủy", class: "text-danger" },
      EXPIRED: { text: "Hết hạn", class: "text-secondary" },
    };

    const s = map[status] || { text: status, class: "" };

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

        {/* TABLE */}
        <div className="container-fluid py-2">
          <div className="card my-4">
            <div className="card-header bg-dark text-white">
              Danh sách hợp đồng
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
                  {contracts.length > 0 ? (
                    contracts.map(c => (
                      <tr key={c.id}>
                        <td>{c.studentName}</td>
                        <td>{c.roomName}</td>
                        <td>{c.startDate}</td>
                        <td>{c.endDate}</td>
                        <td>{renderStatus(c.status)}</td>

                        <td>
                        {/* ===== NÚT XEM (LUÔN CÓ) ===== */}
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => navigate(`/admin/contract-detail?id=${c.id}`)}
                        >
                          Xem
                        </button>

                        {c.status === "PENDING" && (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handleApprove(c.id)}
                            >
                              Duyệt
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => openActionModal(c.id, "reject")}
                            >
                              Từ chối
                            </button>
                          </>
                        )}

                        {c.status === "ACTIVE" && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => openActionModal(c.id, "cancel")}
                          >
                            Hủy
                          </button>
                        )}

                        
                      </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* ===== MODAL ===== */}
      {actionModal.show && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header bg-danger text-white">
                <h5 style={{ color: "#FFF", textAlign: "center", width: "100%" }}>
                  {actionModal.type === "reject" ? "Từ chối hợp đồng" : "Hủy hợp đồng"}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setActionModal({ show: false })}
                ></button>
              </div>

              <div className="modal-body">
                <select
                  className="form-select mb-3"
                  value={actionModal.reasonType}
                  onChange={(e) =>
                    setActionModal(prev => ({ ...prev, reasonType: e.target.value }))
                  }
                >
                  <option value="">-- Chọn lý do --</option>
                  <option value="Không đủ điều kiện">Không đủ điều kiện</option>
                  <option value="Hết phòng">Hết phòng</option>
                  <option value="Sai thông tin">Sai thông tin</option>
                  <option value="Khác">Khác</option>
                </select>

                {actionModal.reasonType === "Khác" && (
                  <textarea
                    className="form-control"
                    placeholder="Nhập lý do..."
                    value={actionModal.customReason}
                    onChange={(e) =>
                      setActionModal(prev => ({ ...prev, customReason: e.target.value }))
                    }
                  />
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setActionModal({ show: false })}
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

      <SettingsPanel sidebarColor={sidebarColor} setSidebarColor={setSidebarColor} />
      <Script />
    </div>
  );
}
