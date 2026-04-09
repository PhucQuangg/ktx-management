import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import Script from "../../components/Script";

export default function ContractDetail() {
  const [sidebarColor, setSidebarColor] = useState("bg-white");
  const [contract, setContract] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const contractId = params.get("id");

  const token = localStorage.getItem("admin_token");

  // LOAD DATA
  useEffect(() => {
    if (!contractId) return;

    fetch(`http://localhost:8080/api/admin/contracts/${contractId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => setContract(data));
  }, [contractId]);

  if (!contract) return <div className="text-center mt-5">Đang tải...</div>;

  const renderStatus = (status) => {
    const map = {
      PENDING: {
        text: "Chờ duyệt",
        class: "bg-warning text-dark",
        icon: "⏳",
      },
      ACTIVE: {
        text: "Đã duyệt",
        class: "bg-success text-white",
        icon: "✔️",
      },
      REJECTED: {
        text: "Từ chối",
        class: "bg-danger text-white",
        icon: "❌",
      },
      CANCELED: {
        text: "Đã hủy",
        class: "bg-secondary text-white",
        icon: "🚫",
      },
      EXPIRED: {
        text: "Hết hạn",
        class: "bg-dark text-white",
        icon: "⌛",
      },
    };
  
    const s = map[status] || {
      text: status,
      class: "bg-light",
      icon: "",
    };
  
    return (
      <span
        className={`badge ${s.class}`}
        style={{
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        {s.icon} {s.text}
      </span>
    );
  };
  

  return (
    <div className="g-sidenav-show">
      <Sidebar color={sidebarColor} />

      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <div className="container-fluid py-4 d-flex justify-content-center">

          {/* KHUNG HỢP ĐỒNG */}
          <div
            className="bg-white p-5 shadow"
            style={{ width: "800px", lineHeight: "1.6" }}
          >

            {/* HEADER */}
            <div className="d-flex justify-content-between text-center mb-4">
              <div>
                <strong>TRƯỜNG ĐẠI HỌC ABC</strong><br />
                <span>Ký túc xá sinh viên</span>
              </div>

              <div>
                <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br />
                <span>Độc lập - Tự do - Hạnh phúc</span>
              </div>
            </div>

            {/* TITLE */}
            <h4 className="text-center fw-bold mb-4">
              HỢP ĐỒNG NỘI TRÚ KÝ TÚC XÁ
            </h4>

            {/* CONTENT */}
            <p>
              Căn cứ nhu cầu đăng ký nội trú của sinh viên và quy định của ký túc xá,
              hai bên thống nhất ký kết hợp đồng với các thông tin sau:
            </p>

            <p><strong>1. Thông tin sinh viên:</strong></p>
            <p>- Họ và tên: <strong>{contract.studentName}</strong></p>
            <p>- Email: <strong>{contract.studentEmail}</strong></p>
            <p>- Mã số sinh viên: <strong>{contract.studentUsername}</strong></p>

            <p><strong>2. Thông tin phòng:</strong></p>
            <p>- Phòng: <strong>{contract.roomName}</strong></p>

            <p><strong>3. Thời gian ở:</strong></p>
            <p>- Từ ngày: {contract.startDate}</p>
            <p>- Đến ngày: {contract.endDate}</p>

            <p><strong>4. Trạng thái hợp đồng:</strong></p>
            <p>
            {renderStatus(contract.status)}

            </p>

            <p className="mt-4">
              Hai bên cam kết thực hiện đúng các điều khoản đã thỏa thuận.
              Hợp đồng có hiệu lực kể từ ngày ký.
            </p>

            {/* SIGNATURE */}
            <div className="d-flex justify-content-between mt-5 text-center">
              <div>
                <strong>ĐẠI DIỆN KTX</strong>
                <p className="mt-5">(Ký, ghi rõ họ tên)</p>
              </div>

              <div>
                <strong>SINH VIÊN</strong>
                <p className="mt-5">(Ký, ghi rõ họ tên)</p>
              </div>
            </div>

            {/* BUTTON */}
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-dark"
                onClick={() => window.history.back()}
              >
                ← Trở về
              </button>
            </div>

          </div>
        </div>
      </main>

      <SettingsPanel sidebarColor={sidebarColor} setSidebarColor={setSidebarColor} />
      <Script />
    </div>
  );
}
