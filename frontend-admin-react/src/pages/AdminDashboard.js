import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import "../css/AdminDashboard.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [dashboard, setDashboard] = useState({});

  const [revenueChart, setRevenueChart] = useState([]);

  const [students, setStudents] = useState([]);

  const [contracts, setContracts] = useState([]);

  const [invoices, setInvoices] = useState([]);

  const [rooms, setRooms] = useState([]);

  const [tab, setTab] = useState("overview");

  const token = sessionStorage.getItem("admin_token");

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        dashboardRes,

        chartRes,

        studentsRes,

        contractsRes,

        invoicesRes,

        roomsRes,
      ] = await Promise.all([
        fetch("http://localhost:8080/api/admin/reports/dashboard", { headers }),

        fetch("http://localhost:8080/api/admin/reports/revenue-chart", {
          headers,
        }),

        fetch("http://localhost:8080/api/admin/students", { headers }),

        fetch("http://localhost:8080/api/admin/contracts", { headers }),

        fetch("http://localhost:8080/api/admin/invoices", { headers }),

        fetch("http://localhost:8080/api/admin/rooms", { headers }),
      ]);

      setDashboard(await dashboardRes.json());

      setRevenueChart(await chartRes.json());

      setStudents(await studentsRes.json());

      setContracts(await contractsRes.json());

      setInvoices(await invoicesRes.json());

      setRooms(await roomsRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const formatMoney = (money) =>
    Number(money || 0).toLocaleString("vi-VN") + " VNĐ";

  return (
    <div className="admin-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`admin-content ${sidebarOpen ? "" : "expand"}`}>
        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>

            <p>Báo cáo và thống kê hệ thống quản lý ký túc xá</p>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={tab === "overview" ? "active" : ""}
            onClick={() => setTab("overview")}
          >
            Tổng quan
          </button>

          <button
            className={tab === "detail" ? "active" : ""}
            onClick={() => setTab("detail")}
          >
            Báo cáo chi tiết
          </button>

          <button
            className={tab === "finance" ? "active" : ""}
            onClick={() => setTab("finance")}
          >
            Thống kê tài chính
          </button>
        </div>

        {tab === "overview" && (
          <>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="card-icon blue">
                  <i className="fa fa-user-graduate"></i>
                </div>

                <div className="card-info">
                  <span>Tổng sinh viên</span>

                  <h3>{dashboard.totalStudents || 0}</h3>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon green">
                  <i className="fa fa-door-open"></i>
                </div>

                <div className="card-info">
                  <span>Tổng phòng</span>

                  <h3>{dashboard.totalRooms || 0}</h3>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon orange">
                  <i className="fa fa-bed"></i>
                </div>

                <div className="card-info">
                  <span>Phòng còn trống</span>

                  <h3>{dashboard.availableRooms || 0}</h3>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon red">
                  <i className="fa fa-file-invoice-dollar"></i>
                </div>

                <div className="card-info">
                  <span>Tổng hóa đơn</span>

                  <h3>{invoices.length}</h3>
                </div>
              </div>
            </div>

            <div className="dashboard-chart">
              <div className="section-title">
                <div>
                  <h3>Doanh thu theo tháng</h3>

                  <p>Thống kê doanh thu từ hóa đơn.</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="month" />

                  <YAxis
                    tickFormatter={(value) =>
                      Number(value).toLocaleString("vi-VN")
                    }
                  />

                  <Tooltip formatter={(value) => formatMoney(value)} />

                  <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {tab === "detail" && (
          <>
            <div className="dashboard-table">
              <div className="section-title">
                <h3>Danh sách sinh viên</h3>
              </div>

              <table>
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

            <div className="dashboard-table">
              <div className="section-title">
                <h3>Danh sách đăng ký phòng</h3>
              </div>

              <table>
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

                        {c.status === "ACTIVE" && "Đang hiệu lực"}

                        {c.status === "REJECTED" && "Từ chối"}

                        {c.status === "CANCELED" && "Đã hủy"}

                        {c.status === "EXPIRED" && "Hết hạn"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dashboard-table">
              <div className="section-title">
                <h3>Danh sách hóa đơn</h3>
              </div>

              <table>
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
                        {i.status === "PAID"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dashboard-table">
              <div className="section-title">
                <h3>Danh sách phòng</h3>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Phòng</th>

                    <th>Sức chứa</th>

                    <th>Đang ở</th>
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
          </>
        )}

        {tab === "finance" && (
          <div className="finance-grid">
            <div className="finance-card">
              <span>Tổng doanh thu</span>

              <h2>{formatMoney(dashboard.revenue)}</h2>
            </div>

            <div className="finance-card">
              <span>Đã thanh toán</span>

              <h2>{dashboard.paidInvoices || 0}</h2>
            </div>

            <div className="finance-card">
              <span>Chưa thanh toán</span>

              <h2>{dashboard.unpaidInvoices || 0}</h2>
            </div>

            <div className="finance-card">
              <span>Tổng tiền chưa thu</span>

              <h2>{formatMoney(dashboard.unpaidAmount)}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
