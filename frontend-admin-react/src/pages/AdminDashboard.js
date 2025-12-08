import SettingsPanel from "../components/SettingsPanel";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";
import React, { useState } from "react";

export default function AdminDashboard() {
  const [sidebarColor, setSidebarColor] = useState("bg-white");
  

  return (
    <div className="g-sidenav-show">
      {/* Sidebar */}
      <Sidebar color={sidebarColor} />

      {/* Main content */}
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        {/* Navbar */}
        <nav
          className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl"
          id="navbarBlur"
          data-scroll="true"
        >
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                <li className="breadcrumb-item text-sm">
                  <a className="opacity-5 text-dark" href="#">
                    Trang
                  </a>
                </li>
                <li
                  className="breadcrumb-item text-sm text-dark active"
                  aria-current="page"
                >
                  Thống kê
                </li>
              </ol>
            </nav>

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
                  <i className="material-symbols-rounded fixed-plugin-button-nav">settings</i>
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
        {/* End Navbar */}

        {/* Dashboard content */}
        <div className="container-fluid py-2">
          <div className="row">
            <div className="ms-3">
              <h3 className="mb-0 h4 font-weight-bolder">Dashboard</h3>
              <p className="mb-4">
                Check the sales, value and bounce rate by country.
              </p>
            </div>

            {/* Card 1 */}
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <div className="card">
                <div className="card-header p-2 ps-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-sm mb-0 text-capitalize">Today's Money</p>
                      <h4 className="mb-0">$53k</h4>
                    </div>
                    <div className="icon icon-md icon-shape bg-gradient-dark shadow-dark shadow text-center border-radius-lg">
                      <i className="material-symbols-rounded opacity-10">weekend</i>
                    </div>
                  </div>
                </div>
                <hr className="dark horizontal my-0" />
                <div className="card-footer p-2 ps-3">
                  <p className="mb-0 text-sm">
                    <span className="text-success font-weight-bolder">+55%</span> than last week
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <div className="card">
                <div className="card-header p-2 ps-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-sm mb-0 text-capitalize">Today's Users</p>
                      <h4 className="mb-0">2300</h4>
                    </div>
                    <div className="icon icon-md icon-shape bg-gradient-dark shadow-dark shadow text-center border-radius-lg">
                      <i className="material-symbols-rounded opacity-10">person</i>
                    </div>
                  </div>
                </div>
                <hr className="dark horizontal my-0" />
                <div className="card-footer p-2 ps-3">
                  <p className="mb-0 text-sm">
                    <span className="text-success font-weight-bolder">+3%</span> than last month
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <div className="card">
                <div className="card-header p-2 ps-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-sm mb-0 text-capitalize">Ads Views</p>
                      <h4 className="mb-0">3,462</h4>
                    </div>
                    <div className="icon icon-md icon-shape bg-gradient-dark shadow-dark shadow text-center border-radius-lg">
                      <i className="material-symbols-rounded opacity-10">leaderboard</i>
                    </div>
                  </div>
                </div>
                <hr className="dark horizontal my-0" />
                <div className="card-footer p-2 ps-3">
                  <p className="mb-0 text-sm">
                    <span className="text-danger font-weight-bolder">-2%</span> than yesterday
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-xl-3 col-sm-6">
              <div className="card">
                <div className="card-header p-2 ps-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-sm mb-0 text-capitalize">Sales</p>
                      <h4 className="mb-0">$103,430</h4>
                    </div>
                    <div className="icon icon-md icon-shape bg-gradient-dark shadow-dark shadow text-center border-radius-lg">
                      <i className="material-symbols-rounded opacity-10">weekend</i>
                    </div>
                  </div>
                </div>
                <hr className="dark horizontal my-0" />
                <div className="card-footer p-2 ps-3">
                  <p className="mb-0 text-sm">
                    <span className="text-success font-weight-bolder">+5%</span> than yesterday
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings panel */}
      <SettingsPanel sidebarColor={sidebarColor} setSidebarColor={setSidebarColor} />
      <Script />
    </div>
  );
}
