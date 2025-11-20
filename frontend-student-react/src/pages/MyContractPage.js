import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Script from "../components/Script";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MyContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        if (!res.ok) throw new Error(data.message || "Lỗi khi hủy hợp đồng");
        window.showPopup("Hủy hợp đồng thành công!", false);
        fetchContracts(); // reload list
      })
      .catch(err => window.showPopup(err.message, true));
  };

  if (loading) return <p>Đang tải hợp đồng...</p>;

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <div className="container" style={{ padding: 20 }}>
          <h2>Hợp đồng của tôi</h2>
          {contracts.length === 0 ? (
            <p>Chưa có hợp đồng nào.</p>
          ) : (
            contracts.map(c => (
              <div key={c.id} className="contract-card">
                <div className="info">
                  <div><strong>Phòng:</strong> {c.roomName}</div>
                  <div><strong>Ngày bắt đầu:</strong> {c.startDate}</div>
                  <div><strong>Ngày kết thúc:</strong> {c.endDate}</div>
                  <div>
                    <strong>Trạng thái:</strong>{" "}
                    <span className={`status status-${c.status.toLowerCase()}`}>{c.status}</span>
                  </div>
                </div>
                <div className="actions">
                  <button onClick={() => navigate(`/contract?id=${c.id}`)}>Xem chi tiết</button>
                  {c.status === "PENDING" && (
                    <button className="btn-cancel" onClick={() => cancelContract(c.id)}>Hủy hợp đồng</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Script />
      <style>{`
        .contract-card {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          margin-bottom: 12px;
          background: #fff;
        }
        .actions button {
          margin-left: 8px;
          padding: 6px 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-cancel { background: #ef4444; color: #fff; }
        .status { font-weight: 700; }
        .status-pending { color: #f59e0b; }
        .status-active { color: #10b981; }
        .status-canceled { color: #6b7280; }
        .status-expired { color: #9ca3af; }
      `}</style>
    </div>
  );
}
