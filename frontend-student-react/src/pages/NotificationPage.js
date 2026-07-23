import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Script from "../components/Script";

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/student/notifications"
      );

      if (!res.ok) {
        throw new Error("Không thể tải thông báo");
      }

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
      window.showPopup("Lỗi tải thông báo", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />

      <div
        className="content-wrapper"
        style={{
          paddingTop: "50px",      
          paddingBottom: "40px",
          minHeight: "100vh",
        }}
      >

        <div
          className="container"
          style={{
            paddingTop: "20px",
            maxWidth: "1100px",
          }}
        >

          {/* Header */}
          <div className="notification-header">

            <div>
              <h2>Thông báo ký túc xá</h2>
              <p>
                Cập nhật các thông báo mới nhất từ Ban quản lý KTX
              </p>
            </div>

            <div className="notification-icon">
              🔔
            </div>

          </div>

          {/* Content */}
          {loading ? (

            <div className="notification-empty">
              Đang tải dữ liệu...
            </div>

          ) : notifications.length === 0 ? (

            <div className="notification-empty">

              <div style={{ fontSize: 60 }}>
                🔕
              </div>

              <h4>Chưa có thông báo</h4>

              <p>
                Hiện tại chưa có thông báo nào.
              </p>

            </div>

          ) : (

            <div className="notification-grid">

              {notifications.map((item) => (

                <div
                  key={item.id}
                  className="notification-card"
                >

                  <div className="notification-card-header">

                    <h4>
                      📢 {item.title}
                    </h4>

                    <span>
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString("vi-VN")
                        : ""}
                    </span>

                  </div>

                  <hr />

                  <div className="notification-content">

                    {item.content}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      <Script />

      <style>{`

        .notification-header{
          background:white;
          border-radius:16px;
          padding:25px;
          margin-bottom:25px;
          box-shadow:0 4px 20px rgba(0,0,0,0.08);

          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .notification-header h2{
          margin:0;
          color:#344767;
          font-weight:700;
        }

        .notification-header p{
          margin-top:8px;
          color:#67748e;
        }

        .notification-icon{
          font-size:48px;
        }

        .notification-grid{
          display:grid;
          grid-template-columns:
            repeat(auto-fill,minmax(450px,1fr));
          gap:20px;
        }

        .notification-card{
          background:white;
          border-radius:16px;
          padding:20px;
          box-shadow:0 4px 20px rgba(0,0,0,0.08);
          transition:0.25s;
        }

        .notification-card:hover{
          transform:translateY(-4px);
        }

        .notification-card-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:15px;
        }

        .notification-card-header h4{
          margin:0;
          color:#344767;
          font-weight:700;
        }

        .notification-card-header span{
          color:#8392ab;
          font-size:14px;
          white-space:nowrap;
        }

        .notification-content{
          white-space:pre-wrap;
          line-height:1.8;
          color:#67748e;
          min-height:80px;
        }

        .notification-empty{
          background:white;
          border-radius:16px;
          padding:60px;
          text-align:center;
          box-shadow:0 4px 20px rgba(0,0,0,0.08);
        }

      `}</style>

    </div>
  );
}