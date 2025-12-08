// src/components/Popup.js
import React, { useState, useEffect } from "react";

function Popup() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState(null);

  // Tạo window.showPopup toàn cục
  useEffect(() => {
    window.showPopup = (msg, error = false, confirm = false, onConfirm = null) => {
      setMessage(msg);
      setIsError(error);
      setIsConfirm(confirm);
      setOnConfirmCallback(() => onConfirm);
      setVisible(true);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setMessage("");
    setIsError(false);
    setIsConfirm(false);
    setOnConfirmCallback(null);
  };

  const handleConfirm = async () => {
    if (onConfirmCallback) {
      const result = await onConfirmCallback();
      if (result === true || result === undefined) {
        handleClose();
      }
    } else {
      handleClose();
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        zIndex: 2000,
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          width: "350px",
          maxWidth: "90%",
          padding: "20px 25px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          textAlign: "center",
          transform: "scale(1)",
          opacity: 1,
          transition: "all 0.3s ease",
        }}
      >
        <h5
          style={{
            fontWeight: 600,
            color: isError ? "#dc3545" : "#198754",
          }}
        >
          {isError ? "Lỗi" : "Thông báo"}
        </h5>
        <p style={{ marginTop: "10px", color: "#333" }}>{message}</p>

        {isConfirm && (
          <button
            onClick={handleConfirm}
            className="btn btn-primary me-2"
            style={{ marginTop: "10px" }}
          >
            Xác nhận
          </button>
        )}

        <button
          onClick={handleClose}
          className={`btn ${isError ? "btn-danger" : "btn-success"}`}
          style={{ marginTop: "10px" }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

export default Popup;
