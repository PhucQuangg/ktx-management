import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import Script from "../../components/Script";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);

  const [filterMonth, setFilterMonth] = useState("");
  const [status, setStatus] = useState("");
  const [roomName, setRoomName] = useState("");

  const [createMonth, setCreateMonth] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const isOverdue = (inv) => {
    return inv.status === "UNPAID" && new Date(inv.dueDate) < new Date();
  };
  

  const [rooms, setRooms] = useState([]);
  const [sidebarColor, setSidebarColor] = useState("bg-white");
  const token = localStorage.getItem("admin_token");

  // 👉 LOAD ROOMS
  const fetchRooms = () => {
    fetch("http://localhost:8080/api/admin/rooms", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error(err));
  };

  // 👉 LOAD INVOICES (CÓ FILTER)
  const fetchInvoices = () => {
    let url = "http://localhost:8080/api/admin/invoices?";

    if (filterMonth) url += `month=${filterMonth}&`;
    if (status) url += `status=${status}&`;
    if (roomName) url += `roomName=${roomName}&`;

    fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.text();
          window.showPopup(err || "Lỗi khi tải hóa đơn", true);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setInvoices(data);
      })
      .catch((err) => console.error(err));
  };

  // 👉 LOAD LẦN ĐẦU
  useEffect(() => {
    if (!token) return;
    fetchInvoices();
    fetchRooms();
  }, [token]);

  // 👉 AUTO FILTER
  useEffect(() => {
    if (!token) return;
    fetchInvoices();
  }, [filterMonth, status, roomName]);

  // 👉 DEFAULT THÁNG HIỆN TẠI CHO FILTER
  useEffect(() => {
    const now = new Date();
    const m = now.toISOString().slice(0, 7);
    setFilterMonth(m);
  }, []);

  // 👉 TẠO HÓA ĐƠN
  const handleGenerate = async () => {
    if (!createMonth) {
      return window.showPopup("Vui lòng chọn tháng", true);
    }

    window.showPopup(
      `Tạo hóa đơn cho tháng ${createMonth}?`,
      false,
      true,
      async () => {
        try {
          const res = await fetch(
            "http://localhost:8080/api/admin/invoices/generate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
              body: JSON.stringify({ month: createMonth }),
            }
          );

          const message = await res.text();

          if (res.ok) {
            setTimeout(() => {
              window.showPopup(message || "Tạo hóa đơn thành công!");
              fetchInvoices();
            }, 200);
          } else {
            setTimeout(() => {
              window.showPopup(message || "Tạo thất bại!", true);
            }, 200);
          }
        } catch (err) {
          console.error(err);
          window.showPopup("Lỗi server!", true);
        }
      }
    );
  };
  const handleRemind = async () => {
    window.showPopup(
      "Gửi nhắc nhở tất cả hóa đơn chưa thanh toán?",
      false,
      true,
      async () => {
        try {
          const res = await fetch(
            "http://localhost:8080/api/admin/invoices/remind",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
  
          const data = await res.text();
  
          if (res.ok) {
            setTimeout(() => {
              window.showPopup(data || "Đã gửi nhắc nhở!");
            }, 200);
          } else {
            setTimeout(() => {
              window.showPopup(data || "Gửi thất bại!", true);
            }, 200);
          }
        } catch (err) {
          console.error(err);
          window.showPopup("Lỗi server!", true);
        }
      }
    );
  };
  
  const hasUnpaid = invoices.some(
    (i) => i.status === "UNPAID"
  );
  
  return (
    <div className="g-sidenav-show">
      <Sidebar color={sidebarColor} />

      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">

        {/* NAVBAR */}
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl">
          <div className="container-fluid py-1 px-3">
            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0">
              <li className="breadcrumb-item text-sm">
                <a className="opacity-5 text-dark" href="#">Trang</a>
              </li>
              <li className="breadcrumb-item text-sm text-dark active">
                Quản lý hóa đơn
              </li>
            </ol>
            <ul className="navbar-nav d-flex align-items-center justify-content-end">
              <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                <a href="#" className="nav-link text-body p-0" id="iconNavbarSidenav">
                  <div className="sidenav-toggler-inner">
                    <i className="sidenav-toggler-line"></i>
                    <i className="sidenav-toggler-line"></i>
                    <i className="sidenav-toggler-line"></i>
                  </div>
                </a>
              </li>

              <li className="nav-item px-3 d-flex align-items-center">
                <a href="#" className="nav-link text-body p-0">
                  <i className="material-symbols-rounded fixed-plugin-button-nav">
                    settings
                  </i>
                </a>
              </li>

              <li className="nav-item d-flex align-items-center">
                <a
                  href="http://localhost:3000/login"
                  className="nav-link text-body font-weight-bold px-0"
                >
                  <i className="material-symbols-rounded">account_circle</i>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* CONTENT */}
        <div className="container-fluid py-2">
          <div className="card my-4">

            {/* HEADER */}
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">
                  Danh sách hóa đơn
                </h6>
              </div>
            </div>

            {/* BODY */}
            <div className="card-body">
              
            <div className="d-flex justify-content-between align-items-center px-4 pt-3">

            {/* FILTER */}
            <div className="row g-2 flex-grow-1 me-3">

              <div className="col-md-4">
                <input
                  type="month"
                  className="form-control"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="UNPAID">Chưa thanh toán</option>
                  <option value="PAID">Đã thanh toán</option>
                </select>
              </div>

              <div className="col-md-4">
                <select
                  className="form-control"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                >
                  <option value="">Tất cả phòng</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.name || r.roomName}>
                      {r.name || r.roomName}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="d-flex gap-2">
              <input
                type="month"
                className="form-control"
                value={createMonth}
                onChange={(e) => setCreateMonth(e.target.value)}
              />

              <button
                className="btn btn-dark"
                onClick={handleGenerate}
                style={{padding:"10px", minWidth:"80px"}}
              >
                Tạo hóa đơn
              </button>
              <button
                  className="btn btn-warning"
                  onClick={handleRemind}
                  disabled={!hasUnpaid}
                  style={{padding:"10px"}}
                >
                  🔔 Nhắc thanh toán
              </button>
            </div>

            </div>


              {/* TABLE */}
              <div className="table-responsive p-0 mt-3">
                <table className="table align-middle mb-0">
                  <thead className="text-center">
                    <tr>
                      <th>Sinh viên</th>
                      <th>Phòng</th>
                      <th>Tháng</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th>Hạn thanh toán</th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoices.length > 0 ? (
                      invoices.map((inv) => (
                        <tr
                            key={inv.id}
                            className={`text-center ${isOverdue(inv) ? "table-danger" : ""}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedInvoice(inv)}
                          >
                          <td>{inv.studentName}</td>
                          <td>{inv.roomName}</td>
                          <td>{inv.month}</td>
                          <td>{inv.totalAmount?.toLocaleString()} đ</td>

                          <td>
                            {inv.status === "PAID" ? (
                              <span className="badge bg-success">
                                Đã thanh toán
                              </span>
                            ) : (
                              <span className="badge bg-warning">
                                Chưa thanh toán
                              </span>
                            )}
                          </td>

                          <td>{inv.dueDate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-3">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
                {selectedInvoice && (
                  <>
                    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.3)" }}>

                      <div className="modal-dialog">
                        <div className="modal-content">

                          {/* HEADER */}
                          <div className="modal-header">
                            <h5 className="modal-title">Chi tiết hóa đơn</h5>
                            <button
                              className="btn-close"
                              onClick={() => setSelectedInvoice(null)}
                            ></button>
                          </div>

                          {/* BODY */}
                          <div className="modal-body">

                            <div className="row mb-2">
                              <div className="col-6"><b>Sinh viên:</b></div>
                              <div className="col-6">{selectedInvoice.studentName}</div>
                            </div>

                            <div className="row mb-2">
                              <div className="col-6"><b>Phòng:</b></div>
                              <div className="col-6">{selectedInvoice.roomName}</div>
                            </div>

                            <div className="row mb-2">
                              <div className="col-6"><b>Tháng:</b></div>
                              <div className="col-6">{selectedInvoice.month}</div>
                            </div>

                            <hr />

                            <div className="row mb-2">
                              <div className="col-6"><b>Tiền phòng:</b></div>
                              <div className="col-6">
                                {selectedInvoice.roomPrice?.toLocaleString()} đ
                              </div>
                            </div>

                            <div className="row mb-2">
                              <div className="col-6"><b>Phí dịch vụ:</b></div>
                              <div className="col-6">
                                {selectedInvoice.serviceFee?.toLocaleString()} đ
                              </div>
                            </div>

                            <div className="row mb-2">
                              <div className="col-6"><b>Tổng tiền:</b></div>
                              <div className="col-6 text-danger fw-bold">
                                {selectedInvoice.totalAmount?.toLocaleString()} đ
                              </div>
                            </div>

                            <hr />

                            <div className="row mb-2">
                              <div className="col-6"><b>Trạng thái:</b></div>
                              <div className="col-6">
                                {selectedInvoice.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                              </div>
                            </div>

                            <div className="row mb-2">
                              <div className="col-6"><b>Hạn thanh toán:</b></div>
                              <div className="col-6">{new Date(selectedInvoice.dueDate).toLocaleDateString("vi-VN")}
                              </div>
                            </div>

                          </div>

                          {/* FOOTER */}
                          <div className="modal-footer">
                            <button
                              className="btn btn-secondary"
                              onClick={() => setSelectedInvoice(null)}
                            >
                              Đóng
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* BACKDROP */}
                    <div
                  className="modal-backdrop fade show"
                  onClick={() => setSelectedInvoice(null)}
                ></div>

                  </>
                )}

              </div>

            </div>
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
