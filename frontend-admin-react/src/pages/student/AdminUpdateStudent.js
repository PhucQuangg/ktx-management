import React, { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import "../../css/AdminStudentForm.css";

const initialForm = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  className: "",
  dateOfBirth: "",
  gender: false,
  role: "STUDENT",

  residenceInfo: {
    identityNumber: "",
    identityIssueDate: "",
    identityIssuePlace: "",

    nationality: "",
    placeOfBirth: "",
    ethnicity: "",
    religion: "",

    province: "",
    district: "",
    ward: "",
    address: "",
  },
};

export default function UpdateStudent() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const studentId = searchParams.get("id");

  const token = sessionStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [form, setForm] = useState(initialForm);

  const [originalForm, setOriginalForm] = useState(initialForm);

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";

      return;
    }

    if (!studentId) {
      window.showPopup?.("Không tìm thấy sinh viên.", true);

      navigate("/admin/students");

      return;
    }

    loadStudent(studentId);
  }, [studentId, token, navigate]);

  const normalizeStudentData = (data) => ({
    fullName: data?.fullName || "",

    username: data?.username || "",

    email: data?.email || "",

    phone: data?.phone || "",

    className: data?.className || "",

    dateOfBirth: data?.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",

    gender: data?.gender === true || data?.gender === "true",

    role: data?.role || "STUDENT",

    residenceInfo: {
      identityNumber: data?.residenceInfo?.identityNumber || "",

      identityIssueDate: data?.residenceInfo?.identityIssueDate
        ? data.residenceInfo.identityIssueDate.split("T")[0]
        : "",

      identityIssuePlace: data?.residenceInfo?.identityIssuePlace || "",

      nationality: data?.residenceInfo?.nationality || "",

      placeOfBirth: data?.residenceInfo?.placeOfBirth || "",

      ethnicity: data?.residenceInfo?.ethnicity || "",

      religion: data?.residenceInfo?.religion || "",

      province: data?.residenceInfo?.province || "",

      district: data?.residenceInfo?.district || "",

      ward: data?.residenceInfo?.ward || "",

      address: data?.residenceInfo?.address || "",
    },
  });

  const loadStudent = async (id) => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/admin/students/edit/${id}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(responseText || "Không thể tải thông tin sinh viên.");
      }

      const normalizedData = normalizeStudentData(data);

      setForm(normalizedData);

      setOriginalForm(normalizedData);
    } catch (error) {
      console.error("Lỗi tải sinh viên:", error);

      window.showPopup?.(error.message || "Lỗi khi tải sinh viên.", true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  const handleResidenceChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,

      residenceInfo: {
        ...previous.residenceInfo,

        [name]: value,
      },
    }));
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      window.showPopup?.("Vui lòng nhập họ và tên.", true);

      return false;
    }

    if (!form.username.trim()) {
      window.showPopup?.("Mã số sinh viên không được để trống.", true);

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

    if (!form.className.trim()) {
      window.showPopup?.("Vui lòng nhập lớp.", true);

      return false;
    }

    if (!form.dateOfBirth) {
      window.showPopup?.("Vui lòng chọn ngày sinh.", true);

      return false;
    }

    const selectedDate = new Date(form.dateOfBirth);

    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);

    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      window.showPopup?.("Ngày sinh không được lớn hơn ngày hiện tại.", true);

      return false;
    }

    if (form.phone.trim()) {
      const phoneRegex = /^(0|\+84)[0-9]{9}$/;

      if (!phoneRegex.test(form.phone.trim())) {
        window.showPopup?.("Số điện thoại không đúng định dạng.", true);

        return false;
      }
    }

    const residence = form.residenceInfo;

    if (residence.identityNumber.trim()) {
      const identityRegex = /^[0-9]{9,12}$/;

      if (!identityRegex.test(residence.identityNumber.trim())) {
        window.showPopup?.("Số CCCD/CMND phải có từ 9 đến 12 chữ số.", true);

        return false;
      }
    }

    if (residence.identityIssueDate) {
      const issueDate = new Date(residence.identityIssueDate);

      issueDate.setHours(0, 0, 0, 0);

      if (issueDate > today) {
        window.showPopup?.(
          "Ngày cấp CCCD không được lớn hơn ngày hiện tại.",
          true
        );

        return false;
      }

      if (issueDate < selectedDate) {
        window.showPopup?.("Ngày cấp CCCD không được nhỏ hơn ngày sinh.", true);

        return false;
      }
    }

    return true;
  };

  const buildPayload = () => ({
    fullName: form.fullName.trim(),

    username: form.username.trim(),

    email: form.email.trim(),

    phone: form.phone.trim(),

    className: form.className.trim(),

    dateOfBirth: form.dateOfBirth,

    gender: form.gender,

    role: form.role,

    residenceInfo: {
      identityNumber: form.residenceInfo.identityNumber.trim(),

      identityIssueDate: form.residenceInfo.identityIssueDate || null,

      identityIssuePlace: form.residenceInfo.identityIssuePlace.trim(),

      nationality: form.residenceInfo.nationality.trim(),

      placeOfBirth: form.residenceInfo.placeOfBirth.trim(),

      ethnicity: form.residenceInfo.ethnicity.trim(),

      religion: form.residenceInfo.religion.trim(),

      province: form.residenceInfo.province.trim(),

      district: form.residenceInfo.district.trim(),

      ward: form.residenceInfo.ward.trim(),

      address: form.residenceInfo.address.trim(),
    },
  });

  const saveStudent = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = buildPayload();

      const response = await fetch(
        `http://localhost:8080/api/admin/students/${studentId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || "Không thể cập nhật sinh viên.");
      }

      setForm(payload);

      setOriginalForm(payload);

      setEditMode(false);

      window.showPopup?.(message || "Cập nhật sinh viên thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật sinh viên:", error);

      window.showPopup?.(error.message || "Lỗi khi cập nhật sinh viên.", true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm(originalForm);

    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="student-form-loading-page">
        <i className="fa fa-spinner fa-spin"></i>

        <p>Đang tải thông tin sinh viên...</p>
      </div>
    );
  }

  return (
    <div className="student-form-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`student-form-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="student-form-banner">
          <div>
            <div className="student-form-banner-badge">
              <i className="fa fa-user-edit"></i>
              Quản lý sinh viên
            </div>

            <h1>Thông tin sinh viên</h1>

            <p>
              Xem và cập nhật thông tin cá nhân cùng thông tin cư trú của sinh
              viên trong hệ thống ký túc xá.
            </p>
          </div>

          <div className="student-form-banner-icon">
            <i className="fa fa-address-card"></i>
          </div>
        </section>

        <div className="student-form-wrapper">
          <section className="student-form-card">
            <div className="student-form-card-header">
              <div className="student-form-header-icon">
                <i className="fa fa-user-graduate"></i>
              </div>

              <div>
                <h2>
                  {editMode
                    ? "Cập nhật thông tin sinh viên"
                    : "Chi tiết sinh viên"}
                </h2>

                <p>
                  {editMode
                    ? "Chỉnh sửa các thông tin cần thiết và nhấn Lưu thay đổi."
                    : "Nhấn nút Cập nhật để chỉnh sửa thông tin sinh viên."}
                </p>
              </div>

              <span
                className={`update-mode-badge ${
                  editMode ? "editing" : "viewing"
                }`}
              >
                <i className={`fa ${editMode ? "fa-pen" : "fa-eye"}`}></i>

                {editMode ? "Đang chỉnh sửa" : "Chế độ xem"}
              </span>
            </div>

            <div className="student-form">
              <div className="student-form-grid">
                <div className="student-form-group">
                  <label htmlFor="fullName">
                    Họ và tên
                    <span>*</span>
                  </label>

                  <div
                    className={`student-input-wrapper ${
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

                <div className="student-form-group">
                  <label htmlFor="username">
                    Mã số sinh viên
                    <span>*</span>
                  </label>

                  <div className="student-input-wrapper readonly">
                    <i className="fa fa-id-badge"></i>

                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={form.username}
                      readOnly
                      placeholder="Mã số sinh viên"
                    />
                  </div>

                  <small>Mã số sinh viên không được phép thay đổi.</small>
                </div>

                <div className="student-form-group">
                  <label htmlFor="email">
                    Email
                    <span>*</span>
                  </label>

                  <div
                    className={`student-input-wrapper ${
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

                <div className="student-form-group">
                  <label htmlFor="phone">Số điện thoại</label>

                  <div
                    className={`student-input-wrapper ${
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

                <div className="student-form-group">
                  <label htmlFor="className">
                    Lớp
                    <span>*</span>
                  </label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-school"></i>

                    <input
                      id="className"
                      type="text"
                      name="className"
                      value={form.className}
                      onChange={handleChange}
                      readOnly={!editMode}
                      placeholder="Nhập lớp"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="dateOfBirth">
                    Ngày sinh
                    <span>*</span>
                  </label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-calendar"></i>

                    <input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      max={new Date().toISOString().split("T")[0]}
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      readOnly={!editMode}
                    />
                  </div>
                </div>

                <div className="student-form-group full-width">
                  <label>
                    Giới tính
                    <span>*</span>
                  </label>

                  <div className="student-gender-options">
                    <label
                      className={`student-gender-option ${
                        form.gender === false ? "selected" : ""
                      } ${!editMode ? "disabled" : ""}`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="false"
                        checked={form.gender === false}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                      <span className="gender-radio"></span>
                      <i className="fa fa-mars"></i>
                      Nam
                    </label>

                    <label
                      className={`student-gender-option female ${
                        form.gender === true ? "selected" : ""
                      } ${!editMode ? "disabled" : ""}`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="true"
                        checked={form.gender === true}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                      <span className="gender-radio"></span>
                      <i className="fa fa-venus"></i>
                      Nữ
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="student-form-card residence-form-card">
            <div className="student-form-card-header">
              <div className="student-form-header-icon residence">
                <i className="fa fa-id-card"></i>
              </div>

              <div>
                <h2>Thông tin cư trú</h2>

                <p>
                  Thông tin căn cước, nơi sinh và địa chỉ thường trú của sinh
                  viên.
                </p>
              </div>
            </div>

            <div className="student-form">
              <div className="student-form-grid">
                <div className="student-form-group">
                  <label htmlFor="identityNumber">Số CCCD/CMND</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-id-card"></i>

                    <input
                      id="identityNumber"
                      type="text"
                      name="identityNumber"
                      value={form.residenceInfo.identityNumber}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                      maxLength="12"
                      inputMode="numeric"
                      placeholder="Chưa cập nhật"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="identityIssueDate">Ngày cấp CCCD</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-calendar-check"></i>

                    <input
                      id="identityIssueDate"
                      type="date"
                      name="identityIssueDate"
                      max={new Date().toISOString().split("T")[0]}
                      value={form.residenceInfo.identityIssueDate}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="identityIssuePlace">Nơi cấp CCCD</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-building"></i>

                    <input
                      id="identityIssuePlace"
                      type="text"
                      name="identityIssuePlace"
                      value={form.residenceInfo.identityIssuePlace}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                      placeholder="Chưa cập nhật"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="nationality">Quốc tịch</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-flag"></i>

                    <input
                      id="nationality"
                      type="text"
                      name="nationality"
                      value={form.residenceInfo.nationality}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                      placeholder="Ví dụ: Việt Nam"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="placeOfBirth">Nơi sinh</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-location-dot"></i>

                    <input
                      id="placeOfBirth"
                      type="text"
                      name="placeOfBirth"
                      value={form.residenceInfo.placeOfBirth}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                      placeholder="Chưa cập nhật"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="ethnicity">Dân tộc</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-users"></i>

                    <input
                      id="ethnicity"
                      type="text"
                      name="ethnicity"
                      value={form.residenceInfo.ethnicity}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                      placeholder="Ví dụ: Kinh"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="religion">Tôn giáo</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-place-of-worship"></i>

                    <input
                      id="religion"
                      type="text"
                      name="religion"
                      value={form.residenceInfo.religion}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                      placeholder="Ví dụ: Không"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="province">Tỉnh/Thành phố</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-city"></i>

                    <input
                      id="province"
                      type="text"
                      name="province"
                      value={form.residenceInfo.province}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                      placeholder="Chưa cập nhật"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="district">Quận/Huyện</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-map"></i>

                    <input
                      id="district"
                      type="text"
                      name="district"
                      value={form.residenceInfo.district}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                      placeholder="Chưa cập nhật"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="ward">Phường/Xã</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-map-pin"></i>

                    <input
                      id="ward"
                      type="text"
                      name="ward"
                      value={form.residenceInfo.ward}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                      placeholder="Chưa cập nhật"
                    />
                  </div>
                </div>

                <div className="student-form-group full-width">
                  <label htmlFor="address">Địa chỉ thường trú</label>

                  <div
                    className={`student-input-wrapper ${
                      !editMode ? "readonly" : ""
                    }`}
                  >
                    <i className="fa fa-home"></i>

                    <input
                      id="address"
                      name="address"
                      rows="4"
                      value={form.residenceInfo.address}
                      onChange={handleResidenceChange}
                      readOnly={!editMode}
                      placeholder="Nhập số nhà, tên đường, khu phố hoặc thôn"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="student-form-note">
            <div className="student-form-note-icon">
              <i className="fa fa-info-circle"></i>
            </div>

            <div>
              <strong>Thông tin tài khoản</strong>

              <p>
                Việc cập nhật thông tin tại đây không làm thay đổi mật khẩu đăng
                nhập của sinh viên.
              </p>
            </div>
          </div>

          <div className="student-form-actions">
            <button
              type="button"
              className="student-form-back-button"
              onClick={() => navigate("/admin/students")}
              disabled={saving}
            >
              <i className="fa fa-arrow-left"></i>
              Trở về
            </button>

            {!editMode ? (
              <button
                type="button"
                className="update-student-edit-button"
                onClick={() => setEditMode(true)}
              >
                <i className="fa fa-pen"></i>
                Cập nhật
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="update-student-cancel-button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <i className="fa fa-times"></i>
                  Hủy
                </button>

                <button
                  type="button"
                  className="update-student-save-button"
                  onClick={saveStudent}
                  disabled={saving}
                >
                  {saving ? (
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
      </main>
    </div>
  );
}
