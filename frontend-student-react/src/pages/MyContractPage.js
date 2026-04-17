import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Script from "../components/Script";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MyContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(""); // ✅ FILTER

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  const fetchContracts = () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);

    fetch("http://localhost:8080/api/student/contracts/my-contracts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setContracts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const cancelContract = (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy hợp đồng này?")) return;

    const token = sessionStorage.getItem("token");

    fetch(`http://localhost:8080/api/student/contracts/cancel/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        window.showPopup("Hủy thành công!", false);
        fetchContracts();
      })
      .catch(err => window.showPopup(err.message, true));
  };

  // ✅ FILTER LOGIC
  const filteredContracts = contracts.filter(c =>
    !statusFilter || c.status === statusFilter
  );

  if (loading) return <p style={{ padding: 20 }}>Đang tải hợp đồng...</p>;

  return (
    <div>
      <Header />
      <Sidebar />

      <div className="content-wrapper">
        <div className="container-fluid py-4 content-body">

          {/* TITLE */}
          <h3 className="page-title">Hợp đồng của tôi</h3>

          {/* FILTER */}
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

          {/* LIST */}
          {filteredContracts.length === 0 ? (
            <p>Không có hợp đồng.</p>
          ) : (
            filteredContracts.map(c => (
              <div
                key={c.id}
                className={`contract-card status-${c.status.toLowerCase()}`}
              >
                {/* LEFT */}
                <div>
                  <div className="title">
                    Hợp đồng phòng {c.roomName}
                  </div>

                  <div className="date">
                    {new Date(c.startDate).toLocaleDateString("vi-VN")} →{" "}
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

                {/* RIGHT */}
                <div className="actions">
                  <button
                    className="btn-detail"
                    onClick={() =>
                      navigate("/contract-detail", { state: { id: c.id } })
                    }
                  >
                    Xem
                  </button>

                  {c.status === "PENDING" && (
                    <button
                      className="btn-cancel"
                      onClick={() => cancelContract(c.id)}
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

      <Script />

      <style>{`
        .content-body {
          max-width: 900px;
        }

        .page-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        /* FILTER */
        .filter-bar {
          margin-bottom: 16px;
          max-width: 250px;
        }

        .filter-bar select {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #ddd;
        }

        /* CARD */
        .contract-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-radius: 14px;
          margin-bottom: 14px;
          background: #fff;
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          transition: 0.2s;
          border-left: 6px solid #ccc;
        }

        .contract-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.1);
        }

        /* STATUS BORDER */
        .contract-card.status-active {
          border-left: 6px solid #10b981;
        }

        .contract-card.status-pending {
          border-left: 6px solid #f59e0b;
        }

        .contract-card.status-canceled {
          border-left: 6px solid #ef4444;
          background: #fff5f5;
        }

        .contract-card.status-expired {
          border-left: 6px solid #9ca3af;
          background: #f9fafb;
        }

        .contract-card.status-rejected {
          border-left: 6px solid #ef4444;
          background: #fff1f2;
        }

        /* TEXT */
        .title {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .date {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 6px;
        }

        /* BADGE */
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

        /* BUTTON */
        .actions button {
          margin-left: 8px;
          padding: 7px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .btn-detail {
          background: #3b82f6;
          color: #fff;
        }

        .btn-cancel {
          background: #ef4444;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
