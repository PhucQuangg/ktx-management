import React, { useState } from "react";
import "./AddRoomModal.css";

export default function AddRoomModal({ show, onClose, onSuccess }) {
  const token = localStorage.getItem("admin_token");

  const [form, setForm] = useState({
    name: "",
    capacity: "",
    current_people: 0,
    price: "",
    type: "",
    status: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/admin/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      window.showPopup("Thêm phòng thành công!");
      onSuccess();
      onClose();
    } else {
      const err = await res.text();
      window.showPopup(err, true);
    }
  };

  if (!show) return null;

  return (
    <div className="modern-modal-overlay">
      <div className="modern-modal">

        <div className="modal-header-custom">
          <img
            src="/assets/images/small-logos/Logo_STU.png"
            alt="STU Logo"
            className="modal-logo"
          />
          <div>
            <h2 className="modal-title">Thêm phòng mới</h2>
            <p className="modal-subtitle">Quản lý ký túc xá – STU</p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="modal-body-custom">

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label"><strong>Tên phòng:</strong></label>
              <input name="name" className="form-control"  placeholder="Nhập tên phòng"  onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label"><strong>Sức chứa:</strong></label>
              <input type="number" name="capacity" className="form-control" placeholder="Số lượng sinh viên tối đa" onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label"><strong>Giá phòng:</strong></label>
              <input type="number" name="price" className="form-control" placeholder="Giá phòng" onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label"><strong>Loại phòng:</strong></label>
              <select name="type" className="form-select" onChange={handleChange} required>
                <option value="">-- Chọn --</option>
                <option value="NORMAL">Tiêu chuẩn</option>
                <option value="PLUS">Tiện nghi</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label"><strong>Trạng thái:</strong></label>
              <select name="status" className="form-select"  onChange={handleChange} required>
                <option value="">-- Chọn --</option>
                <option value="AVAILABLE">Còn trống</option>
                <option value="FULL">Đầy</option>
                <option value="MAINTENANCE">Bảo trì</option>
              </select>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="modal-actions">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Đóng
            </button>
            <button type="submit" className="btn btn-success">
              Thêm phòng
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
