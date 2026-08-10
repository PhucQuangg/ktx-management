import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import "../../css/AdminRoomList.css";

export default function RoomList() {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [roomType, setRoomType] = useState("ALL");
  const [roomStatus, setRoomStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchRooms();
  }, [token]);

  useEffect(() => {
    let filtered = [...rooms];

    if (roomType !== "ALL") {
      filtered = filtered.filter((room) => room.type === roomType);
    }

    if (roomStatus !== "ALL") {
      filtered = filtered.filter((room) => room.status === roomStatus);
    }

    setFilteredRooms(filtered);
  }, [roomType, roomStatus, rooms]);

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/admin/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseText = await res.text();

      let data = [];

      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch {
        data = [];
      }

      if (!res.ok) {
        throw new Error(responseText || "Không thể tải danh sách phòng.");
      }

      setRooms(data);
    } catch (error) {
      console.error(error);

      window.showPopup?.(error.message || "Lỗi khi tải danh sách phòng.", true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId, currentPeople) => {
    if (Number(currentPeople || 0) > 0) {
      window.showPopup?.(
        "Không thể xóa phòng vì hiện có sinh viên đang ở.",
        true
      );

      return;
    }

    window.showPopup?.(
      "Bạn có chắc chắn muốn xóa phòng này không?",
      false,
      true,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/admin/rooms/delete/${roomId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await res.text();

          if (!res.ok) {
            throw new Error(message || "Không thể xóa phòng.");
          }

          setRooms((prev) => prev.filter((room) => room.id !== roomId));

          setTimeout(() => {
            window.showPopup?.(message || "Xóa phòng thành công.");
          }, 200);
        } catch (error) {
          console.error(error);

          window.showPopup?.(error.message || "Lỗi khi xóa phòng.", true);
        }
      }
    );
  };

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN") + " đ";

  const getRoomStatusText = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "Còn trống";

      case "FULL":
        return "Đã đầy";

      case "MAINTENANCE":
        return "Bảo trì";

      default:
        return status || "Chưa xác định";
    }
  };

  const getRoomTypeText = (type) => {
    switch (type) {
      case "NORMAL":
        return "Tiêu chuẩn";

      case "PLUS":
        return "Tiện nghi";

      default:
        return type || "Chưa xác định";
    }
  };

  const countByStatus = (status) =>
    rooms.filter((room) => room.status === status).length;

  const clearFilters = () => {
    setRoomType("ALL");
    setRoomStatus("ALL");
  };

  return (
    <div className="admin-room-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`admin-room-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="room-list-banner">
          <div>
            <div className="room-list-banner-badge">
              <i className="fa fa-door-open"></i>
              Quản lý phòng
            </div>

            <h1>Danh sách phòng</h1>

            <p>
              Theo dõi sức chứa, số lượng sinh viên, tình trạng và loại phòng
              trong ký túc xá.
            </p>
          </div>

          <div className="room-list-banner-icon">
            <i className="fa fa-building"></i>
          </div>
        </section>

        <section className="room-summary-grid">
          <div className="room-summary-card total">
            <div className="room-summary-icon">
              <i className="fa fa-building"></i>
            </div>

            <div>
              <span>Tổng số phòng</span>
              <strong>{rooms.length}</strong>
            </div>
          </div>

          <div className="room-summary-card available">
            <div className="room-summary-icon">
              <i className="fa fa-door-open"></i>
            </div>

            <div>
              <span>Phòng còn trống</span>
              <strong>{countByStatus("AVAILABLE")}</strong>
            </div>
          </div>

          <div className="room-summary-card full">
            <div className="room-summary-icon">
              <i className="fa fa-users"></i>
            </div>

            <div>
              <span>Phòng đã đầy</span>
              <strong>{countByStatus("FULL")}</strong>
            </div>
          </div>

          <div className="room-summary-card maintenance">
            <div className="room-summary-icon">
              <i className="fa fa-tools"></i>
            </div>

            <div>
              <span>Đang bảo trì</span>
              <strong>{countByStatus("MAINTENANCE")}</strong>
            </div>
          </div>
        </section>

        <section className="room-list-section">
          <div className="room-list-toolbar">
            <div>
              <h2>Danh sách phòng</h2>

              <p>Lọc theo loại phòng hoặc tình trạng sử dụng.</p>
            </div>

            <button
              type="button"
              className="room-add-button"
              onClick={() => navigate("/admin/add-room")}
            >
              <i className="fa fa-plus"></i>
              Thêm phòng
            </button>
          </div>

          <div className="room-filter-panel">
            <div className="room-filter-group">
              <label htmlFor="room-type-filter">Loại phòng</label>

              <select
                id="room-type-filter"
                value={roomType}
                onChange={(event) => setRoomType(event.target.value)}
              >
                <option value="ALL">Tất cả loại phòng</option>

                <option value="NORMAL">Tiêu chuẩn</option>

                <option value="PLUS">Tiện nghi</option>
              </select>
            </div>

            <div className="room-filter-group">
              <label htmlFor="room-status-filter">Tình trạng</label>

              <select
                id="room-status-filter"
                value={roomStatus}
                onChange={(event) => setRoomStatus(event.target.value)}
              >
                <option value="ALL">Tất cả tình trạng</option>

                <option value="AVAILABLE">Còn trống</option>

                <option value="FULL">Đã đầy</option>

                <option value="MAINTENANCE">Bảo trì</option>
              </select>
            </div>

            {(roomType !== "ALL" || roomStatus !== "ALL") && (
              <button
                type="button"
                className="room-clear-filter"
                onClick={clearFilters}
              >
                <i className="fa fa-times"></i>
                Xóa bộ lọc
              </button>
            )}
          </div>

          {loading ? (
            <div className="room-list-loading">
              <i className="fa fa-spinner fa-spin"></i>

              <p>Đang tải danh sách phòng...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="room-list-empty">
              <div className="room-empty-icon">
                <i className="fa fa-door-closed"></i>
              </div>

              <h3>Không có phòng phù hợp</h3>

              <p>Không tìm thấy phòng theo bộ lọc hiện tại.</p>
            </div>
          ) : (
            <div className="room-table-wrapper">
              <table className="room-table">
                <thead>
                  <tr>
                    <th>Phòng</th>
                    <th>Sức chứa</th>
                    <th>Đang ở</th>
                    <th>Tỷ lệ sử dụng</th>
                    <th>Giá phòng</th>
                    <th>Tình trạng</th>
                    <th>Loại phòng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRooms.map((room) => {
                    const currentPeople = Number(
                      room.current_people ?? room.currentPeople ?? 0
                    );

                    const capacity = Number(room.capacity || 0);

                    const occupancyPercent =
                      capacity > 0
                        ? Math.min(
                            Math.round((currentPeople / capacity) * 100),
                            100
                          )
                        : 0;

                    return (
                      <tr key={room.id}>
                        <td>
                          <div className="room-name-cell">
                            <div className="room-avatar">
                              <i className="fa fa-door-open"></i>
                            </div>

                            <div>
                              <strong>
                                {room.name || room.roomName || "Chưa đặt tên"}
                              </strong>
                            </div>
                          </div>
                        </td>

                        <td>{capacity}</td>

                        <td>{currentPeople}</td>

                        <td>
                          <div className="room-occupancy">
                            <div className="room-progress">
                              <div
                                className={`room-progress-value ${
                                  occupancyPercent >= 100
                                    ? "full"
                                    : occupancyPercent >= 70
                                    ? "warning"
                                    : ""
                                }`}
                                style={{
                                  width: `${occupancyPercent}%`,
                                }}
                              ></div>
                            </div>

                            <span>{occupancyPercent}%</span>
                          </div>
                        </td>

                        <td className="room-price-cell">
                          {formatMoney(room.price)}
                        </td>

                        <td>
                          <span
                            className={`room-status-badge ${
                              room.status ? room.status.toLowerCase() : ""
                            }`}
                          >
                            {getRoomStatusText(room.status)}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`room-type-badge ${
                              room.type ? room.type.toLowerCase() : ""
                            }`}
                          >
                            {getRoomTypeText(room.type)}
                          </span>
                        </td>

                        <td>
                          <div className="room-action-buttons">
                            <button
                              type="button"
                              className="room-edit-button"
                              onClick={() =>
                                navigate(`/admin/update-room?id=${room.id}`)
                              }
                            >
                              <i className="fa fa-eye"></i>
                              Xem
                            </button>

                            <button
                              type="button"
                              className="room-delete-button"
                              onClick={() =>
                                handleDelete(room.id, currentPeople)
                              }
                            >
                              <i className="fa fa-trash"></i>
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
