import React from "react";

const Sidebar = ({ color }) => {

  const logout = () => {
    fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("admin_token");
          window.location.href = "http://localhost:3000/login";
        } else {
          alert("Logout failed: " + response.status);
        }
      })
      .catch(() => alert("Không thể kết nối tới server!"));
  };

  return (
    <aside className={`sidenav navbar navbar-vertical navbar-expand-xs border-radius-lg fixed-start ms-2 bg-white my-2 ${color}`}>
      <div className="sidenav-header">
        <i
          className="fas fa-times p-3 cursor-pointer text-dark opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
          aria-hidden="true"
        ></i>
        <a
          className="navbar-brand px-4 py-3 m-0"
          href="https://demos.creative-tim.com/material-dashboard/pages/dashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/images/logo-ct-dark.png"
            className="navbar-brand-img"
            width="26"
            height="26"
            alt="main_logo"
          />
          <span className="ms-1 text-sm text-dark">Dormitory Management</span>
        </a>
      </div>
      <hr className="horizontal dark mt-0 mb-2" />
      <div className="collapse navbar-collapse w-auto">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link text-dark" href="/">
              <i className="material-symbols-rounded opacity-5">dashboard</i>
              <span className="nav-link-text ms-1">Thống kê</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark" href="/admin/accounts">
              <i className="material-symbols-rounded opacity-5">table_view</i>
              <span className="nav-link-text ms-1">Quản lý tài khoản</span>
            </a>
          </li>
     
          <li className="nav-item">
            <a className="nav-link text-dark" href="/admin/students">
              <i className="material-symbols-rounded opacity-5">table_view</i>
              <span className="nav-link-text ms-1">Quản lý sinh viên</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark" href="/admin/rooms">
              <i className="material-symbols-rounded opacity-5">table_view</i>
              <span className="nav-link-text ms-1">Quản lý phòng</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark" href="/admin/contracts">
              <i className="material-symbols-rounded opacity-5">receipt_long</i>
              <span className="nav-link-text ms-1">Quản lý hợp đồng</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark" href="/notifications">
              <i className="material-symbols-rounded opacity-5">notifications</i>
              <span className="nav-link-text ms-1">Notifications</span>
            </a>
          </li>
          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs text-dark font-weight-bolder opacity-5">
              Account pages
            </h6>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark" href="/profile">
              <i className="material-symbols-rounded opacity-5">person</i>
              <span className="nav-link-text ms-1">Thông tin cá nhân</span>
            </a>
          </li>
          <li className="nav-item">
            <button
              className="nav-link text-dark btn"
              style={{ textAlign: "left", paddingLeft: "1rem" }}
              onClick={logout}
            >
              <i className="material-symbols-rounded opacity-5">logout</i>
              <span className="nav-link-text ms-1">Đăng xuất</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
