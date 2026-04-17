import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

export default function ContractDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;


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
    if (!id) {
      window.showPopup("Không tìm thấy hợp đồng!", true);
      navigate("/my-contracts");
      return;
    }
  
    fetchContract();
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
  <div className="paper">

    {/* HEADER */}
    <div className="header">
  <div className="left text-center">
  <strong>TRƯỜNG ĐẠI HỌC CÔNG NGHÊ SÀI GÒN</strong><br />
  <span>Ký túc xá sinh viên</span>
  </div>
  <div className="right">
    <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
    <div className="sub">Độc lập - Tự do - Hạnh phúc</div>
  </div>
</div>


    {/* TITLE */}
    <h2 className="title">
      {contract.status === "PENDING"
        ? "ĐƠN ĐĂNG KÝ NỘI TRÚ KÝ TÚC XÁ"
        : "HỢP ĐỒNG NỘI TRÚ KÝ TÚC XÁ"}
    </h2>

    {/* STATUS */}
    <div className={`status-badge ${contract.status.toLowerCase()}`}>
      {contract.status === "PENDING" && "⏳ Chờ duyệt"}
      {contract.status === "ACTIVE" && "✅ Đã duyệt"}
      {contract.status === "CANCELED" && "❌ Đã hủy"}
    </div>

    {/* INFO */}
    <div className="section">
      <p><strong>Sinh viên:</strong> {contract.studentName}</p>
      <p><strong>Email:</strong> {contract.studentEmail}</p>
      <p><strong>Phòng:</strong> {contract.roomName}</p>
      <p><strong>Ngày bắt đầu:</strong> {contract.startDate}</p>
      <p><strong>Ngày kết thúc:</strong> {contract.endDate}</p>
    </div>

    {/* CONTENT */}
    <div className="section">
      {contract.status === "PENDING" ? (
        <>
          <p>
            Tôi xin đăng ký ở nội trú tại phòng <b>{contract.roomName}</b>.
          </p>
          <p>
            Thời gian từ ngày <b>{contract.startDate}</b> đến <b>{contract.endDate}</b>.
          </p>
          <p>
            Tôi cam kết tuân thủ các quy định của ký túc xá và chờ phê duyệt từ quản lý.
          </p>
        </>
      ) : (
        <>
          <p>
            Bên A đồng ý cho Bên B thuê phòng <b>{contract.roomName}</b>.
          </p>
          <p>
            Thời gian từ ngày <b>{contract.startDate}</b> đến <b>{contract.endDate}</b>.
          </p>
          <p>
            Hai bên cam kết thực hiện đúng các điều khoản của hợp đồng.
          </p>
        </>
      )}
    </div>

    {/* SIGNATURE */}
    <div className="signature">
      <div>
        <p>Người đăng ký</p>
        <p>(Ký tên)</p>
      </div>
      <div>
        <p>Quản lý KTX</p>
        <p>(Ký tên)</p>
      </div>
    </div>
    

    {/* ACTION */}
    {contract.status === "PENDING" && (
      <button className="btn-cancel" onClick={cancelContract}>
        Hủy đăng ký
      </button>
    )}
        <div className="back-btn" onClick={() => navigate("/my-contracts")}>
        ← Quay lại
      </div>
    
  </div>
</div>

      </div>

      <Script />
      <style>{`
        .paper {
          background: #fff;
          padding: 40px;
          max-width: 800px;
          margin: auto;
          border: 1px solid #ccc;
          font-family: "Times New Roman", serif;
          line-height: 1.6;
        }

        .back-btn {
          cursor: pointer;
          color: #3b82f6;
          margin-bottom: 10px;
          font-weight: 500;
          transition: 0.2s;
        }

        .back-btn:hover {
          opacity: 0.8;
        }


        .header {
          display: flex;
          justify-content: space-between;
        }

.right {
  text-align: center;
}

        .title {
          text-align: center;
          margin: 20px 0;
        }

        .section {
          margin-top: 20px;
        }

        .signature {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
          text-align: center;
        }

        .status-badge {
          text-align: center;
          margin-top: 10px;
          font-weight: bold;
        }

        .status-badge.pending { color: orange; }
        .status-badge.active { color: green; }
        .status-badge.canceled { color: red; }

        .btn-cancel {
          margin-top: 20px;
          background: red;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 8px;
        }

        button {
          margin-top: 15px;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: #4f46e5;
          color: #fff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
