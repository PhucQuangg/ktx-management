import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SettingsPanel from "../components/SettingsPanel";
import Script from "../components/Script";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {

  const [sidebarColor, setSidebarColor] = useState("bg-white");

  const [dashboard, setDashboard] = useState({});
  const [revenueChart, setRevenueChart] = useState([]);

  const [students, setStudents] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [tab, setTab] = useState("overview");

  const token = localStorage.getItem("admin_token");

  // ================= FETCH =================
  useEffect(() => {

    // DASHBOARD
    fetch("http://localhost:8080/api/admin/reports/dashboard", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setDashboard(data));

    // CHART
    fetch("http://localhost:8080/api/admin/reports/revenue-chart", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setRevenueChart(data));

    // STUDENTS
    fetch("http://localhost:8080/api/admin/students", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data));

    // CONTRACTS
    fetch("http://localhost:8080/api/admin/contracts", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setContracts(data));

    // INVOICES
    fetch("http://localhost:8080/api/admin/invoices", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setInvoices(data));

    // ROOMS
    fetch("http://localhost:8080/api/admin/rooms", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setRooms(data));

  }, []);

  // ================= FORMAT =================
  const formatMoney = (money) => {
    return Number(money || 0).toLocaleString("vi-VN") + " VNĐ";
  };

  // ================= EXPORT EXCEL =================
  const exportExcel = () => {
    window.open(
      "http://localhost:8080/api/admin/reports/export/excel",
      "_blank"
    );
  };

  // ================= EXPORT PDF =================
  const exportPDF = () => {
    window.open(
      "http://localhost:8080/api/admin/reports/export/pdf",
      "_blank"
    );
  };

  return (
    <div className="g-sidenav-show">

      {/* SIDEBAR */}
      <Sidebar color={sidebarColor} />

      {/* MAIN */}
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">

        {/* NAVBAR */}
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl">

          <div className="container-fluid py-1 px-3">

            <nav aria-label="breadcrumb">

              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0">

                <li className="breadcrumb-item text-sm">
                  <a className="opacity-5 text-dark" href="#">
                    Trang
                  </a>
                </li>

                <li
                  className="breadcrumb-item text-sm text-dark active"
                  aria-current="page"
                >
                  Báo cáo & Thống kê
                </li>

              </ol>

            </nav>

          </div>

        </nav>

        {/* CONTENT */}
        <div className="container-fluid py-4">

          {/* ===== TAB ===== */}
          <div className="card mb-4">

            <div className="card-body d-flex gap-3">

              <button
                className={`btn ${tab === "overview" ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => setTab("overview")}
              >
                Tổng quan
              </button>

              <button
                className={`btn ${tab === "detail" ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => setTab("detail")}
              >
                Báo cáo chi tiết
              </button>

              <button
                className={`btn ${tab === "finance" ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => setTab("finance")}
              >
                Thống kê tài chính
              </button>

            </div>

          </div>

          {/* ================================================= */}
          {/* ================= TỔNG QUAN ===================== */}
          {/* ================================================= */}

          {tab === "overview" && (
            <>

              {/* CHART */}
              <div className="card mb-4 shadow-sm border-0">

                <div className="card-header pb-0 d-flex justify-content-between align-items-center">

                  <h6 className="mb-0">
                    Biểu đồ doanh thu theo tháng
                  </h6>

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-success btn-sm"
                      onClick={exportExcel}
                    >
                      Xuất Excel
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={exportPDF}
                    >
                      Xuất PDF
                    </button>

                  </div>

                </div>

                <div className="card-body">

                  <ResponsiveContainer width="100%" height={350}>

                    <BarChart
                      data={revenueChart}
                      margin={{
                        top: 20,
                        right: 20,
                        left: 40,
                        bottom: 5,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 13 }}
                      />

                      <YAxis
                        width={100}
                        tickFormatter={(value) =>
                          Number(value).toLocaleString("vi-VN")
                        }
                      />

                      <Tooltip
                        formatter={(value) =>
                          Number(value).toLocaleString("vi-VN") + " VNĐ"
                        }
                      />

                      <Bar
                        dataKey="revenue"
                        fill="#344767"
                        radius={[10, 10, 0, 0]}
                        barSize={60}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

              {/* CARD */}
              <div className="row">

                <div className="col-xl-3 col-sm-6 mb-4">
                  <div className="card">
                    <div className="card-body">

                      <p className="text-sm mb-1">
                        Tổng sinh viên
                      </p>

                      <h3>{dashboard.totalStudents}</h3>

                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-4">
                  <div className="card">
                    <div className="card-body">

                      <p className="text-sm mb-1">
                        Tổng phòng
                      </p>

                      <h3>{dashboard.totalRooms}</h3>

                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-4">
                  <div className="card">
                    <div className="card-body">

                      <p className="text-sm mb-1">
                        Phòng còn trống
                      </p>

                      <h3 className="text-success">
                        {dashboard.availableRooms}
                      </h3>

                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-4">
                  <div className="card">
                    <div className="card-body">

                      <p className="text-sm mb-1">
                        Tổng hóa đơn
                      </p>

                      <h3>
                        {invoices.length}
                      </h3>

                    </div>
                  </div>
                </div>

              </div>

            </>
          )}

          {/* ================================================= */}
          {/* ============== BÁO CÁO CHI TIẾT ================= */}
          {/* ================================================= */}

          {tab === "detail" && (
            <>

              {/* STUDENTS */}
              <div className="card mb-4">

                <div className="card-header">
                  <h6>Danh sách sinh viên</h6>
                </div>

                <div className="table-responsive">

                  <table className="table align-items-center mb-0 text-center">

                    <thead>
                      <tr>
                        <th>MSSV</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                      </tr>
                    </thead>

                    <tbody>

                      {students.map((s) => (
                        <tr key={s.id}>

                          <td>{s.username}</td>

                          <td>{s.fullName}</td>

                          <td>{s.email}</td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* CONTRACT */}
              <div className="card mb-4">

                <div className="card-header">
                  <h6>Danh sách hợp đồng</h6>
                </div>

                <div className="table-responsive">

                  <table className="table align-items-center mb-0 text-center">

                    <thead>
                      <tr>
                        <th>Sinh viên</th>
                        <th>Phòng</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>

                    <tbody>

                      {contracts.map((c) => (
                        <tr key={c.id}>

                          <td>{c.studentName}</td>

                          <td>{c.roomName}</td>

                          <td>
                            {c.status === "PENDING" && "Chờ duyệt"}
                            {c.status === "ACTIVE" && "Đang hoạt động"}
                            {c.status === "REJECTED" && "Đã từ chối"}
                            {c.status === "CANCELED" && "Đã hủy"}
                            {c.status === "EXPIRED" && "Hết hạn"}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* INVOICE */}
              <div className="card mb-4">

                <div className="card-header">
                  <h6>Danh sách hóa đơn</h6>
                </div>

                <div className="table-responsive">

                  <table className="table align-items-center mb-0 text-center">

                    <thead>
                      <tr>
                        <th>Sinh viên</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>

                    <tbody>

                      {invoices.map((i) => (
                        <tr key={i.id}>

                          <td>{i.studentName}</td>

                          <td>{formatMoney(i.totalAmount)}</td>

                          <td>
                            {i.status === "PAID" && "Đã thanh toán"}
                            {i.status === "UNPAID" && "Chưa thanh toán"}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* ROOM */}
              <div className="card mb-4">

                <div className="card-header">
                  <h6>Danh sách phòng</h6>
                </div>

                <div className="table-responsive">

                  <table className="table align-items-center mb-0 text-center">

                    <thead>
                      <tr>
                        <th>Tên phòng</th>
                        <th>Sức chứa</th>
                        <th>Hiện tại</th>
                      </tr>
                    </thead>

                    <tbody>

                      {rooms.map((r) => (
                        <tr key={r.id}>

                          <td>{r.name}</td>

                          <td>{r.capacity}</td>

                          <td>{r.current_people}</td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </>
          )}

          {/* ================================================= */}
          {/* ============= THỐNG KÊ TÀI CHÍNH ================ */}
          {/* ================================================= */}

          {tab === "finance" && (
            <div className="row">

              <div className="col-xl-3 col-sm-6 mb-4">

                <div className="card">

                  <div className="card-body">

                    <p className="text-sm mb-1">
                      Tổng doanh thu
                    </p>

                    <h5 className="text-success">
                      {formatMoney(dashboard.revenue)}
                    </h5>

                  </div>

                </div>

              </div>

              <div className="col-xl-3 col-sm-6 mb-4">

                <div className="card">

                  <div className="card-body">

                    <p className="text-sm mb-1">
                      Hóa đơn đã thanh toán
                    </p>

                    <h3>
                      {dashboard.paidInvoices}
                    </h3>

                  </div>

                </div>

              </div>

              <div className="col-xl-3 col-sm-6 mb-4">

                <div className="card">

                  <div className="card-body">

                    <p className="text-sm mb-1">
                      Hóa đơn chưa thanh toán
                    </p>

                    <h3 className="text-danger">
                      {dashboard.unpaidInvoices}
                    </h3>

                  </div>

                </div>

              </div>

              <div className="col-xl-3 col-sm-6 mb-4">

                <div className="card">

                  <div className="card-body">

                    <p className="text-sm mb-1">
                      Tổng tiền chưa thanh toán
                    </p>

                    <h5 className="text-warning">
                      {formatMoney(dashboard.unpaidAmount)}
                    </h5>

                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* SETTINGS */}
      <SettingsPanel
        sidebarColor={sidebarColor}
        setSidebarColor={setSidebarColor}
      />

      <Script />

    </div>
  );
}