import React, { useEffect, useState } from "react";
import { ProductAPI } from "../services/api";
import { Eye, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductSection.css";

const RelatedProducts = ({ categorySlug, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelated = async () => {
      if (!categorySlug) return;
      try {
        setLoading(true);
        const res = await ProductAPI.getAll();
        const allProducts = res.products || [];

        // Lọc sản phẩm cùng danh mục, khác id hiện tại
        const filtered = allProducts.filter(
          (p) => p.category?.slug === categorySlug && p._id !== currentProductId
        );

        setRelatedProducts(filtered.slice(0, 6)); // lấy tối đa 6 sản phẩm
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm gợi ý:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [categorySlug, currentProductId]);

  const addToCart = (product, e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exist = cart.find((item) => item._id === product._id);

    if (exist) {
      exist.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        image: product.variants?.[0]?.image,
        price: product.variants?.[0]?.price || 0,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast("Đã thêm vào giỏ hàng!");
  };

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

  return (
    <section className="product-section">
      <h2 className="related-title">SẢN PHẨM TƯƠNG TỰ</h2>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading">Đang tải...</p>
        </div>
      ) : (
        <div className="product-grid">
          {relatedProducts.map((p) => (
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
                  <div className="discount-badge">-{p.variants[0].discount}%</div>
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
                            {p.variants[0].originalPrice.toLocaleString("vi-VN")}₫
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

export default RelatedProducts;
