import { useEffect } from "react";
import Chart from "chart.js/auto";

function Script() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("admin_token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      window.location.href = "http://localhost:3000/login";
      return;
    }
    

    fetch("http://localhost:8080/api/admin/dashboard", {
      headers: { Authorization: "Bearer " + savedToken },
    })
      .then((r) => r.json())
      .then((data) => console.log("Admin data:", data))
      .catch((e) => console.error("Lỗi:", e));
  }, []);

  // --- KHỞI TẠO CHART ---
  useEffect(() => {
    const barCtx = document.getElementById("chart-bars");
    const lineCtx = document.getElementById("chart-line");
    const taskCtx = document.getElementById("chart-line-tasks");

    if (!barCtx || !lineCtx || !taskCtx) return;

    // Biểu đồ cột
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        datasets: [
          {
            label: "Views",
            backgroundColor: "#43A047",
            data: [50, 45, 22, 28, 50, 60, 76],
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    // Biểu đồ line 1
    new Chart(lineCtx, {
      type: "line",
      data: {
        labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        datasets: [
          {
            label: "Sales",
            borderColor: "#43A047",
            data: [120, 230, 130, 440, 250, 360, 270, 180, 90, 300, 310, 220],
            tension: 0.3,
          },
        ],
      },
      options: { plugins: { legend: { display: false } } },
    });

    // Biểu đồ line 2
    new Chart(taskCtx, {
      type: "line",
      data: {
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Tasks",
            borderColor: "#43A047",
            data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
          },
        ],
      },
      options: { plugins: { legend: { display: false } } },
    });
  }, []);
}

export default Script;
