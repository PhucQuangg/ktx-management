import React, { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import "../../css/AdminNotificationList.css";

const initialNotificationForm = {
  title: "",
  content: "",
  published: false,
};

export default function NotificationList() {
  const navigate = useNavigate();

  const token =
    sessionStorage.getItem("admin_token") ||
    localStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] = useState(null);

  const [keyword, setKeyword] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [notificationForm, setNotificationForm] = useState(
    initialNotificationForm
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchNotifications();
  }, [token, navigate]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/admin/notifications",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Không thể tải danh sách thông báo.");
      }

      let data = [];

      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch {
        data = [];
      }

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);

      window.showPopup?.(
        error.message || "Lỗi khi tải danh sách thông báo.",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesKeyword =
        !normalizedKeyword ||
        item.title?.toLowerCase().includes(normalizedKeyword) ||
        item.content?.toLowerCase().includes(normalizedKeyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && item.published === true) ||
        (statusFilter === "HIDDEN" && item.published === false);

      return matchesKeyword && matchesStatus;
    });
  }, [notifications, keyword, statusFilter]);

  const statistics = useMemo(() => {
    const published = notifications.filter(
      (item) => item.published === true
    ).length;

    const hidden = notifications.filter(
      (item) => item.published === false
    ).length;

    return {
      total: notifications.length,
      published,
      hidden,
    };
  }, [notifications]);

  const formatDate = (date) => {
    if (!date) {
      return "Chưa cập nhật";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showDelayedPopup = (message, isError = false) => {
    setTimeout(() => {
      window.showPopup?.(message, isError);
    }, 250);
  };

  const getContentPreview = (content) => {
    if (!content) {
      return "Không có nội dung";
    }

    const normalizedContent = content.trim();

    if (normalizedContent.length <= 90) {
      return normalizedContent;
    }

    return normalizedContent.substring(0, 90) + "...";
  };

  const resetNotificationModal = () => {
    setShowNotificationModal(false);
    setIsEdit(false);
    setEditingId(null);

    setNotificationForm(initialNotificationForm);
  };

  const openAddModal = () => {
    setIsEdit(false);
    setEditingId(null);

    setNotificationForm(initialNotificationForm);

    setShowNotificationModal(true);
  };

  const openUpdateModal = (item) => {
    setIsEdit(true);
    setEditingId(item.id);

    setNotificationForm({
      title: item.title || "",
      content: item.content || "",
      published: item.published === true,
    });

    setShowNotificationModal(true);
  };

  const closeNotificationModal = () => {
    if (processingId === "notification-form") {
      return;
    }

    resetNotificationModal();
  };

  const handleNotificationChange = (event) => {
    const { name, value } = event.target;

    setNotificationForm((previous) => ({
      ...previous,

      [name]: name === "published" ? value === "true" : value,
    }));
  };

  const validateNotificationForm = () => {
    if (!notificationForm.title.trim()) {
      window.showPopup?.("Vui lòng nhập tiêu đề thông báo.", true);

      return false;
    }

    if (notificationForm.title.trim().length < 3) {
      window.showPopup?.("Tiêu đề phải có ít nhất 3 ký tự.", true);

      return false;
    }

    if (!notificationForm.content.trim()) {
      window.showPopup?.("Vui lòng nhập nội dung thông báo.", true);

      return false;
    }

    if (notificationForm.content.trim().length < 5) {
      window.showPopup?.("Nội dung phải có ít nhất 5 ký tự.", true);

      return false;
    }

    return true;
  };

  const addNotification = async () => {
    if (!validateNotificationForm()) {
      return;
    }

    try {
      setProcessingId("notification-form");

      const payload = {
        title: notificationForm.title.trim(),

        content: notificationForm.content.trim(),

        published: notificationForm.published,
      };

      const response = await fetch(
        "http://localhost:8080/api/admin/notifications",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Không thể thêm thông báo.");
      }

      let createdNotification = null;

      try {
        createdNotification = responseText ? JSON.parse(responseText) : null;
      } catch {
        createdNotification = null;
      }

      if (createdNotification && createdNotification.id) {
        setNotifications((previous) => [createdNotification, ...previous]);
      } else {
        await fetchNotifications();
      }

      resetNotificationModal();

      showDelayedPopup(
        typeof createdNotification === "string"
          ? createdNotification
          : "Thêm thông báo thành công!"
      );
    } catch (error) {
      console.error("Lỗi thêm thông báo:", error);

      showDelayedPopup(error.message || "Lỗi khi thêm thông báo.", true);
    } finally {
      setProcessingId(null);
    }
  };

  const updateNotification = async () => {
    if (!validateNotificationForm()) {
      return;
    }

    if (!editingId) {
      window.showPopup?.("Không tìm thấy mã thông báo.", true);

      return;
    }

    try {
      setProcessingId("notification-form");

      const payload = {
        title: notificationForm.title.trim(),

        content: notificationForm.content.trim(),

        published: notificationForm.published,
      };

      const response = await fetch(
        `http://localhost:8080/api/admin/notifications/${editingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Không thể cập nhật thông báo.");
      }

      let updatedNotification = null;

      try {
        updatedNotification = responseText ? JSON.parse(responseText) : null;
      } catch {
        updatedNotification = null;
      }

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...payload,
                ...(updatedNotification &&
                typeof updatedNotification === "object"
                  ? updatedNotification
                  : {}),
              }
            : item
        )
      );

      resetNotificationModal();

      showDelayedPopup("Cập nhật thông báo thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật thông báo:", error);

      showDelayedPopup(error.message || "Lỗi khi cập nhật thông báo.", true);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = (notificationId) => {
    window.showPopup?.(
      "Bạn có chắc chắn muốn xóa thông báo này?",
      false,
      true,
      async () => {
        try {
          setProcessingId(notificationId);

          const response = await fetch(
            `http://localhost:8080/api/admin/notifications/${notificationId}`,
            {
              method: "DELETE",

              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await response.text();

          if (!response.ok) {
            throw new Error(message || "Không thể xóa thông báo.");
          }

          setNotifications((previous) =>
            previous.filter((item) => item.id !== notificationId)
          );

          showDelayedPopup(message || "Xóa thông báo thành công!");
        } catch (error) {
          console.error("Lỗi xóa thông báo:", error);

          showDelayedPopup(error.message || "Lỗi khi xóa thông báo.", true);
        } finally {
          setProcessingId(null);
        }
      }
    );
  };

  const togglePublish = async (item) => {
    const actionText = item.published ? "ẩn" : "đăng";

    try {
      setProcessingId(item.id);

      const response = await fetch(
        `http://localhost:8080/api/admin/notifications/${item.id}/publish`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || `Không thể ${actionText} thông báo.`);
      }

      setNotifications((previous) =>
        previous.map((notificationItem) =>
          notificationItem.id === item.id
            ? {
                ...notificationItem,

                published: !notificationItem.published,
              }
            : notificationItem
        )
      );

      showDelayedPopup(
        message ||
          (item.published
            ? "Ẩn thông báo thành công!"
            : "Đăng thông báo thành công!")
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);

      showDelayedPopup(
        error.message || "Lỗi khi cập nhật trạng thái thông báo.",
        true
      );
    } finally {
      setProcessingId(null);
    }
  };

  const clearFilters = () => {
    setKeyword("");
    setStatusFilter("ALL");
  };

  const isFormProcessing = processingId === "notification-form";

  return (
    <div className="admin-notification-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`admin-notification-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="notification-list-banner">
          <div>
            <div className="notification-list-banner-badge">
              <i className="fa fa-bullhorn"></i>
              Quản lý thông báo
            </div>

            <h1>Danh sách thông báo</h1>

            <p>
              Tạo, cập nhật và quản lý trạng thái hiển thị các thông báo dành
              cho sinh viên trong hệ thống ký túc xá.
            </p>
          </div>

          <div className="notification-list-banner-icon">
            <i className="fa fa-bell"></i>
          </div>
        </section>

        <section className="notification-summary-grid">
          <div className="notification-summary-card total">
            <div className="notification-summary-icon">
              <i className="fa fa-bullhorn"></i>
            </div>

            <div>
              <span>Tổng thông báo</span>

              <strong>{statistics.total}</strong>
            </div>
          </div>

          <div className="notification-summary-card published">
            <div className="notification-summary-icon">
              <i className="fa fa-eye"></i>
            </div>

            <div>
              <span>Đã đăng</span>

              <strong>{statistics.published}</strong>
            </div>
          </div>

          <div className="notification-summary-card hidden">
            <div className="notification-summary-icon">
              <i className="fa fa-eye-slash"></i>
            </div>

            <div>
              <span>Đã ẩn</span>

              <strong>{statistics.hidden}</strong>
            </div>
          </div>
        </section>

        <section className="notification-list-section">
          <div className="notification-list-toolbar">
            <div>
              <h2>Danh sách thông báo</h2>

              <p>
                Tìm kiếm và quản lý thông báo đang hiển thị trên trang sinh
                viên.
              </p>
            </div>

            <button
              type="button"
              className="notification-add-button"
              onClick={openAddModal}
            >
              <i className="fa fa-plus"></i>
              Thêm thông báo
            </button>
          </div>

          <div className="notification-filter-panel">
            <div className="notification-filter-group notification-search-group">
              <label htmlFor="notification-keyword">Tìm kiếm</label>

              <div className="notification-search-input">
                <i className="fa fa-search"></i>

                <input
                  id="notification-keyword"
                  type="text"
                  placeholder="Tìm theo tiêu đề hoặc nội dung..."
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />

                {keyword && (
                  <button
                    type="button"
                    className="notification-search-clear"
                    onClick={() => setKeyword("")}
                    title="Xóa từ khóa"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="notification-filter-group">
              <label htmlFor="notification-status">Trạng thái</label>

              <select
                id="notification-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>

                <option value="PUBLISHED">Đã đăng</option>

                <option value="HIDDEN">Đã ẩn</option>
              </select>
            </div>

            {(keyword || statusFilter !== "ALL") && (
              <button
                type="button"
                className="notification-clear-filter"
                onClick={clearFilters}
              >
                <i className="fa fa-times"></i>
                Xóa bộ lọc
              </button>
            )}

            <span className="notification-result-count">
              {filteredNotifications.length} kết quả
            </span>
          </div>

          {loading ? (
            <div className="notification-list-loading">
              <i className="fa fa-spinner fa-spin"></i>

              <p>Đang tải danh sách thông báo...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notification-list-empty">
              <div className="notification-empty-icon">
                <i className="fa fa-bell-slash"></i>
              </div>

              <h3>Không có thông báo phù hợp</h3>

              <p>
                Không tìm thấy thông báo theo từ khóa hoặc trạng thái hiện tại.
              </p>
            </div>
          ) : (
            <div className="notification-table-wrapper">
              <table className="notification-table">
                <thead>
                  <tr>
                    <th>Thông báo</th>
                    <th>Nội dung</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNotifications.map((item) => {
                    const isProcessing = processingId === item.id;

                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="notification-title-cell">
                            <div
                              className={`notification-item-icon ${
                                item.published ? "published" : "hidden"
                              }`}
                            >
                              <i
                                className={`fa ${
                                  item.published
                                    ? "fa-bullhorn"
                                    : "fa-bell-slash"
                                }`}
                              ></i>
                            </div>

                            <div>
                              <strong>
                                {item.title || "Không có tiêu đề"}
                              </strong>
                            </div>
                          </div>
                        </td>

                        <td>
                          <p className="notification-content-preview">
                            {getContentPreview(item.content)}
                          </p>
                        </td>

                        <td>
                          <div className="notification-date-cell">
                            <strong>{formatDate(item.createdAt)}</strong>

                            <span>{formatDateTime(item.createdAt)}</span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`notification-status-badge ${
                              item.published ? "published" : "hidden"
                            }`}
                          >
                            <i
                              className={`fa ${
                                item.published ? "fa-eye" : "fa-eye-slash"
                              }`}
                            ></i>

                            {item.published ? "Đã đăng" : "Đã ẩn"}
                          </span>
                        </td>

                        <td>
                          <div className="notification-action-buttons">
                            <button
                              type="button"
                              className="notification-edit-button"
                              title="Cập nhật thông báo"
                              disabled={isProcessing}
                              onClick={() => openUpdateModal(item)}
                            >
                              <i className="fa fa-eye"></i>
                              Xem
                            </button>

                            <button
                              type="button"
                              className={
                                item.published
                                  ? "notification-hide-button"
                                  : "notification-publish-button"
                              }
                              title={
                                item.published
                                  ? "Ẩn thông báo"
                                  : "Đăng thông báo"
                              }
                              disabled={isProcessing}
                              onClick={() => togglePublish(item)}
                            >
                              {isProcessing ? (
                                <i className="fa fa-spinner fa-spin"></i>
                              ) : (
                                <i
                                  className={`fa ${
                                    item.published ? "fa-eye-slash" : "fa-eye"
                                  }`}
                                ></i>
                              )}

                              {item.published ? "Ẩn" : "Đăng"}
                            </button>

                            <button
                              type="button"
                              className="notification-delete-button"
                              title="Xóa thông báo"
                              disabled={isProcessing}
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="fa fa-trash"></i>
                              Xóa
                            </button>
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

      {showNotificationModal && (
        <div
          className="notification-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isFormProcessing) {
              closeNotificationModal();
            }
          }}
        >
          <div className="notification-form-modal">
            <div className="notification-modal-header">
              <div>
                <span>Quản lý thông báo</span>

                <h2>{isEdit ? "Cập nhật thông báo" : "Thêm thông báo"}</h2>
              </div>

              <button
                type="button"
                className="notification-modal-close"
                onClick={closeNotificationModal}
                disabled={isFormProcessing}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="notification-modal-body">
              <div className="notification-modal-form-group">
                <label htmlFor="modal-notification-title">
                  Tiêu đề
                  <span>*</span>
                </label>

                <div className="notification-modal-input">
                  <i className="fa fa-heading"></i>

                  <input
                    id="modal-notification-title"
                    type="text"
                    name="title"
                    maxLength="255"
                    placeholder="Nhập tiêu đề thông báo"
                    value={notificationForm.title}
                    onChange={handleNotificationChange}
                    autoComplete="off"
                  />
                </div>

                <small>
                  {notificationForm.title.length}
                  /255 ký tự
                </small>
              </div>

              <div className="notification-modal-form-group">
                <label htmlFor="modal-notification-content">
                  Nội dung
                  <span>*</span>
                </label>

                <div className="notification-modal-textarea">
                  <i className="fa fa-align-left"></i>

                  <textarea
                    id="modal-notification-content"
                    name="content"
                    rows="7"
                    maxLength="2000"
                    placeholder="Nhập nội dung thông báo..."
                    value={notificationForm.content}
                    onChange={handleNotificationChange}
                  />
                </div>

                <small>
                  {notificationForm.content.length}
                  /2000 ký tự
                </small>
              </div>

              <div className="notification-modal-form-group">
                <label htmlFor="modal-notification-published">
                  Trạng thái
                  <span>*</span>
                </label>

                <div className="notification-modal-select">
                  <i
                    className={`fa ${
                      notificationForm.published ? "fa-eye" : "fa-eye-slash"
                    }`}
                  ></i>

                  <select
                    id="modal-notification-published"
                    name="published"
                    value={String(notificationForm.published)}
                    onChange={handleNotificationChange}
                  >
                    <option value="false">Đã ẩn</option>

                    <option value="true">Đã đăng</option>
                  </select>
                </div>
              </div>

              <div className="notification-modal-preview">
                <div className="notification-modal-preview-header">
                  <span>
                    <i className="fa fa-bell"></i>
                    Xem trước thông báo
                  </span>

                  <span
                    className={`notification-modal-status ${
                      notificationForm.published ? "published" : "hidden"
                    }`}
                  >
                    {notificationForm.published ? "Đã đăng" : "Đã ẩn"}
                  </span>
                </div>

                <div className="notification-modal-preview-body">
                  <h3>{notificationForm.title || "Tiêu đề thông báo"}</h3>

                  <p>
                    {notificationForm.content ||
                      "Nội dung thông báo sẽ hiển thị tại đây."}
                  </p>
                </div>
              </div>
            </div>

            <div className="notification-modal-footer">
              <button
                type="button"
                className="notification-modal-cancel-button"
                onClick={closeNotificationModal}
                disabled={isFormProcessing}
              >
                Đóng
              </button>

              <button
                type="button"
                className="notification-modal-save-button"
                onClick={isEdit ? updateNotification : addNotification}
                disabled={isFormProcessing}
              >
                {isFormProcessing ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className={`fa ${isEdit ? "fa-save" : "fa-plus"}`}></i>

                    {isEdit ? "Lưu thay đổi" : "Thêm thông báo"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
