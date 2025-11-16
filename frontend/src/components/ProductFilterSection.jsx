import React from "react";
import { Eye, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductSection.css";
import { BASE_URL } from "../constants";

const ProductFilterSection = ({
  products = [],
  page,
  totalPages,
  onPageChange,
}) => {
  const navigate = useNavigate();

  return (
    <section className="product-section">
      {products.length === 0 ? (
        <div className="no-products">
          <p>Không tìm thấy sản phẩm nào phù hợp.</p>
        </div>
      ) : (
        <>
          {/* 🔹 Danh sách sản phẩm */}
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
                        ? `${BASE_URL}${p.variants[0].image}`
                        : "/no-image.jpg"
                    }
                    alt={p.name}
                    className="product-image"
                  />

                  <div className="product-overlay">
                    
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

          {/* 🔹 Thanh phân trang */}
          <div className="pagination">
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
              ← Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={page === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              Sau →
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductFilterSection;
