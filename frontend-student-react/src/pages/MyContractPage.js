import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Script from "../components/Script";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MyContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedContractId, setSelectedContractId] = useState(null);

  const navigate = useNavigate();

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
        throw new Error("Không thể tải danh sách hợp đồng");
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
        `http://localhost:8080/api/student/contracts/cancel/${selectedContractId}?reason=${encodeURIComponent(cancelReason)}`,
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
        data = { message: text };
      }
  
      if (!res.ok) {
        throw new Error(data.message || "Không thể hủy hợp đồng");
      }
  
      window.showPopup?.("Hủy hợp đồng thành công!", false);
  
      setContracts(prev =>
        prev.map(c =>
          c.id === selectedContractId
            ? { ...c, status: "CANCELED" }
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
    return <p style={{ padding: 20 }}>Đang tải hợp đồng...</p>;
  }

  return (
    <div>
      <Header />
      <Sidebar />

      <div
        className="content-wrapper"
        style={{
          paddingTop: "50px",      
          paddingBottom: "40px",
          minHeight: "100vh",
        }}
      >
        <div className="container-fluid py-4 content-body">

          <h3 className="page-title">Hợp đồng của tôi</h3>

          <div className="filter-bar">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="ACTIVE">Đang hiệu lực</option>
              <option value="CANCELED">Đã hủy</option>
              <option value="EXPIRED">Hết hạn</option>
              <option value="REJECTED">Bị từ chối</option>
            </select>
          </div>

          {filteredContracts.length === 0 ? (
            <p>Không có hợp đồng.</p>
          ) : (
            filteredContracts.map((c) => (
              <div
                key={c.id}
                className={`contract-card status-${c.status.toLowerCase()}`}
              >
                <div>
                  <div className="title">
                    Hợp đồng phòng {c.roomName}
                  </div>

                  <div className="date">
                    {new Date(c.startDate).toLocaleDateString("vi-VN")}
                    {" → "}
                    {new Date(c.endDate).toLocaleDateString("vi-VN")}
                  </div>

                  <span className={`status ${c.status.toLowerCase()}`}>
                    {c.status === "PENDING" && "Chờ duyệt"}
                    {c.status === "ACTIVE" && "Đang hiệu lực"}
                    {c.status === "CANCELED" && "Đã hủy"}
                    {c.status === "EXPIRED" && "Hết hạn"}
                    {c.status === "REJECTED" && "Bị từ chối"}
                  </span>
                </div>

                <div className="actions">
                  <button
                    type="button"
                    className="btn-detail"
                    onClick={() =>
                      navigate("/contract-detail", {
                        state: { id: c.id },
                      })
                    }
                  >
                    Xem
                  </button>

                  {c.status === "PENDING" && (
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setSelectedContractId(c.id);
                        setCancelReason("");
                        setShowCancelModal(true);
                      }}
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {showCancelModal && (
  <div className="modal-backdrop-custom">
    <div className="cancel-modal">

      <div className="modal-header-custom">
        <h4>Hủy hợp đồng</h4>
      </div>

      <div className="modal-body-custom">

        <p>
          Vui lòng nhập lý do hủy hợp đồng:
        </p>

        <textarea
          rows="5"
          className="reason-input"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Ví dụ: Không còn nhu cầu ở ký túc xá..."
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
          Xác nhận hủy
        </button>

      </div>

    </div>
  </div>
)}
      <Script />

      <style>{`
        .content-body {
          max-width: 900px;
        }

        .page-title {
          text-align: center;
          font-size: 34px;
          font-weight: 700;
          color: #2c3e50;
          margin: 20px 0 35px;
          position: relative;
          letter-spacing: 0.5px;
        }

        .page-title::after {
          content: "";
          display: block;
          width: 90px;
          height: 4px;
          background: linear-gradient(90deg, #4BA3FF, #00C6FF);
          margin: 14px auto 0;
          border-radius: 50px;
        }

        .filter-bar {
          margin-bottom: 16px;
          max-width: 250px;
        }

        .filter-bar select {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .contract-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-radius: 14px;
          margin-bottom: 14px;
          background: #fff;
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          border-left: 6px solid #ccc;
          transition: 0.2s;
        }

        .contract-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.1);
        }

        .contract-card.status-active {
          border-left-color: #10b981;
        }

        .contract-card.status-pending {
          border-left-color: #f59e0b;
        }

        .contract-card.status-canceled {
          border-left-color: #ef4444;
          background: #fff5f5;
        }

        .contract-card.status-expired {
          border-left-color: #9ca3af;
          background: #f9fafb;
        }

        .contract-card.status-rejected {
          border-left-color: #dc2626;
          background: #fff1f2;
        }

        .title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .date {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 6px;
        }

        .status {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .status.active {
          background: #d1fae5;
          color: #10b981;
        }

        .status.pending {
          background: #fef3c7;
          color: #d97706;
        }

        .status.canceled {
          background: #fee2e2;
          color: #ef4444;
        }

        .status.expired {
          background: #e5e7eb;
          color: #6b7280;
        }

        .status.rejected {
          background: #fee2e2;
          color: #b91c1c;
        }

        .actions button {
          margin-left: 8px;
          padding: 8px 14px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-detail {
          background: #3b82f6;
          color: white;
        }

        .btn-cancel {
          background: #ef4444;
          color: white;
        }

        .modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.cancel-modal {
  width: 550px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
}

.modal-header-custom {
  padding: 18px 22px;
  border-bottom: 1px solid #eee;
}

.modal-header-custom h4 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.modal-body-custom {
  padding: 22px;
}

.modal-body-custom p {
  margin-bottom: 12px;
}

.reason-input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  resize: none;
  outline: none;
}

.reason-input:focus {
  border-color: #3b82f6;
}

.modal-footer-custom {
  padding: 18px 22px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-close-modal {
  border: none;
  background: #6b7280;
  color: white;
  padding: 8px 18px;
  border-radius: 8px;
}

.btn-confirm-cancel {
  border: none;
  background: #ef4444;
  color: white;
  padding: 8px 18px;
  border-radius: 8px;
}

.btn-confirm-cancel:hover {
  background: #dc2626;
}
      `}</style>
    </div>
  );
}