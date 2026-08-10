import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import "../css/AdminHome.css";

export default function IndexPage() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("Quản trị viên");

  useEffect(() => {
    const name = sessionStorage.getItem("admin_fullname");

    if (name && name.trim()) {
      setAdminName(name);
    }
  }, []);

  const modules = [
    {
      title: "Quản lý đăng ký nội trú",
      icon: "fa fa-file-signature",
      colorClass: "blue",
      desc: "Xem và xét duyệt các đơn đăng ký nội trú của sinh viên.",
      path: "/admin/accounts",
    },
    {
      title: "Quản lý sinh viên",
      icon: "fa fa-user-graduate",
      colorClass: "cyan",
      desc: "Quản lý hồ sơ và thông tin sinh viên đang nội trú.",
      path: "/admin/students",
    },
    {
      title: "Quản lý phòng",
      icon: "fa fa-door-open",
      colorClass: "green",
      desc: "Theo dõi phòng ở, sức chứa và số lượng sinh viên.",
      path: "/admin/rooms",
    },
    {
      title: "Quản lý đăng ký phòng",
      icon: "fa fa-file-contract",
      colorClass: "orange",
      desc: "Xem, phê duyệt và theo dõi các đăng ký phòng nội trú.",
      path: "/admin/contracts",
    },
    {
      title: "Quản lý hóa đơn",
      icon: "fa fa-file-invoice-dollar",
      colorClass: "red",
      desc: "Tạo hóa đơn, theo dõi và xác nhận các khoản thanh toán.",
      path: "/admin/invoices",
    },
    {
      title: "Cơ sở vật chất",
      icon: "fa fa-couch",
      colorClass: "purple",
      desc: "Quản lý trang thiết bị và cơ sở vật chất của từng phòng.",
      path: "/admin/facilities",
    },
    {
      title: "Quản lý thông báo",
      icon: "fa fa-bell",
      colorClass: "yellow",
      desc: "Đăng tải và cập nhật thông báo dành cho sinh viên.",
      path: "/admin/notifications",
    },
    {
      title: "Thông tin cá nhân",
      icon: "fa fa-user-circle",
      colorClass: "slate",
      desc: "Xem và cập nhật thông tin tài khoản quản trị viên.",
      path: "/admin/profile",
    },
  ];

  return (
    <div className="admin-home-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`admin-home-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section
          className="admin-home-banner"
          style={{
            backgroundImage: "url('/assets/images/logoSTU.png')",
          }}
        >
          <div className="admin-home-banner-overlay"></div>

          <div className="admin-home-banner-decoration decoration-one"></div>
          <div className="admin-home-banner-decoration decoration-two"></div>

          <div className="admin-home-banner-content">
            <div className="admin-home-welcome-badge">
              <i className="fa fa-shield-alt"></i>
              Trang quản trị
            </div>

            <h1>HỆ THỐNG QUẢN LÝ KÝ TÚC XÁ</h1>

            <p className="admin-welcome-text">
              Xin chào, <strong>{adminName}</strong>
            </p>

            <p className="admin-home-banner-description">
              Quản lý tập trung sinh viên, phòng ở, đăng ký phòng, hóa đơn và cơ
              sở vật chất trong cùng một hệ thống.
            </p>

            <button
              type="button"
              className="admin-dashboard-button"
              onClick={() => navigate("/admin/dashboard")}
            >
              <i className="fa fa-chart-line"></i>
              Xem báo cáo thống kê
            </button>
          </div>
        </section>

        <section className="admin-home-section admin-introduction">
          <div className="admin-section-heading">
            <div className="admin-section-icon">
              <i className="fa fa-info-circle"></i>
            </div>

            <div>
              <h2>Giới thiệu hệ thống</h2>
              <p>Giải pháp hỗ trợ Ban quản lý ký túc xá</p>
            </div>
          </div>

          <div className="admin-introduction-content">
            <p>
              Hệ thống quản lý ký túc xá được xây dựng nhằm hỗ trợ Ban quản lý
              trong việc quản lý sinh viên, phòng ở, đăng ký phòng, hóa đơn, cơ
              sở vật chất và thông báo.
            </p>

            <p>
              Các chức năng được số hóa giúp giảm thời gian xử lý dữ liệu, hạn
              chế sai sót và nâng cao hiệu quả quản lý nội trú.
            </p>
          </div>
        </section>

        <section className="admin-modules-section">
          <div className="admin-modules-heading">
            <div>
              <h2>Chức năng quản lý</h2>
              <p>Truy cập nhanh các chức năng chính của hệ thống</p>
            </div>

            <span className="module-count">{modules.length} chức năng</span>
          </div>

          <div className="admin-module-grid">
            {modules.map((item) => (
              <button
                type="button"
                key={item.path}
                className="admin-module-card"
                onClick={() => navigate(item.path)}
              >
                <div className={`admin-module-icon ${item.colorClass}`}>
                  <i className={item.icon}></i>
                </div>

                <div className="admin-module-body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>

                <div className="admin-module-arrow">
                  <i className="fa fa-arrow-right"></i>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="admin-home-section admin-contact-section">
          <div className="admin-section-heading">
            <div className="admin-section-icon contact">
              <i className="fa fa-headset"></i>
            </div>

            <div>
              <h2>Thông tin liên hệ</h2>
              <p>Ban Quản lý Ký túc xá Sinh viên STU</p>
            </div>
          </div>

          <div className="admin-contact-grid">
            <div className="admin-contact-item">
              <div className="contact-item-icon">
                <i className="fa fa-map-marker-alt"></i>
              </div>

              <div>
                <label>Địa chỉ</label>
                <span>180 Cao Lỗ, Phường 4, Quận 8, TP.HCM</span>
              </div>
            </div>

            <div className="admin-contact-item">
              <div className="contact-item-icon">
                <i className="fa fa-phone"></i>
              </div>

              <div>
                <label>Điện thoại</label>
                <span>(028) 3850 5520</span>
              </div>
            </div>

            <div className="admin-contact-item">
              <div className="contact-item-icon">
                <i className="fa fa-envelope"></i>
              </div>

              <div>
                <label>Email</label>
                <span>ktx@stu.edu.vn</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="admin-home-footer">
          <span>© 2026 Hệ thống quản lý Ký túc xá STU</span>

          <span>Phiên bản dành cho quản trị viên</span>
        </footer>
      </main>
    </div>
  );
}
