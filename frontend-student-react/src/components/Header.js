import "../css/Header.css";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header
      className={`custom-header ${
        sidebarOpen ? "" : "sidebar-collapse"
      }`}
    >
      <div className="header-left">

        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className="fa fa-bars"></i>
        </button>

        <div className="page-title">
          <h3>Hệ thống ký túc xá sinh viên STU</h3>
        </div>

      </div>

     
    </header>
  );
}