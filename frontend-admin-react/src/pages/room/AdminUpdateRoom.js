import React, { useEffect, useState } from "react";

export default function UpdateRoom() {
  const [room, setRoom] = useState({
    name: "",
    capacity: 0,
    current_people: 0,
    price: 0,
    type: "",
    status: "",
  });
  const [students, setStudents] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("id");
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!roomId) return;
    loadRoom(roomId);
    loadStudentsInRoom(roomId);
  }, [roomId]);

  // Load thông tin phòng
  const loadRoom = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/rooms/edit/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.text();
        window.showPopup(err,true);
        return;
      }
      const data = await res.json();
      setRoom(data);
    } catch (err) {
      console.error(err);
      window.showPopupt("Lỗi khi tải thông tin phòng",true);
    }
  };

  // Load sinh viên dựa vào Contract
  const loadStudentsInRoom = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/contracts/room/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom(prev => ({ ...prev, [name]: value }));
  };

  const saveRoom = async () => {
    if (!room.name || !room.capacity || !room.price || !room.type || !room.status) {
      window.showPopup("Vui lòng nhập đầy đủ thông tin!",true);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/admin/rooms/update/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(room),
      });
      if (!res.ok) {
        const err = await res.text();
        window.showPopupt(err);
        return;
      }
      window.showPopup("Cập nhật phòng thành công!");
      setEditMode(false);
      loadRoom(roomId);
    } catch (err) {
      console.error(err);
      window.showPopup("Lỗi khi cập nhật phòng",true);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="topbar mb-4 d-flex align-items-center gap-3">
        <div className="brand d-flex align-items-center gap-3">
          <img src="/assets/images/small-logos/Logo_STU.png" alt="STU Logo" style={{ width: 100 }} />
          <div>
            <h1 className="fs-3 fw-bold text-primary mb-0">Thông Tin Phòng</h1>
            <p className="text-muted mb-0">Quản lý ký túc xá — Đại học Công nghệ Sài Gòn</p>
          </div>
        </div>
      </div>

      {/* Layout 2 cột */}
      <div className="row">
        {/* Cột trái: thông tin phòng */}
        <div className="col-lg-5">
          <div className="card p-4 mb-4">
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label fw-bold">Tên phòng</label>
                <input type="text" className="form-control" name="name" value={room.name} onChange={handleChange} readOnly={!editMode} 
                style={{ border: "1px solid #ced4da", borderRadius: "0.375rem", backgroundColor: "#fff" , paddingLeft: "0.75rem", }}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Sức chứa</label>
                <input type="number" className="form-control" name="capacity" value={room.capacity} onChange={handleChange} readOnly={!editMode} 
                style={{ border: "1px solid #ced4da", borderRadius: "0.375rem", backgroundColor: "#fff" , paddingLeft: "0.75rem", }}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Số người hiện tại</label>
                <input type="number" className="form-control" value={students.length} readOnly 
                style={{ border: "1px solid #ced4da", borderRadius: "0.375rem", backgroundColor: "#fff" , paddingLeft: "0.75rem", }}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Giá phòng (VNĐ)</label>
                <input type="number" className="form-control" name="price" value={room.price} onChange={handleChange} readOnly={!editMode} 
                style={{ border: "1px solid #ced4da", borderRadius: "0.375rem", backgroundColor: "#fff" , paddingLeft: "0.75rem", }}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Loại phòng</label>
                <select className="form-select" name="type" value={room.type} onChange={handleChange} disabled={!editMode}
                 style={{ border: "1px solid #ced4da", borderRadius: "0.375rem" , paddingLeft: "0.75rem", }}
                >
                  <option value="">-- Chọn loại phòng --</option>
                  <option value="NORMAL">Tiêu chuẩn</option>
                  <option value="PLUS">Tiện nghi</option>
                </select>
              </div>
              <div className="col-md-12">
                <label className="form-label fw-bold">Trạng thái</label>
                <select className="form-select" name="status" value={room.status} onChange={handleChange} disabled={!editMode}
                style={{ border: "1px solid #ced4da", borderRadius: "0.375rem" , paddingLeft: "0.75rem", }}
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="AVAILABLE">Còn trống</option>
                  <option value="FULL">Đầy</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              {!editMode && <button className="btn btn-warning fw-bold" onClick={() => setEditMode(true)}>Cập nhật</button>}
              {editMode && <button className="btn btn-success fw-bold" onClick={saveRoom}>Lưu</button>}
              {editMode && <button className="btn btn-outline-secondary fw-bold" onClick={() => { setEditMode(false); loadRoom(roomId); }}>Hủy</button>}
              <button className="btn btn-outline-secondary fw-bold" onClick={() => window.history.back()}>Trở về</button>
            </div>
          </div>
        </div>

        {/* Cột phải: danh sách sinh viên */}
        <div className="col-lg-7">
          <div className="card p-4 mb-4" style={{ maxHeight: "600px", overflowY: "auto" }}>
            <h5 className="fw-bold mb-3 text-center">Sinh viên đang ở phòng này</h5>
            {students.length > 0 ? (
              <table className="table text-center mb-0">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>MSSV</th>
                    <th>Lớp</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(stu => (
                    <tr key={stu.id}>
                      <td>{stu.fullName}</td>
                      <td>{stu.username}</td>
                      <td>{stu.className}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-center text-muted">Chưa có sinh viên nào ở phòng này</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
