import React, { useState } from "react";

export default function SettingsPanel({ sidebarColor, setSidebarColor }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed-plugin">
      {/* Nút bánh răng mở/đóng */}
      <a
        className="fixed-plugin-button text-dark position-fixed px-3 py-2"
        style={{ cursor: "pointer", right: "20px", bottom: "20px" }}
        onClick={() => setOpen(!open)}
      >
        <i className="material-symbols-rounded py-2">settings</i>
      </a>

      {/* Panel */}
      {open && (
        <div className="card shadow-lg position-fixed" style={{ right: "80px", bottom: "20px", zIndex: 1050 }}>
          <div className="card-header pb-0 pt-3 d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mt-3 mb-0">Material UI Configurator</h5>
              <p>See our dashboard options.</p>
            </div>
            <button
              className="btn btn-link text-dark p-0"
              onClick={() => setOpen(false)}
            >
              <i className="material-symbols-rounded">clear</i>
            </button>
          </div>

          <hr className="horizontal dark my-1" />
          <div className="card-body pt-sm-3 pt-0">
            {/* Sidebar Colors */}
            <h6 className="mb-0">Sidebar Colors</h6>
            <div className="badge-colors my-2 text-start">
            {["primary","dark","info","success","warning","danger"].map((color) => (
                <span
                  key={color}
                  className={`badge filter bg-gradient-${color} ${sidebarColor === `bg-gradient-${color}` ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSidebarColor(`bg-gradient-${color}`)}
                />
              ))}
            </div>

            {/* Sidenav Type */}
            <h6 className="mb-0 mt-3">Sidenav Type</h6>
            <p className="text-sm">Choose between different sidenav types.</p>
            <div className="d-flex">
              {[
                { label: "Dark", type: "bg-gradient-dark" },
                { label: "Transparent", type: "bg-transparent" },
                { label: "White", type: "bg-white" },
              ].map((item) => (
                <button
                  key={item.type}
                  className={`btn bg-gradient-dark px-3 mb-2 ms-2`}
                  data-class={item.type}
                  onClick={(e) => window.sidebarType && window.sidebarType(e.target)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Navbar Fixed */}
            <div className="mt-3 d-flex">
              <h6 className="mb-0">Navbar Fixed</h6>
              <div className="form-check form-switch ps-0 ms-auto my-auto">
                <input
                  type="checkbox"
                  className="form-check-input mt-1 ms-auto"
                  onClick={(e) => window.navbarFixed && window.navbarFixed(e.target)}
                />
              </div>
            </div>

            <hr className="horizontal dark my-3" />

            {/* Light / Dark Mode */}
            <div className="mt-2 d-flex">
              <h6 className="mb-0">Light / Dark</h6>
              <div className="form-check form-switch ps-0 ms-auto my-auto">
                <input
                  type="checkbox"
                  className="form-check-input mt-1 ms-auto"
                  onClick={(e) => window.darkMode && window.darkMode(e.target)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 