import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import Script from "../../components/Script";
import AddRoomModal from "../../components/AddRoomModal";
import { useNavigate } from "react-router-dom";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomType, setRoomType] = useState("ALL");
  const [sidebarColor, setSidebarColor] = useState("bg-white");
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/admin/rooms", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setFilteredRooms(data);
      })
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    if (roomType === "ALL") {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter((r) => r.type === roomType));
    }
  }, [roomType, rooms]);

  const handleDelete = async (roomId,current_people) => {
    if(current_people > 0 ){
      window.showPopup("Không thể xoá phòng vì hiện có người đang ở!", true);
      return;
    }
    window.showPopup(
      "Bạn có chắc chắn muốn xoá phòng này không?",
      false,
      true,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/admin/rooms/delete/${roomId}`,
            { method: "DELETE", headers: { Authorization: "Bearer " + token } }
          );
          if (res.ok) {
            setRooms((prev) => prev.filter((r) => r.id !== roomId));
            setTimeout(() => {
              window.showPopup("Xoá phòng thành công!");
            }, 300);
          } else {
            const err = await res.text();
            window.showPopup(err, true);
          }
        } catch (err) {
          console.error(err);
          window.showPopup("Có lỗi xảy ra khi xoá phòng!", true);
        }
      }
    );
  };

  return (
    <div className="g-sidenav-show">
      <Sidebar color={sidebarColor} />

      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
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
                  Quản lý phòng
                </li>
              </ol>
            </nav>

            <ul className="navbar-nav d-flex align-items-center justify-content-end">
              <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                <a href="#" className="nav-link text-body p-0" id="iconNavbarSidenav">
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

        <div className="container-fluid py-2">
          <div className="row">
            <div className="col-12">
              <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                    <h6 className="text-white text-capitalize ps-3">Danh sách phòng</h6>
                  </div>
                </div>

                <div className="card-body px-0 pb-2">
                  <div className="table-responsive p-0">
                    <div className="d-flex justify-content-between align-items-center px-4 pt-3">
                      <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="form-select w-auto"
                      >
                        <option value="ALL">Tất cả</option>
                        <option value="NORMAL">Tiêu chuẩn</option>
                        <option value="PLUS">Tiện nghi</option>
                      </select>

                      <button
                        className="btn btn-dark"
                        onClick={() => setShowAddModal(true)}
                      >
                        + Thêm phòng
                      </button>
                    </div>

                    <table className="table align-middle mb-0">
                      <thead>
                        <tr className="text-center">
                          <th>Tên phòng</th>
                          <th>Sức chứa</th>
                          <th>SL hiện tại</th>
                          <th>Giá</th>
                          <th>Tình trạng</th>
                          <th>Loại phòng</th>
                          <th style={{ width: "100px" }}>Hành động</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredRooms.length > 0 ? (
                          filteredRooms.map((r) => (
                            <tr key={r.id} className="text-center">
                              <td style={{ whiteSpace: "nowrap" }}>{r.name}</td>
                              <td>{r.capacity}</td>
                              <td>{r.current_people}</td>
                              <td>{r.price}</td>
                              <td style={{ whiteSpace: "nowrap" }}>{r.status}</td>
                              <td>{r.type}</td>
                              <td>
                                <i
                                  className="fa-regular fa-pen-to-square text-secondary me-2"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => navigate(`/admin/update-room?id=${r.id}`)}
                                ></i>
                                <i
                                  className="fa-solid fa-trash text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDelete(r.id,r.current_people)}
                                ></i>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-3">
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

      <SettingsPanel sidebarColor={sidebarColor} setSidebarColor={setSidebarColor} />
      <Script />
      <AddRoomModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetch("http://localhost:8080/api/admin/rooms", {
            headers: { Authorization: "Bearer " + token },
          })
            .then((res) => res.json())
            .then((data) => {
              setRooms(data);
              setFilteredRooms(data);
            });
        }}
      />
    </div>
  );
}
