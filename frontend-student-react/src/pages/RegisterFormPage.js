import { useEffect, useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

export default function DormitoryRegistration() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [fullName, setFullName] = useState("");

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [className, setClassName] = useState("");

  const [gender, setGender] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState("");

  const [identityNumber, setIdentityNumber] = useState("");

  const [identityIssueDate, setIdentityIssueDate] = useState("");

  const [identityIssuePlace, setIdentityIssuePlace] = useState("");

  const [nationality, setNationality] = useState("");

  const [placeOfBirth, setPlaceOfBirth] = useState("");

  const [ethnicity, setEthnicity] = useState("");

  const [religion, setReligion] = useState("");

  const [province, setProvince] = useState("");

  const [district, setDistrict] = useState("");

  const [ward, setWard] = useState("");

  const [address, setAddress] = useState("");

  const [message, setMessage] = useState("");

  const [messageColor, setMessageColor] = useState("red");

  const [disabled, setDisabled] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      setDisabled(true);

      setMessage("Không thể đăng ký nội trú mới khi tài khoản đã tồn tại.");

      setMessageColor("blue");
    }
  }, []);

  const showMessage = (text, color = "red") => {
    setMessage(text);
    setMessageColor(color);
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      showMessage("Vui lòng nhập họ và tên!");

      return false;
    }

    if (!username.trim()) {
      showMessage("Vui lòng nhập mã số sinh viên!");

      return false;
    }

    if (!dateOfBirth) {
      showMessage("Vui lòng chọn ngày sinh!");

      return false;
    }

    if (!className.trim()) {
      showMessage("Vui lòng nhập lớp!");

      return false;
    }

    if (!email.trim()) {
      showMessage("Vui lòng nhập email!");

      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      showMessage("Email không hợp lệ! Vui lòng nhập đúng định dạng.");

      return false;
    }

    if (!phone.trim()) {
      showMessage("Vui lòng nhập số điện thoại!");

      return false;
    }

    const phoneRegex = /^(0|\+84)[0-9]{9}$/;

    if (!phoneRegex.test(phone.trim())) {
      showMessage("Số điện thoại không đúng định dạng!");

      return false;
    }

    const selectedBirthDate = new Date(dateOfBirth);

    const today = new Date();

    selectedBirthDate.setHours(0, 0, 0, 0);

    today.setHours(0, 0, 0, 0);

    if (selectedBirthDate > today) {
      showMessage("Ngày sinh không được lớn hơn ngày hiện tại!");

      return false;
    }

    if (!identityNumber.trim()) {
      showMessage("Vui lòng nhập số CCCD!");

      return false;
    }

    const identityRegex = /^[0-9]{12}$/;

    if (!identityRegex.test(identityNumber.trim())) {
      showMessage("Số CCCD phải gồm đúng 12 chữ số!");

      return false;
    }

    if (!identityIssueDate) {
      showMessage("Vui lòng chọn ngày cấp CCCD!");

      return false;
    }

    const issueDate = new Date(identityIssueDate);

    issueDate.setHours(0, 0, 0, 0);

    if (issueDate > today) {
      showMessage("Ngày cấp CCCD không được lớn hơn ngày hiện tại!");

      return false;
    }

    if (issueDate < selectedBirthDate) {
      showMessage("Ngày cấp CCCD không được nhỏ hơn ngày sinh!");

      return false;
    }

    if (!identityIssuePlace.trim()) {
      showMessage("Vui lòng nhập nơi cấp CCCD!");

      return false;
    }

    if (!nationality.trim()) {
      showMessage("Vui lòng nhập quốc tịch!");

      return false;
    }

    if (!placeOfBirth.trim()) {
      showMessage("Vui lòng nhập nơi sinh!");

      return false;
    }

    if (!ethnicity.trim()) {
      showMessage("Vui lòng nhập dân tộc!");

      return false;
    }

    if (!religion.trim()) {
      showMessage("Vui lòng nhập tôn giáo!");

      return false;
    }

    if (!province.trim()) {
      showMessage("Vui lòng nhập tỉnh hoặc thành phố!");

      return false;
    }

    if (!district.trim()) {
      showMessage("Vui lòng nhập quận hoặc huyện!");

      return false;
    }

    if (!ward.trim()) {
      showMessage("Vui lòng nhập phường hoặc xã!");

      return false;
    }

    if (!address.trim()) {
      showMessage("Vui lòng nhập địa chỉ cụ thể!");

      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFullName("");
    setUsername("");
    setEmail("");
    setPhone("");
    setClassName("");
    setGender(false);
    setDateOfBirth("");

    setIdentityNumber("");
    setIdentityIssueDate("");
    setIdentityIssuePlace("");

    setNationality("");
    setPlaceOfBirth("");
    setEthnicity("");
    setReligion("");

    setProvince("");
    setDistrict("");
    setWard("");
    setAddress("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!validateForm()) {
      return;
    }

    const data = {
      username: username.trim(),

      fullName: fullName.trim(),

      email: email.trim(),

      phone: phone.trim(),

      className: className.trim(),

      gender,

      dateOfBirth,

      password: "12345678",

      residenceInfo: {
        identityNumber: identityNumber.trim(),

        identityIssueDate,

        identityIssuePlace: identityIssuePlace.trim(),

        nationality: nationality.trim(),

        placeOfBirth: placeOfBirth.trim(),

        ethnicity: ethnicity.trim(),

        religion: religion.trim(),

        province: province.trim(),

        district: district.trim(),

        ward: ward.trim(),

        address: address.trim(),
      },
    };

    try {
      setSubmitting(true);

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Không thể đăng ký nội trú.");
      }

      showMessage(
        responseText ||
          "Đăng ký thành công! Vui lòng chờ quản trị viên xét duyệt.",
        "green"
      );

      resetForm();
    } catch (error) {
      console.error("Lỗi đăng ký nội trú:", error);

      showMessage(error.message || "Không thể kết nối đến máy chủ!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} />

      <div
        style={{
          marginLeft: sidebarOpen ? "230px" : "80px",

          marginTop: "65px",

          transition: "all .3s",

          minHeight: "100vh",

          background:
            "linear-gradient(135deg,#eef5ff 0%,#f8fbff 50%,#ffffff 100%)",

          padding: "35px",
        }}
      >
        <div
          style={{
            maxWidth: "950px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#1565C0",

              color: "#fff",

              padding: "30px",

              borderRadius: "18px",

              marginBottom: "30px",

              boxShadow: "0 10px 30px rgba(0,0,0,.15)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
              }}
            >
              <i
                className="fa fa-home"
                style={{
                  marginRight: 10,
                }}
              ></i>
              Đăng ký nội trú
            </h2>

            <p
              style={{
                marginTop: 12,
                marginBottom: 0,
                fontSize: 16,
                opacity: 0.95,
              }}
            >
              Điền đầy đủ thông tin để đăng ký ở Ký túc xá Trường Đại học Công
              nghệ Sài Gòn.
            </p>
          </div>

          <div
            style={{
              background: "#fff",

              borderRadius: "20px",

              padding: "40px",

              boxShadow: "0 10px 35px rgba(21,101,192,.08)",

              border: "1px solid #e6eef7",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Họ và tên
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      disabled={disabled}
                      style={modernInput}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Mã số sinh viên
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      disabled={disabled}
                      style={modernInput}
                      placeholder="Ví dụ: DH52000001"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Ngày sinh
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      max={new Date().toISOString().split("T")[0]}
                      value={dateOfBirth}
                      onChange={(event) => setDateOfBirth(event.target.value)}
                      disabled={disabled}
                      style={modernInput}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Lớp
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={className}
                      onChange={(event) => setClassName(event.target.value)}
                      disabled={disabled}
                      style={modernInput}
                      placeholder="Ví dụ: D20_TH01"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Email
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    {" "}
                    *
                  </span>
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={disabled}
                  style={modernInput}
                  placeholder="Nhập email sinh viên"
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Số điện thoại
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      disabled={disabled}
                      style={modernInput}
                      placeholder="Ví dụ: 0912345678"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Giới tính
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <div
                      style={{
                        marginTop: 15,
                        display: "flex",
                        gap: 35,
                      }}
                    >
                      <label
                        style={{
                          fontWeight: 500,
                        }}
                      >
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === false}
                          onChange={() => setGender(false)}
                          disabled={disabled}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                          }}
                        />

                        <span
                          style={{
                            marginLeft: 8,
                          }}
                        >
                          Nam
                        </span>
                      </label>

                      <label
                        style={{
                          fontWeight: 500,
                        }}
                      >
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === true}
                          onChange={() => setGender(true)}
                          disabled={disabled}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                          }}
                        />

                        <span
                          style={{
                            marginLeft: 8,
                          }}
                        >
                          Nữ
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <hr
                style={{
                  margin: "35px 0",
                }}
              />

              <h4
                style={{
                  color: "#1565C0",
                  fontWeight: 700,
                  marginBottom: 25,
                }}
              >
                <i
                  className="fa fa-id-card"
                  style={{
                    marginRight: 10,
                  }}
                ></i>
                Thông tin cư trú
              </h4>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Số CCCD
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={modernInput}
                      value={identityNumber}
                      onChange={(event) =>
                        setIdentityNumber(event.target.value.replace(/\D/g, ""))
                      }
                      disabled={disabled}
                      maxLength="12"
                      inputMode="numeric"
                      placeholder="Nhập 12 chữ số CCCD"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Ngày cấp CCCD
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      style={modernInput}
                      max={new Date().toISOString().split("T")[0]}
                      value={identityIssueDate}
                      onChange={(event) =>
                        setIdentityIssueDate(event.target.value)
                      }
                      disabled={disabled}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Nơi cấp CCCD
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    {" "}
                    *
                  </span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  style={modernInput}
                  value={identityIssuePlace}
                  onChange={(event) =>
                    setIdentityIssuePlace(event.target.value)
                  }
                  disabled={disabled}
                  placeholder="Nhập nơi cấp CCCD"
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Quốc tịch
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={modernInput}
                      value={nationality}
                      onChange={(event) => setNationality(event.target.value)}
                      disabled={disabled}
                      placeholder="Ví dụ: Việt Nam"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Nơi sinh
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={modernInput}
                      value={placeOfBirth}
                      onChange={(event) => setPlaceOfBirth(event.target.value)}
                      disabled={disabled}
                      placeholder="Nhập nơi sinh"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Dân tộc
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={modernInput}
                      value={ethnicity}
                      onChange={(event) => setEthnicity(event.target.value)}
                      disabled={disabled}
                      placeholder="Ví dụ: Kinh"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Tôn giáo
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={modernInput}
                      value={religion}
                      onChange={(event) => setReligion(event.target.value)}
                      disabled={disabled}
                      placeholder="Ví dụ: Không"
                    />
                  </div>
                </div>
              </div>

              <h4
                style={{
                  color: "#1565C0",
                  fontWeight: 700,
                  marginTop: 25,
                  marginBottom: 20,
                }}
              >
                Địa chỉ thường trú
              </h4>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>
                      Tỉnh / Thành phố
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={modernInput}
                      value={province}
                      onChange={(event) => setProvince(event.target.value)}
                      disabled={disabled}
                      placeholder="Nhập tỉnh/thành phố"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>
                      Quận / Huyện
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={modernInput}
                      value={district}
                      onChange={(event) => setDistrict(event.target.value)}
                      disabled={disabled}
                      placeholder="Nhập quận/huyện"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>
                      Phường / Xã
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={modernInput}
                      value={ward}
                      onChange={(event) => setWard(event.target.value)}
                      disabled={disabled}
                      placeholder="Nhập phường/xã"
                    />
                  </div>
                </div>
              </div>

              <div
                className="form-group"
                style={{
                  marginTop: 15,
                }}
              >
                <label>
                  Địa chỉ cụ thể
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    {" "}
                    *
                  </span>
                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  style={{
                    ...modernInput,
                    height: "90px",
                  }}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  disabled={disabled}
                  placeholder="Nhập số nhà, tên đường, khu phố hoặc thôn"
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: 35,
                }}
              >
                <button
                  type="submit"
                  className="btn"
                  disabled={disabled || submitting}
                  style={{
                    ...submitButton,
                    opacity: disabled || submitting ? 0.65 : 1,
                    cursor: disabled || submitting ? "not-allowed" : "pointer",
                  }}
                >
                  <i
                    className={`fa ${
                      submitting ? "fa-spinner fa-spin" : "fa-paper-plane"
                    }`}
                    style={{
                      marginRight: 8,
                    }}
                  ></i>

                  {submitting ? "Đang gửi..." : "Gửi đăng ký"}
                </button>
              </div>

              {message && (
                <div
                  style={{
                    marginTop: 25,

                    padding: "15px",

                    borderRadius: 10,

                    background:
                      messageColor === "green"
                        ? "#e8f8ef"
                        : messageColor === "blue"
                        ? "#e8f2ff"
                        : "#fdeaea",

                    color:
                      messageColor === "green"
                        ? "#198754"
                        : messageColor === "blue"
                        ? "#1565C0"
                        : "#dc3545",

                    textAlign: "center",

                    fontWeight: 600,

                    border:
                      messageColor === "green"
                        ? "1px solid #19875433"
                        : messageColor === "blue"
                        ? "1px solid #1565C033"
                        : "1px solid #dc354533",
                  }}
                >
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <Script />
    </div>
  );
}

const modernInput = {
  height: "48px",

  borderRadius: "10px",

  border: "1px solid #d7e3f2",

  boxShadow: "none",

  fontSize: "15px",

  padding: "12px 15px",

  transition: ".25s",

  background: "#fafcff",
};

const submitButton = {
  width: "230px",

  height: "50px",

  background: "#1565C0",

  border: "none",

  borderRadius: "12px",

  color: "#fff",

  fontSize: "16px",

  fontWeight: 600,

  boxShadow: "0 8px 20px rgba(21,101,192,.25)",

  transition: ".3s",
};
