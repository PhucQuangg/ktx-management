import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

import "../css/MyContracts.css";

export default function MyContracts() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedContractId, setSelectedContractId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const token = sessionStorage.getItem("token");

      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/api/student/contracts/my-contracts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Không thể tải danh sách hợp đồng.");
      }

      const data = await res.json();

      setContracts(data);
    } catch (err) {
      console.error(err);

      window.showPopup?.(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const cancelContract = async () => {
    if (!cancelReason.trim()) {
      window.showPopup?.("Vui lòng nhập lý do hủy!", true);

      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/student/contracts/cancel/${selectedContractId}?reason=${encodeURIComponent(
          cancelReason
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await res.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {
          message: text,
        };
      }

      if (!res.ok) {
        throw new Error(data.message || "Không thể hủy hợp đồng.");
      }

      window.showPopup?.("Hủy hợp đồng thành công!", false);

      setContracts((prev) =>
        prev.map((c) =>
          c.id === selectedContractId
            ? {
                ...c,
                status: "CANCELED",
              }
            : c
        )
      );

      setShowCancelModal(false);
      setCancelReason("");
      setSelectedContractId(null);
    } catch (err) {
      console.error(err);

      window.showPopup?.(err.message, true);
    }
  };

  const filteredContracts = contracts.filter(
    (c) => !statusFilter || c.status === statusFilter
  );

  if (loading) {
    return (
      <div className="loading-page">
        <i className="fa fa-spinner fa-spin"></i>

        <p>Đang tải hợp đồng...</p>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} />

      <div
        className="content-wrapper"
        style={{
          marginLeft: sidebarOpen ? "260px" : "80px",

          transition: ".3s",

          marginTop: "65px",
        }}
      >
        <div className="contracts-container">
          <div className="contracts-banner">
            <div>
              <h2>
                <i className="fa fa-file-text-o"></i>
                Đăng ký phòng của tôi
              </h2>

              <p>
                Theo dõi trạng thái hợp đồng, xem chi tiết hoặc gửi yêu cầu hủy
                hợp đồng nội trú.
              </p>
            </div>
          </div>

          <div className="contracts-toolbar">
            <h4>Danh sách đăng ký phòng</h4>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>

              <option value="PENDING">Chờ duyệt</option>

              <option value="ACTIVE">Đang hiệu lực</option>

              <option value="CANCELED">Đã hủy</option>

              <option value="EXPIRED">Hết hạn</option>

              <option value="REJECTED">Bị từ chối</option>
            </select>
          </div>

          {filteredContracts.length === 0 ? (
            <div className="empty-contract">
              <i className="fa fa-folder-open-o"></i>

              <h3>Chưa có hợp đồng</h3>

              <p>Hiện tại bạn chưa có hợp đồng nội trú nào.</p>
            </div>
          ) : (
            <div className="contract-list">
              {filteredContracts.map((c) => (
                <div
                  key={c.id}
                  className={`contract-card status-${c.status.toLowerCase()}`}
                >
                  <div className="contract-left">
                    <div className="contract-icon">
                      <i className="fa fa-home"></i>
                    </div>

                    <div className="contract-info">
                      <h3>Phòng {c.roomName}</h3>

                      <div className="contract-date">
                        <i className="fa fa-calendar"></i>

                        <span>
                          {new Date(c.startDate).toLocaleDateString("vi-VN")}

                          {"  →  "}

                          {new Date(c.endDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      <div className="contract-status">
                        <span
                          className={`status-badge ${c.status.toLowerCase()}`}
                        >
                          {c.status === "PENDING" && "Chờ duyệt"}

                          {c.status === "ACTIVE" && "Đang hiệu lực"}

                          {c.status === "CANCELED" && "Đã hủy"}

                          {c.status === "EXPIRED" && "Hết hạn"}

                          {c.status === "REJECTED" && "Bị từ chối"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="contract-right">
                    <button
                      className="btn-detail"
                      onClick={() =>
                        navigate("/contract-detail", {
                          state: {
                            id: c.id,
                          },
                        })
                      }
                    >
                      <i
                        className="fa fa-eye"
                        style={{ paddingRight: "10px" }}
                      ></i>
                      Chi tiết
                    </button>

                    {c.status === "PENDING" && (
                      <button
                        className="btn-cancel"
                        onClick={() => {
                          setSelectedContractId(c.id);

                          setCancelReason("");

                          setShowCancelModal(true);
                        }}
                      >
                        <i
                          className="fa fa-times-circle"
                          style={{ paddingRight: "10px" }}
                        ></i>
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showCancelModal && (
            <div className="modal-backdrop-custom">
              <div className="cancel-modal">
                <div className="modal-header-custom">
                  <h3>
                    <i className="fa fa-warning"></i>
                    Xác nhận hủy hợp đồng
                  </h3>
                </div>

                <div className="modal-body-custom">
                  <p>Vui lòng nhập lý do hủy hợp đồng.</p>

                  <textarea
                    rows="5"
                    className="reason-input"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Nhập lý do..."
                  />
                </div>

                <div className="modal-footer-custom">
                  <button
                    className="btn-close-modal"
                    onClick={() => {
                      setShowCancelModal(false);

                      setCancelReason("");

                      setSelectedContractId(null);
                    }}
                  >
                    Đóng
                  </button>

                  <button
                    className="btn-confirm-cancel"
                    onClick={cancelContract}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Script />
    </div>
  );
}
