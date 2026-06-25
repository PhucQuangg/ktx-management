import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentReturn() {
  const navigate = useNavigate();

  const called = useRef(false);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xác thực thanh toán...");

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const queryString = window.location.search;

    fetch(
      `http://localhost:8080/api/payment/return${queryString}`
    )
      .then((res) => res.text())
      .then((msg) => {
        console.log("Payment Result:", msg);

        if (msg === "SUCCESS") {
          setStatus("success");
          setMessage("Thanh toán thành công");
        } else if (msg === "FAILED") {
          setStatus("error");
          setMessage("Thanh toán thất bại");
        } else if (msg === "INVALID_SIGNATURE") {
          setStatus("error");
          setMessage("Chữ ký không hợp lệ");
        } else if (msg === "NOT_FOUND") {
          setStatus("error");
          setMessage("Không tìm thấy hóa đơn");
        } else {
          setStatus("error");
          setMessage(msg);
        }

        setTimeout(() => {
          navigate("/invoices");
        }, 2500);
      })
      .catch((err) => {
        console.error(err);

        setStatus("error");
        setMessage("Lỗi xác thực thanh toán");

        setTimeout(() => {
          navigate("/invoices");
        }, 2500);
      });
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
          minWidth: "380px",
          maxWidth: "500px"
        }}
      >
        {status === "loading" && (
          <>
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            />
            <h3>Đang xử lý thanh toán...</h3>
            <p>Vui lòng chờ trong giây lát</p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              style={{
                fontSize: "72px",
                marginBottom: "10px"
              }}
            >
              ✅
            </div>

            <h2
              style={{
                color: "#16a34a",
                fontWeight: "bold"
              }}
            >
              Thanh toán thành công
            </h2>

            <p
              style={{
                color: "#666"
              }}
            >
              Hóa đơn đã được cập nhật trạng thái.
            </p>

            <p
              style={{
                color: "#999",
                fontSize: "14px"
              }}
            >
              Đang chuyển về danh sách hóa đơn...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div
              style={{
                fontSize: "72px",
                marginBottom: "10px"
              }}
            >
              ❌
            </div>

            <h2
              style={{
                color: "#dc2626",
                fontWeight: "bold"
              }}
            >
              {message}
            </h2>

            <p
              style={{
                color: "#666"
              }}
            >   
              Vui lòng kiểm tra lại hoặc liên hệ quản lý.
            </p>

            <p
              style={{
                color: "#999",
                fontSize: "14px"
              }}
            >
              Đang quay lại...
            </p>
          </>
        )}
      </div>
    </div>
  );
}