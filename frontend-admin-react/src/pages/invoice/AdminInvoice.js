import React, { useEffect, useMemo, useState } from "react";

import Sidebar from "../../components/Sidebar";

import "../../css/AdminInvoiceList.css";

const initialServiceForm = {
  name: "",
  price: "",
};

export default function InvoiceList() {
  const token = sessionStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [invoices, setInvoices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [filterMonth, setFilterMonth] = useState("");
  const [status, setStatus] = useState("");
  const [roomName, setRoomName] = useState("");

  const [createMonth, setCreateMonth] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [showServiceModal, setShowServiceModal] = useState(false);

  const [serviceForm, setServiceForm] = useState(initialServiceForm);

  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadInitialData();
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const timeout = setTimeout(() => {
      fetchInvoices();
    }, 250);

    return () => clearTimeout(timeout);
  }, [filterMonth, status, roomName]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      await Promise.all([fetchInvoices(), fetchRooms(), fetchServices()]);
    } finally {
      setLoading(false);
    }
  };

  const parseJsonResponse = async (response, fallbackValue) => {
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Không thể tải dữ liệu.");
    }

    if (!responseText) {
      return fallbackValue;
    }

    try {
      return JSON.parse(responseText);
    } catch {
      return fallbackValue;
    }
  };

  const fetchInvoices = async () => {
    try {
      const params = new URLSearchParams();

      if (filterMonth) {
        params.append("month", filterMonth);
      }

      if (status) {
        params.append("status", status);
      }

      if (roomName) {
        params.append("roomName", roomName);
      }

      const url =
        "http://localhost:8080/api/admin/invoices" +
        (params.toString() ? `?${params.toString()}` : "");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonResponse(response, []);

      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      window.showPopup?.(
        error.message || "Lỗi khi tải danh sách hóa đơn.",
        true
      );
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonResponse(response, []);

      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      window.showPopup?.(error.message || "Lỗi khi tải danh sách phòng.", true);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonResponse(response, []);

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      window.showPopup?.(
        error.message || "Lỗi khi tải danh sách dịch vụ.",
        true
      );
    }
  };

  const isOverdue = (invoice) => {
    if (invoice.status !== "UNPAID" || !invoice.dueDate) {
      return false;
    }

    const dueDate = new Date(`${invoice.dueDate}T23:59:59`);

    return dueDate < new Date();
  };

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN") + " đ";

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

  const getStatusText = (invoiceStatus) => {
    const statusMap = {
      PAID: "Đã thanh toán",
      UNPAID: "Chưa thanh toán",
    };

    return statusMap[invoiceStatus] || invoiceStatus || "Chưa xác định";
  };

  const invoiceStatistics = useMemo(() => {
    const paidInvoices = invoices.filter(
      (invoice) => invoice.status === "PAID"
    );

    const unpaidInvoices = invoices.filter(
      (invoice) => invoice.status === "UNPAID"
    );

    const overdueInvoices = invoices.filter(isOverdue);

    const paidRevenue = paidInvoices.reduce(
      (total, invoice) => total + Number(invoice.totalAmount || 0),
      0
    );

    return {
      total: invoices.length,
      paid: paidInvoices.length,
      unpaid: unpaidInvoices.length,
      overdue: overdueInvoices.length,
      paidRevenue,
    };
  }, [invoices]);

  const confirmPayment = (invoiceId) => {
    window.showPopup?.(
      "Xác nhận hóa đơn này đã được thanh toán?",
      false,
      true,
      async () => {
        try {
          setProcessing(true);

          const response = await fetch(
            `http://localhost:8080/api/admin/invoices/${invoiceId}/confirm`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await response.text();

          if (!response.ok) {
            setTimeout(() => {
              window.showPopup?.(
                message || "Xác nhận thanh toán thất bại.",
                true
              );
            }, 250);

            return;
          }

          if (selectedInvoice?.id === invoiceId) {
            setSelectedInvoice((prev) => ({
              ...prev,
              status: "PAID",
            }));
          }

          await fetchInvoices();

          setTimeout(() => {
            window.showPopup?.(message || "Xác nhận thanh toán thành công!");
          }, 250);
        } catch (error) {
          console.error(error);

          setTimeout(() => {
            window.showPopup?.(
              error.message || "Lỗi khi xác nhận thanh toán.",
              true
            );
          }, 250);
        } finally {
          setProcessing(false);
        }
      }
    );
  };
  const handleGenerate = () => {
    if (!createMonth) {
      window.showPopup?.("Vui lòng chọn tháng cần tạo hóa đơn.", true);

      return;
    }

    window.showPopup?.(
      `Tạo hóa đơn cho tháng ${createMonth}?`,
      false,
      true,
      async () => {
        try {
          setProcessing(true);

          const response = await fetch(
            "http://localhost:8080/api/admin/invoices/generate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                month: createMonth,
              }),
            }
          );

          const message = await response.text();

          if (!response.ok) {
            throw new Error(message || "Tạo hóa đơn thất bại.");
          }

          await fetchInvoices();

          setTimeout(() => {
            window.showPopup?.(message || "Tạo hóa đơn thành công.");
          }, 350);
        } catch (error) {
          console.error("Lỗi tạo hóa đơn:", error);

          setTimeout(() => {
            window.showPopup?.(error.message || "Lỗi khi tạo hóa đơn.", true);
          }, 350);
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  const handleRemind = () => {
    if (!hasUnpaid) {
      window.showPopup?.("Hiện không có hóa đơn chưa thanh toán.", true);
      return;
    }

    window.showPopup?.(
      "Gửi nhắc nhở đến tất cả sinh viên có hóa đơn chưa thanh toán?",
      false,
      true,
      async () => {
        try {
          setProcessing(true);

          const response = await fetch(
            "http://localhost:8080/api/admin/invoices/remind",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await response.text();

          if (!response.ok) {
            setTimeout(() => {
              window.showPopup?.(message || "Không thể gửi nhắc nhở.", true);
            }, 250);

            return;
          }

          setTimeout(() => {
            window.showPopup?.(
              message || "Đã gửi nhắc nhở thanh toán thành công!"
            );
          }, 250);
        } catch (error) {
          console.error(error);

          setTimeout(() => {
            window.showPopup?.("Lỗi khi gửi nhắc nhở thanh toán.", true);
          }, 250);
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  const printInvoice = async (invoiceId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/invoices/${invoiceId}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(message || "Không thể tải hóa đơn PDF.");
      }

      const blob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(blob);

      const pdfWindow = window.open(pdfUrl, "_blank");

      if (!pdfWindow) {
        window.URL.revokeObjectURL(pdfUrl);

        throw new Error("Trình duyệt đã chặn cửa sổ in.");
      }

      pdfWindow.onload = () => {
        pdfWindow.focus();
        pdfWindow.print();
      };

      setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (error) {
      console.error(error);

      window.showPopup?.(error.message || "Lỗi khi tải PDF.", true);
    }
  };

  const handleServiceChange = (event) => {
    const { name, value } = event.target;

    setServiceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CHỌN DỊCH VỤ CẦN SỬA
  // =====================================================

  const editService = (service) => {
    setEditingService(service);

    setServiceForm({
      name: service.name || "",
      price: service.price ?? "",
    });
  };

  const cancelEditService = () => {
    setEditingService(null);

    setServiceForm(initialServiceForm);
  };

  const saveService = async () => {
    const serviceName = serviceForm.name.trim();

    const servicePrice = Number(serviceForm.price);

    if (!serviceName) {
      window.showPopup?.("Vui lòng nhập tên dịch vụ.", true);

      return;
    }

    if (!serviceForm.price || servicePrice <= 0) {
      window.showPopup?.("Giá dịch vụ phải lớn hơn 0.", true);

      return;
    }

    const isEditing = editingService !== null;

    try {
      setProcessing(true);

      const url = isEditing
        ? `http://localhost:8080/api/admin/services/${editingService.id}`
        : "http://localhost:8080/api/admin/services";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: serviceName,
          price: servicePrice,
        }),
      });

      const message = await response.text();

      if (!response.ok) {
        throw new Error(
          message ||
            (isEditing
              ? "Không thể cập nhật dịch vụ."
              : "Không thể thêm dịch vụ.")
        );
      }

      // ================= RESET FORM =================

      setServiceForm(initialServiceForm);

      setEditingService(null);

      // ================= LOAD LẠI DANH SÁCH =================

      await fetchServices();

      // ================= THÔNG BÁO =================

      setTimeout(() => {
        window.showPopup?.(
          message ||
            (isEditing
              ? "Cập nhật dịch vụ thành công."
              : "Thêm dịch vụ thành công.")
        );
      }, 350);
    } catch (error) {
      console.error("Lỗi lưu dịch vụ:", error);

      setTimeout(() => {
        window.showPopup?.(
          error.message ||
            (isEditing ? "Lỗi khi cập nhật dịch vụ." : "Lỗi khi thêm dịch vụ."),
          true
        );
      }, 350);
    } finally {
      setProcessing(false);
    }
  };

  // =====================================================
  // XÓA DỊCH VỤ
  // =====================================================

  const deleteService = (serviceId) => {
    window.showPopup?.(
      "Bạn có chắc chắn muốn xóa dịch vụ này?",
      false,
      true,

      async () => {
        try {
          setProcessing(true);

          const response = await fetch(
            `http://localhost:8080/api/admin/services/${serviceId}`,
            {
              method: "DELETE",

              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await response.text();

          if (!response.ok) {
            throw new Error(message || "Không thể xóa dịch vụ.");
          }

          // Nếu đang sửa chính dịch vụ vừa xóa
          // thì reset form

          if (editingService?.id === serviceId) {
            cancelEditService();
          }

          await fetchServices();

          setTimeout(() => {
            window.showPopup?.(message || "Xóa dịch vụ thành công.");
          }, 350);
        } catch (error) {
          console.error("Lỗi xóa dịch vụ:", error);

          setTimeout(() => {
            window.showPopup?.(error.message || "Lỗi khi xóa dịch vụ.", true);
          }, 350);
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  const clearFilters = () => {
    setFilterMonth("");
    setStatus("");
    setRoomName("");
  };

  const hasUnpaid = invoiceStatistics.unpaid > 0;

  return (
    <div className="admin-invoice-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`admin-invoice-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="invoice-list-banner">
          <div>
            <div className="invoice-list-banner-badge">
              <i className="fa fa-file-invoice-dollar"></i>
              Quản lý hóa đơn
            </div>

            <h1>Danh sách hóa đơn</h1>

            <p>
              Tạo hóa đơn hàng tháng, theo dõi thanh toán, quản lý dịch vụ và
              nhắc nhở sinh viên hoàn thành nghĩa vụ tài chính.
            </p>
          </div>

          <div className="invoice-list-banner-icon">
            <i className="fa fa-receipt"></i>
          </div>
        </section>

        <section className="invoice-summary-grid">
          <div className="invoice-summary-card total">
            <div className="invoice-summary-icon">
              <i className="fa fa-file-invoice"></i>
            </div>

            <div>
              <span>Tổng hóa đơn</span>
              <strong>{invoiceStatistics.total}</strong>
            </div>
          </div>

          <div className="invoice-summary-card paid">
            <div className="invoice-summary-icon">
              <i className="fa fa-check-circle"></i>
            </div>

            <div>
              <span>Đã thanh toán</span>
              <strong>{invoiceStatistics.paid}</strong>
            </div>
          </div>

          <div className="invoice-summary-card unpaid">
            <div className="invoice-summary-icon">
              <i className="fa fa-clock"></i>
            </div>

            <div>
              <span>Chưa thanh toán</span>
              <strong>{invoiceStatistics.unpaid}</strong>
            </div>
          </div>

          <div className="invoice-summary-card overdue">
            <div className="invoice-summary-icon">
              <i className="fa fa-triangle-exclamation"></i>
            </div>

            <div>
              <span>Đã quá hạn</span>
              <strong>{invoiceStatistics.overdue}</strong>
            </div>
          </div>
        </section>

        <section className="invoice-list-section">
          <div className="invoice-list-toolbar">
            <div>
              <h2>Danh sách hóa đơn</h2>

              <p>Lọc hóa đơn theo tháng, trạng thái hoặc phòng nội trú.</p>
            </div>

            <div className="invoice-toolbar-actions">
              <button
                type="button"
                className="invoice-service-button"
                onClick={() => setShowServiceModal(true)}
              >
                <i className="fa fa-concierge-bell"></i>
                Quản lý dịch vụ
              </button>

              <button
                type="button"
                className="invoice-remind-button"
                onClick={handleRemind}
                disabled={!hasUnpaid || processing}
              >
                <i className="fa fa-bell"></i>
                Nhắc thanh toán
              </button>
            </div>
          </div>

          <div className="invoice-generate-panel">
            <div>
              <div className="invoice-generate-icon">
                <i className="fa fa-calendar-plus"></i>
              </div>

              <div>
                <strong>Tạo hóa đơn theo tháng</strong>

                <span>
                  Hệ thống sẽ tạo hóa đơn cho các hợp đồng đang hoạt động.
                </span>
              </div>
            </div>

            <div className="invoice-generate-actions">
              <input
                type="month"
                value={createMonth}
                onChange={(event) => setCreateMonth(event.target.value)}
              />

              <button
                type="button"
                onClick={handleGenerate}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fa fa-plus"></i>
                    Tạo hóa đơn
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="invoice-filter-panel">
            <div className="invoice-filter-group">
              <label htmlFor="invoice-month">Tháng</label>

              <input
                id="invoice-month"
                type="month"
                value={filterMonth}
                onChange={(event) => setFilterMonth(event.target.value)}
              />
            </div>

            <div className="invoice-filter-group">
              <label htmlFor="invoice-status">Trạng thái</label>

              <select
                id="invoice-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="">Tất cả trạng thái</option>

                <option value="UNPAID">Chưa thanh toán</option>

                <option value="PAID">Đã thanh toán</option>
              </select>
            </div>

            <div className="invoice-filter-group">
              <label htmlFor="invoice-room">Phòng</label>

              <select
                id="invoice-room"
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
              >
                <option value="">Tất cả phòng</option>

                {rooms.map((room) => {
                  const currentRoomName = room.name || room.roomName || "";

                  return (
                    <option key={room.id} value={currentRoomName}>
                      {currentRoomName}
                    </option>
                  );
                })}
              </select>
            </div>

            {(filterMonth || status || roomName) && (
              <button
                type="button"
                className="invoice-clear-filter"
                onClick={clearFilters}
              >
                <i className="fa fa-times"></i>
                Xóa bộ lọc
              </button>
            )}
          </div>

          {loading ? (
            <div className="invoice-list-loading">
              <i className="fa fa-spinner fa-spin"></i>

              <p>Đang tải danh sách hóa đơn...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="invoice-list-empty">
              <div>
                <i className="fa fa-file-circle-xmark"></i>
              </div>

              <h3>Không có hóa đơn</h3>

              <p>Không tìm thấy hóa đơn theo điều kiện lọc hiện tại.</p>
            </div>
          ) : (
            <div className="invoice-table-wrapper">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Sinh viên</th>
                    <th>Phòng</th>
                    <th>Tháng</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Hạn thanh toán</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {invoices.map((invoice) => {
                    const overdue = isOverdue(invoice);

                    return (
                      <tr
                        key={invoice.id}
                        className={overdue ? "invoice-overdue-row" : ""}
                      >
                        <td>
                          <div className="invoice-student-cell">
                            <div className="invoice-student-avatar">
                              {invoice.studentName
                                ? invoice.studentName
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()
                                : "S"}
                            </div>

                            <div>
                              <strong>
                                {invoice.studentName || "Chưa cập nhật"}
                              </strong>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="invoice-room-badge">
                            <i className="fa fa-door-open"></i>

                            {invoice.roomName || "Chưa cập nhật"}
                          </span>
                        </td>

                        <td>
                          <span className="invoice-month-badge">
                            {invoice.month || "Chưa cập nhật"}
                          </span>
                        </td>

                        <td className="invoice-total-cell">
                          {formatMoney(invoice.totalAmount)}
                        </td>

                        <td>
                          <span
                            className={`invoice-status-badge ${
                              invoice.status ? invoice.status.toLowerCase() : ""
                            }`}
                          >
                            {getStatusText(invoice.status)}
                          </span>
                        </td>

                        <td>
                          <div className="invoice-due-date">
                            <span>{formatDate(invoice.dueDate)}</span>

                            {overdue && (
                              <small>
                                <i className="fa fa-triangle-exclamation"></i>
                                Quá hạn
                              </small>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="invoice-action-buttons">
                            <button
                              type="button"
                              className="invoice-detail-button"
                              onClick={() => setSelectedInvoice(invoice)}
                            >
                              <i className="fa fa-eye"></i>
                              Chi tiết
                            </button>

                            {invoice.status === "UNPAID" && (
                              <button
                                type="button"
                                className="invoice-confirm-button"
                                disabled={processing}
                                onClick={() => confirmPayment(invoice.id)}
                              >
                                <i className="fa fa-check"></i>
                                Xác nhận
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {selectedInvoice && (
        <div
          className="invoice-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedInvoice(null);
            }
          }}
        >
          <div className="invoice-detail-modal">
            <div className="invoice-modal-header">
              <div>
                <span>Thông tin hóa đơn</span>

                <h2>Chi tiết hóa đơn</h2>
              </div>

              <button type="button" onClick={() => setSelectedInvoice(null)}>
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="invoice-modal-body">
              <div className="invoice-detail-grid">
                <div className="invoice-detail-item">
                  <label>Sinh viên</label>
                  <span>{selectedInvoice.studentName}</span>
                </div>

                <div className="invoice-detail-item">
                  <label>Phòng</label>
                  <span>{selectedInvoice.roomName}</span>
                </div>

                <div className="invoice-detail-item">
                  <label>Tháng</label>
                  <span>{selectedInvoice.month}</span>
                </div>

                <div className="invoice-detail-item">
                  <label>Hạn thanh toán</label>
                  <span>{formatDate(selectedInvoice.dueDate)}</span>
                </div>
              </div>

              <section className="invoice-cost-section">
                <h3>Chi tiết thanh toán</h3>

                <div className="invoice-cost-row">
                  <span>Tiền phòng</span>

                  <strong>{formatMoney(selectedInvoice.roomPrice)}</strong>
                </div>

                <div className="invoice-service-detail">
                  <div className="invoice-service-detail-title">
                    <span>Dịch vụ</span>

                    <small>
                      {selectedInvoice.services?.length || 0} dịch vụ
                    </small>
                  </div>

                  {selectedInvoice.services?.length > 0 ? (
                    selectedInvoice.services.map((service, index) => (
                      <div
                        className="invoice-service-row"
                        key={service.id || `${service.name}-${index}`}
                      >
                        <span>
                          {service.name || service.serviceName || "Dịch vụ"}
                        </span>

                        <strong>{formatMoney(service.amount)}</strong>
                      </div>
                    ))
                  ) : (
                    <div className="invoice-no-service">Không có dịch vụ.</div>
                  )}
                </div>

                <div className="invoice-total-row">
                  <span>Tổng thanh toán</span>

                  <strong>{formatMoney(selectedInvoice.totalAmount)}</strong>
                </div>
              </section>

              <div className="invoice-detail-status-row">
                <span>Trạng thái</span>

                <span
                  className={`invoice-status-badge ${
                    selectedInvoice.status
                      ? selectedInvoice.status.toLowerCase()
                      : ""
                  }`}
                >
                  {getStatusText(selectedInvoice.status)}
                </span>
              </div>
            </div>

            <div className="invoice-modal-footer">
              <button
                type="button"
                className="invoice-modal-close-button"
                onClick={() => setSelectedInvoice(null)}
              >
                Đóng
              </button>

              <button
                type="button"
                className="invoice-print-button"
                onClick={() => printInvoice(selectedInvoice.id)}
              >
                <i className="fa fa-print"></i>
                In hóa đơn
              </button>

              {selectedInvoice.status === "UNPAID" && (
                <button
                  type="button"
                  className="invoice-payment-button"
                  disabled={processing}
                  onClick={() => confirmPayment(selectedInvoice.id)}
                >
                  <i className="fa fa-check-circle"></i>
                  Xác nhận thanh toán
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showServiceModal && (
        <div
          className="invoice-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !processing) {
              setShowServiceModal(false);
            }
          }}
        >
          <div className="service-management-modal">
            <div className="service-modal-header">
              <div>
                <span>Thiết lập hóa đơn</span>

                <h2>Quản lý dịch vụ</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowServiceModal(false)}
                disabled={processing}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="service-modal-body">
              <div className="service-create-panel">
                <div className="service-form-group">
                  <label htmlFor="service-name">Tên dịch vụ</label>

                  <div>
                    <i className="fa fa-concierge-bell"></i>

                    <input
                      id="service-name"
                      type="text"
                      name="name"
                      placeholder="Ví dụ: Điện, nước..."
                      value={serviceForm.name}
                      onChange={handleServiceChange}
                    />
                  </div>
                </div>

                <div className="service-form-group">
                  <label htmlFor="service-price">Giá dịch vụ</label>

                  <div>
                    <i className="fa fa-money-bill-wave"></i>

                    <input
                      id="service-price"
                      type="number"
                      name="price"
                      min="1"
                      step="1000"
                      placeholder="Nhập giá"
                      value={serviceForm.price}
                      onChange={handleServiceChange}
                    />

                    <span>VNĐ</span>
                  </div>
                </div>

                <div className="service-form-actions">
                  <button
                    type="button"
                    className={
                      editingService
                        ? "service-update-button"
                        : "service-add-button"
                    }
                    onClick={saveService}
                    disabled={processing}
                  >
                    <i
                      className={editingService ? "fa fa-save" : "fa fa-plus"}
                    ></i>

                    {editingService ? "Cập nhật" : "Thêm dịch vụ"}
                  </button>

                  {editingService && (
                    <button
                      type="button"
                      className="service-cancel-edit-icon"
                      onClick={cancelEditService}
                      disabled={processing}
                      title="Hủy chỉnh sửa"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              {services.length === 0 ? (
                <div className="service-list-empty">
                  <i className="fa fa-bell-slash"></i>

                  <p>Chưa có dịch vụ nào trong hệ thống.</p>
                </div>
              ) : (
                <div className="service-table-wrapper">
                  <table className="service-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên dịch vụ</th>
                        <th>Giá</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>

                    <tbody>
                      {services.map((service, index) => (
                        <tr key={service.id}>
                          <td>{index + 1}</td>

                          <td>
                            <strong>{service.name}</strong>
                          </td>

                          <td>{formatMoney(service.price)}</td>

                          <td>
                            <div className="service-action-buttons">
                              <button
                                type="button"
                                className="service-edit-button"
                                disabled={processing}
                                onClick={() => editService(service)}
                              >
                                <i className="fa fa-pen"></i>
                                Sửa
                              </button>

                              <button
                                type="button"
                                className="service-delete-button"
                                disabled={processing}
                                onClick={() => deleteService(service.id)}
                              >
                                <i className="fa fa-trash"></i>
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="service-modal-footer">
              <button
                type="button"
                onClick={() => {
                  setShowServiceModal(false);
                  cancelEditService();
                }}
                disabled={processing}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
