import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SettingsPanel from "../components/SettingsPanel";
import Script from "../components/Script";

import { useNavigate } from "react-router-dom";

export default function AdminListFacility() {
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [facilityStatus, setFacilityStatus] = useState("ALL");
  const [roomFilter, setRoomFilter] = useState("ALL");
  const [sidebarColor, setSidebarColor] = useState("bg-white");

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [newFacility, setNewFacility] = useState({
    roomId: "",
    facilityName: "",
    quantity: 1,
    status: "GOOD",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  // LOAD DATA
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/admin/facilities", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFacilities(data);
        setFilteredFacilities(data);
      })
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/rooms", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
      })
      .catch((err) => console.error(err));
  }, [token]);

  // DANH SÁCH PHÒNG
  const roomList = [...new Set(facilities.map((f) => f.roomName))];

  // FILTER
  useEffect(() => {
    let filtered = facilities;

    if (roomFilter !== "ALL") {
      filtered = filtered.filter((f) => f.roomName === roomFilter);
    }

    if (facilityStatus !== "ALL") {
      filtered = filtered.filter((f) => f.status === facilityStatus);
    }

    setFilteredFacilities(filtered);
  }, [roomFilter, facilityStatus, facilities]);
  const handleAddFacility = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/facilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(newFacility),
      });

      const message = await res.text();

      if (res.ok) {
        window.showPopup(message || "Thêm thiết bị thành công!");

        setShowAddModal(false);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        window.showPopup(message, true);
      }
    } catch (err) {
      console.error(err);
      window.showPopup("Có lỗi xảy ra!", true);
    }
  };

  const handleUpdateFacility = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/facilities/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(newFacility),
        }
      );

      const message = await res.text();

      if (res.ok) {
        window.showPopup(message || "Cập nhật thành công!");

        setShowAddModal(false);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        window.showPopup(message, true);
      }
    } catch (err) {
      console.error(err);
      window.showPopup("Có lỗi xảy ra!", true);
    }
  };
  // DELETE
  const handleDelete = async (facilityId) => {
    window.showPopup(
      "Bạn có chắc chắn muốn xoá thiết bị này không?",
      false,
      true,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/admin/facilities/${facilityId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          if (res.ok) {
            setFacilities((prev) => prev.filter((f) => f.id !== facilityId));

            setTimeout(() => {
              window.showPopup("Xóa thành công!");
            }, 300);
          } else {
            const err = await res.text();
            window.showPopup(err, true);
          }
        } catch (err) {
          console.error(err);
          window.showPopup("Có lỗi xảy ra!", true);
        }
      }
    );
  };

  return (
    <div className="g-sidenav-show">
      <Sidebar color={sidebarColor} />

      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        {/* NAVBAR */}
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl">
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                <li className="breadcrumb-item text-sm">
                  <a className="opacity-5 text-dark" href="#">
                    Trang
                  </a>
                </li>

                <li
                  className="breadcrumb-item text-sm text-dark active"
                  aria-current="page"
                >
                  Quản lý cơ sở vật chất
                </li>
              </ol>
            </nav>

            <ul className="navbar-nav d-flex align-items-center justify-content-end">
              <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                <a
                  href="#"
                  className="nav-link text-body p-0"
                  id="iconNavbarSidenav"
                >
                  <div className="sidenav-toggler-inner">
                    <i className="sidenav-toggler-line"></i>
                    <i className="sidenav-toggler-line"></i>
                    <i className="sidenav-toggler-line"></i>
                  </div>
                </a>
              </li>

              <li className="nav-item px-3 d-flex align-items-center">
                <a href="#" className="nav-link text-body p-0">
                  <i className="material-symbols-rounded fixed-plugin-button-nav">
                    settings
                  </i>
                </a>
              </li>

              <li className="nav-item d-flex align-items-center">
                <a
                  href="http://localhost:3000/login"
                  className="nav-link text-body font-weight-bold px-0"
                >
                  <i className="material-symbols-rounded">account_circle</i>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* CONTENT */}
        <div className="container-fluid py-2">
          <div className="row">
            <div className="col-12">
              <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                    <h6 className="text-white text-capitalize ps-3">
                      Danh sách cơ sở vật chất
                    </h6>
                  </div>
                </div>

                <div className="card-body px-0 pb-2">
                  <div className="table-responsive p-0">
                    {/* FILTER */}
                    <div className="d-flex justify-content-between align-items-center px-4 pt-3">
                      <div className="d-flex gap-2">
                        <select
                          value={roomFilter}
                          onChange={(e) => setRoomFilter(e.target.value)}
                          className="form-select"
                          style={{
                            width: "180px",
                          }}
                        >
                          <option value="ALL">Tất cả phòng</option>

                          {roomList.map((room) => (
                            <option key={room} value={room}>
                              {room}
                            </option>
                          ))}
                        </select>

                        <select
                          value={facilityStatus}
                          onChange={(e) => setFacilityStatus(e.target.value)}
                          className="form-select"
                          style={{
                            width: "180px",
                          }}
                        >
                          <option value="ALL">Tất cả tình trạng</option>

                          <option value="GOOD">Tốt</option>

                          <option value="BROKEN">Hỏng</option>

                          <option value="MAINTENANCE">Bảo trì</option>
                        </select>
                      </div>

                      <button
                        className="btn btn-dark"
                        onClick={() => {
                          setIsEdit(false);
                          setEditingId(null);

                          setNewFacility({
                            roomId: "",
                            facilityName: "",
                            quantity: 1,
                            status: "GOOD",
                          });

                          setShowAddModal(true);
                        }}
                      >
                        + Thêm thiết bị
                      </button>
                    </div>

                    {/* TABLE */}
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr className="text-center">
                          <th>Phòng</th>
                          <th>Thiết bị</th>
                          <th>Số lượng</th>
                          <th>Tình trạng</th>
                          <th
                            style={{
                              width: "100px",
                            }}
                          >
                            Hành động
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredFacilities.length > 0 ? (
                          filteredFacilities.map((f) => (
                            <tr key={f.id} className="text-center">
                              <td>{f.roomName}</td>

                              <td>{f.facilityName}</td>

                              <td>{f.quantity}</td>

                              <td>
                                {f.status === "GOOD" && (
                                  <span className="badge bg-success">Tốt</span>
                                )}

                                {f.status === "BROKEN" && (
                                  <span className="badge bg-danger">Hỏng</span>
                                )}

                                {f.status === "MAINTENANCE" && (
                                  <span className="badge bg-warning text-dark">
                                    Bảo trì
                                  </span>
                                )}
                              </td>

                              <td>
                                <i
                                  className="fa-regular fa-pen-to-square text-secondary me-2"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setIsEdit(true);
                                    setEditingId(f.id);

                                    setNewFacility({
                                      roomId: f.roomId,
                                      facilityName: f.facilityName,
                                      quantity: f.quantity,
                                      status: f.status,
                                    });

                                    setShowAddModal(true);
                                  }}
                                ></i>

                                <i
                                  className="fa-solid fa-trash text-danger"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(f.id)}
                                ></i>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-3">
                              Không có dữ liệu
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showAddModal && (
        <div className="modern-modal-overlay">
          <div className="modern-modal">
            {/* HEADER */}
            <div className="modal-header-custom">
              <img
                src="/assets/images/small-logos/Logo_STU.png"
                alt="STU Logo"
                className="modal-logo"
              />

              <div>
                <h2 className="modal-title">
                  {isEdit ? "Cập nhật cơ sở vật chất" : "Thêm cơ sở vật chất"}
                </h2>

                <p className="modal-subtitle">Quản lý ký túc xá – STU</p>
              </div>
            </div>

            {/* FORM */}
            <div className="modal-body-custom">
              <div className="row g-3">
                {/* PHÒNG */}
                <div className="col-md-12">
                  <label className="form-label">
                    <strong>Phòng:</strong>
                  </label>

                  <select
                    className="form-select"
                    value={newFacility.roomId}
                    onChange={(e) =>
                      setNewFacility({
                        ...newFacility,
                        roomId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">-- Chọn phòng --</option>

                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TÊN THIẾT BỊ */}
                <div className="col-md-12">
                  <label className="form-label">
                    <strong>Tên thiết bị:</strong>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: Giường tầng, Máy lạnh..."
                    value={newFacility.facilityName}
                    onChange={(e) =>
                      setNewFacility({
                        ...newFacility,
                        facilityName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* SỐ LƯỢNG */}
                <div className="col-md-6">
                  <label className="form-label">
                    <strong>Số lượng:</strong>
                  </label>

                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="Nhập số lượng"
                    value={newFacility.quantity}
                    onChange={(e) =>
                      setNewFacility({
                        ...newFacility,
                        quantity: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                {/* TÌNH TRẠNG */}
                <div className="col-md-6">
                  <label className="form-label">
                    <strong>Tình trạng:</strong>
                  </label>

                  <select
                    className="form-select"
                    value={newFacility.status}
                    onChange={(e) =>
                      setNewFacility({
                        ...newFacility,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="GOOD">Tốt</option>

                    <option value="BROKEN">Hỏng</option>

                    <option value="MAINTENANCE">Bảo trì</option>
                  </select>
                </div>
              </div>

              {/* BUTTON */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Đóng
                </button>

                <button
                  className={`btn ${isEdit ? "btn-warning" : "btn-success"}`}
                  onClick={isEdit ? handleUpdateFacility : handleAddFacility}
                >
                  {isEdit ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <SettingsPanel
        sidebarColor={sidebarColor}
        setSidebarColor={setSidebarColor}
      />

      <Script />
      <style>{`
          .modern-modal-overlay{
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.55);
            backdrop-filter: blur(3px);
            display:flex;
            justify-content:center;
            align-items:center;
            z-index:9999;
          }

          .modern-modal{
            width:650px;
            max-width:95%;
            background:#fff;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 20px 50px rgba(0,0,0,.25);
            animation:fadeIn .25s ease;
          }

          .modal-header-custom{
            display:flex;
            align-items:center;
            gap:15px;
            padding:25px;
            background:linear-gradient(
              135deg,
              #212529,
              #343a40
            );
          }

          .modal-logo{
            width:70px;
            height:70px;
            object-fit:contain;
            background:white;
            border-radius:50%;
            padding:5px;
          }

          .modal-title{
            color:white;
            margin:0;
            font-size:24px;
            font-weight:700;
          }

          .modal-subtitle{
            color:#d6d6d6;
            margin:0;
            font-size:14px;
          }

          .modal-body-custom{
            padding:25px;
          }

          .modal-actions{
            display:flex;
            justify-content:flex-end;
            gap:10px;
            margin-top:25px;
          }

          .form-control,
          .form-select{
            border-radius:10px;
            height:45px;
          }

          .form-control:focus,
          .form-select:focus{
            box-shadow:none;
            border-color:#198754;
          }

          @keyframes fadeIn{
            from{
              opacity:0;
              transform:translateY(-15px);
            }
            to{
              opacity:1;
              transform:translateY(0);
            }
          }
          `}</style>
    </div>
  );
}
