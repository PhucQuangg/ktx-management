import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Script from "../components/Script";
import "./RoomType.css";

export default function RoomType() {
  const [selectedType, setSelectedType] = useState(null); // mặc định chưa chọn loại phòng
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  // Kiểm tra token khi load trang
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.showPopup("Vui lòng đăng nhập để truy cập trang này!", true);
      setTimeout(() => (window.location.href = "/login"), 3000);
    }
  }, []);

  // Fetch API khi chọn loại phòng
  useEffect(() => {
    if (!selectedType) return; // chưa click => không gọi API

    const token = sessionStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    fetch(
      `http://localhost:8080/api/student/rooms/available-by-type?type=${selectedType}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy danh sách phòng");
        return res.json();
      })
      .then((data) => setRooms(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedType]);

  // Nút quay lại
  const backToSelector = () => {
    setSelectedType(null);
    setRooms([]);
  };
  const handleViewRoom = (room) => {
    navigate(`/room-detail?id=${room.id}`); // <-- dùng query string
  };
  
  

  return (
    <div>
      <Header />
      <Sidebar />
      
      <div className="content-wrapper">
      <h2 className="text-center">Chọn loại phòng</h2>
        {!selectedType && (
          <div className="room-type-wrapper">
            {/* PHÒNG THƯỜNG */}
            <div className="type-card" onClick={() => setSelectedType("NORMAL")}>
              <div
                className="type-bg"
                style={{
                  backgroundImage: "url('/assets/images/roomNor.jpg')",
                }}
              ></div>
              <div className="overlay"></div>
              <div className="type-content">
                <h3>Phòng Tiêu Chuẩn</h3>
                <p>Giá rẻ · Tiện nghi cơ bản</p>
              </div>
            </div>

            {/* PHÒNG PLUS */}
            <div className="type-card" onClick={() => setSelectedType("PLUS")}>
              <div
                className="type-bg"
                style={{
                  backgroundImage: "url('/assets/images/roomPlus.jpg')",
                }}
              ></div>
              <div className="overlay"></div>
              <div className="type-content">
                <h3>Phòng Tiện Nghi</h3>
                <p>Giá tầm trung · Đầy đủ tiện nghi</p>
              </div>
            </div>
          </div>
        )}

        {selectedType && (
          <div className="room-list">
          <h3>
            {selectedType === "NORMAL"
              ? "Danh sách Phòng Tiêu Chuẩn"
              : "Danh sách Phòng Tiện Nghi"}
          </h3>
        
          {loading ? (
            <p>Đang tải...</p>
          ) : rooms.length === 0 ? (
            <p>Không có phòng trống.</p>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="room-item">
                <img
                  src="/assets/images/house.jpg" 
                  alt={`Phòng ${room.name}`}
                  className="room-image"
                />
                <div className="room-info">
                  <h4>{room.name}</h4>
                  <p><strong>Sức chứa:</strong> {room.capacity}</p>
                  <p><strong>Đang ở:</strong> {room.current_people ?? room.currentPeople}</p>
                </div>
                <div className="room-actions">
                  <div className="room-price">{room.price} VNĐ</div>
                  <button className="room-button" onClick={() => handleViewRoom(room)}>
                    Xem phòng
                  </button>
                </div>
              </div>
            ))
          )}
        
          <button className="back-button" onClick={backToSelector}>
            Quay lại
          </button>
        </div>
        
        )}
      </div>

      <Script />
    </div>
  );
}
