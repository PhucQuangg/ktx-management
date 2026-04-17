import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Script from "../../components/Script";

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("");

  const [selected, setSelected] = useState(null);

  const token = sessionStorage.getItem("token");
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; 
    }
  }, []);

  const formatMoney = (amount) =>
    amount?.toLocaleString("vi-VN") + " đ";

  // 👉 LOAD DATA
  const fetchInvoices = () => {
    setLoading(true);

    fetch("http://localhost:8080/api/student/invoices", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const isOverdue = (inv) =>
    inv.status === "UNPAID" &&
    new Date(inv.dueDate) < new Date();

  const filtered = invoices.filter(inv =>
    (!month || inv.month.includes(month)) &&
    (!status || inv.status === status)
  );

  if (loading) return <p style={{ padding: 20 }}>Đang tải hóa đơn...</p>;

  return (
    <div>
      <Header />
      <Sidebar />

      <div className="content-wrapper">
      <div className="container-fluid py-4 content-body">

        {/* 👉 LIST */}
        {!selected && (
          <>
            <h3 style={{fontWeight:"bold"}}>Hóa đơn của tôi</h3>

            <div className="filter-bar">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="form-control"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-control"
              >
                <option value="">Tất cả</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="UNPAID">Chưa thanh toán</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <p>Không có hóa đơn.</p>
            ) : (
              filtered.map((inv) => {
                const overdue = isOverdue(inv);

                return (
                  <div
                    key={inv.id}
                    className={`invoice-card 
                      ${inv.status === "PAID" ? "paid" : ""} 
                      ${overdue ? "overdue" : "unpaid"}`}
                  >
                    <div>
                      <div className="title">
                        Hóa đơn tháng {inv.month}
                      </div>

                      <div>Phòng: {inv.roomName}</div>

                      <div className="amount">
                        {formatMoney(inv.totalAmount)}
                      </div>

                      <span className={`status ${inv.status.toLowerCase()}`}>
                        {inv.status === "PAID"
                          ? "Đã thanh toán"
                          : overdue
                          ? "⚠️ Quá hạn"
                          : "Chưa thanh toán"}
                      </span>
                    </div>

                    <div className="actions">
                      <button
                        className="btn-detail"
                        onClick={() => setSelected(inv)}
                      >
                        Xem
                      </button>

                      {inv.status === "UNPAID" && (
                        <button className="btn-pay">
                          Thanh toán
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* 👉 DETAIL */}
        {selected && (
          <div className="invoice-detail">

            <div className="back" onClick={() => setSelected(null)}>
              ← Quay lại
            </div>

            <h3 className="detail-title">
              HÓA ĐƠN THÁNG {selected.month}
            </h3>

            <div className="detail-box">
              <div><b>Phòng:</b> {selected.roomName}</div>

              <div>
                <b>Trạng thái:</b>{" "}
                <span className={`status ${selected.status.toLowerCase()}`}>
                  {selected.status === "PAID"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </div>

              <div>
                <b>Hạn:</b>{" "}
                {new Date(selected.dueDate).toLocaleDateString("vi-VN")}
              </div>
            </div>

            <table className="table mt-3">
              <tbody>
                <tr>
                  <td>Tiền phòng</td>
                  <td className="text-end">
                    {formatMoney(selected.roomPrice)}
                  </td>
                </tr>
                <tr>
                  <td>Phí dịch vụ (Điện + Nước)</td>
                  <td className="text-end">
                    {formatMoney(selected.serviceFee)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="total">
              {formatMoney(selected.totalAmount)}
            </div>

            {selected.status === "UNPAID" && (
              <div className="pay-wrapper">
                <button className="btn-pay">
                  Thanh toán
                </button>
              </div>
            )}

          </div>
        )}

      </div>
      </div>

      

      <Script />

      <style>{`
      
        .content-body {
          max-width: 900px;
        }

        .filter-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          max-width: 400px;
        }

        .invoice-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-radius: 14px;
          margin-bottom: 14px;
          background: #fff;
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          transition: 0.2s;
          border-left: 6px solid #ccc;
        }

        .invoice-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.1);
        }

        .invoice-card.paid {
          border-left: 6px solid #10b981;
        }

        .invoice-card.unpaid {
          border-left: 6px solid #f59e0b;
        }

        .invoice-card.overdue {
          border-left: 6px solid #ef4444;
          background: #fff5f5;
        }

        .title {
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          width: 100%;
        }

        .amount {
          font-size: 20px;
          font-weight: bold;
          color: #ef4444;
          margin: 6px 0;
        }

        .status {
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 13px;
        }

        .status.paid {
          background: #d1fae5;
          color: #10b981;
        }

        .status.unpaid {
          background: #fef3c7;
          color: #d97706;
        }

        .actions button {
          margin-left: 8px;
          padding: 7px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .btn-detail {
          background: #3b82f6;
          color: #fff;
        }

        .btn-pay {
          background: #10b981;
          color: #fff;
          border: none;
          padding: 7px 14px;
          
        }
          .pay-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
          }

          .invoice-detail {
        background: #fff;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 6px 16px rgba(0,0,0,0.06);
      }

      .back {
        cursor: pointer;
        color: #3b82f6;
        margin-bottom: 8px;
      }

      .detail-title {
        font-weight: bold;
        margin-bottom: 10px;
      }

      .detail-box {
        margin-bottom: 10px;
        line-height: 1.6;
      }

      .total {
        text-align: right;
        font-size: 22px;
        font-weight: bold;
        color: #ef4444;
      }
      `}</style>
    </div>
  );
}
