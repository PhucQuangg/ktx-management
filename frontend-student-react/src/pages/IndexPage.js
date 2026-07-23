import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

export default function IndexPage() {
  const features = [
    {
      title: "Đăng ký nội trú",
      icon: "fa-edit",
      desc: "Đăng ký nội trú trực tuyến",
      color: "#3498db",
      link: "/register-dormitory",
    },
    {
      title: "Chọn phòng",
      icon: "fa-bed",
      desc: "Xem phòng còn trống",
      color: "#27ae60",
      link: "/room-type",
    },
    {
      title: "Hợp đồng",
      icon: "fa-file",
      desc: "Theo dõi hợp đồng",
      color: "#9b59b6",
      link: "/student/contracts",
    },
    {
      title: "Hóa đơn",
      icon: "fa-credit-card",
      desc: "Thanh toán hóa đơn",
      color: "#f39c12",
      link: "/student/invoices",
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
    <div className="wrapper">
      <Header />
      <Sidebar />

      <div
        className="content-wrapper"
        style={{
          background: "#f7f9fc",
          minHeight: "100vh",
          paddingTop: "70px",
          paddingBottom: "40px",
        }}
      >
        {/* Banner */}

        <section
          style={{
            margin: "20px",
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            height: "430px",
            backgroundImage:
              "url('/assets/images/illustrations/STUU.jpg')",
            backgroundPosition: "center 25%",
            backgroundSize: "cover",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.35))",
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
                fontSize: "52px",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              CHÀO MỪNG ĐẾN KÝ TÚC XÁ STU
            </h1>

            <p
              style={{
                fontSize: "22px",
                marginBottom: "35px",
              }}
            >
              Không gian học tập - Sinh hoạt - Phát triển toàn diện dành cho sinh
              viên.
            </p>

            <a
              href="/room-type"
              className="btn btn-warning btn-lg"
              style={{
                borderRadius: "30px",
                padding: "13px 40px",
                fontWeight: "bold",
              }}
            >
              Đăng ký phòng ngay
            </a>
          </div>
        </section>

        {/* Giới thiệu */}

        <div
          style={{
            margin: "20px",
            background: "#fff",
            borderRadius: "15px",
            padding: "35px",
            boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              color: "#2c3e50",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Giới thiệu
          </h2>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "32px",
            }}
          >
            Hệ thống quản lý ký túc xá giúp sinh viên đăng ký nội trú, lựa chọn
            phòng, quản lý hợp đồng, theo dõi hóa đơn, nhận thông báo và liên hệ
            với Ban quản lý một cách nhanh chóng, thuận tiện và trực tuyến.
          </p>
        </div>

        {/* Chức năng */}

        <div className="row" style={{ margin: "20px" }}>
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
                    borderRadius: "18px",
                    padding: "35px",
                    marginBottom: "25px",
                    textAlign: "center",
                    transition: ".35s",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(0,0,0,.08)",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: item.color,
                      margin: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "34px",
                    }}
                  >
                    <i className={`fa ${item.icon}`}></i>
                  </div>

                  <h3
                    style={{
                      marginTop: "25px",
                      color: "#2c3e50",
                      fontWeight: "600",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      color: "#777",
                      marginTop: "10px",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Tiện ích */}

        <div
          style={{
            margin: "20px",
            background: "#fff",
            borderRadius: "15px",
            padding: "35px",
            boxShadow: "0 5px 18px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ fontWeight: "700", marginBottom: "25px" }}>
            Tiện ích ký túc xá
          </h2>

          <div className="row text-center">

            <div className="col-md-2"><h1>📶</h1><p>Wifi</p></div>

            <div className="col-md-2"><h1>🚗</h1><p>Bãi xe</p></div>

            <div className="col-md-2"><h1>🍱</h1><p>Nhà ăn</p></div>

            <div className="col-md-2"><h1>📚</h1><p>Khu tự học</p></div>

            <div className="col-md-2"><h1>🧺</h1><p>Giặt sấy</p></div>

            <div className="col-md-2"><h1>🛡️</h1><p>An ninh 24/7</p></div>

          </div>
        </div>
      </div>

      <Script />
    </div>
  );
}