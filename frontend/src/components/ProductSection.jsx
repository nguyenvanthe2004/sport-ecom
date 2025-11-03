import React, { useEffect, useState } from "react";
import { ProductAPI } from "../services/api";
import { Eye, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductSection.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, addToCart } from "../redux/slices/cartSlice";
import { showToast } from "../../libs/utils";
import { BASE_URL } from "../constants";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await ProductAPI.getAll();
        setProducts(data.products || data);
      } catch (error) {
        console.error("❌ Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  const handleAddToCart = async (product, e) => {
    e.stopPropagation();

    if (!currentUser || !currentUser.userId) {
      navigate("/login");
      return;
    }

    try {
      await dispatch(addToCart(product, 1));
      showToast("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Thêm vào giỏ hàng thất bại:", error);
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
                      ? `${BASE_URL}${p.variants[0].image}`
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
                      onClick={(e) => handleAddToCart(p, e)}
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

export default ProductSection;
