import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import "../../css/AdminRoomForm.css";

const initialRoom = {
  name: "",
  capacity: "",
  current_people: 0,
  price: "",
  type: "NORMAL",
  status: "AVAILABLE",
};

export default function UpdateRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("id");
  const token = sessionStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [room, setRoom] = useState(initialRoom);
  const [originalRoom, setOriginalRoom] = useState(initialRoom);

  const [students, setStudents] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!roomId) {
      window.showPopup?.("Không tìm thấy thông tin phòng.", true);

      navigate("/admin/rooms");
      return;
    }

    loadPageData();
  }, [roomId, token, navigate]);

  const loadPageData = async () => {
    try {
      setLoading(true);

      await Promise.all([loadRoom(roomId), loadStudentsInRoom(roomId)]);
    } finally {
      setLoading(false);
    }
  };

  const normalizeRoomData = (data) => ({
    name: data.name || data.roomName || "",

    capacity: data.capacity ?? "",

    current_people: data.current_people ?? data.currentPeople ?? 0,

    price: data.price ?? "",

    type: data.type || "NORMAL",

    status: data.status || "AVAILABLE",
  });

  const loadRoom = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/rooms/edit/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await res.text();

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(responseText || "Không thể tải thông tin phòng.");
      }

      const normalizedRoom = normalizeRoomData(data);

      setRoom(normalizedRoom);
      setOriginalRoom(normalizedRoom);
    } catch (error) {
      console.error(error);

      window.showPopup?.(error.message || "Lỗi khi tải thông tin phòng.", true);
    }
  };

  const loadStudentsInRoom = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/contracts/room/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await res.text();

      let data = [];

      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch {
        data = [];
      }

      if (!res.ok) {
        setStudents([]);
        return;
      }

      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setStudents([]);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateRoom = () => {
    if (!room.name.trim()) {
      window.showPopup?.("Vui lòng nhập tên phòng.", true);

      return false;
    }

    if (!room.capacity) {
      window.showPopup?.("Vui lòng nhập sức chứa.", true);

      return false;
    }

    if (Number(room.capacity) <= 0) {
      window.showPopup?.("Sức chứa phải lớn hơn 0.", true);

      return false;
    }

    if (Number(room.capacity) < students.length) {
      window.showPopup?.(
        `Sức chứa không được nhỏ hơn số sinh viên hiện tại (${students.length}).`,
        true
      );

      return false;
    }

    if (!room.price) {
      window.showPopup?.("Vui lòng nhập giá phòng.", true);

      return false;
    }

    if (Number(room.price) <= 0) {
      window.showPopup?.("Giá phòng phải lớn hơn 0.", true);

      return false;
    }

    if (!room.type) {
      window.showPopup?.("Vui lòng chọn loại phòng.", true);

      return false;
    }

    if (!room.status) {
      window.showPopup?.("Vui lòng chọn trạng thái phòng.", true);

      return false;
    }

    if (
      room.status === "AVAILABLE" &&
      students.length >= Number(room.capacity)
    ) {
      window.showPopup?.(
        "Phòng đã đạt sức chứa tối đa nên không thể đặt trạng thái Còn trống.",
        true
      );

      return false;
    }

    return true;
  };

  const saveRoom = async () => {
    if (!validateRoom()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...room,

        name: room.name.trim(),

        capacity: Number(room.capacity),

        current_people: students.length,

        price: Number(room.price),
      };

      const res = await fetch(
        `http://localhost:8080/api/admin/rooms/update/${roomId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const message = await res.text();

      if (!res.ok) {
        throw new Error(message || "Không thể cập nhật phòng.");
      }

      window.showPopup?.(message || "Cập nhật phòng thành công!");

      const updatedRoom = {
        ...payload,
      };

      setRoom(updatedRoom);
      setOriginalRoom(updatedRoom);
      setEditMode(false);

      await loadRoom(roomId);
    } catch (error) {
      console.error(error);

      window.showPopup?.(error.message || "Lỗi khi cập nhật phòng.", true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setRoom(originalRoom);
    setEditMode(false);
  };

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN") + " đ";

  const occupancyPercent =
    Number(room.capacity) > 0
      ? Math.min(
          Math.round((students.length / Number(room.capacity)) * 100),
          100
        )
      : 0;

  if (loading) {
    return (
      <div className="room-form-loading-page">
        <i className="fa fa-spinner fa-spin"></i>

        <p>Đang tải thông tin phòng...</p>
      </div>
    );
  }

  return (
    <div className="room-form-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`room-form-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="room-form-banner">
          <div>
            <div className="room-form-banner-badge">
              <i className="fa fa-door-open"></i>
              Quản lý phòng
            </div>

            <h1>Thông tin phòng</h1>

            <p>
              Xem và cập nhật thông tin, sức chứa, giá phòng và tình trạng sử
              dụng của phòng ký túc xá.
            </p>
          </div>

          <div className="room-form-banner-icon">
            <i className="fa fa-building"></i>
          </div>
        </section>

        <div className="room-update-layout">
          <section className="room-form-card">
            <div className="room-form-card-header">
              <div className="room-form-header-icon">
                <i className="fa fa-door-closed"></i>
              </div>

              <div>
                <h2>{editMode ? "Cập nhật thông tin" : "Chi tiết phòng"}</h2>

                <p>
                  {editMode
                    ? "Chỉnh sửa thông tin và nhấn Lưu thay đổi."
                    : "Nhấn nút Cập nhật để chỉnh sửa thông tin phòng."}
                </p>
              </div>

              <span
                className={`room-update-mode-badge ${
                  editMode ? "editing" : "viewing"
                }`}
              >
                <i className={`fa ${editMode ? "fa-pen" : "fa-eye"}`}></i>

                {editMode ? "Đang chỉnh sửa" : "Chế độ xem"}
              </span>
            </div>

            <div className="room-form">
              <div className="room-form-grid">
                <div className="room-form-group full-width">
                  <label htmlFor="name">
                    Tên phòng
                    <span>*</span>
                  </label>

                  <div
                    className={`room-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-door-open"></i>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={room.name}
                      onChange={handleChange}
                      readOnly={!editMode}
                      placeholder="Nhập tên phòng"
                    />
                  </div>
                </div>

                <div className="room-form-group">
                  <label htmlFor="capacity">
                    Sức chứa
                    <span>*</span>
                  </label>

                  <div
                    className={`room-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-users"></i>

                    <input
                      id="capacity"
                      type="number"
                      name="capacity"
                      min={students.length || 1}
                      value={room.capacity}
                      onChange={handleChange}
                      readOnly={!editMode}
                    />
                  </div>

                  <small>Không được nhỏ hơn số sinh viên hiện tại.</small>
                </div>

                <div className="room-form-group">
                  <label>Số người hiện tại</label>

                  <div className="room-input-wrapper readonly">
                    <i className="fa fa-user-friends"></i>

                    <input type="number" value={students.length} readOnly />
                  </div>
                </div>

                <div className="room-form-group">
                  <label htmlFor="price">
                    Giá phòng
                    <span>*</span>
                  </label>

                  <div
                    className={`room-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-money-bill-wave"></i>

                    <input
                      id="price"
                      type="number"
                      name="price"
                      min="1"
                      step="1000"
                      value={room.price}
                      onChange={handleChange}
                      readOnly={!editMode}
                    />

                    <span className="room-input-suffix">VNĐ</span>
                  </div>
                </div>

                <div className="room-form-group">
                  <label htmlFor="type">
                    Loại phòng
                    <span>*</span>
                  </label>

                  <div
                    className={`room-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-layer-group"></i>

                    <select
                      id="type"
                      name="type"
                      value={room.type}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <option value="NORMAL">Tiêu chuẩn</option>

                      <option value="PLUS">Tiện nghi</option>
                    </select>
                  </div>
                </div>

                <div className="room-form-group full-width">
                  <label>
                    Trạng thái phòng
                    <span>*</span>
                  </label>

                  <div className="room-status-options update">
                    <label
                      className={`room-status-option available ${
                        room.status === "AVAILABLE" ? "selected" : ""
                      } ${!editMode ? "disabled" : ""}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="AVAILABLE"
                        checked={room.status === "AVAILABLE"}
                        onChange={handleChange}
                        disabled={!editMode}
                      />

                      <span className="room-radio"></span>

                      <i className="fa fa-check-circle"></i>

                      <div>
                        <strong>Còn trống</strong>

                        <small>Có thể tiếp nhận thêm sinh viên.</small>
                      </div>
                    </label>

                    <label
                      className={`room-status-option full ${
                        room.status === "FULL" ? "selected" : ""
                      } ${!editMode ? "disabled" : ""}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="FULL"
                        checked={room.status === "FULL"}
                        onChange={handleChange}
                        disabled={!editMode}
                      />

                      <span className="room-radio"></span>

                      <i className="fa fa-users"></i>

                      <div>
                        <strong>Đã đầy</strong>

                        <small>Không tiếp nhận thêm sinh viên.</small>
                      </div>
                    </label>

                    <label
                      className={`room-status-option maintenance ${
                        room.status === "MAINTENANCE" ? "selected" : ""
                      } ${!editMode ? "disabled" : ""}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="MAINTENANCE"
                        checked={room.status === "MAINTENANCE"}
                        onChange={handleChange}
                        disabled={!editMode}
                      />

                      <span className="room-radio"></span>

                      <i className="fa fa-tools"></i>

                      <div>
                        <strong>Bảo trì</strong>

                        <small>Tạm thời chưa thể sử dụng.</small>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="room-form-note">
                <div className="room-form-note-icon">
                  <i className="fa fa-info-circle"></i>
                </div>

                <div>
                  <strong>Lưu ý</strong>

                  <p>
                    Không thể giảm sức chứa xuống thấp hơn số sinh viên hiện
                    tại. Trạng thái phòng nên phù hợp với số lượng người đang ở.
                  </p>
                </div>
              </div>

              <div className="room-form-actions">
                <button
                  type="button"
                  className="room-form-back-button"
                  onClick={() => navigate("/admin/rooms")}
                  disabled={saving}
                >
                  <i className="fa fa-arrow-left"></i>
                  Trở về
                </button>

                {!editMode ? (
                  <button
                    type="button"
                    className="room-form-edit-button"
                    onClick={() => setEditMode(true)}
                  >
                    <i className="fa fa-pen"></i>
                    Cập nhật
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="room-form-cancel-button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      <i className="fa fa-times"></i>
                      Hủy
                    </button>

                    <button
                      type="button"
                      className="room-form-save-button"
                      onClick={saveRoom}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <i className="fa fa-spinner fa-spin"></i>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-save"></i>
                          Lưu thay đổi
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          <section className="room-student-card">
            <div className="room-student-card-header">
              <div>
                <h2>Sinh viên trong phòng</h2>

                <p>
                  Danh sách sinh viên có hợp đồng đang hoạt động tại phòng này.
                </p>
              </div>

              <span>{students.length} sinh viên</span>
            </div>

            {students.length === 0 ? (
              <div className="room-student-empty">
                <div>
                  <i className="fa fa-user-slash"></i>
                </div>

                <h3>Chưa có sinh viên</h3>

                <p>Hiện tại chưa có sinh viên nào đang ở phòng này.</p>
              </div>
            ) : (
              <div className="room-student-table-wrapper">
                <table className="room-student-table">
                  <thead>
                    <tr>
                      <th>Sinh viên</th>
                      <th>MSSV</th>
                      <th>Lớp</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id || `${student.username}-${index}`}>
                        <td>
                          <div className="room-student-name">
                            <div className="room-student-avatar">
                              {student.fullName
                                ? student.fullName
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()
                                : "S"}
                            </div>

                            <strong>
                              {student.fullName || "Chưa cập nhật"}
                            </strong>
                          </div>
                        </td>

                        <td>{student.username || "—"}</td>

                        <td>
                          <span className="room-student-class">
                            {student.className || "Chưa cập nhật"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
