import { NavLink } from "react-router-dom";
import "../css/Sidebar.css";

export default function Sidebar({ sidebarOpen }) {
  const handleLogout = () => {
    sessionStorage.clear();
  };

  const token = sessionStorage.getItem("token");
  const isLogin = Boolean(token);

  let username = "Guest";

  if (token) {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      username =
        payload.username ||
        payload.sub ||
        "Sinh viên";
    } catch (error) {
      console.error(
        "Không thể đọc thông tin token:",
        error
      );

      username = "Sinh viên";
    }
  }

  const getMenuClass = ({ isActive }) =>
    isActive
      ? "menu-item active"
      : "menu-item";

  return (
    <aside
      className={`student-sidebar ${
        sidebarOpen ? "" : "collapsed"
      }`}
    >
      {/* Logo */}

      <div className="sidebar-top">
        <img
          src="/assets/images/small-logos/Logo_STU.png"
          alt="STU"
          className="sidebar-logo"
        />

        {sidebarOpen && (
          <h3>Ký túc xá STU</h3>
        )}
      </div>

      {/* User */}

      <div className="sidebar-user">
        <img
          src="/assets/images/userlogo.jpg"
          alt="Ảnh đại diện"
          className="user-avatar"
        />

        {sidebarOpen && (
          <h5 className="usernameSpan">
            {username}
          </h5>
        )}

        {isLogin && (
          <NavLink
            to="/profile"
            className={getMenuClass}
          >
            <i className="fa fa-user-circle"></i>

            {sidebarOpen && (
              <span
                style={{
                  fontSize: "15px",
                }}
              >
                Thông tin cá nhân
              </span>
            )}
          </NavLink>
        )}
      </div>

      {/* Menu */}

      <div className="sidebar-menu-wrapper">
        <NavLink
          to="/"
          end
          className={getMenuClass}
        >
          <i className="fa fa-home"></i>

          {sidebarOpen && (
            <span>Trang chủ</span>
          )}
        </NavLink>

        <NavLink
          to="/register-dorm"
          className={getMenuClass}
        >
          <i className="fa fa-pencil-square-o"></i>

          {sidebarOpen && (
            <span>Đăng ký nội trú</span>
          )}
        </NavLink>

        <NavLink
          to="/rooms"
          className={getMenuClass}
        >
          <i className="fa fa-bed"></i>

          {sidebarOpen && (
            <span>Phòng ở</span>
          )}
        </NavLink>

        {/* Chỉ hiển thị sau khi đăng nhập */}

        {isLogin && (
          <>
            <NavLink
              to="/my-contracts"
              className={getMenuClass}
            >
              <i className="fa fa-file-text-o"></i>

              {sidebarOpen && (
                <span>
                  Đăng ký phòng của tôi
                </span>
              )}
            </NavLink>

            <NavLink
              to="/invoices"
              className={getMenuClass}
            >
              <i className="fa fa-credit-card"></i>

              {sidebarOpen && (
                <span>
                  Hóa đơn của tôi
                </span>
              )}
            </NavLink>
          </>
        )}

        <NavLink
          to="/notifications"
          className={getMenuClass}
        >
          <i className="fa fa-bell"></i>

          {sidebarOpen && (
            <span>Thông báo</span>
          )}
        </NavLink>

        <NavLink
          to="/contact"
          className={getMenuClass}
        >
          <i className="fa fa-phone"></i>

          {sidebarOpen && (
            <span>Liên hệ</span>
          )}
        </NavLink>
      </div>

      {/* Bottom */}

      <div className="sidebar-bottom">
        {isLogin ? (
          <NavLink
            to="/login"
            onClick={handleLogout}
            className="logout-btn"
          >
            <i className="fa fa-sign-out"></i>

            {sidebarOpen && (
              <span>Đăng xuất</span>
            )}
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className="login-btn-sidebar"
          >
            <i className="fa fa-sign-in"></i>

            {sidebarOpen && (
              <span>Đăng nhập</span>
            )}
          </NavLink>
        )}
      </div>
    </aside>
  );
}