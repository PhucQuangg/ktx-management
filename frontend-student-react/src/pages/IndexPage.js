import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";
import { useState } from "react";
export default function IndexPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const features = [
    {
      title: "Đăng ký nội trú",
      icon: "fa-edit",
      desc: "Đăng ký nội trú trực tuyến",
      color: "#3498db",
      link: "/register-dorm",
    },
    {
      title: "Chọn phòng",
      icon: "fa-bed",
      desc: "Xem phòng còn trống",
      color: "#27ae60",
      link: "/rooms",
    },
    {
      title: "Hợp đồng",
      icon: "fa-file",
      desc: "Theo dõi hợp đồng",
      color: "#9b59b6",
      link: "/my-contracts",
    },
    {
      title: "Hóa đơn",
      icon: "fa-credit-card",
      desc: "Thanh toán hóa đơn",
      color: "#f39c12",
      link: "/invoices",
    },
    {
      title: "Thông báo",
      icon: "fa-bell",
      desc: "Thông báo mới nhất",
      color: "#e74c3c",
      link: "/notifications",
    },
    {
      title: "Liên hệ",
      icon: "fa-phone",
      desc: "Liên hệ Ban quản lý",
      color: "#16a085",
      link: "/contact",
    },
  ];

  return (
    <>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} />

      <div
        className="content-wrapper"
        style={{
          marginLeft: sidebarOpen ? "260px" : "80px",
          marginTop: "70px",
          transition: "all .3s ease",
          background: "#eef4fb",
          minHeight: "100vh",
          paddingBottom: "40px",
        }}
      >
        <section
          style={{
            margin: "20px",
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            height: "430px",
            backgroundImage: "url('/assets/images/illustrations/STUU.jpg')",
            backgroundPosition: "center 25%",
            backgroundSize: "cover",
          }}
        >
          {" "}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.35))",
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
                fontSize: "48px",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              CHÀO MỪNG ĐẾN KÝ TÚC XÁ STU
            </h1>

            <p
              style={{
                fontSize: 20,
                marginTop: 20,
                marginBottom: 35,
              }}
            >
              Không gian học tập - Sinh hoạt - Phát triển toàn diện dành cho
              sinh viên
            </p>

            <a
              href="/register-dorm"
              style={{
                background: "#1565C0",
                color: "#fff",
                padding: "14px 40px",
                borderRadius: 35,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 17,
                display: "inline-block",
                transition: ".3s",
              }}
            >
              Đăng ký phòng ngay
            </a>
          </div>
        </section>

        <section
          style={{
            margin: "25px",
            background: "#fff",
            borderRadius: 20,
            padding: 35,
            boxShadow: "0 10px 25px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              color: "#0d47a1",
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Giới thiệu
          </h2>

          <p
            style={{
              lineHeight: "34px",
              fontSize: 17,
              color: "#555",
            }}
          >
            Hệ thống quản lý ký túc xá giúp sinh viên đăng ký nội trú, lựa chọn
            phòng, theo dõi hợp đồng, hóa đơn, nhận thông báo và liên hệ với Ban
            quản lý hoàn toàn trực tuyến.
          </p>
        </section>

        <div className="row" style={{ margin: "25px" }}>
          {features.map((item, index) => (
            <div className="col-md-4" key={index}>
              <a
                href={item.link}
                style={{
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: 35,
                    textAlign: "center",
                    marginBottom: 25,
                    border: "1px solid #e9eef5",
                    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
                    transition: ".3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(21,101,192,.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0,0,0,.08)";
                  }}
                >
                  <div
                    style={{
                      width: 82,
                      height: 82,
                      borderRadius: "50%",
                      background: item.color,
                      margin: "auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#fff",
                      fontSize: 34,
                    }}
                  >
                    <i className={`fa ${item.icon}`}></i>
                  </div>

                  <h3
                    style={{
                      marginTop: 25,
                      color: "#1d3557",
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      color: "#6c757d",
                      marginTop: 10,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>

        <section
          style={{
            margin: "25px",
            background: "#fff",
            borderRadius: 20,
            padding: 35,
            boxShadow: "0 10px 25px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              color: "#0d47a1",
              fontWeight: 700,
              marginBottom: 30,
            }}
          >
            Tiện ích ký túc xá
          </h2>

          <div className="row text-center">
            {[
              ["📶", "Wifi tốc độ cao"],
              ["🚗", "Bãi giữ xe"],
              ["🍱", "Nhà ăn"],
              ["📚", "Khu tự học"],
              ["🧺", "Giặt sấy"],
              ["🛡️", "An ninh 24/7"],
            ].map((item, index) => (
              <div className="col-md-2" key={index}>
                <div
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: "50%",
                    background: "#e8f2ff",
                    margin: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 35,
                  }}
                >
                  {item[0]}
                </div>

                <p
                  style={{
                    marginTop: 18,
                    color: "#1d3557",
                    fontWeight: 600,
                  }}
                >
                  {item[1]}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Script />
    </>
  );
}
