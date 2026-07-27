import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import Script from "../../components/Script";

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [sidebarColor, setSidebarColor] = useState("bg-white");

  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [notification, setNotification] = useState({
    title: "",
    content: "",
    published: false,
  });

  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();
  const token = sessionStorage.getItem("admin_token");
  
  const fetchNotifications = () => {
    fetch("http://localhost:8080/api/admin/notifications", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.text();
          window.showPopup(err || "Lỗi tải dữ liệu", true);
          return;
        }

        return res.json();
      })
      .then((data) => {
        if (!data) return;

        const filtered = data.filter(
          (n) =>
            n.title?.toLowerCase().includes(keyword.toLowerCase()) ||
            n.content?.toLowerCase().includes(keyword.toLowerCase())
        );

        setNotifications(filtered);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNotifications();
  }, [token, keyword]);

  const handleDelete = async (id) => {
    window.showPopup(
      "Bạn có chắc chắn muốn xoá thông báo này?",
      false,
      true,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/notifications/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          const message = await res.text();

          if (res.ok) {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== id)
            );

            setTimeout(() => {
              window.showPopup("Xóa thành công!");
            }, 200);
          } else {
            setTimeout(() => {
              window.showPopup(
                message || "Không thể xoá!",
                true
              );
            }, 200);
          }
        } catch (err) {
          console.error(err);

          setTimeout(() => {
            window.showPopup("Lỗi kết nối server!", true);
          }, 200);
        }
      }
    );
  };

  const togglePublish = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/${id}/publish`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (res.ok) {
        fetchNotifications();
      } else {
        const msg = await res.text();
        window.showPopup(msg, true);
      }
    } catch (err) {
      console.error(err);
      window.showPopup("Lỗi kết nối server!", true);
    }
  };

  const handleAddNotification = async () => {

    if (!notification.title.trim()) {
      window.showPopup("Vui lòng nhập tiêu đề!", true);
      return;
    }
  
    if (!notification.content.trim()) {
      window.showPopup("Vui lòng nhập nội dung!", true);
      return;
    }
  
    try {
  
      const res = await fetch(
        "http://localhost:8080/api/admin/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(notification),
        }
      );
  
      if (!res.ok) {
  
        const err = await res.text();
  
        window.showPopup(
          err || "Không thể thêm thông báo!",
          true
        );
  
        return;
      }
  
      window.showPopup(
        "Thêm thông báo thành công!"
      );
  
      setShowModal(false);
  
      setTimeout(() => {
        window.location.reload();
      }, 1200);
  
    } catch (error) {
  
      console.error(error);
  
      window.showPopup(
        "Lỗi kết nối server!",
        true
      );
    }
  };

  const handleUpdateNotification = async () => {

    if (!notification.title.trim()) {
      window.showPopup("Vui lòng nhập tiêu đề!", true);
      return;
    }
  
    if (!notification.content.trim()) {
      window.showPopup("Vui lòng nhập nội dung!", true);
      return;
    }
  
    try {
  
      const res = await fetch(
        `http://localhost:8080/api/admin/notifications/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(notification),
        }
      );
  
      if (!res.ok) {
  
        const err = await res.text();
  
        window.showPopup(
          err || "Không thể cập nhật!",
          true
        );
  
        return;
      }
  
      window.showPopup(
        "Cập nhật thông báo thành công!"
      );
  
      setShowModal(false);
  
      setTimeout(() => {
        window.location.reload();
      }, 1200);
  
    } catch (error) {
  
      console.error(error);
  
      window.showPopup(
        "Lỗi kết nối server!",
        true
      );
    }
  };

  return (
    <div className="g-sidenav-show">
      <Sidebar color={sidebarColor} />

      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">

        {/* NAVBAR */}
        <nav
          className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl"
          id="navbarBlur"
        >
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0">
                <li className="breadcrumb-item text-sm">
                  <a
                    className="opacity-5 text-dark"
                    href="#"
                  >
                    Trang
                  </a>
                </li>

                <li
                  className="breadcrumb-item text-sm text-dark active"
                  aria-current="page"
                >
                  Quản lý thông báo
                </li>
              </ol>
            </nav>
          </div>
        </nav>

        {/* CONTENT */}
        <div className="container-fluid py-2">
          <div className="row">
            <div className="col-12">

              <div className="card my-4">

                {/* HEADER */}
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                    <h6 className="text-white text-capitalize ps-3">
                      Danh sách thông báo
                    </h6>
                  </div>
                </div>

                <div className="card-body px-0 pb-2">

                  {/* FILTER */}
                  <div className="d-flex justify-content-between align-items-center px-4 pt-3">

                    <input
                      type="text"
                      placeholder="Tìm kiếm thông báo..."
                      className="form-control border border-dark"
                      style={{ width: "300px" }}
                      value={keyword}
                      onChange={(e) =>
                        setKeyword(e.target.value)
                      }
                    />

                  <button
                    className="btn btn-dark mb-0"
                    onClick={() => {

                      setIsEdit(false);

                      setEditingId(null);

                      setNotification({
                        title: "",
                        content: "",
                        published: false,
                      });

                      setShowModal(true);

                    }}
                  >
                    + Thêm thông báo
                  </button>
                  </div>

                  {/* TABLE */}
                  <div className="table-responsive p-0">

                    <table className="table align-middle mb-0">

                      <thead className="text-center">
                        <tr>
                          <th>Tiêu đề</th>
                          <th>Ngày tạo</th>
                          <th>Trạng thái</th>
                          <th style={{ width: "150px" }}>
                            Hành động
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        {notifications.length > 0 ? (
                          notifications.map((item) => (
                            <tr
                              key={item.id}
                              className="text-center"
                            >

                              <td>{item.title}</td>

                              

                              <td>
                                {item.createdAt
                                  ? new Date(
                                      item.createdAt
                                    ).toLocaleDateString("vi-VN")
                                  : ""}
                              </td>

                              <td>
                                {item.published ? (
                                  <span className="badge bg-success">
                                    Đã đăng
                                  </span>
                                ) : (
                                  <span className="badge bg-secondary">
                                    Đã ẩn
                                  </span>
                                )}
                              </td>

                              <td>

                                {/* EDIT */}
                                <i
                                  className="fa-regular fa-pen-to-square text-secondary me-3"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {

                                    setIsEdit(true);
                                  
                                    setEditingId(item.id);
                                  
                                    setNotification({
                                      title: item.title,
                                      content: item.content,
                                      published: item.published,
                                    });
                                  
                                    setShowModal(true);
                                  
                                  }}
                                  
                                ></i>

                                {/* PUBLISH */}
                                <i
                                  className={`fa-solid ${
                                    item.published
                                      ? "fa-eye-slash text-warning"
                                      : "fa-eye text-success"
                                  } me-3`}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    togglePublish(item.id)
                                  }
                                ></i>

                                {/* DELETE */}
                                <i
                                  className="fa-solid fa-trash text-danger"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleDelete(item.id)
                                  }
                                ></i>

                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center py-3"
                            >
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
      {showModal && (
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
            {isEdit
              ? "Cập nhật thông báo"
              : "Thêm thông báo"}
          </h2>

          <p className="modal-subtitle">
            Quản lý ký túc xá – STU
          </p>

        </div>

      </div>

      {/* BODY */}
      <div className="modal-body-custom">

        <div className="row g-3">

          {/* TIÊU ĐỀ */}
          <div className="col-12">

            <label className="form-label">
              <strong>Tiêu đề:</strong>
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Nhập tiêu đề thông báo"
              value={notification.title}
              onChange={(e) =>
                setNotification({
                  ...notification,
                  title: e.target.value,
                })
              }
            />

          </div>

          {/* NỘI DUNG */}
          <div className="col-12">

            <label className="form-label">
              <strong>Nội dung:</strong>
            </label>

            <textarea
              rows="6"
              className="form-control"
              placeholder="Nhập nội dung thông báo..."
              value={notification.content}
              onChange={(e) =>
                setNotification({
                  ...notification,
                  content: e.target.value,
                })
              }
            />

          </div>

          {/* TRẠNG THÁI */}
          <div className="col-12">

            <label className="form-label">
              <strong>Trạng thái:</strong>
            </label>

            <select
              className="form-select"
              value={notification.published}
              onChange={(e) =>
                setNotification({
                  ...notification,
                  published:
                    e.target.value === "true",
                })
              }
            >

              <option value="false">
                Chưa đăng
              </option>

              <option value="true">
                Đã đăng
              </option>

            </select>

          </div>

        </div>

        {/* BUTTON */}
        <div className="modal-actions">

          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowModal(false)}
          >
            Đóng
          </button>

          <button
            className={`btn ${
              isEdit
                ? "btn-warning"
                : "btn-success"
            }`}
            onClick={
              isEdit
                ? handleUpdateNotification
                : handleAddNotification
            }
          >
            {isEdit
              ? "Cập nhật"
              : "Thêm thông báo"}
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
      <style>
        {
          `.modern-modal-overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(3px);
  z-index: 99999;
}

.modern-modal{
  position: fixed;



  width: 650px;
  max-width: 95%;

  background: white;
  border-radius: 20px;

  overflow: hidden;

  box-shadow: 0 20px 50px rgba(0,0,0,.25);
  textarea.form-control{
  min-height:180px;
  resize:none;
  border:1px solid #ced4da !important;
  border-radius:10px;
  padding:12px;
  line-height:1.6;
}
}`
        }
      </style>
    </div>
  );
}