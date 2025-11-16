import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/OrderPage.css";
import LoadingPage from "../../components/LoadingPage";
import { OrderAPI } from "../../services/api";
import { BASE_URL } from "../../constants";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const data = await OrderAPI.getMyOrders(page, itemsPerPage);
      setOrders(data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("❌ Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  if (loading) return <LoadingPage />;

  return (
    <>
      <Header />
      <div className="order-page">
        <div className="order-container">
          <h1 className="order-title">Đơn hàng của tôi</h1>

          {orders.length === 0 ? (
            <div className="empty-order">
              <p>Bạn chưa có đơn hàng nào.</p>
              <button
                className="continue-shopping"
                onClick={() => (window.location.href = "/")}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <>
              <div className="order-list">
                {orders.map((order) => (
                  <div className="order-card" key={order._id}>
                    <div className="order-header">
                      <span>Mã đơn: {order._id}</span>
                      <span
                        className={`order-status ${order.status
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      >
                        {order.status === "pending"
                          ? "Đang xử lý"
                          : order.status === "shipped"
                          ? "Đang giao"
                          : order.status === "delivered"
                          ? "Hoàn thành"
                          : "Đã hủy"}
                      </span>
                    </div>

                    <div className="order-body">
                      {order.orderItems.map((item) => (
                        <div className="order-item" key={item._id}>
                          <img
                            src={
                              item.variantId?.image
                                ? `${BASE_URL}${item.variantId.image}`
                                : "/no-image.png"
                            }
                            alt={item.variantId?.name || "Sản phẩm"}
                          />
                          <div className="item-info">
                            <h4>
                              {item.variantId?.productId?.name}
                              {item.variantId?.nameDetail
                                ? ` – ${item.variantId.nameDetail}`
                                : ""}
                            </h4>
                            <p>Số lượng: {item.quantity}</p>
                            <p>
                              Giá:{" "}
                              {item.variantId?.price?.toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <p>
                        Tổng tiền:{" "}
                        <strong>
                          {order.totalPrice.toLocaleString("vi-VN")}₫
                        </strong>
                      </p>
                      <p>
                        Ngày đặt:{" "}
                        {new Date(order.createAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    «
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={currentPage === i + 1 ? "active" : ""}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    »
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderPage;
