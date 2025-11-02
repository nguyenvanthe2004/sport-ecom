import React from "react";
import { Eye, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductSection.css";

const ProductFilterSection = ({ products = [], addToCart }) => {
  const navigate = useNavigate();

  return (
    <section className="product-section">
      {products.length === 0 ? (
        <div className="no-products">
          <p>Không tìm thấy sản phẩm nào phù hợp.</p>
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
                      className="actions-btn view-btn"
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
                      className="actions-btn cart-btn"
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

export default ProductFilterSection;
