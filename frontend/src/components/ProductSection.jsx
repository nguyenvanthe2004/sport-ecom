import React, { useEffect, useState } from "react";
import { CartAPI, ProductAPI } from "../services/api";
import { Eye, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductSection.css";
import { useSelector } from "react-redux";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await ProductAPI.getAll();
        setProducts(res.products || []);
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Toast thông báo đơn giản
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = `
      <div class="toast-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const addToCart = async (product, e) => {
    e?.stopPropagation?.();
    try {
      const variantId = product.variants?.[0]?._id;
      const quantity = 1;

      if (currentUser && currentUser.userId) {
        await CartAPI.addToCart(variantId, quantity);
        window.dispatchEvent(new Event("cartUpdated"));
        showToast("Đã thêm vào giỏ hàng!");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
      showToast("Thêm vào giỏ hàng thất bại!");
    }
  };

  return (
    <section className="product-section">
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading">Đang tải sản phẩm...</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div
              key={p._id}
              className="product-card"
              onClick={() => navigate(`/product/${p.slug}`)}
            >
              <div className="product-image-wrapper">
                <img
                  src={
                    p.variants?.[0]?.image
                      ? `http://localhost:8000/${p.variants[0].image}`
                      : "/no-image.jpg"
                  }
                  alt={p.name}
                  className="product-image"
                />

                <div className="product-overlay">
                  <div className="product-actions">
                    <button
                      className="action-btn view-btn"
                      title="Xem chi tiết"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${p.slug}`);
                      }}
                    >
                      <Eye size={18} />
                      <span>Xem</span>
                    </button>
                    <button
                      className="action-btn cart-btn"
                      title="Thêm vào giỏ"
                      onClick={(e) => addToCart(p, e)}
                    >
                      <ShoppingCart size={18} />
                      <span>Giỏ hàng</span>
                    </button>
                  </div>
                </div>

                {p.variants?.[0]?.discount && (
                  <div className="discount-badge">
                    -{p.variants[0].discount}%
                  </div>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{p.name}</h3>
                <div className="product-footer">
                  <div className="product-price-wrapper">
                    {p.variants?.[0]?.price ? (
                      <>
                        <span className="product-price">
                          {p.variants[0].price.toLocaleString("vi-VN")}₫
                        </span>
                        {p.variants[0].originalPrice && (
                          <span className="product-price-old">
                            {p.variants[0].originalPrice.toLocaleString(
                              "vi-VN"
                            )}
                            ₫
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="product-price">Liên hệ</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductSection;
