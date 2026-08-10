import React, { useEffect, useState } from "react";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import "../../css/AdminContractDetail.css";

export default function ContractDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const contractId = searchParams.get("id");

  const token =
    sessionStorage.getItem("admin_token") ||
    localStorage.getItem("admin_token");

  const filters = location.state || {
    statusFilter: "ALL",
    studentFilter: "",
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [contract, setContract] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!contractId) {
      window.showPopup?.("Không tìm thấy mã đăng ký phòng.", true);

      navigate("/admin/contracts");
      return;
    }

    loadContract();
  }, [contractId, token, navigate]);

  const loadContract = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/admin/contracts/${contractId}`,
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
      console.error("Lỗi tải chi tiết đăng ký phòng:", error);

      setContract(null);

      window.showPopup?.(
        error.message || "Lỗi khi tải thông tin đăng ký phòng.",
        true
      );
    } finally {
      setLoading(false);
    }
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
      REJECTED: "Đã từ chối",
      CANCELED: "Đã hủy",
      EXPIRED: "Hết hạn",
    };

    return statusMap[status] || status || "Chưa xác định";
  };

  const handleBack = () => {
    navigate("/admin/contracts", {
      state: filters,
    });
  };

  if (loading) {
    return (
      <div className="contract-detail-loading-page">
        <i className="fa fa-spinner fa-spin"></i>

        <p>Đang tải thông tin đăng ký phòng...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="contract-detail-loading-page">
        <i className="fa fa-file-circle-xmark"></i>

        <p>Không tìm thấy thông tin đăng ký phòng.</p>

        <button type="button" onClick={handleBack}>
          Trở về danh sách
        </button>
      </div>
    );
  }

  const isRegistration =
    contract.status === "PENDING" || contract.status === "REJECTED";

  const isActiveContract =
    contract.status === "ACTIVE" ||
    contract.status === "CANCELED" ||
    contract.status === "EXPIRED";

  const pageTitle = isRegistration
    ? "Chi tiết đăng ký phòng"
    : "Chi tiết hợp đồng nội trú";

  const documentTitle = isRegistration
    ? "PHIẾU ĐĂNG KÝ PHÒNG NỘI TRÚ"
    : "HỢP ĐỒNG NỘI TRÚ KÝ TÚC XÁ";

  const documentCode = isRegistration
    ? `${contract.id}/ĐK-PHÒNG`
    : `${contract.id}/HĐ-KTX`;

  const toolbarTitle = isRegistration
    ? "Phiếu đăng ký phòng nội trú"
    : "Hợp đồng nội trú ký túc xá";

  const toolbarDescription = isRegistration
    ? "Thông tin đăng ký phòng của sinh viên được lưu trữ trên hệ thống."
    : "Thông tin hợp đồng nội trú được lưu trữ trên hệ thống.";

  const statusSectionTitle = isRegistration
    ? "Điều 4. Trạng thái đăng ký phòng"
    : "Điều 4. Trạng thái hợp đồng";

  const reasonTitle =
    contract.status === "REJECTED"
      ? "Lý do từ chối"
      : contract.status === "CANCELED"
      ? "Lý do hủy hợp đồng"
      : "Lý do xử lý";

  return (
    <div className="admin-contract-detail-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`admin-contract-detail-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="contract-detail-banner">
          <div>
            <div className="contract-detail-banner-badge">
              <i
                className={`fa ${
                  isRegistration ? "fa-bed" : "fa-file-contract"
                }`}
              ></i>
              Quản lý đăng ký phòng
            </div>

            <h1>{pageTitle}</h1>

            <p>
              {isRegistration
                ? "Xem thông tin sinh viên, phòng đăng ký, thời gian nội trú và trạng thái xử lý."
                : "Xem thông tin sinh viên, phòng ở, thời hạn và trạng thái của hợp đồng nội trú."}
            </p>
          </div>

          <div className="contract-detail-banner-icon">
            <i
              className={`fa ${
                isRegistration ? "fa-door-open" : "fa-file-signature"
              }`}
            ></i>
          </div>
        </section>

        <section className="contract-document-card">
          <div className="contract-document-toolbar">
            <div>
              <h2>{toolbarTitle}</h2>

              <p>{toolbarDescription}</p>
            </div>

            <span
              className={`contract-detail-status ${
                contract.status ? contract.status.toLowerCase() : ""
              }`}
            >
              {getStatusText(contract.status)}
            </span>
          </div>

          <div className="contract-document">
            <div className="contract-national-header">
              <div className="contract-school-header">
                <strong>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ SÀI GÒN</strong>

                <span>KÝ TÚC XÁ SINH VIÊN</span>

                <div className="contract-header-line"></div>
              </div>

              <div className="contract-country-header">
                <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>

                <span>Độc lập - Tự do - Hạnh phúc</span>

                <div className="contract-header-line"></div>
              </div>
            </div>

            <div className="contract-document-title">
              <h2>{documentTitle}</h2>

              <p>
                Số:
                <strong> {documentCode}</strong>
              </p>
            </div>

            <div className="contract-document-introduction">
              {isRegistration ? (
                <>
                  <p>
                    Căn cứ nhu cầu đăng ký phòng nội trú của sinh viên và quy
                    định quản lý ký túc xá của Trường Đại học Công nghệ Sài Gòn;
                  </p>

                  <p>Sinh viên đăng ký phòng nội trú với các thông tin sau:</p>
                </>
              ) : (
                <>
                  <p>
                    Căn cứ nhu cầu đăng ký nội trú của sinh viên và quy định
                    quản lý ký túc xá của Trường Đại học Công nghệ Sài Gòn;
                  </p>

                  <p>
                    Hai bên thống nhất xác lập hợp đồng nội trú với các thông
                    tin và điều khoản sau:
                  </p>
                </>
              )}
            </div>

            <section className="contract-document-section">
              <h3>Điều 1. Thông tin sinh viên</h3>

              <div className="contract-information-grid">
                <div className="contract-information-row">
                  <label>Họ và tên</label>

                  <span>{contract.studentName || "Chưa cập nhật"}</span>
                </div>

                <div className="contract-information-row">
                  <label>Mã số sinh viên</label>

                  <span>{contract.studentUsername || "Chưa cập nhật"}</span>
                </div>

                <div className="contract-information-row full-width">
                  <label>Email</label>

                  <span>{contract.studentEmail || "Chưa cập nhật"}</span>
                </div>
              </div>
            </section>

            <section className="contract-document-section">
              <h3>Điều 2. Thông tin phòng ở</h3>

              <div className="contract-information-grid">
                <div className="contract-information-row full-width">
                  <label>Phòng nội trú</label>

                  <span>{contract.roomName || "Chưa cập nhật"}</span>
                </div>
              </div>
            </section>

            <section className="contract-document-section">
              <h3>Điều 3. Thời gian nội trú</h3>

              <div className="contract-information-grid">
                <div className="contract-information-row">
                  <label>Ngày bắt đầu</label>

                  <span>{formatDate(contract.startDate)}</span>
                </div>

                <div className="contract-information-row">
                  <label>Ngày kết thúc</label>

                  <span>{formatDate(contract.endDate)}</span>
                </div>
              </div>
            </section>

            <section className="contract-document-section">
              <h3>{statusSectionTitle}</h3>

              <div className="contract-status-information">
                <span
                  className={`contract-detail-status large ${
                    contract.status ? contract.status.toLowerCase() : ""
                  }`}
                >
                  {getStatusText(contract.status)}
                </span>

                {contract.reason && (
                  <div className="contract-reason-box">
                    <strong>{reasonTitle}</strong>

                    <p>{contract.reason}</p>
                  </div>
                )}

                {contract.status === "PENDING" && (
                  <div className="contract-reason-box">
                    <strong>Thông tin xử lý</strong>

                    <p>
                      Đăng ký phòng đang chờ Ban Quản lý Ký túc xá xét duyệt.
                    </p>
                  </div>
                )}

                {contract.status === "ACTIVE" && (
                  <div className="contract-reason-box">
                    <strong>Kết quả xử lý</strong>

                    <p>
                      Đăng ký phòng đã được duyệt và hợp đồng nội trú đang có
                      hiệu lực.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="contract-document-section">
              <h3>
                {isRegistration
                  ? "Điều 5. Cam kết của sinh viên"
                  : "Điều 5. Cam kết của các bên"}
              </h3>

              <div className="contract-commitment-list">
                {isRegistration ? (
                  <>
                    <p>
                      1. Sinh viên cam kết cung cấp đầy đủ và chính xác các
                      thông tin đăng ký phòng.
                    </p>

                    <p>
                      2. Sinh viên đồng ý tuân thủ nội quy, quy định và nghĩa vụ
                      tài chính của ký túc xá nếu đăng ký được duyệt.
                    </p>

                    <p>
                      3. Đăng ký phòng chỉ có hiệu lực sau khi được Ban Quản lý
                      Ký túc xá phê duyệt.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      1. Sinh viên cam kết thực hiện đúng nội quy, quy định và
                      nghĩa vụ tài chính của ký túc xá.
                    </p>

                    <p>
                      2. Ban Quản lý Ký túc xá có trách nhiệm bố trí phòng ở và
                      bảo đảm các quyền lợi nội trú theo quy định.
                    </p>

                    <p>
                      3. Hợp đồng có hiệu lực theo thời gian được ghi tại Điều 3
                      và có thể chấm dứt theo quy định của ký túc xá.
                    </p>
                  </>
                )}
              </div>
            </section>

            <div className="contract-signature-section">
              <div className="contract-signature-column">
                <strong>
                  {isRegistration
                    ? "BAN QUẢN LÝ KÝ TÚC XÁ"
                    : "ĐẠI DIỆN KÝ TÚC XÁ"}
                </strong>

                <span>
                  {isRegistration
                    ? "(Xác nhận sau khi xét duyệt)"
                    : "(Ký và ghi rõ họ tên)"}
                </span>

                <div className="signature-space"></div>
              </div>

              <div className="contract-signature-column">
                <strong>SINH VIÊN</strong>

                <span>(Ký và ghi rõ họ tên)</span>

                <div className="signature-space"></div>

                <p>{contract.studentName || ""}</p>
              </div>
            </div>
          </div>

          <div className="contract-document-actions">
            <button
              type="button"
              className="contract-detail-back-button"
              onClick={handleBack}
            >
              <i className="fa fa-arrow-left"></i>
              Trở về danh sách
            </button>

            {isActiveContract && (
              <button
                type="button"
                className="contract-detail-print-button"
                onClick={() => window.print()}
              >
                <i className="fa fa-print"></i>
                In hợp đồng
              </button>
            )}

            {isRegistration && (
              <button
                type="button"
                className="contract-detail-print-button"
                onClick={() => window.print()}
              >
                <i className="fa fa-print"></i>
                In phiếu đăng ký
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
