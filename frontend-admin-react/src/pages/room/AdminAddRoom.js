import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import "../../css/AdminRoomForm.css";

export default function AddRoom() {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    capacity: "",
    price: "",
    type: "NORMAL",
    status: "AVAILABLE",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      window.showPopup?.("Vui lòng nhập tên phòng.", true);
      return false;
    }

    if (!form.capacity) {
      window.showPopup?.("Vui lòng nhập sức chứa.", true);
      return false;
    }

    if (Number(form.capacity) <= 0) {
      window.showPopup?.("Sức chứa phải lớn hơn 0.", true);
      return false;
    }

    if (!form.price) {
      window.showPopup?.("Vui lòng nhập giá phòng.", true);
      return false;
    }

    if (Number(form.price) <= 0) {
      window.showPopup?.("Giá phòng phải lớn hơn 0.", true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        capacity: Number(form.capacity),
        price: Number(form.price),
        type: form.type,
        status: form.status,
        current_people: 0,
      };

      const res = await fetch("http://localhost:8080/api/admin/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const message = await res.text();

      if (!res.ok) {
        throw new Error(message || "Không thể thêm phòng.");
      }

      window.showPopup?.(message || "Thêm phòng thành công!");

      setTimeout(() => {
        navigate("/admin/rooms");
      }, 800);
    } catch (error) {
      console.error(error);

      window.showPopup?.(error.message || "Lỗi khi thêm phòng.", true);
    } finally {
      setSubmitting(false);
    }
  };

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

            <h1>Thêm phòng</h1>

            <p>
              Tạo mới phòng ký túc xá và thiết lập sức chứa, giá phòng, loại
              phòng và trạng thái ban đầu.
            </p>
          </div>

          <div className="room-form-banner-icon">
            <i className="fa fa-building"></i>
          </div>
        </section>

        <section className="room-form-card">
          <div className="room-form-card-header">
            <div className="room-form-header-icon">
              <i className="fa fa-door-open"></i>
            </div>

            <div>
              <h2>Thông tin phòng</h2>

              <p>
                Các trường có dấu
                <span className="required-mark"> *</span> là thông tin bắt buộc.
              </p>
            </div>
          </div>

          <form className="room-form" onSubmit={handleSubmit}>
            <div className="room-form-grid">
              <div className="room-form-group">
                <label htmlFor="name">
                  Tên phòng
                  <span>*</span>
                </label>

                <div className="room-input-wrapper">
                  <i className="fa fa-door-closed"></i>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ví dụ: A101"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="room-form-group">
                <label htmlFor="capacity">
                  Sức chứa
                  <span>*</span>
                </label>

                <div className="room-input-wrapper">
                  <i className="fa fa-users"></i>

                  <input
                    id="capacity"
                    type="number"
                    name="capacity"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="Nhập số sinh viên tối đa"
                  />
                </div>
              </div>

              <div className="room-form-group">
                <label htmlFor="price">
                  Giá phòng
                  <span>*</span>
                </label>

                <div className="room-input-wrapper">
                  <i className="fa fa-money-bill-wave"></i>

                  <input
                    id="price"
                    type="number"
                    name="price"
                    min="0"
                    step="1000"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Nhập giá phòng"
                  />

                  <span className="room-input-suffix">VNĐ</span>
                </div>
              </div>

              <div className="room-form-group">
                <label htmlFor="type">
                  Loại phòng
                  <span>*</span>
                </label>

                <div className="room-input-wrapper">
                  <i className="fa fa-layer-group"></i>

                  <select
                    id="type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="NORMAL">Tiêu chuẩn</option>

                    <option value="PLUS">Tiện nghi</option>
                  </select>
                </div>
              </div>

              <div className="room-form-group full-width">
                <label>
                  Trạng thái ban đầu
                  <span>*</span>
                </label>

                <div className="room-status-options">
                  <label
                    className={`room-status-option available ${
                      form.status === "AVAILABLE" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="AVAILABLE"
                      checked={form.status === "AVAILABLE"}
                      onChange={handleChange}
                    />

                    <span className="room-radio"></span>

                    <i className="fa fa-check-circle"></i>

                    <div>
                      <strong>Còn trống</strong>
                      <small>Phòng có thể tiếp nhận sinh viên.</small>
                    </div>
                  </label>

                  <label
                    className={`room-status-option maintenance ${
                      form.status === "MAINTENANCE" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="MAINTENANCE"
                      checked={form.status === "MAINTENANCE"}
                      onChange={handleChange}
                    />

                    <span className="room-radio"></span>

                    <i className="fa fa-tools"></i>

                    <div>
                      <strong>Bảo trì</strong>
                      <small>Phòng chưa thể đưa vào sử dụng.</small>
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
                  Số lượng sinh viên hiện tại sẽ được hệ thống tự động thiết lập
                  bằng 0 khi tạo phòng mới. Trạng thái “Đã đầy” sẽ được tự động
                  cập nhật khi số lượng sinh viên đạt sức chứa tối đa.
                </p>
              </div>
            </div>

            <div className="room-form-actions">
              <button
                type="button"
                className="room-form-back-button"
                onClick={() => navigate("/admin/rooms")}
                disabled={submitting}
              >
                <i className="fa fa-arrow-left"></i>
                Trở về
              </button>

              <button
                type="submit"
                className="room-form-submit-button"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <i className="fa fa-plus"></i>
                    Thêm phòng
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
