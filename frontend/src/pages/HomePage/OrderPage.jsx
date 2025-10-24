import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/OrderPage.css";
import LoadingPage from "../../components/LoadingPage";
import { OrderAPI } from "../../services/api";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await OrderAPI.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("❌ Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
                onClick={() => (window.location.href = "/home")}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
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
                              ? `http://localhost:8000/${item.variantId.image}`
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
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderPage;
