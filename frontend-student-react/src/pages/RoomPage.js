import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";
import "../css/RoomType.css";

export default function RoomType() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} />

      <div
        className="content-wrapper"
        style={{
          marginLeft: sidebarOpen ? "260px" : "80px",
          marginTop: "65px",
          transition: ".3s",
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#eef5ff 0%,#f7fbff 45%,#ffffff 100%)",
          padding: "35px",
        }}
      >
        <div
          style={{
            background: "#1565C0",
            borderRadius: "20px",
            padding: "35px",
            color: "#fff",
            marginBottom: "35px",
            boxShadow: "0 12px 30px rgba(21,101,192,.18)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "32px",
            }}
          >
            <i className="fa fa-bed" style={{ marginRight: 12 }}></i>
            Đăng ký phòng ký túc xá
          </h2>

          <p
            style={{
              marginTop: "15px",
              marginBottom: 0,
              fontSize: "17px",
              opacity: 0.95,
              lineHeight: "28px",
            }}
          >
            Lựa chọn loại phòng phù hợp với nhu cầu của bạn và xem danh sách
            phòng còn trống trong hệ thống.
          </p>
        </div>

        {!selectedType && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
              gap: "35px",
            }}
          >
            <div
              onClick={() => setSelectedType("NORMAL")}
              style={{
                cursor: "pointer",
                borderRadius: "22px",
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 12px 35px rgba(21,101,192,.12)",
                transition: ".35s",
                border: "1px solid #e7eef8",
              }}
            >
              <div
                style={{
                  height: "250px",
                  backgroundImage: "url('/assets/images/roomNor.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(rgba(0,0,0,.15),rgba(0,0,0,.45))",
                  }}
                ></div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "25px",
                    left: "25px",
                  }}
                >
                  <span
                    style={{
                      background: "#1565C0",
                      color: "#fff",
                      padding: "8px 18px",
                      borderRadius: "30px",
                      fontWeight: 600,
                    }}
                  >
                    TIÊU CHUẨN
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: "28px",
                }}
              >
                <h3
                  style={{
                    color: "#1565C0",
                    fontWeight: 700,
                    marginTop: 0,
                  }}
                >
                  Phòng Tiêu Chuẩn
                </h3>

                <p
                  style={{
                    color: "#666",
                    lineHeight: "28px",
                    fontSize: "15px",
                    marginTop: "12px",
                  }}
                >
                  Phòng ở sạch sẽ, đầy đủ giường, tủ, bàn học, quạt và các tiện
                  nghi cơ bản dành cho sinh viên.
                </p>

                <hr />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#555",
                    marginBottom: "20px",
                  }}
                >
                  <span>
                    <i className="fa fa-users" style={{ marginRight: 8 }}></i>4
                    - 8 sinh viên
                  </span>

                  <span>
                    <i className="fa fa-wifi" style={{ marginRight: 8 }}></i>
                    Wifi
                  </span>
                </div>

                <button
                  className="btn"
                  style={{
                    width: "100%",
                    background: "#1565C0",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "13px",
                    fontWeight: 600,
                  }}
                >
                  Chọn phòng
                </button>
              </div>
            </div>

            <div
              onClick={() => setSelectedType("PLUS")}
              style={{
                cursor: "pointer",
                borderRadius: "22px",
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 12px 35px rgba(21,101,192,.12)",
                transition: ".35s",
                border: "1px solid #e7eef8",
              }}
            >
              <div
                style={{
                  height: "250px",
                  backgroundImage: "url('/assets/images/roomPlus.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(rgba(0,0,0,.15),rgba(0,0,0,.45))",
                  }}
                ></div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "25px",
                    left: "25px",
                  }}
                >
                  <span
                    style={{
                      background: "#27AE60",
                      color: "#fff",
                      padding: "8px 18px",
                      borderRadius: "30px",
                      fontWeight: 600,
                    }}
                  >
                    TIỆN NGHI
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: "28px",
                }}
              >
                <h3
                  style={{
                    color: "#1565C0",
                    fontWeight: 700,
                    marginTop: 0,
                  }}
                >
                  Phòng Tiện Nghi
                </h3>

                <p
                  style={{
                    color: "#666",
                    lineHeight: "28px",
                    fontSize: "15px",
                    marginTop: "12px",
                  }}
                >
                  Không gian rộng rãi, đầy đủ máy lạnh, nước nóng, wifi tốc độ
                  cao và nhiều tiện ích giúp sinh hoạt thoải mái hơn.
                </p>

                <hr />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#555",
                    marginBottom: "20px",
                  }}
                >
                  <span>
                    <i
                      className="fa fa-snowflake-o"
                      style={{ marginRight: 8 }}
                    ></i>
                    Máy lạnh
                  </span>

                  <span>
                    <i className="fa fa-bath" style={{ marginRight: 8 }}></i>
                    Nước nóng
                  </span>
                </div>

                <button
                  className="btn"
                  style={{
                    width: "100%",
                    background: "#1565C0",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "13px",
                    fontWeight: 600,
                  }}
                >
                  Chọn phòng
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedType && (
          <div className="room-list">
            <div className="room-list-header">
              <button
                className="back-button"
                style={{
                  background: "#1565C0",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "13px",
                  marginBottom: "20px",
                  fontWeight: 600,
                }}
                onClick={() => {
                  setSelectedType(null);
                  setRooms([]);
                }}
              >
                <i className="fa fa-arrow-left"></i>
                Quay lại
              </button>
            </div>

            {loading ? (
              <div className="loading-box">
                <i className="fa fa-spinner fa-spin"></i>

                <p>Đang tải danh sách phòng...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="empty-room">
                <i className="fa fa-bed"></i>

                <h4>Hiện chưa có phòng trống</h4>

                <p>Vui lòng quay lại sau hoặc lựa chọn loại phòng khác.</p>
              </div>
            ) : (
              <div className="room-grid">
                {rooms.map((room) => (
                  <div key={room.id} className="room-card">
                    <div className="room-header">
                      <div>
                        <h3>{room.name}</h3>

                        <span className="room-type-badge">
                          {selectedType === "NORMAL"
                            ? "Tiêu chuẩn"
                            : "Tiện nghi"}
                        </span>
                      </div>

                      <div className="room-status">
                        <i className="fa fa-check-circle"></i>
                        Còn chỗ
                      </div>
                    </div>

                    <div className="room-info-grid">
                      <div>
                        <i className="fa fa-users"></i>

                        <span>Sức chứa</span>

                        <strong>{room.capacity} sinh viên</strong>
                      </div>

                      <div>
                        <i className="fa fa-user"></i>

                        <span>Đang ở</span>

                        <strong>
                          {room.current_people ?? room.currentPeople}/{" "}
                          {room.capacity}
                        </strong>
                      </div>

                      <div>
                        <i className="fa fa-money"></i>

                        <span>Giá phòng</span>

                        <strong className="price">
                          {Number(room.price).toLocaleString("vi-VN")} đ
                        </strong>
                      </div>
                    </div>

                    <div className="room-footer">
                      <button
                        className="room-button"
                        onClick={() => handleViewRoom(room)}
                      >
                        <i className="fa fa-search"></i>
                        &nbsp; Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Script />
    </div>
  );
}
