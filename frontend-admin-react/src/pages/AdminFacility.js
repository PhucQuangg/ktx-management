import React, { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";

import "../css/AdminFacilityList.css";

const initialFacilityForm = {
  roomId: "",
  facilityName: "",
  quantity: 1,
  status: "GOOD",
};

export default function AdminListFacility() {
  const token =
    sessionStorage.getItem("admin_token") ||
    localStorage.getItem("admin_token");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [facilities, setFacilities] = useState([]);

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState(false);

  const [facilityStatus, setFacilityStatus] = useState("ALL");

  const [roomFilter, setRoomFilter] = useState("ALL");

  const [keyword, setKeyword] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [facilityForm, setFacilityForm] = useState(initialFacilityForm);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadInitialData();
  }, [token]);

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

  const loadInitialData = async () => {
    try {
      setLoading(true);

      await Promise.all([fetchFacilities(), fetchRooms()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/facilities",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await parseJsonResponse(response, []);

      setFacilities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải cơ sở vật chất:", error);

      window.showPopup?.(
        error.message || "Lỗi khi tải danh sách cơ sở vật chất.",
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
      console.error("Lỗi tải phòng:", error);

      window.showPopup?.(error.message || "Lỗi khi tải danh sách phòng.", true);
    }
  };

  const filteredFacilities = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return facilities.filter((facility) => {
      const matchesRoom =
        roomFilter === "ALL" || facility.roomName === roomFilter;

      const matchesStatus =
        facilityStatus === "ALL" || facility.status === facilityStatus;

      const matchesKeyword =
        !normalizedKeyword ||
        facility.facilityName?.toLowerCase().includes(normalizedKeyword) ||
        facility.roomName?.toLowerCase().includes(normalizedKeyword);

      return matchesRoom && matchesStatus && matchesKeyword;
    });
  }, [facilities, roomFilter, facilityStatus, keyword]);

  const statistics = useMemo(() => {
    const good = facilities.filter(
      (facility) => facility.status === "GOOD"
    ).length;

    const broken = facilities.filter(
      (facility) => facility.status === "BROKEN"
    ).length;

    const maintenance = facilities.filter(
      (facility) => facility.status === "MAINTENANCE"
    ).length;

    const totalQuantity = facilities.reduce(
      (total, facility) => total + Number(facility.quantity || 0),
      0
    );

    return {
      total: facilities.length,
      totalQuantity,
      good,
      broken,
      maintenance,
    };
  }, [facilities]);

  const roomList = useMemo(() => {
    return [
      ...new Set(
        facilities.map((facility) => facility.roomName).filter(Boolean)
      ),
    ];
  }, [facilities]);

  const getStatusText = (status) => {
    const statusMap = {
      GOOD: "Tốt",
      BROKEN: "Hỏng",
      MAINTENANCE: "Bảo trì",
    };

    return statusMap[status] || status || "Chưa xác định";
  };

  const openAddModal = () => {
    setIsEdit(false);
    setEditingId(null);
    setFacilityForm(initialFacilityForm);
    setShowModal(true);
  };

  const openEditModal = (facility) => {
    setIsEdit(true);
    setEditingId(facility.id);

    setFacilityForm({
      roomId: facility.roomId || "",
      facilityName: facility.facilityName || "",
      quantity: Number(facility.quantity || 1),
      status: facility.status || "GOOD",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (processing) {
      return;
    }

    setShowModal(false);
    setIsEdit(false);
    setEditingId(null);
    setFacilityForm(initialFacilityForm);
  };

  const handleFacilityChange = (event) => {
    const { name, value, type } = event.target;

    setFacilityForm((previous) => ({
      ...previous,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const validateFacility = () => {
    if (!facilityForm.roomId) {
      window.showPopup?.("Vui lòng chọn phòng.", true);

      return false;
    }

    if (!facilityForm.facilityName.trim()) {
      window.showPopup?.("Vui lòng nhập tên thiết bị.", true);

      return false;
    }

    if (!facilityForm.quantity || Number(facilityForm.quantity) <= 0) {
      window.showPopup?.("Số lượng phải lớn hơn 0.", true);

      return false;
    }

    if (!facilityForm.status) {
      window.showPopup?.("Vui lòng chọn tình trạng.", true);

      return false;
    }

    return true;
  };

  const handleSaveFacility = async () => {
    if (!validateFacility()) {
      return;
    }

    try {
      setProcessing(true);

      const payload = {
        roomId: Number(facilityForm.roomId),
        facilityName: facilityForm.facilityName.trim(),
        quantity: Number(facilityForm.quantity),
        status: facilityForm.status,
      };

      const url = isEdit
        ? `http://localhost:8080/api/admin/facilities/${editingId}`
        : "http://localhost:8080/api/admin/facilities";

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const message = await response.text();

      if (!response.ok) {
        throw new Error(
          message ||
            (isEdit
              ? "Không thể cập nhật thiết bị."
              : "Không thể thêm thiết bị.")
        );
      }

      closeModal();

      await fetchFacilities();

      setTimeout(() => {
        window.showPopup?.(
          message ||
            (isEdit
              ? "Cập nhật thiết bị thành công!"
              : "Thêm thiết bị thành công!")
        );
      }, 250);
    } catch (error) {
      console.error("Lỗi lưu thiết bị:", error);

      window.showPopup?.(
        error.message || "Có lỗi xảy ra khi lưu thiết bị.",
        true
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = (facilityId) => {
    window.showPopup?.(
      "Bạn có chắc chắn muốn xóa thiết bị này không?",
      false,
      true,
      async () => {
        try {
          setProcessing(true);

          const response = await fetch(
            `http://localhost:8080/api/admin/facilities/${facilityId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const message = await response.text();

          if (!response.ok) {
            throw new Error(message || "Không thể xóa thiết bị.");
          }

          setFacilities((previous) =>
            previous.filter((facility) => facility.id !== facilityId)
          );

          setTimeout(() => {
            window.showPopup?.(message || "Xóa thiết bị thành công!");
          }, 250);
        } catch (error) {
          console.error("Lỗi xóa thiết bị:", error);

          setTimeout(() => {
            window.showPopup?.(
              error.message || "Có lỗi xảy ra khi xóa thiết bị.",
              true
            );
          }, 250);
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  const clearFilters = () => {
    setRoomFilter("ALL");
    setFacilityStatus("ALL");
    setKeyword("");
  };

  return (
    <div className="admin-facility-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`admin-facility-content ${
          sidebarOpen ? "" : "sidebar-collapsed"
        }`}
      >
        <section className="facility-list-banner">
          <div>
            <div className="facility-list-banner-badge">
              <i className="fa fa-couch"></i>
              Quản lý cơ sở vật chất
            </div>

            <h1>Danh sách cơ sở vật chất</h1>

            <p>
              Theo dõi thiết bị theo từng phòng, cập nhật số lượng và tình trạng
              sử dụng trong ký túc xá.
            </p>
          </div>

          <div className="facility-list-banner-icon">
            <i className="fa fa-toolbox"></i>
          </div>
        </section>

        <section className="facility-summary-grid">
          <div className="facility-summary-card total">
            <div className="facility-summary-icon">
              <i className="fa fa-cubes"></i>
            </div>

            <div>
              <span>Loại thiết bị</span>

              <strong>{statistics.total}</strong>
            </div>
          </div>

          <div className="facility-summary-card quantity">
            <div className="facility-summary-icon">
              <i className="fa fa-layer-group"></i>
            </div>

            <div>
              <span>Tổng số lượng</span>

              <strong>{statistics.totalQuantity}</strong>
            </div>
          </div>

          <div className="facility-summary-card good">
            <div className="facility-summary-icon">
              <i className="fa fa-check-circle"></i>
            </div>

            <div>
              <span>Tình trạng tốt</span>

              <strong>{statistics.good}</strong>
            </div>
          </div>

          <div className="facility-summary-card issue">
            <div className="facility-summary-icon">
              <i className="fa fa-triangle-exclamation"></i>
            </div>

            <div>
              <span>Hỏng / Bảo trì</span>

              <strong>{statistics.broken + statistics.maintenance}</strong>
            </div>
          </div>
        </section>

        <section className="facility-list-section">
          <div className="facility-list-toolbar">
            <div>
              <h2>Danh sách thiết bị</h2>

              <p>Tìm kiếm và lọc thiết bị theo phòng hoặc tình trạng.</p>
            </div>

            <button
              type="button"
              className="facility-add-button"
              onClick={openAddModal}
            >
              <i className="fa fa-plus"></i>
              Thêm thiết bị
            </button>
          </div>

          <div className="facility-filter-panel">
            <div className="facility-filter-group facility-search-group">
              <label htmlFor="facility-keyword">Tìm kiếm</label>

              <div className="facility-search-input">
                <i className="fa fa-search"></i>

                <input
                  id="facility-keyword"
                  type="text"
                  placeholder="Tìm theo tên thiết bị hoặc phòng..."
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />

                {keyword && (
                  <button type="button" onClick={() => setKeyword("")}>
                    <i className="fa fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="facility-filter-group">
              <label htmlFor="facility-room">Phòng</label>

              <select
                id="facility-room"
                value={roomFilter}
                onChange={(event) => setRoomFilter(event.target.value)}
              >
                <option value="ALL">Tất cả phòng</option>

                {roomList.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            <div className="facility-filter-group">
              <label htmlFor="facility-status">Tình trạng</label>

              <select
                id="facility-status"
                value={facilityStatus}
                onChange={(event) => setFacilityStatus(event.target.value)}
              >
                <option value="ALL">Tất cả tình trạng</option>

                <option value="GOOD">Tốt</option>

                <option value="BROKEN">Hỏng</option>

                <option value="MAINTENANCE">Bảo trì</option>
              </select>
            </div>

            {(keyword || roomFilter !== "ALL" || facilityStatus !== "ALL") && (
              <button
                type="button"
                className="facility-clear-filter"
                onClick={clearFilters}
              >
                <i className="fa fa-times"></i>
                Xóa bộ lọc
              </button>
            )}

            <span className="facility-result-count">
              {filteredFacilities.length} kết quả
            </span>
          </div>

          {loading ? (
            <div className="facility-list-loading">
              <i className="fa fa-spinner fa-spin"></i>

              <p>Đang tải danh sách thiết bị...</p>
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div className="facility-list-empty">
              <div className="facility-empty-icon">
                <i className="fa fa-box-open"></i>
              </div>

              <h3>Không có thiết bị phù hợp</h3>

              <p>Không tìm thấy thiết bị theo điều kiện lọc hiện tại.</p>
            </div>
          ) : (
            <div className="facility-table-wrapper">
              <table className="facility-table">
                <thead>
                  <tr>
                    <th>Phòng</th>
                    <th>Thiết bị</th>
                    <th>Số lượng</th>
                    <th>Tình trạng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFacilities.map((facility) => (
                    <tr key={facility.id}>
                      <td>
                        <span className="facility-room-badge">
                          <i className="fa fa-door-open"></i>

                          {facility.roomName || "Chưa cập nhật"}
                        </span>
                      </td>

                      <td>
                        <div className="facility-name-cell">
                          <div className="facility-item-icon">
                            <i className="fa fa-couch"></i>
                          </div>

                          <div>
                            <strong>
                              {facility.facilityName || "Chưa cập nhật"}
                            </strong>

                            <span>Mã thiết bị #{facility.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="facility-quantity-badge">
                          {facility.quantity || 0}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`facility-status-badge ${
                            facility.status ? facility.status.toLowerCase() : ""
                          }`}
                        >
                          {getStatusText(facility.status)}
                        </span>
                      </td>

                      <td>
                        <div className="facility-action-buttons">
                          <button
                            type="button"
                            className="facility-edit-button"
                            onClick={() => openEditModal(facility)}
                          >
                            <i className="fa fa-pen"></i>
                            Sửa
                          </button>

                          <button
                            type="button"
                            className="facility-delete-button"
                            onClick={() => handleDelete(facility.id)}
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
        </section>
      </main>

      {showModal && (
        <div
          className="facility-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="facility-modal">
            <div className="facility-modal-header">
              <div>
                <span>Quản lý cơ sở vật chất</span>

                <h2>{isEdit ? "Cập nhật thiết bị" : "Thêm thiết bị"}</h2>
              </div>

              <button type="button" onClick={closeModal} disabled={processing}>
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="facility-modal-body">
              <div className="facility-modal-form-grid">
                <div className="facility-modal-form-group full-width">
                  <label htmlFor="roomId">
                    Phòng
                    <span>*</span>
                  </label>

                  <div className="facility-modal-input">
                    <i className="fa fa-door-open"></i>

                    <select
                      id="roomId"
                      name="roomId"
                      value={facilityForm.roomId}
                      onChange={handleFacilityChange}
                    >
                      <option value="">-- Chọn phòng --</option>

                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name || room.roomName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="facility-modal-form-group full-width">
                  <label htmlFor="facilityName">
                    Tên thiết bị
                    <span>*</span>
                  </label>

                  <div className="facility-modal-input">
                    <i className="fa fa-couch"></i>

                    <input
                      id="facilityName"
                      type="text"
                      name="facilityName"
                      placeholder="Ví dụ: Giường tầng, máy lạnh..."
                      value={facilityForm.facilityName}
                      onChange={handleFacilityChange}
                    />
                  </div>
                </div>

                <div className="facility-modal-form-group">
                  <label htmlFor="quantity">
                    Số lượng
                    <span>*</span>
                  </label>

                  <div className="facility-modal-input">
                    <i className="fa fa-layer-group"></i>

                    <input
                      id="quantity"
                      type="number"
                      name="quantity"
                      min="1"
                      value={facilityForm.quantity}
                      onChange={handleFacilityChange}
                    />
                  </div>
                </div>

                <div className="facility-modal-form-group">
                  <label htmlFor="status">
                    Tình trạng
                    <span>*</span>
                  </label>

                  <div className="facility-modal-input">
                    <i className="fa fa-circle-info"></i>

                    <select
                      id="status"
                      name="status"
                      value={facilityForm.status}
                      onChange={handleFacilityChange}
                    >
                      <option value="GOOD">Tốt</option>

                      <option value="BROKEN">Hỏng</option>

                      <option value="MAINTENANCE">Bảo trì</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="facility-modal-note">
                <i className="fa fa-info-circle"></i>

                <p>
                  Vui lòng chọn đúng phòng, số lượng và tình trạng thực tế của
                  thiết bị.
                </p>
              </div>
            </div>

            <div className="facility-modal-footer">
              <button
                type="button"
                className="facility-modal-cancel-button"
                onClick={closeModal}
                disabled={processing}
              >
                Đóng
              </button>

              <button
                type="button"
                className="facility-modal-save-button"
                onClick={handleSaveFacility}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className={`fa ${isEdit ? "fa-save" : "fa-plus"}`}></i>

                    {isEdit ? "Lưu thay đổi" : "Thêm thiết bị"}
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
