import React, { useEffect, useState, useCallback } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

import "../css/StudentNotifications.css";

export default function StudentNotifications() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  const fetchNotifications = useCallback(() => {
    fetch("http://localhost:8080/api/student/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())

      .then((data) => {
        setNotifications(data);
      })

      .catch((err) => {
        console.error(err);

        window.showPopup("Lỗi tải thông báo!", true);
      })

      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="wrapper">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} />

      <div
        className="content-wrapper"
        style={{
          marginLeft: sidebarOpen ? "260px" : "80px",
          transition: ".3s",
          marginTop: "65px",
        }}
      >
        <div className="notification-page">
          <div className="notification-banner">
            <h2>
              <i className="fa fa-bell"></i>
              Thông báo ký túc xá
            </h2>

            <p>Cập nhật các thông báo mới nhất từ Ban quản lý KTX.</p>
          </div>

          {loading ? (
            <div className="notification-empty">
              <i className="fa fa-spinner"></i>

              <h3>Đang tải dữ liệu...</h3>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">
              <i className="fa fa-bell-slash"></i>

              <h3>Chưa có thông báo</h3>

              <p>Hiện tại chưa có thông báo nào.</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((item) => (
                <div className="notification-card" key={item.id}>
                  <div className="notification-left">
                    <div className="notification-icon">
                      <i className="fa fa-bullhorn"></i>
                    </div>

                    <div className="notification-info">
                      <h3>{item.title}</h3>

                      <div className="notification-date">
                        <i className="fa fa-calendar"></i>

                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                          : ""}
                      </div>

                      <div className="notification-content">{item.content}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Script />
    </div>
  );
}
