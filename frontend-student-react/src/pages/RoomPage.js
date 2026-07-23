import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Script from "../components/Script";
import "./RoomType.css";

export default function RoomType() {
  const [selectedType, setSelectedType] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (!selectedType) return;

    const token = sessionStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    fetch(
      `http://localhost:8080/api/student/rooms/available-by-type?type=${selectedType}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách phòng");
        return res.json();
      })
      .then((data) => setRooms(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedType]);

  const handleViewRoom = (room) => {
    navigate(`/room-detail?id=${room.id}`);
  };

  return (
    <div className="wrapper">
      <Header />
      <Sidebar />

      <div className="content-wrapper room-page">

        {/* ===== TITLE ===== */}

        <div className="room-page-title">
          <span className="title-line"></span>

          <h2>
            <i className="fa fa-bed"></i>
            Đăng ký phòng ký túc xá
          </h2>

          <p>
            Vui lòng lựa chọn loại phòng phù hợp với nhu cầu của bạn
          </p>

          <span className="title-line"></span>
        </div>

        {/* ===== CHỌN LOẠI PHÒNG ===== */}

        {!selectedType && (
          <div className="room-type-wrapper">

            <div
              className="type-card"
              onClick={() => setSelectedType("NORMAL")}
            >
              <div
                className="type-bg"
                style={{
                  backgroundImage:
                    "url('/assets/images/roomNor.jpg')",
                }}
              ></div>

              <div className="overlay"></div>

              <div className="type-content">
                <h3>Phòng Tiêu Chuẩn</h3>
                <p>Giá rẻ • Tiện nghi cơ bản</p>
              </div>
            </div>

            <div
              className="type-card"
              onClick={() => setSelectedType("PLUS")}
            >
              <div
                className="type-bg"
                style={{
                  backgroundImage:
                    "url('/assets/images/roomPlus.jpg')",
                }}
              ></div>

              <div className="overlay"></div>

              <div className="type-content">
                <h3>Phòng Tiện Nghi</h3>
                <p>Không gian hiện đại • Đầy đủ tiện ích</p>
              </div>
            </div>

          </div>
        )}

        {/* ===== DANH SÁCH PHÒNG ===== */}

        {selectedType && (
          <div className="room-list">

            <h3 className="room-list-title">
              {selectedType === "NORMAL"
                ? "Danh sách phòng tiêu chuẩn"
                : "Danh sách phòng tiện nghi"}
            </h3>

            {loading ? (
              <p className="text-center">Đang tải dữ liệu...</p>
            ) : rooms.length === 0 ? (
              <p className="text-center">
                Hiện chưa có phòng trống.
              </p>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="room-item">

                  <img
                    src="/assets/images/house.jpg"
                    alt=""
                    className="room-image"
                  />

                  <div className="room-info">
                    <h4>{room.name}</h4>

                    <p>
                      <strong>Sức chứa:</strong> {room.capacity}
                    </p>

                    <p>
                      <strong>Đang ở:</strong>{" "}
                      {room.current_people ?? room.currentPeople}
                    </p>
                  </div>

                  <div className="room-actions">

                    <div className="room-price">
                      {Number(room.price).toLocaleString("vi-VN")} đ
                    </div>

                    <button
                      className="room-button"
                      onClick={() => handleViewRoom(room)}
                    >
                      Xem phòng
                    </button>

                  </div>

                </div>
              ))
            )}

            <button
              className="back-button"
              onClick={() => {
                setSelectedType(null);
                setRooms([]);
              }}
            >
              ← Quay lại
            </button>

          </div>
        )}

      </div>

      <Script />
    </div>
  );
}