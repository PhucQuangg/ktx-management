import React, { useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

import "../css/ContactPage.css";

export default function ContactPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        <div className="contact-page">
          <div className="contact-banner">
            <h2>
              <i className="fa fa-phone"></i>
              Liên hệ hỗ trợ
            </h2>

            <p>
              Mọi thắc mắc về đăng ký nội trú, hợp đồng, hóa đơn hoặc phòng ở,
              vui lòng liên hệ Ban quản lý KTX để được hỗ trợ.
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-title">
              <div className="contact-icon">
                <i className="fa fa-building"></i>
              </div>

              <h3>Ban quản lý Ký túc xá Sinh viên</h3>
            </div>

            <div className="contact-list">
              <div className="contact-item">
                <i className="fa fa-map-marker"></i>

                <span>Địa chỉ: 180 Cao Lỗ, Phường 4, Quận 8, TP.HCM</span>
              </div>

              <div className="contact-item">
                <i className="fa fa-phone"></i>

                <span>Điện thoại: 028 3850 5520</span>
              </div>

              <div className="contact-item">
                <i className="fa fa-envelope"></i>

                <span>Email: ktx@stu.edu.vn</span>
              </div>

              <div className="contact-item">
                <i className="fa fa-clock-o"></i>

                <span>Giờ làm việc: 07:30 - 17:00 (Thứ 2 - Thứ 7)</span>
              </div>
            </div>

            <hr />

            <h3 className="map-title">
              <i className="fa fa-map"></i>
              Bản đồ vị trí
            </h3>

            <div className="map-container">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps?q=180%20Cao%20Lo,%20Quan%208,%20TPHCM&output=embed"
                width="100%"
                height="400"
                style={{
                  border: 0,
                }}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Script />
    </div>
  );
}
