import React, { useState } from "react";

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
    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.5)",
        zIndex: 2000,
      }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-3">
          <h4 className="mb-3">Thêm phòng mới</h4>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tên phòng:</label>
                <input name="name" className="form-control" onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Sức chứa:</label>
                <input type="number" name="capacity" className="form-control" onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Giá phòng:</label>
                <input type="number" name="price" className="form-control" onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Loại phòng:</label>
                <select name="type" className="form-select" onChange={handleChange} required>
                  <option value="">-- Chọn --</option>
                  <option value="NORMAL">Tiêu chuẩn</option>
                  <option value="PLUS">Tiện nghi</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Trạng thái:</label>
                <select name="status" className="form-select" onChange={handleChange} required>
                  <option value="">-- Chọn --</option>
                  <option value="AVAILABLE">Còn trống</option>
                  <option value="FULL">Đầy</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Đóng
              </button>
              <button type="submit" className="btn btn-success">
                Thêm phòng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
