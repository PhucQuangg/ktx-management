import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./RoomType.css";

export default function RoomType() {
  const [selectedType, setSelectedType] = useState("NORMAL");
  const [rooms, setRooms] = useState([]);

  const fakeApi = {
    NORMAL: ["A101", "A102", "A103"],
    PLUS: ["P201", "P202"]
  };

  useEffect(() => {
    setRooms(fakeApi[selectedType]);
  }, [selectedType]);

  return (
    <div>
      <Header />
      <Sidebar />

      <div className="content-wrapper">
        <h2 className="title">Chọn loại phòng</h2>

        <div className="room-type-wrapper">

          {/* PHÒNG THƯỜNG */}
          <div className="type-card" onClick={() => setSelectedType("NORMAL")}>
            <div
              className="type-bg"
              style={{
                width: "100%",
                height: "300px",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: "url('/assets/images/roomNor.jpg')",
              }}v
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
                width: "100%",
                height: "300px",
                backgroundSize: "cover",
                backgroundPosition: "center",
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

        {/* DANH SÁCH PHÒNG */}
        <div className="room-list">
          <h3>
            {selectedType === "NORMAL"
              ? "Danh sách Phòng Thường"
              : "Danh sách Phòng Plus"}
          </h3>

          {rooms.map((r, index) => (
            <div key={index} className="room-item">
              Phòng {r}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
