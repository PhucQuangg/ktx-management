import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

import "../css/ContractDetail.css";

export default function ContractDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.state?.id;

  const [contract, setContract] = useState(null);

  const [loading, setLoading] = useState(true);

  const [loadingCancel, setLoadingCancel] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!id) {
      window.showPopup?.("Không tìm thấy thông tin đăng ký phòng!", true);

      navigate("/my-contracts");
      return;
    }

    fetchContract();
  }, [id, token, navigate]);

  const fetchContract = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/student/contracts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();

      let data = null;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            responseText ||
            "Không thể tải thông tin đăng ký phòng."
        );
      }

      setContract(data);
    } catch (error) {
      console.error("Lỗi tải thông tin đăng ký phòng:", error);

      setContract(null);

      window.showPopup?.(
        error.message || "Không thể tải thông tin đăng ký phòng.",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelContract = () => {
    window.showPopup?.(
      "Bạn có chắc muốn hủy đăng ký phòng này không?",
      false,
      true,
      async () => {
        try {
          setLoadingCancel(true);

          const response = await fetch(
            `http://localhost:8080/api/student/contracts/cancel/${id}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const responseText = await response.text();

          let data = null;

          try {
            data = responseText ? JSON.parse(responseText) : null;
          } catch {
            data = null;
          }

          if (!response.ok) {
            throw new Error(
              data?.message || responseText || "Hủy đăng ký phòng thất bại."
            );
          }

          window.showPopup?.(
            data?.message || responseText || "Hủy đăng ký phòng thành công!"
          );

          await fetchContract();
        } catch (error) {
          console.error("Lỗi hủy đăng ký phòng:", error);

          window.showPopup?.(
            error.message || "Hủy đăng ký phòng thất bại.",
            true
          );
        } finally {
          setLoadingCancel(false);
        }
      }
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Chưa cập nhật";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("vi-VN");
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Chờ duyệt",
      ACTIVE: "Đang hiệu lực",
      CANCELED: "Đã hủy",
      EXPIRED: "Hết hạn",
      REJECTED: "Bị từ chối",
    };

    return statusMap[status] || status || "Chưa xác định";
  };

  if (loading) {
    return (
      <div className="contract-loading-page">
        <i className="fa fa-spinner fa-spin"></i>

        <p>Đang tải thông tin đăng ký phòng...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="contract-loading-page">
        <i className="fa fa-file-o"></i>

        <p>Không tìm thấy thông tin đăng ký phòng.</p>

        <button type="button" onClick={() => navigate("/my-contracts")}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const isRegistration =
    contract.status === "PENDING" || contract.status === "REJECTED";

  const isContract =
    contract.status === "ACTIVE" ||
    contract.status === "CANCELED" ||
    contract.status === "EXPIRED";

  const pageTitle = isRegistration
    ? "Chi tiết đăng ký phòng"
    : "Chi tiết hợp đồng nội trú";

  const pageDescription = isRegistration
    ? "Thông tin chi tiết về yêu cầu đăng ký phòng nội trú của sinh viên."
    : "Thông tin chi tiết về hợp đồng nội trú ký túc xá.";

  const informationTitle = isRegistration
    ? "Thông tin đăng ký phòng"
    : "Thông tin hợp đồng nội trú";

  const contentTitle = isRegistration
    ? "Nội dung đăng ký phòng"
    : "Nội dung hợp đồng nội trú";

  return (
    <div className="wrapper">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} />

      <div
        className="content-wrapper"
        style={{
          marginLeft: sidebarOpen ? "260px" : "80px",
          marginTop: "65px",
          transition: ".3s",
          minHeight: "100vh",
        }}
      >
        <div className="contract-page">
          <div className="contract-banner">
            <h2>
              <i
                className={`fa ${isRegistration ? "fa-bed" : "fa-file-text-o"}`}
              ></i>

              {pageTitle}
            </h2>

            <p>{pageDescription}</p>
          </div>

          <div className="contract-detail-card">
            <h3 className="card-title">
              <i
                className={`fa ${isRegistration ? "fa-bed" : "fa-file-text-o"}`}
              ></i>

              {informationTitle}
            </h3>

            <div className="status-wrapper">
              <span
                className={`status-badge ${
                  contract.status ? contract.status.toLowerCase() : ""
                }`}
              >
                {getStatusText(contract.status)}
              </span>
            </div>

            <div className="contract-info-grid">
              <div className="info-item">
                <label>Họ và tên</label>

                <span>{contract.studentName || "Chưa cập nhật"}</span>
              </div>

              <div className="info-item">
                <label>Email</label>

                <span>{contract.studentEmail || "Chưa cập nhật"}</span>
              </div>

              <div className="info-item">
                <label>Phòng đăng ký</label>

                <span>{contract.roomName || "Chưa cập nhật"}</span>
              </div>

              <div className="info-item">
                <label>Ngày bắt đầu</label>

                <span>{formatDate(contract.startDate)}</span>
              </div>

              <div className="info-item">
                <label>Ngày kết thúc</label>

                <span>{formatDate(contract.endDate)}</span>
              </div>

              {contract.reason && (
                <div className="info-item">
                  <label>
                    {contract.status === "REJECTED"
                      ? "Lý do từ chối"
                      : contract.status === "CANCELED"
                      ? "Lý do hủy"
                      : "Lý do xử lý"}
                  </label>

                  <span>{contract.reason}</span>
                </div>
              )}
            </div>
          </div>

          <div className="contract-detail-card">
            <h3 className="card-title">
              <i className="fa fa-book"></i>

              {contentTitle}
            </h3>

            <div className="contract-content">
              {contract.status === "PENDING" && (
                <>
                  <div className="content-item">
                    <i className="fa fa-bed"></i>

                    <p>
                      Sinh viên đã gửi yêu cầu đăng ký
                      <strong> phòng {contract.roomName}</strong>.
                    </p>
                  </div>

                  <div className="content-item">
                    <i className="fa fa-calendar"></i>

                    <p>
                      Thời gian đăng ký từ{" "}
                      <strong>{formatDate(contract.startDate)}</strong> đến{" "}
                      <strong>{formatDate(contract.endDate)}</strong>.
                    </p>
                  </div>

                  <div className="content-item">
                    <i className="fa fa-hourglass-half"></i>

                    <p>
                      Yêu cầu đăng ký phòng đang chờ Ban Quản lý Ký túc xá xét
                      duyệt.
                    </p>
                  </div>

                  <div className="content-item">
                    <i className="fa fa-info-circle"></i>

                    <p>
                      Sau khi được duyệt, đăng ký phòng sẽ chuyển thành hợp đồng
                      nội trú đang có hiệu lực.
                    </p>
                  </div>
                </>
              )}

              {contract.status === "REJECTED" && (
                <>
                  <div className="content-item">
                    <i className="fa fa-times-circle"></i>

                    <p>
                      Yêu cầu đăng ký
                      <strong> phòng {contract.roomName}</strong> đã bị từ chối.
                    </p>
                  </div>

                  <div className="content-item">
                    <i className="fa fa-calendar"></i>

                    <p>
                      Thời gian đăng ký từ{" "}
                      <strong>{formatDate(contract.startDate)}</strong> đến{" "}
                      <strong>{formatDate(contract.endDate)}</strong>.
                    </p>
                  </div>

                  {contract.reason && (
                    <div className="content-item">
                      <i className="fa fa-exclamation-circle"></i>

                      <p>
                        Lý do từ chối: <strong>{contract.reason}</strong>.
                      </p>
                    </div>
                  )}

                  <div className="content-item">
                    <i className="fa fa-info-circle"></i>

                    <p>
                      Sinh viên có thể kiểm tra lại thông tin và thực hiện đăng
                      ký phòng khác theo quy định của hệ thống.
                    </p>
                  </div>
                </>
              )}

              {contract.status === "ACTIVE" && (
                <>
                  <div className="content-item">
                    <i className="fa fa-home"></i>

                    <p>
                      Ban Quản lý Ký túc xá đồng ý bố trí cho sinh viên ở
                      <strong> phòng {contract.roomName}</strong>.
                    </p>
                  </div>

                  <div className="content-item">
                    <i className="fa fa-calendar"></i>

                    <p>
                      Hợp đồng có hiệu lực từ{" "}
                      <strong>{formatDate(contract.startDate)}</strong> đến{" "}
                      <strong>{formatDate(contract.endDate)}</strong>.
                    </p>
                  </div>

                  <div className="content-item">
                    <i className="fa fa-file-text-o"></i>

                    <p>
                      Sinh viên có trách nhiệm thực hiện đầy đủ các quy định nội
                      trú, thanh toán chi phí đúng thời hạn và bảo quản tài sản
                      ký túc xá.
                    </p>
                  </div>

                  <div className="content-item">
                    <i className="fa fa-check-square-o"></i>

                    <p>
                      Hai bên thống nhất thực hiện đúng các điều khoản được quy
                      định trong hợp đồng nội trú.
                    </p>
                  </div>
                </>
              )}

              {contract.status === "CANCELED" && (
                <>
                  <div className="content-item">
                    <i className="fa fa-ban"></i>

                    <p>
                      Hợp đồng nội trú tại
                      <strong> phòng {contract.roomName}</strong> đã được hủy.
                    </p>
                  </div>

                  <div className="content-item">
                    <i className="fa fa-calendar"></i>

                    <p>
                      Thời gian hợp đồng được đăng ký từ{" "}
                      <strong>{formatDate(contract.startDate)}</strong> đến{" "}
                      <strong>{formatDate(contract.endDate)}</strong>.
                    </p>
                  </div>

                  {contract.reason && (
                    <div className="content-item">
                      <i className="fa fa-exclamation-circle"></i>

                      <p>
                        Lý do hủy hợp đồng: <strong>{contract.reason}</strong>.
                      </p>
                    </div>
                  )}
                </>
              )}

              {contract.status === "EXPIRED" && (
                <>
                  <div className="content-item">
                    <i className="fa fa-clock-o"></i>

                    <p>
                      Hợp đồng nội trú tại
                      <strong> phòng {contract.roomName}</strong> đã hết thời
                      hạn hiệu lực.
                    </p>
                  </div>

                  <div className="content-item">
                    <i className="fa fa-calendar"></i>

                    <p>
                      Thời gian hợp đồng từ{" "}
                      <strong>{formatDate(contract.startDate)}</strong> đến{" "}
                      <strong>{formatDate(contract.endDate)}</strong>.
                    </p>
                  </div>

                  <div className="content-item">
                    <i className="fa fa-info-circle"></i>

                    <p>
                      Sinh viên có thể thực hiện đăng ký phòng mới nếu hệ thống
                      đang mở đợt đăng ký.
                    </p>
                  </div>
                </>
              )}

              {!isRegistration && !isContract && (
                <div className="content-item">
                  <i className="fa fa-info-circle"></i>

                  <p>Chưa có thông tin nội dung cho trạng thái hiện tại.</p>
                </div>
              )}
            </div>
          </div>

          <div className="contract-action">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/my-contracts")}
            >
              <i className="fa fa-arrow-left"></i>
              Quay lại
            </button>

            {contract.status === "PENDING" && (
              <button
                type="button"
                className="btn-cancel"
                onClick={cancelContract}
                disabled={loadingCancel}
              >
                <i
                  className={`fa ${
                    loadingCancel ? "fa-spinner fa-spin" : "fa-times-circle"
                  }`}
                ></i>

                {loadingCancel ? "Đang hủy..." : "Hủy đăng ký phòng"}
              </button>
            )}
          </div>
        </div>
      </div>

      <Script />
    </div>
  );
}
