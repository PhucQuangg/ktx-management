// src/components/Script.js
import { useEffect } from "react";
import showPopup from "./Popup";

function Script() {
  useEffect(() => {
    // --- Xử lý tham số URL (fromLogin & role) ---
    const params = new URLSearchParams(window.location.search);
    const fromLogin = params.get("fromLogin");
    const role = params.get("role");

    if (fromLogin && role === "STUDENT") {
      // Xóa query param khỏi URL & reload trang
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    }

    // --- Xử lý token & user menu ---
    const timer = setTimeout(() => {
      const token = sessionStorage.getItem("token");

      function parseJwt(token) {
        try {
          return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
          return null;
        }
      }

      const userMenu = document.getElementById("userMenu");
      if (!userMenu) return; // header chưa sẵn sàng

      if (token) {
        const decoded = parseJwt(token);
        if (decoded?.username) {
          document.querySelectorAll(".usernameSpan").forEach((el) => {
            el.innerText = decoded.username;
          });
        }

        userMenu.innerHTML = `
          <div class="pull-left">
            <a href="/profile" class="btn btn-default btn-flat">Profile</a>
          </div>
          <div class="pull-right">
            <a id="logoutBtn" class="btn btn-default btn-flat">Sign out</a>
          </div>
        `;

        document.getElementById("logoutBtn").onclick = async () => {
          try {
            const res = await fetch("http://localhost:8080/api/auth/logout", {
              method: "POST",
            });
            if (res.ok) {
              sessionStorage.clear();
              window.location.href = "http://localhost:3000/login";
            } else {
              showPopup("Logout failed: " + res.status,true);
            }
          } catch {
            showPopup("Không thể kết nối tới server!",true);
          }
        };
      } else {
        userMenu.innerHTML = `
          <div class="text-center" style="width:100%">
            <a href="/login" class="btn btn-default btn-flat">Sign in</a>
          </div>
        `;
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

export default Script;
