import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import "../css/AdminProfile.css";

const initialProfile = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  role: "",
  createdAt: "",
};

const initialPasswords = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function AdminProfile() {
  const token =
    sessionStorage.getItem("admin_token") ||
    localStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [form, setForm] = useState(initialProfile);

  const [originalForm, setOriginalForm] = useState(initialProfile);

  const [passwords, setPasswords] = useState(initialPasswords);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showPasswordFields, setShowPasswordFields] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);

  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadProfile();
  }, [token]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Không thể tải thông tin cá nhân.");
      }

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {};
      }

      const normalizedProfile = {
        fullName: data.fullName || "",
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "",
        createdAt: data.createdAt || data.created_at || "",
      };

      setForm(normalizedProfile);
      setOriginalForm(normalizedProfile);
    } catch (error) {
      console.error("Lỗi tải thông tin cá nhân:", error);

      window.showPopup?.(
        error.message || "Không tải được thông tin cá nhân.",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswordFields((previous) => ({
      ...previous,
      [fieldName]: !previous[fieldName],
    }));
  };

  const validateProfile = () => {
    if (!form.fullName.trim()) {
      window.showPopup?.("Vui lòng nhập họ và tên.", true);

      return false;
    }

    if (!form.email.trim()) {
      window.showPopup?.("Vui lòng nhập email.", true);

      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      window.showPopup?.("Email không đúng định dạng.", true);

      return false;
    }

    if (form.phone.trim()) {
      const phoneRegex = /^(0|\+84)[0-9]{9}$/;

      if (!phoneRegex.test(form.phone.trim())) {
        window.showPopup?.("Số điện thoại không đúng định dạng.", true);

        return false;
      }
    }

    return true;
  };

  const saveProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    try {
      setSavingProfile(true);

      const payload = {
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      };

      const response = await fetch("http://localhost:8080/api/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || "Không thể cập nhật thông tin.");
      }

      setForm(payload);
      setOriginalForm(payload);
      setEditMode(false);

      sessionStorage.setItem("admin_fullname", payload.fullName);

      localStorage.setItem("admin_fullname", payload.fullName);

      window.showPopup?.(message || "Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);

      window.showPopup?.(
        error.message || "Lỗi khi cập nhật thông tin cá nhân.",
        true
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const cancelEdit = () => {
    setForm(originalForm);
    setEditMode(false);
  };

  const validatePassword = () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword) {
      window.showPopup?.("Vui lòng nhập đầy đủ thông tin mật khẩu.", true);

      return false;
    }

    if (newPassword.length < 8) {
      window.showPopup?.("Mật khẩu mới phải có ít nhất 8 ký tự.", true);

      return false;
    }

    if (oldPassword === newPassword) {
      window.showPopup?.("Mật khẩu mới phải khác mật khẩu hiện tại.", true);

      return false;
    }

    if (newPassword !== confirmPassword) {
      window.showPopup?.("Mật khẩu xác nhận không khớp.", true);

      return false;
    }

    return true;
  };

  const handlePasswordChange = async () => {
    if (!validatePassword()) {
      return;
    }

    try {
      setSavingPassword(true);

      const response = await fetch(
        "http://localhost:8080/api/change-password",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || "Đổi mật khẩu thất bại.");
      }

      closePasswordModal();

      setTimeout(() => {
        window.showPopup?.(message || "Đổi mật khẩu thành công!");
      }, 250);
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);

      window.showPopup?.(error.message || "Lỗi khi đổi mật khẩu.", true);
    } finally {
      setSavingPassword(false);
    }
  };

  const openPasswordModal = () => {
    setPasswords(initialPasswords);

    setShowPasswordFields({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (savingPassword) {
      return;
    }

    setShowPasswordModal(false);
    setPasswords(initialPasswords);

    setShowPasswordFields({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
  };

  const formatDate = (date) => {
    if (!date) {
      return "Chưa cập nhật";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getRoleText = (role) => {
    const roleMap = {
      ADMIN: "Quản trị viên",
      STUDENT: "Sinh viên",
    };

    return roleMap[role] || role || "Chưa xác định";
  };

  const getInitials = (fullName) => {
    if (!fullName?.trim()) {
      return "A";
    }

    const words = fullName.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  if (loading) {
    return (
      <div className="admin-profile-loading-page">
        <i className="fa fa-spinner fa-spin"></i>

        <p>Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`admin-profile-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="admin-profile-banner">
          <div>
            <div className="admin-profile-banner-badge">
              <i className="fa fa-user-shield"></i>
              Tài khoản quản trị
            </div>

            <h1>Thông tin cá nhân</h1>

            <p>
              Xem và cập nhật thông tin tài khoản quản trị viên, đồng thời quản
              lý mật khẩu đăng nhập của hệ thống.
            </p>
          </div>

          <div className="admin-profile-banner-icon">
            <i className="fa fa-id-card"></i>
          </div>
        </section>

        <section className="admin-profile-summary">
          <div className="admin-profile-avatar-card">
            <div className="admin-profile-avatar">
              {getInitials(form.fullName)}
            </div>

            <div>
              <span>Quản trị viên</span>

              <h2>{form.fullName || "Chưa cập nhật"}</h2>

              <p>{form.email || "Chưa cập nhật email"}</p>
            </div>
          </div>

          <div className="admin-profile-summary-card">
            <div className="admin-profile-summary-icon blue">
              <i className="fa fa-user"></i>
            </div>

            <div>
              <span>Tên đăng nhập</span>

              <strong>{form.username || "Chưa cập nhật"}</strong>
            </div>
          </div>

          <div className="admin-profile-summary-card">
            <div className="admin-profile-summary-icon purple">
              <i className="fa fa-user-tag"></i>
            </div>

            <div>
              <span>Vai trò</span>

              <strong>{getRoleText(form.role)}</strong>
            </div>
          </div>

          <div className="admin-profile-summary-card">
            <div className="admin-profile-summary-icon green">
              <i className="fa fa-calendar-check"></i>
            </div>

            <div>
              <span>Ngày tạo tài khoản</span>

              <strong>{formatDate(form.createdAt)}</strong>
            </div>
          </div>
        </section>

        <section className="admin-profile-card">
          <div className="admin-profile-card-header">
            <div className="admin-profile-header-title">
              <div className="admin-profile-header-icon">
                <i className="fa fa-address-card"></i>
              </div>

              <div>
                <h2>
                  {editMode ? "Cập nhật thông tin" : "Chi tiết tài khoản"}
                </h2>

                <p>
                  {editMode
                    ? "Chỉnh sửa thông tin cần thiết và nhấn Lưu thay đổi."
                    : "Nhấn Cập nhật để chỉnh sửa thông tin cá nhân."}
                </p>
              </div>
            </div>

            <span
              className={`admin-profile-mode-badge ${
                editMode ? "editing" : "viewing"
              }`}
            >
              <i className={`fa ${editMode ? "fa-pen" : "fa-eye"}`}></i>

              {editMode ? "Đang chỉnh sửa" : "Chế độ xem"}
            </span>
          </div>

          <div className="admin-profile-form">
            <div className="admin-profile-form-grid">
              <div className="admin-profile-form-group">
                <label htmlFor="fullName">
                  Họ và tên
                  <span>*</span>
                </label>

                <div
                  className={`admin-profile-input-wrapper ${
                    !editMode ? "readonly" : ""
                  }`}
                >
                  <i className="fa fa-user"></i>

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    readOnly={!editMode}
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </div>

              <div className="admin-profile-form-group">
                <label htmlFor="email">
                  Email
                  <span>*</span>
                </label>

                <div
                  className={`admin-profile-input-wrapper ${
                    !editMode ? "readonly" : ""
                  }`}
                >
                  <i className="fa fa-envelope"></i>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    readOnly={!editMode}
                    placeholder="Nhập email"
                  />
                </div>
              </div>

              <div className="admin-profile-form-group">
                <label htmlFor="username">Tên đăng nhập</label>

                <div className="admin-profile-input-wrapper readonly">
                  <i className="fa fa-id-badge"></i>

                  <input
                    id="username"
                    type="text"
                    value={form.username}
                    readOnly
                  />
                </div>

                <small>Tên đăng nhập không được phép thay đổi.</small>
              </div>

              <div className="admin-profile-form-group">
                <label htmlFor="phone">Số điện thoại</label>

                <div
                  className={`admin-profile-input-wrapper ${
                    !editMode ? "readonly" : ""
                  }`}
                >
                  <i className="fa fa-phone"></i>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    readOnly={!editMode}
                    maxLength="12"
                    placeholder="Chưa cập nhật"
                  />
                </div>
              </div>

              <div className="admin-profile-form-group">
                <label htmlFor="role">Vai trò</label>

                <div className="admin-profile-input-wrapper readonly">
                  <i className="fa fa-user-shield"></i>

                  <input
                    id="role"
                    type="text"
                    value={getRoleText(form.role)}
                    readOnly
                  />
                </div>
              </div>

              <div className="admin-profile-form-group">
                <label htmlFor="createdAt">Ngày tạo tài khoản</label>

                <div className="admin-profile-input-wrapper readonly">
                  <i className="fa fa-calendar"></i>

                  <input
                    id="createdAt"
                    type="text"
                    value={formatDate(form.createdAt)}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="admin-profile-note">
              <div className="admin-profile-note-icon">
                <i className="fa fa-shield-alt"></i>
              </div>

              <div>
                <strong>Bảo mật tài khoản</strong>

                <p>
                  Không chia sẻ thông tin đăng nhập. Nên thay đổi mật khẩu định
                  kỳ để bảo vệ tài khoản quản trị.
                </p>
              </div>
            </div>

            <div className="admin-profile-actions">
              {!editMode ? (
                <>
                  <button
                    type="button"
                    className="admin-profile-password-button"
                    onClick={openPasswordModal}
                  >
                    <i className="fa fa-key"></i>
                    Đổi mật khẩu
                  </button>

                  <button
                    type="button"
                    className="admin-profile-edit-button"
                    onClick={() => setEditMode(true)}
                  >
                    <i className="fa fa-pen"></i>
                    Cập nhật
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="admin-profile-cancel-button"
                    onClick={cancelEdit}
                    disabled={savingProfile}
                  >
                    <i className="fa fa-times"></i>
                    Hủy
                  </button>

                  <button
                    type="button"
                    className="admin-profile-save-button"
                    onClick={saveProfile}
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <>
                        <i className="fa fa-spinner fa-spin"></i>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-save"></i>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {showPasswordModal && (
        <div
          className="admin-password-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePasswordModal();
            }
          }}
        >
          <div className="admin-password-modal">
            <div className="admin-password-modal-header">
              <div>
                <span>Bảo mật tài khoản</span>

                <h2>Đổi mật khẩu</h2>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={savingPassword}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="admin-password-modal-body">
              <div className="admin-password-warning">
                <div>
                  <i className="fa fa-shield-alt"></i>
                </div>

                <p>
                  Mật khẩu mới phải có ít nhất 8 ký tự và khác mật khẩu hiện
                  tại.
                </p>
              </div>

              <div className="admin-password-form-group">
                <label htmlFor="oldPassword">
                  Mật khẩu hiện tại
                  <span>*</span>
                </label>

                <div className="admin-password-input-wrapper">
                  <i className="fa fa-lock"></i>

                  <input
                    id="oldPassword"
                    type={showPasswordFields.oldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Nhập mật khẩu hiện tại"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("oldPassword")}
                  >
                    <i
                      className={`fa ${
                        showPasswordFields.oldPassword
                          ? "fa-eye-slash"
                          : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              <div className="admin-password-form-group">
                <label htmlFor="newPassword">
                  Mật khẩu mới
                  <span>*</span>
                </label>

                <div className="admin-password-input-wrapper">
                  <i className="fa fa-key"></i>

                  <input
                    id="newPassword"
                    type={showPasswordFields.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Nhập mật khẩu mới"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                  >
                    <i
                      className={`fa ${
                        showPasswordFields.newPassword
                          ? "fa-eye-slash"
                          : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              <div className="admin-password-form-group">
                <label htmlFor="confirmPassword">
                  Xác nhận mật khẩu mới
                  <span>*</span>
                </label>

                <div className="admin-password-input-wrapper">
                  <i className="fa fa-check-circle"></i>

                  <input
                    id="confirmPassword"
                    type={
                      showPasswordFields.confirmPassword ? "text" : "password"
                    }
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Nhập lại mật khẩu mới"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    <i
                      className={`fa ${
                        showPasswordFields.confirmPassword
                          ? "fa-eye-slash"
                          : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-password-modal-footer">
              <button
                type="button"
                className="admin-password-cancel-button"
                onClick={closePasswordModal}
                disabled={savingPassword}
              >
                Hủy
              </button>

              <button
                type="button"
                className="admin-password-save-button"
                onClick={handlePasswordChange}
                disabled={savingPassword}
              >
                {savingPassword ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="fa fa-save"></i>
                    Lưu mật khẩu
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
