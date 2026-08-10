import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../css/Sidebar.css";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
      });
    } catch (e) {}

    localStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_token");

    navigate("/login");
  };

  const menuItems = [
    {
      title: "TỔNG QUAN",
      items: [
        {
          icon: "fa fa-chart-pie",
          text: "Dashboard",
          path: "/admin/dashboard",
        },
      ],
    },

    {
      title: "QUẢN LÝ",
      items: [
        {
          icon: "fa fa-file-signature",
          text: "Đăng ký nội trú",
          path: "/admin/accounts",
        },

        {
          icon: "fa fa-user-graduate",
          text: "Sinh viên",
          path: "/admin/students",
        },

        {
          icon: "fa fa-door-open",
          text: "Phòng",
          path: "/admin/rooms",
        },

        {
          icon: "fa fa-couch",
          text: "Cơ sở vật chất",
          path: "/admin/facilities",
        },

        {
          icon: "fa fa-file-contract",
          text: "Đăng ký phòng",
          path: "/admin/contracts",
        },

        {
          icon: "fa fa-file-invoice-dollar",
          text: "Hóa đơn",
          path: "/admin/invoices",
        },

        {
          icon: "fa fa-bell",
          text: "Thông báo",
          path: "/admin/notifications",
        },
      ],
    },

    {
      title: "TÀI KHOẢN",
      items: [
        {
          icon: "fa fa-user-circle",
          text: "Thông tin cá nhân",
          path: "/admin/profile",
        },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "close"}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i
          className={`fa ${sidebarOpen ? "fa-angle-left" : "fa-angle-right"}`}
        ></i>
      </button>

      <div
        className="sidebar-logo"
        onClick={() => (window.location.href = "/")}
        style={{ cursor: "pointer" }}
      >
        <div className="logo-box">
          <img src="/assets/images/Logo_STU.png" alt="STU" />
        </div>

        {sidebarOpen && (
          <div className="logo-text">
            <h3>KÝ TÚC XÁ STU</h3>

            <p>Hệ thống quản lý</p>
          </div>
        )}
      </div>

      <div className="sidebar-menu">
        {menuItems.map((group, index) => (
          <div className="menu-group" key={index}>
            {sidebarOpen && <div className="menu-title">{group.title}</div>}

            {group.items.map((item) => {
              const active = location.pathname === item.path;

              return (
                <div
                  key={item.path}
                  className={`menu-item ${active ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className="menu-icon">
                    <i className={item.icon}></i>
                  </div>

                  {sidebarOpen && <span>{item.text}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <i className="fa fa-sign-out-alt"></i>

          {sidebarOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}
