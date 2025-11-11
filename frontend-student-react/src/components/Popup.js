// src/components/Popup.js
import { useState, useEffect } from "react";

function Popup() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    window.showPopup = (msg, error = false) => {
      setMessage(msg);
      setIsError(error);
      setVisible(true);
    };
  }, []);

  const handleClose = () => {
    const box = document.getElementById("popupBox");
    if (box) {
      box.style.opacity = "0";
      box.style.transform = "scale(0.8)";
      setTimeout(() => setVisible(false), 300);
    } else {
      setVisible(false);
    }
  };

  return (
    visible && (
      <div
        id="popupOverlay"
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
          id="popupBox"
          style={{
            background: "#fff",
            borderRadius: "12px",
            width: "500px",       
            maxWidth: "95%",      
            padding: "30px 35px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            textAlign: "center",
            transform: "scale(1)",
            opacity: 1,
            transition: "all 0.3s ease",
          }}
        >
          <h3
            id="popupTitle"
            style={{
              fontWeight: 700,
              fontSize: "1.8rem", 
              color: isError ? "#dc3545" : "#198754",
            }}
          >
            {isError ? "Lỗi" : "Thông báo"}
          </h3>

          <p
            id="popupMessage"
            style={{
              marginTop: "15px",
              color: "#333",
              fontSize: "1.5rem", 
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>

          <button
            id="popupCloseBtn"
            className={`btn ${isError ? "btn-danger" : "btn-success"} mt-3`}
            onClick={handleClose}
            style={{ fontSize: "1.5rem", padding: "0.75rem 1.5rem" }} 
          >
            Đóng
          </button>
        </div>
      </div>
    )
  );
}

export default Popup;
