import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Script from "../components/Script";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function RoomDetail() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("id"); 

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRegister, setLoadingRegister] = useState(false);

  const [contractStatus, setContractStatus] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.showPopup("Vui lòng đăng nhập để truy cập trang này!", true);
      setTimeout(() => (window.location.href = "/login"), 3000);
      return;
    }

    if (!roomId) return;

    fetch(`http://localhost:8080/api/student/rooms/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRoom(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

      fetch(`http://localhost:8080/api/student/contracts/my-contracts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((contracts) => {
          const activeContract = contracts.find(c => c.status === "ACTIVE");
          if (activeContract) setContractStatus("ACTIVE");
          else if (contracts.find(c => c.status === "PENDING")) setContractStatus("PENDING");
          else setContractStatus(null);
        })
        .catch(err => console.error(err));
  }, [roomId]);

  if (loading) return <p>Đang tải...</p>;
  if (!room) return <p>Không tìm thấy phòng.</p>;

  const occupancyRate = Math.round((room.current_people / room.capacity) * 100);
  const typeVN = room.type === "NORMAL" ? "Tiêu Chuẩn" : "Tiện Nghi";
  const statusVN = {
    AVAILABLE: "Có sẵn",
    FULL: "Đầy",
    MAINTENANCE: "Bảo trì",
  }[room.status] || room.status;

  const registerRoom = () => {

    const token = sessionStorage.getItem("token");
  
    if (!token) {
      window.showPopup("Bạn chưa đăng nhập!", true);
      return;
    }
  
    setLoadingRegister(true);
  
    fetch(
      `http://localhost:8080/api/student/contracts/register/semester?roomId=${roomId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || "Không thể đăng ký phòng");
        }
  
        return data;
      })
      .then(() => {
  
        window.showPopup(
          "Đăng ký phòng thành công! Chờ admin duyệt!"
        );
  
        setTimeout(() => {
          window.location.reload();
        }, 2000);
  
      })
      .catch((err) => {
  
        window.showPopup(
          err.message,
          true
        );
  
      })
      .finally(() => {
  
        setLoadingRegister(false);
  
      });
  };
  

  
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <div className="container" style={{ paddingTop: 20 }}        >
          <div className="card">
            <div className="room-header">
              <div className="photo">
                <img
                  src={room.photo || "/assets/images/roomDefault.jpg"}
                  alt={`Phòng ${room.name}`}
                  style={{ width: "160px", height: "110px", borderRadius: 10, objectFit: "cover" }}
                />
              </div>
              <div className="meta">
                <h1>{room.name}</h1>
                <p className="muted">
                  Loại: {typeVN} • ID: #{room.id}
                </p>
                <div className="badges">
                  <span className={`badge status-${room.status}`}>{statusVN}</span>
                  <span className="badge type-small">{typeVN}</span>
                  <span className="badge" style={{ background: "#f8fafc", color: "#0f172a" }}>
                    Sức chứa: {room.capacity}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="muted-2">Hiện có</div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{room.current_people}</div>
              </div>
            </div>

            <div className="content">
              <div className="info">
                <div className="field">
                  <div className="label">Tên phòng</div>
                  <div className="value">{room.name}</div>
                </div>
                <div className="field">
                  <div className="label">Sức chứa</div>
                  <div className="value">{room.capacity} người</div>
                </div>
                <div className="field">
                  <div className="label">Hiện đang thuê</div>
                  <div className="value">{room.current_people} người</div>
                </div>
                <div className="field occupancy">
                  <div style={{ width: "55%" }}>
                    <div className="label">Tỉ lệ lấp đầy</div>
                    <div className="progress">
                      <div className="bar" style={{ width: `${occupancyRate}%` }}></div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }} className="value">
                    {occupancyRate}%
                  </div>
                </div>
                <div className="field">
                  <div className="label">Trạng thái</div>
                  <div className="value">
                    <span className={`badge status-${room.status}`}>{statusVN}</span>
                  </div>
                </div>
                <div className="field">
                  <div className="label">Loại phòng</div>
                  <div className="value">{typeVN}</div>
                </div>
                <div className="field">
                  <div className="label">Ghi chú</div>
                  <div className="value muted">{room.note || "Không có"}</div>
                </div>
                <div className="facility-section">

                <h4 className="facility-title">
                  Cơ sở vật chất phòng
                </h4>

                {room.facilities && room.facilities.length > 0 ? (

                  <div className="facility-grid">

                    {room.facilities.map((item, index) => (

                      <div
                        key={index}
                        className="facility-card"
                      >
                        <div className="facility-icon">
                          🛠️
                        </div>

                        <div>
                          <div className="facility-name">
                            {item.facilityName}
                          </div>

                          <div className="facility-quantity">
                            Số lượng: {item.quantity}
                          </div>
                        </div>
                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="text-muted">
                    Chưa có dữ liệu cơ sở vật chất
                  </div>

                )}

                </div>
              </div>

              <aside className="sidebar">
                <div className="meta-row">
                  <div>
                    <div className="muted">Giá / tháng</div>
                    <div className="price">{room.price?.toLocaleString()}₫</div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }} className="muted">
                  Các tùy chọn
                </div>
                <div className="actions">
                <button
                  className="btn btn-primary"
                  disabled={loadingRegister}
                  onClick={() => {

                    if (contractStatus === "ACTIVE") {

                      window.showPopup(
                        "Bạn đã có hợp đồng đang hoạt động",
                        true
                      );

                      return;
                    }

                    if (contractStatus === "PENDING") {

                      window.showPopup(
                        "Bạn đã có đơn đăng ký đang chờ duyệt",
                        true
                      );

                      return;
                    }

                    registerRoom();
                  }}
                >
                  {loadingRegister
                    ? "Đang đăng ký..."
                    : "Đăng ký phòng"}
                </button>
                  </div>


                  <div
                    style={{
                      marginTop: 18,
                      borderTop: "1px dashed #eef2ff",
                      paddingTop: 12,
                    }}
                  >
                    <div
                      className="muted"
                      style={{
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      Thông tin thêm
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: "1.8",
                        color: "#64748b",
                      }}
                    >
                      <div>
                        💡 <strong>Phí điện nước:</strong> 350.000đ/người/tháng
                      </div>

                      <div
                        style={{
                          marginTop: 10,
                          padding: 10,
                          background: "#f8fafc",
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>
                          📚 Học kỳ 1
                        </div>

                        <div>
                          ⏰ Đăng ký: <strong>01/06 - 31/07</strong>
                        </div>

                        <div>
                          🏠 Lưu trú: <strong>01/09 - 31/01</strong>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 10,
                          padding: 10,
                          background: "#f8fafc",
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>
                          📚 Học kỳ 2
                        </div>

                        <div>
                          ⏰ Đăng ký: <strong>01/12 - 31/01</strong>
                        </div>

                        <div>
                          🏠 Lưu trú: <strong>01/02 - 30/06</strong>
                        </div>
                      </div>
                    </div>
                  </div>
              </aside>

              <button className="back-button" onClick={() => (window.location.href = "/rooms")}>
                Quay lại
              </button>
            </div>
          </div>
        </div>

        

        <Script />

        <style>{`
          :root{--bg:#f6f8fb;--card:#fff;--muted:#6b7280;--accent:#4f46e5;--radius:12px;font-family:Inter,sans-serif}
          .card{background:var(--card); max-width: 1000px;border-radius:var(--radius);box-shadow:0 8px 24px rgba(15,23,42,0.08);overflow:hidden}
          .room-header{display:flex;gap:20px;padding:28px;border-bottom:1px solid #eef2ff;align-items:center}
          .photo{width:160px;height:110px;border-radius:10px;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-weight:700;color:#1e293b}
          .meta{flex:1}.meta h1{margin:0;font-size:22px}.meta p{margin:6px 0;color:var(--muted)}
          .badges{display:flex;gap:8px;margin-top:10px}.badge{padding:6px 10px;border-radius:999px;font-size:13px;font-weight:600}
          .status-AVAILABLE{background:#ecfeff;color:#064e3b}.status-FULL{background:#fff1f2;color:#7f1d1d}.status-MAINTENANCE{background:#fff7ed;color:#92400e}
          .type-small{background:#eef2ff;color:#1e3a8a}
          .content{display:grid;grid-template-columns:1fr 340px;gap:22px;padding:22px}.info{padding:6px}
          .field{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px dashed #f1f5f9}
          .field .label{color:var(--muted);font-size:13px}.field .value{font-weight:700}
          .occupancy{margin-top:8px}.progress{height:12px;background:#eef2ff;border-radius:999px;overflow:hidden}
          .bar{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--accent),#06b6d4)}
          .price{font-size:28px;font-weight:800}.muted{color:var(--muted);font-size:13px}
          .actions{display:flex;gap:12px;margin-top:12px}.btn-primary{padding:10px 14px;border-radius:10px;border:0;cursor:pointer;font-weight:700}.btn-primary{background:var(--accent);color:white}
          .btn-secondary{background:#f1f5f9;color:#334155}
          .meta-row{display:flex;gap:12px;align-items:center}.muted-2{color:#94a3b8}
          .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:9999}
          .modal-box{width:400px;background:white;border-radius:14px;padding:25px;box-shadow:0 10px 35px rgba(0,0,0,0.15);animation:fadeIn 0.2s ease}
          .modal-buttons{margin-top:20px;display:flex;flex-direction:column;gap:12px}
          .modal-close{margin-top:15px;background:transparent;border:0;color:#6b7280;font-size:14px;cursor:pointer}
          .custom-date-form{display:flex;flex-direction:column;gap:8px;margin-top:10px}
          .custom-date-form label{display:flex;flex-direction:column;font-size:13px;color:#374151}
          .custom-date-form input{padding:6px 10px;border:1px solid #d1d5db;border-radius:8px}
          @keyframes fadeIn{from {opacity:0; transform:scale(0.94);} to {opacity:1; transform:scale(1);}}
          .facility-section{
            margin-top:25px;
          }

          .facility-title{
            font-size:18px;
            font-weight:700;
            margin-bottom:15px;
            color:#1e293b;
          }

          .facility-grid{
            display:grid;
            grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
            gap:15px;
          }

          .facility-card{
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:12px;
            padding:15px;
            display:flex;
            align-items:center;
            gap:12px;
            transition:0.2s;
          }

          .facility-card:hover{
            transform:translateY(-2px);
            box-shadow:0 4px 12px rgba(0,0,0,0.08);
          }

          .facility-icon{
            width:45px;
            height:45px;
            border-radius:10px;
            background:#eef2ff;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:20px;
          }

          .facility-name{
            font-weight:700;
            color:#1e293b;
          }

          .facility-quantity{
            color:#64748b;
            font-size:14px;
          }
        `}</style>
      </div>
    </div>
  );
}
