import React, { useCallback, useEffect, useMemo, useState } from "react";

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Script from "../../components/Script";

import "../../css/MyInvoices.css";

export default function MyInvoices() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [invoices, setInvoices] = useState([]);

  const [month, setMonth] = useState("");

  const [status, setStatus] = useState("");

  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(true);

  const [paymentLoadingId, setPaymentLoadingId] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

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

  const fetchInvoices = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/student/invoices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Không thể tải danh sách hóa đơn.");
      }

      let data = [];

      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch {
        data = [];
      }

      setInvoices(Array.isArray(data) ? data : []);

      setSelected((previous) => {
        if (!previous) {
          return null;
        }

        return data.find((invoice) => invoice.id === previous.id) || previous;
      });
    } catch (error) {
      console.error("Lỗi tải hóa đơn:", error);

      window.showPopup?.(
        error.message || "Lỗi khi tải danh sách hóa đơn.",
        true
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handlePayment = async (invoiceId) => {
    try {
      setPaymentLoadingId(invoiceId);

      const response = await fetch(
        `http://localhost:8080/api/payment/create/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const paymentUrl = await response.text();

      if (!response.ok) {
        throw new Error(paymentUrl || "Không thể tạo yêu cầu thanh toán.");
      }

      if (!paymentUrl || !paymentUrl.startsWith("http")) {
        throw new Error("Đường dẫn thanh toán không hợp lệ.");
      }

      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Lỗi thanh toán:", error);

      window.showPopup?.(error.message || "Lỗi thanh toán!", true);
    } finally {
      setPaymentLoadingId(null);
    }
  };

  const isOverdue = (invoice) => {
    if (invoice.status !== "UNPAID" || !invoice.dueDate) {
      return false;
    }

    const dueDate = new Date(`${invoice.dueDate}T23:59:59`);

    return dueDate < new Date();
  };

  const filtered = useMemo(
    () =>
      invoices.filter(
        (invoice) =>
          (!month || invoice.month?.includes(month)) &&
          (!status || invoice.status === status)
      ),
    [invoices, month, status]
  );

  const getInvoiceServices = (invoice) => {
    if (!invoice) {
      return [];
    }

    if (Array.isArray(invoice.services)) {
      return invoice.services;
    }

    if (Array.isArray(invoice.invoiceServices)) {
      return invoice.invoiceServices;
    }

    return [];
  };

  const getServiceName = (service) =>
    service?.name ||
    service?.serviceName ||
    service?.service?.name ||
    "Dịch vụ";

  const getServiceAmount = (service) =>
    Number(service?.amount ?? service?.price ?? service?.service?.price ?? 0);

  const calculateServiceTotal = (invoice) => {
    const invoiceServices = getInvoiceServices(invoice);

    if (invoiceServices.length > 0) {
      return invoiceServices.reduce(
        (total, service) => total + getServiceAmount(service),
        0
      );
    }

    return Number(invoice?.serviceFee || 0);
  };

  return (
    <div className="wrapper">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} />

      <div
        className="content-wrapper"
        style={{
          marginLeft: sidebarOpen ? "260px" : "80px",
          transition: ".3s",
          marginTop: "65px",
          minHeight: "100vh",
        }}
      >
        <div className="invoice-page">
          <div className="invoice-banner">
            <h2>
              <i className="fa fa-credit-card"></i>
              Hóa đơn của tôi
            </h2>

            <p>Quản lý hóa đơn nội trú và thanh toán trực tuyến qua VNPay.</p>
          </div>

          {!selected && (
            <>
              <div className="invoice-toolbar">
                <h3>Danh sách hóa đơn</h3>

                <div className="toolbar-filter">
                  <input
                    type="month"
                    value={month}
                    onChange={(event) => setMonth(event.target.value)}
                  />

                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="">Tất cả trạng thái</option>

                    <option value="PAID">Đã thanh toán</option>

                    <option value="UNPAID">Chưa thanh toán</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="empty-invoice">
                  <i className="fa fa-spinner fa-spin"></i>

                  <h3>Đang tải hóa đơn</h3>

                  <p>Vui lòng chờ trong giây lát.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty-invoice">
                  <i className="fa fa-folder-open-o"></i>

                  <h3>Không có hóa đơn</h3>

                  <p>Hiện tại bạn chưa có hóa đơn phù hợp.</p>
                </div>
              ) : (
                <div className="invoice-list">
                  {filtered.map((invoice) => {
                    const overdue = isOverdue(invoice);

                    const isPaymentLoading = paymentLoadingId === invoice.id;

                    return (
                      <div key={invoice.id} className="invoice-card">
                        <div className="invoice-left">
                          <div className="invoice-icon">
                            <i className="fa fa-file-text-o"></i>
                          </div>

                          <div className="invoice-info">
                            <h3>Hóa đơn tháng {invoice.month}</h3>

                            <div className="invoice-room">
                              <i className="fa fa-home"></i>
                              Phòng {invoice.roomName || "Chưa cập nhật"}
                            </div>

                            <div className="invoice-money">
                              {formatMoney(invoice.totalAmount)}
                            </div>

                            <span
                              className={`status-badge ${
                                invoice.status === "PAID"
                                  ? "paid"
                                  : overdue
                                  ? "overdue"
                                  : "unpaid"
                              }`}
                            >
                              {invoice.status === "PAID"
                                ? "Đã thanh toán"
                                : overdue
                                ? "Quá hạn"
                                : "Chưa thanh toán"}
                            </span>
                          </div>
                        </div>

                        <div className="invoice-right">
                          <button
                            type="button"
                            className="btn-detail"
                            onClick={() => setSelected(invoice)}
                          >
                            <i className="fa fa-eye"></i>
                            Chi tiết
                          </button>

                          {invoice.status === "UNPAID" && (
                            <button
                              type="button"
                              className="btn-pay"
                              disabled={isPaymentLoading}
                              onClick={() => handlePayment(invoice.id)}
                            >
                              <i
                                className={`fa ${
                                  isPaymentLoading
                                    ? "fa-spinner fa-spin"
                                    : "fa-credit-card"
                                }`}
                              ></i>

                              {isPaymentLoading
                                ? "Đang xử lý..."
                                : "Thanh toán"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {selected && (
            <div className="invoice-detail-page">
              <button
                type="button"
                className="btn-back"
                onClick={() => setSelected(null)}
              >
                <i className="fa fa-arrow-left"></i>
                Quay lại
              </button>

              <div className="invoice-detail-card">
                <h3 className="card-title">
                  <i className="fa fa-file-text-o"></i>
                  Thông tin hóa đơn
                </h3>

                <div className="status-wrapper">
                  <span
                    className={`status-badge ${
                      selected.status === "PAID"
                        ? "paid"
                        : isOverdue(selected)
                        ? "overdue"
                        : "unpaid"
                    }`}
                  >
                    {selected.status === "PAID"
                      ? "Đã thanh toán"
                      : isOverdue(selected)
                      ? "Quá hạn"
                      : "Chưa thanh toán"}
                  </span>
                </div>

                <div className="invoice-info-grid">
                  <div className="info-item">
                    <label>Phòng</label>

                    <span>{selected.roomName || "Chưa cập nhật"}</span>
                  </div>

                  <div className="info-item">
                    <label>Tháng</label>

                    <span>{selected.month || "Chưa cập nhật"}</span>
                  </div>

                  <div className="info-item">
                    <label>Hạn thanh toán</label>

                    <span>{formatDate(selected.dueDate)}</span>
                  </div>

                  <div className="info-item">
                    <label>Tổng tiền</label>

                    <span className="money">
                      {formatMoney(selected.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="invoice-detail-card">
                <h3 className="card-title">
                  <i className="fa fa-list-alt"></i>
                  Chi tiết thanh toán
                </h3>

                <div className="invoice-detail-list">
                  <div className="detail-row">
                    <span>Tiền phòng</span>

                    <strong>{formatMoney(selected.roomPrice)}</strong>
                  </div>

                  <div className="invoice-service-section">
                    {getInvoiceServices(selected).length > 0 ? (
                      getInvoiceServices(selected).map((service, index) => (
                        <div
                          className="detail-row service-row"
                          key={
                            service.id || `${getServiceName(service)}-${index}`
                          }
                        >
                          <span className="service-name">
                            <i className="fa fa-concierge-bell"></i>
                            {getServiceName(service)}
                          </span>

                          <strong>
                            {formatMoney(getServiceAmount(service))}
                          </strong>
                        </div>
                      ))
                    ) : (
                      <div className="invoice-no-service">
                        <i className="fa fa-circle-info"></i>
                        Không có dịch vụ chi tiết.
                      </div>
                    )}
                  </div>

                  <div className="detail-row service-total">
                    <span>Tổng phí dịch vụ</span>

                    <strong>
                      {formatMoney(calculateServiceTotal(selected))}
                    </strong>
                  </div>

                  <div className="detail-row total">
                    <span>Tổng cộng</span>

                    <strong>{formatMoney(selected.totalAmount)}</strong>
                  </div>
                </div>

                {selected.status === "UNPAID" && (
                  <div className="invoice-action">
                    <button
                      type="button"
                      className="btn-pay"
                      disabled={paymentLoadingId === selected.id}
                      onClick={() => handlePayment(selected.id)}
                    >
                      <i
                        className={`fa ${
                          paymentLoadingId === selected.id
                            ? "fa-spinner fa-spin"
                            : "fa-credit-card"
                        }`}
                      ></i>

                      {paymentLoadingId === selected.id
                        ? "Đang chuyển hướng..."
                        : "Thanh toán VNPay"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Script />
    </div>
  );
}
