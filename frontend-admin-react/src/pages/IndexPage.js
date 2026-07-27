import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import SettingsPanel from "../components/SettingsPanel";
import Script from "../components/Script";

export default function IndexPage() {
  const [sidebarColor, setSidebarColor] = useState("bg-white");


  const modules = [
    {
      title: "Quản lý sinh viên",
      icon: "fa-users",
      color: "#00c0ef",
      desc: "Quản lý thông tin sinh viên nội trú",
    },
    {
      title: "Quản lý phòng",
      icon: "fa-building",
      color: "#00a65a",
      desc: "Quản lý phòng và sức chứa",
    },
    {
      title: "Quản lý hợp đồng",
      icon: "fa-file-contract",
        color: "#f39c12",
      desc: "Quản lý hợp đồng lưu trú",
    },
    {
      title: "Quản lý hóa đơn",
      icon: "fa-credit-card",
      color: "#dd4b39",
      desc: "Quản lý thanh toán hóa đơn",
    },
    {
      title: "Cơ sở vật chất",
      icon: "fa-cubes",
      color: "#605ca8",
      desc: "Quản lý trang thiết bị",
    },
    {
      title: "Thông báo",
      icon: "fa-bullhorn",
      color: "#39cccc",
      desc: "Quản lý thông báo",
    },
  ];

  return (
    <div className="g-sidenav-show">
      <Sidebar color={sidebarColor} />

      <main className="main-content position-relative">

        <div
          className="content-wrapper"
          style={{
            background: "#f5f7fa",
            minHeight: "100vh",
          }}
        >

          {/* Banner */}

          <section
            style={{
              margin: 20,
              height: 420,
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
              backgroundImage:
                "url('/assets/images/illustrations/index.jpg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,.55)",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                color: "#fff",
                textAlign: "center",
                width: "90%",
              }}
            >
              <h1
                style={{
                  fontWeight: 700,
                  fontSize: 48,
                  color: "#fff",
                }}
              >
                HỆ THỐNG QUẢN LÝ KÝ TÚC XÁ
              </h1>

              <p
                style={{
                  fontSize: 20,
                  marginTop: 15,
                }}
              >
                Trang quản trị dành cho Ban Quản lý Ký túc xá
              </p>
            </div>
          </section>

          {/* Giới thiệu */}

          <div className="box" style={{ margin: 20 }}>
            <div className="box-header">
              <h3 className="box-title">
                Giới thiệu hệ thống
              </h3>
            </div>

            <div
              className="box-body"
              style={{
                fontSize: 17,
                lineHeight: "32px",
              }}
            >
              Hệ thống quản lý ký túc xá sinh viên được xây dựng nhằm hỗ trợ Ban
              quản lý trong việc quản lý sinh viên, phòng ở, hợp đồng, hóa đơn,
              cơ sở vật chất và thông báo. Hệ thống giúp số hóa quy trình quản
              lý, nâng cao hiệu quả làm việc và giảm thời gian xử lý dữ liệu.
            </div>
          </div>

          {/* Module */}

          <div className="row" style={{ margin: 20 }}>

            {modules.map((item, index) => (

              <div className="col-lg-4 col-md-6" key={index}>

                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    textAlign: "center",
                    padding: 35,
                    marginBottom: 25,
                    boxShadow: "0 4px 15px rgba(0,0,0,.08)",
                    transition: ".3s",
                    cursor: "pointer",
                  }}
                >

                  <i
                    className={`fa ${item.icon}`}
                    style={{
                      fontSize: 45,
                      color: item.color,
                      marginBottom: 20,
                    }}
                  />

                  <h4
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </h4>

                  <p
                    style={{
                      color: "#666",
                      marginTop: 10,
                    }}
                  >
                    {item.desc}
                  </p>

                </div>

              </div>

            ))}

          </div>

          
          {/* Liên hệ */}

          <div className="box" style={{ margin: 20 }}>

            <div className="box-header">

              <h3 className="box-title">

                Thông tin liên hệ

              </h3>

            </div>

            <div
              className="box-body"
              style={{
                lineHeight: "32px",
                fontSize: 16,
              }}
            >

              <p>
                <b>Ban Quản lý Ký túc xá Sinh viên</b>
              </p>

              <p>
                <i className="fa fa-map-marker"></i> 180 Cao Lỗ, Phường 4,
                Quận 8, TP.HCM
              </p>

              <p>
                <i className="fa fa-phone"></i> (028) 3850 5520
              </p>

              <p>
                <i className="fa fa-envelope"></i> ktx@stu.edu.vn
              </p>

            </div>

          </div>

          {/* Footer */}

          <div
            style={{
              textAlign: "center",
              color: "#888",
              padding: 30,
            }}
          >
            © 2026 Student Dormitory Management System
          </div>

        </div>

      </main>

      <SettingsPanel
        sidebarColor={sidebarColor}
        setSidebarColor={setSidebarColor}
      />

      <Script />
    </div>
  );
}