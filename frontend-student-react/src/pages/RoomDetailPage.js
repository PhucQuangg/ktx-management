import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Script from "../components/Script";

export default function RoomDetail() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("id"); 

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [roomId]);

  if (loading) return <p>Đang tải...</p>;
  if (!room) return <p>Không tìm thấy phòng.</p>;

  const occupancyRate = Math.round((room.current_people / room.capacity) * 100);

  // Map type & status sang tiếng Việt
  const typeVN = room.type === "NORMAL" ? "Tiêu Chuẩn" : "Tiện Nghi";
  const statusVN = {
    AVAILABLE: "Có sẵn",
    FULL: "Đầy",
    MAINTENANCE: "Bảo trì",
  }[room.status] || room.status;

  return (
    <div>
      <div className="container" style={{ padding: 20 }}>
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
                <button className="btn btn-primary">Đặt</button>
              </div>

              <div style={{ marginTop: 18, borderTop: "1px dashed #eef2ff", paddingTop: 12 }}>
                <div className="muted">Thông tin thêm</div>
                <div style={{ fontSize: 13, marginTop: 8 }} className="muted-2">
                  Ngày cập nhật: {new Date(room.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Script />

      {/* CSS inline giữ layout */}
      <style>{`
        :root{--bg:#f6f8fb;--card:#fff;--muted:#6b7280;--accent:#4f46e5;--radius:12px;font-family:Inter,sans-serif}
        .card{background:var(--card);border-radius:var(--radius);box-shadow:0 8px 24px rgba(15,23,42,0.08);overflow:hidden}
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
        .actions{display:flex;gap:12px;margin-top:12px}.btn{padding:10px 14px;border-radius:10px;border:0;cursor:pointer;font-weight:700}.btn-primary{background:var(--accent);color:white}
        .meta-row{display:flex;gap:12px;align-items:center}.muted-2{color:#94a3b8}
      `}</style>
    </div>
  );
}
