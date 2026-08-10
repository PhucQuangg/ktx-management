import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

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

export default function AddStudent() {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

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
      window.showPopup?.("Vui lòng nhập mã số sinh viên.", true);

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
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
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
      };

      const response = await fetch("http://localhost:8080/api/admin/students", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || "Không thể thêm sinh viên.");
      }

      window.showPopup?.(message || "Thêm sinh viên thành công!");

      setTimeout(() => {
        navigate("/admin/students");
      }, 800);
    } catch (error) {
      console.error("Lỗi thêm sinh viên:", error);

      window.showPopup?.(error.message || "Lỗi khi thêm sinh viên.", true);
    } finally {
      setSubmitting(false);
    }
  };

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
              <i className="fa fa-user-plus"></i>
              Quản lý sinh viên
            </div>

            <h1>Thêm sinh viên</h1>

            <p>
              Tạo tài khoản, nhập thông tin cá nhân và thông tin cư trú cho sinh
              viên trong hệ thống ký túc xá.
            </p>
          </div>

          <div className="student-form-banner-icon">
            <i className="fa fa-user-graduate"></i>
          </div>
        </section>

        <form className="student-form-wrapper" onSubmit={handleSubmit}>
          <section className="student-form-card">
            <div className="student-form-card-header">
              <div className="student-form-header-icon">
                <i className="fa fa-address-card"></i>
              </div>

              <div>
                <h2>Thông tin sinh viên</h2>

                <p>
                  Các trường có dấu
                  <span className="required-mark"> *</span> là thông tin bắt
                  buộc.
                </p>
              </div>
            </div>

            <div className="student-form">
              <div className="student-form-grid">
                <div className="student-form-group">
                  <label htmlFor="fullName">
                    Họ và tên
                    <span>*</span>
                  </label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-user"></i>

                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên sinh viên"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="username">
                    Mã số sinh viên
                    <span>*</span>
                  </label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-id-badge"></i>

                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Ví dụ: DH52000001"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="email">
                    Email
                    <span>*</span>
                  </label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-envelope"></i>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Nhập email sinh viên"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="phone">Số điện thoại</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-phone"></i>

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Ví dụ: 0912345678"
                      maxLength="12"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="className">
                    Lớp
                    <span>*</span>
                  </label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-school"></i>

                    <input
                      id="className"
                      type="text"
                      name="className"
                      value={form.className}
                      onChange={handleChange}
                      placeholder="Ví dụ: D20_TH01"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="dateOfBirth">
                    Ngày sinh
                    <span>*</span>
                  </label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-calendar"></i>

                    <input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      max={new Date().toISOString().split("T")[0]}
                      value={form.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label>
                    Giới tính
                    <span>*</span>
                  </label>

                  <div className="student-gender-options">
                    <label
                      className={`student-gender-option ${
                        form.gender === false ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="false"
                        checked={form.gender === false}
                        onChange={handleChange}
                      />
                      <span className="gender-radio"></span>
                      <i className="fa fa-mars"></i>
                      Nam
                    </label>

                    <label
                      className={`student-gender-option female ${
                        form.gender === true ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="true"
                        checked={form.gender === true}
                        onChange={handleChange}
                      />
                      <span className="gender-radio"></span>
                      <i className="fa fa-venus"></i>
                      Nữ
                    </label>
                  </div>
                </div>

                <div className="student-form-group">
                  <label>Mật khẩu mặc định</label>

                  <div className="default-password-box">
                    <i className="fa fa-key"></i>

                    <div className="default-password-content">
                      <span>12345678</span>

                      <small>
                        Mật khẩu được hệ thống tự động thiết lập khi tạo tài
                        khoản.
                      </small>
                    </div>
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
                  Nhập thông tin căn cước, nơi sinh và địa chỉ thường trú của
                  sinh viên.
                </p>
              </div>
            </div>

            <div className="student-form">
              <div className="student-form-grid">
                <div className="student-form-group">
                  <label htmlFor="identityNumber">Số CCCD/CMND</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-id-card"></i>

                    <input
                      id="identityNumber"
                      type="text"
                      name="identityNumber"
                      value={form.residenceInfo.identityNumber}
                      onChange={handleResidenceChange}
                      placeholder="Nhập số CCCD/CMND"
                      maxLength="12"
                      inputMode="numeric"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="identityIssueDate">Ngày cấp</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-calendar-check"></i>

                    <input
                      id="identityIssueDate"
                      type="date"
                      name="identityIssueDate"
                      max={new Date().toISOString().split("T")[0]}
                      value={form.residenceInfo.identityIssueDate}
                      onChange={handleResidenceChange}
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="identityIssuePlace">Nơi cấp</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-building"></i>

                    <input
                      id="identityIssuePlace"
                      type="text"
                      name="identityIssuePlace"
                      value={form.residenceInfo.identityIssuePlace}
                      onChange={handleResidenceChange}
                      placeholder="Nhập nơi cấp CCCD"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="nationality">Quốc tịch</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-flag"></i>

                    <input
                      id="nationality"
                      type="text"
                      name="nationality"
                      value={form.residenceInfo.nationality}
                      onChange={handleResidenceChange}
                      placeholder="Ví dụ: Việt Nam"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="placeOfBirth">Nơi sinh</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-location-dot"></i>

                    <input
                      id="placeOfBirth"
                      type="text"
                      name="placeOfBirth"
                      value={form.residenceInfo.placeOfBirth}
                      onChange={handleResidenceChange}
                      placeholder="Nhập nơi sinh"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="ethnicity">Dân tộc</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-users"></i>

                    <input
                      id="ethnicity"
                      type="text"
                      name="ethnicity"
                      value={form.residenceInfo.ethnicity}
                      onChange={handleResidenceChange}
                      placeholder="Ví dụ: Kinh"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="religion">Tôn giáo</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-place-of-worship"></i>

                    <input
                      id="religion"
                      type="text"
                      name="religion"
                      value={form.residenceInfo.religion}
                      onChange={handleResidenceChange}
                      placeholder="Ví dụ: Không"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="province">Tỉnh/Thành phố</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-city"></i>

                    <input
                      id="province"
                      type="text"
                      name="province"
                      value={form.residenceInfo.province}
                      onChange={handleResidenceChange}
                      placeholder="Nhập tỉnh/thành phố"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="district">Quận/Huyện</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-map"></i>

                    <input
                      id="district"
                      type="text"
                      name="district"
                      value={form.residenceInfo.district}
                      onChange={handleResidenceChange}
                      placeholder="Nhập quận/huyện"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group">
                  <label htmlFor="ward">Phường/Xã</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-map-pin"></i>

                    <input
                      id="ward"
                      type="text"
                      name="ward"
                      value={form.residenceInfo.ward}
                      onChange={handleResidenceChange}
                      placeholder="Nhập phường/xã"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="student-form-group full-width">
                  <label htmlFor="address">Địa chỉ thường trú</label>

                  <div className="student-input-wrapper">
                    <i className="fa fa-home"></i>

                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={form.residenceInfo.address}
                      onChange={handleResidenceChange}
                      placeholder="Nhập số nhà, tên đường, khu phố/thôn"
                      autoComplete="off"
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
              <strong>Lưu ý</strong>

              <p>
                Tài khoản được tạo với vai trò sinh viên. Sinh viên đăng nhập
                bằng mã số sinh viên và mật khẩu mặc định 12345678.
              </p>
            </div>
          </div>

          <div className="student-form-actions">
            <button
              type="button"
              className="student-form-back-button"
              onClick={() => navigate("/admin/students")}
              disabled={submitting}
            >
              <i className="fa fa-arrow-left"></i>
              Trở về
            </button>

            <button
              type="submit"
              className="add-student-submit-button"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i>
                  Đang thêm...
                </>
              ) : (
                <>
                  <i className="fa fa-user-plus"></i>
                  Thêm sinh viên
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
