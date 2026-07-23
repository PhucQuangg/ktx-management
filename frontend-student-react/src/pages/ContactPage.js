import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

export default function ContactPage() {
  return (
    <div>
      <Header />
      <Sidebar />

      <div className="content-wrapper"
       style={{
        marginTop: "50px",
        minHeight: "calc(100vh - 50px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
    }}>
        <div className="container-fluid py-4">

            <div className="contact-header">
            <h2>📞 Liên hệ hỗ trợ</h2>
            <p>
                Mọi thắc mắc về đăng ký nội trú, hợp đồng, hóa đơn hoặc phòng ở,
                vui lòng liên hệ Ban quản lý Ký túc xá để được hỗ trợ.
            </p>
            </div>

          <div className="contact-card">

            <h4>Ban quản lý Ký túc xá Sinh viên</h4>

            <div className="contact-item">
              <i className="fa fa-map-marker"></i>
              <span>
                Địa chỉ: 180 Cao Lỗ, Phường 4, Quận 8, TP.HCM
              </span>
            </div>

            <div className="contact-item">
              <i className="fa fa-phone"></i>
              <span>
                Điện thoại: 028 3850 5520
              </span>
            </div>

            <div className="contact-item">
              <i className="fa fa-envelope"></i>
              <span>
                Email: ktx@stu.edu.vn
              </span>
            </div>

            <div className="contact-item">
              <i className="fa fa-clock-o"></i>
              <span>
                Giờ làm việc: 07:30 - 17:00 (Thứ 2 - Thứ 7)
              </span>
            </div>

            <hr />

            <h3 className="page-title">Liên hệ</h3>

            <div className="map-container">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps?q=180%20Cao%20Lo,%20Quan%208,%20TPHCM&output=embed"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

          </div>

        </div>
      </div>

      <Script />

      <style>{`
      .contact-header {
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        color: white;
        padding: 28px;
        border-radius: 10px;
        margin-bottom: 24px;
        box-shadow: 0 8px 24px rgba(37, 99, 235, 0.2);
        margin-top: 20px;
        }

        .contact-header h2 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        }

        .contact-header p {
        margin-top: 10px;
        opacity: 0.95;
        font-size: 15px;
        line-height: 1.6;
        }
        .page-title{
          font-weight:700;
          margin-bottom:20px;
        }

        .contact-card{
          background:#fff;
          padding:25px;
          border-radius:12px;
          box-shadow:0 2px 10px rgba(0,0,0,0.08);
        }

        .contact-card h4{
          margin-bottom:20px;
          font-weight:700;
          color:#2563eb;
        }

        .contact-item{
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:15px;
          font-size:15px;
        }

        .contact-item i{
          width:20px;
          color:#2563eb;
        }

        .map-container{
          margin-top:15px;
          overflow:hidden;
          border-radius:10px;
        }
      `}</style>
    </div>
  );
}