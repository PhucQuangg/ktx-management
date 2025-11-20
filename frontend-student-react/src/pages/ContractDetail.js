import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

export default function ContractDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id"); // lấy id từ query string

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const fetchContract = () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    fetch(`http://localhost:8080/api/student/contracts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setContract(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) fetchContract();
  }, [id]);

  const cancelContract = () => {
    if (!window.confirm("Bạn có chắc muốn hủy hợp đồng này?")) return;
    setLoadingCancel(true);
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:8080/api/student/contracts/cancel/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Hủy hợp đồng thất bại");
        window.showPopup("Hủy hợp đồng thành công!", false);
        fetchContract(); // reload data
      })
      .catch(err => window.showPopup(err.message, true))
      .finally(() => setLoadingCancel(false));
  };

  if (loading) return <p>Đang tải...</p>;
  if (!contract) return <p>Không tìm thấy hợp đồng.</p>;

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <div className="container" style={{ padding: 20 }}>
          <h2>Chi tiết hợp đồng</h2>
          <div className="contract-detail-card">
            <div><strong>ID:</strong> {contract.id}</div>
            <div><strong>Sinh viên:</strong> {contract.studentName} ({contract.studentEmail})</div>
            <div><strong>Phòng:</strong> {contract.roomName}</div>
            <div><strong>Ngày bắt đầu:</strong> {contract.startDate}</div>
            <div><strong>Ngày kết thúc:</strong> {contract.endDate}</div>
            <div>
              <strong>Trạng thái:</strong> 
              <span className={`status status-${contract.status.toLowerCase()}`}>{contract.status}</span>
            </div>
          </div>

          {contract.status === "PENDING" && (
            <button onClick={cancelContract} disabled={loadingCancel}>
              {loadingCancel ? "Đang hủy..." : "Hủy hợp đồng"}
            </button>
          )}

          <button style={{ marginLeft: 12 }} onClick={() => navigate("/my-contracts")}>Quay lại</button>
        </div>
      </div>

      <Script />
      <style>{`
        .contract-detail-card {
          padding: 20px;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          margin-bottom: 20px;
        }
        .status { font-weight: 700; }
        .status-pending { color: #f59e0b; }
        .status-active { color: #10b981; }
        .status-canceled { color: #ef4444; }
        .status-expired { color: #9ca3af; }
        button { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; background: #4f46e5; color: #fff; }
        button:disabled { background: #a5b4fc; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
