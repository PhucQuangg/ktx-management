import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import "../css/Profile.css";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    className: "",

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
  });

  const [editing, setEditing] = useState(false);

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleResidenceChange = (field, value) => {
    setProfile({
      ...profile,

      residenceInfo: {
        ...profile.residenceInfo,
        [field]: value,
      },
    });
  };

  const getToken = () => sessionStorage.getItem("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = getToken();

    if (!token) {
      window.showPopup?.("Vui lòng đăng nhập!", true);
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      setProfile({
        fullName: data.fullName || "",
        email: data.email || "",
        gender: data.gender?.toString() ?? "",
        dateOfBirth: data.dateOfBirth || "",
        phone: data.phone || "",
        className: data.className || "",

        residenceInfo: {
          identityNumber: data.residenceInfo?.identityNumber || "",

          identityIssueDate: data.residenceInfo?.identityIssueDate || "",

          identityIssuePlace: data.residenceInfo?.identityIssuePlace || "",

          nationality: data.residenceInfo?.nationality || "",

          placeOfBirth: data.residenceInfo?.placeOfBirth || "",

          ethnicity: data.residenceInfo?.ethnicity || "",

          religion: data.residenceInfo?.religion || "",

          province: data.residenceInfo?.province || "",

          district: data.residenceInfo?.district || "",

          ward: data.residenceInfo?.ward || "",

          address: data.residenceInfo?.address || "",
        },
      });
    } catch (e) {
      console.error(e);
      window.showPopup?.("Không thể tải thông tin cá nhân!", true);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    loadProfile();
  };

  const handleSave = async () => {
    const token = getToken();

    const {
      fullName,
      email,
      gender,
      dateOfBirth,
      phone,
      className,
      residenceInfo,
    } = profile;
    if (
      !fullName ||
      !email ||
      !phone ||
      !className ||
      !dateOfBirth ||
      gender === ""
    ) {
      window.showPopup?.("Vui lòng nhập đầy đủ thông tin!", true);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          email,
          gender: gender === "true",
          dateOfBirth,
          phone,
          className,

          residenceInfo: residenceInfo,
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      window.showPopup?.("Cập nhật thành công!");

      setEditing(false);

      loadProfile();
    } catch {
      window.showPopup?.("Không thể cập nhật thông tin!", true);
    }
  };

  const handlePasswordChange = async () => {
    const token = getToken();

    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword) {
      window.showPopup?.("Vui lòng nhập đầy đủ!", true);
      return;
    }

    if (newPassword !== confirmPassword) {
      window.showPopup?.("Mật khẩu xác nhận không khớp!", true);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      window.showPopup?.("Đổi mật khẩu thành công!");

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordSection(false);
    } catch {
      window.showPopup?.("Đổi mật khẩu thất bại!", true);
    }
  };

  return (
    <div className="wrapper">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} />

      <div
        className="content-wrapper"
        style={{
          marginLeft: sidebarOpen ? "230px" : "80px",
          marginTop: "65px",
          transition: ".3s",
          minHeight: "100vh",
        }}
      >
        <div className="profile-page">
          <div className="profile-banner">
            <h2>
              <i className="fa fa-user-circle"></i>
              Thông tin cá nhân
            </h2>

            <p>Quản lý thông tin cá nhân và thay đổi mật khẩu</p>
          </div>

          <div className="profile-card">
            <div className="profile-form">
              <div className="profile-grid">
                <div className="form-group">
                  <label>Họ và tên</label>

                  <input
                    type="text"
                    value={profile.fullName}
                    readOnly={!editing}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    value={profile.email}
                    readOnly={!editing}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Ngày sinh</label>

                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={profile.dateOfBirth}
                    readOnly={!editing}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại</label>

                  <input
                    type="text"
                    value={profile.phone}
                    readOnly={!editing}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Lớp</label>

                  <input
                    type="text"
                    value={profile.className}
                    readOnly={!editing}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        className: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Giới tính</label>

                  <select
                    value={profile.gender}
                    disabled={!editing}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="false">Nam</option>
                    <option value="true">Nữ</option>
                  </select>
                </div>
              </div>
              <div className="residence-section">
                <h3 className="card-title">
                  <i className="fa fa-home"></i>
                  Thông tin cư trú
                </h3>

                <div className="profile-grid">
                  <div className="form-group">
                    <label>Số CCCD</label>

                    <input
                      value={profile.residenceInfo.identityNumber}
                      readOnly={!editing}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          residenceInfo: {
                            ...profile.residenceInfo,
                            identityNumber: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngày cấp</label>

                    <input
                      type="date"
                      value={profile.residenceInfo.identityIssueDate}
                      readOnly={!editing}
                      onChange={(e) =>
                        handleResidenceChange(
                          "identityIssueDate",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Nơi cấp</label>

                    <input
                      value={profile.residenceInfo.identityIssuePlace}
                      readOnly={!editing}
                      onChange={(e) =>
                        handleResidenceChange(
                          "identityIssuePlace",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Quốc tịch</label>

                    <input
                      value={profile.residenceInfo.nationality}
                      readOnly={!editing}
                      onChange={(e) =>
                        handleResidenceChange("nationality", e.target.value)
                      }
                      placeholder="Ví dụ: Việt Nam"
                    />
                  </div>

                  <div className="form-group">
                    <label>Dân tộc</label>

                    <input
                      value={profile.residenceInfo.ethnicity}
                      readOnly={!editing}
                      onChange={(e) =>
                        handleResidenceChange("ethnicity", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Tôn giáo</label>

                    <input
                      value={profile.residenceInfo.religion}
                      readOnly={!editing}
                      onChange={(e) =>
                        handleResidenceChange("religion", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Nơi sinh</label>

                    <input
                      value={profile.residenceInfo.placeOfBirth}
                      readOnly={!editing}
                      onChange={(e) =>
                        handleResidenceChange("placeOfBirth", e.target.value)
                      }
                    />
                  </div>
                </div>

                <h4 style={{ marginTop: 25 }}>Địa chỉ thường trú</h4>

                <div className="profile-grid">
                  <div className="form-group">
                    <label>Tỉnh / Thành phố</label>

                    <input
                      value={profile.residenceInfo.province}
                      readOnly={!editing}
                      onChange={(e) =>
                        handleResidenceChange("province", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Quận / Huyện</label>

                    <input
                      value={profile.residenceInfo.district}
                      readOnly={!editing}
                      onChange={(e) =>
                        handleResidenceChange("district", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Phường / Xã</label>

                    <input
                      value={profile.residenceInfo.ward}
                      readOnly={!editing}
                      onChange={(e) =>
                        handleResidenceChange("ward", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Địa chỉ</label>

                  <textarea
                    rows="3"
                    value={profile.residenceInfo.address}
                    readOnly={!editing}
                    onChange={(e) =>
                      handleResidenceChange("address", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="profile-action">
                {!editing ? (
                  <>
                    <button className="btn-edit" onClick={handleEdit}>
                      <i className="fa fa-pencil"></i>
                      Cập nhật thông tin
                    </button>

                    <button
                      className="btn-password"
                      onClick={() => setShowPasswordSection(true)}
                    >
                      <i className="fa fa-lock"></i>
                      Đổi mật khẩu
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-save" onClick={handleSave}>
                      <i className="fa fa-check"></i>
                      Lưu thay đổi
                    </button>

                    <button className="btn-cancel" onClick={handleCancel}>
                      <i className="fa fa-times"></i>
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {showPasswordSection && (
            <div className="profile-card password-card">
              <h3 className="card-title">
                <i className="fa fa-lock"></i>
                Đổi mật khẩu
              </h3>

              <div className="password-grid">
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>

                  <div className="password-input">
                    <input
                      type={showPassword.old ? "text" : "password"}
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passwords.oldPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          oldPassword: e.target.value,
                        })
                      }
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          old: !showPassword.old,
                        })
                      }
                    >
                      <i
                        className={
                          showPassword.old ? "fa fa-eye-slash" : "fa fa-eye"
                        }
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mật khẩu mới</label>

                  <div className="password-input">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          new: !showPassword.new,
                        })
                      }
                    >
                      <i
                        className={
                          showPassword.new ? "fa fa-eye-slash" : "fa fa-eye"
                        }
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Xác nhận mật khẩu</label>

                  <div className="password-input">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          confirm: !showPassword.confirm,
                        })
                      }
                    >
                      <i
                        className={
                          showPassword.confirm ? "fa fa-eye-slash" : "fa fa-eye"
                        }
                      ></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="password-action">
                <button className="btn-save" onClick={handlePasswordChange}>
                  <i className="fa fa-check-circle"></i>
                  Xác nhận
                </button>

                <button
                  className="btn-cancel"
                  onClick={() => setShowPasswordSection(false)}
                >
                  <i className="fa fa-times-circle"></i>
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
