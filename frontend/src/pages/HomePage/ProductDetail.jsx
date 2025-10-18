import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductAPI } from "../../services/api";
import {
  ShoppingCart,
  Eye,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import "../../styles/ProductDetail.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [related, setRelated] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentVariant, setCurrentVariant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ProductAPI.getBySlug(slug);
        const p = res.product;
        setProduct(p);
        setRelated(res.relatedProducts || []);

        if (p?.variants?.length > 0) {
          const defaultImage = `http://localhost:8000/${p.variants[0].image}`;
          setMainImage(defaultImage);

          // lấy danh sách color và size từ nameDetail
          const [firstColor, firstSize] = p.variants[0].nameDetail.split("-");
          setSelectedColor(firstColor?.trim() || "");
          setSelectedSize(firstSize?.trim() || "");
          setCurrentVariant(p.variants[0]);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      }
    };
    fetchData();
  }, [slug]);

  // tách tất cả color và size duy nhất
  const colors = [
    ...new Set(
      product?.variants?.map((v) => v.nameDetail.split("-")[0].trim())
    ),
  ];
  const sizes = [
    ...new Set(
      product?.variants?.map((v) => v.nameDetail.split("-")[1]?.trim())
    ),
  ];

  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const found = product.variants.find((v) => {
        const [color, size] = v.nameDetail.split("-");
        return color.trim() === selectedColor && size.trim() === selectedSize;
      });
      setCurrentVariant(found || null);
      if (found) {
        setMainImage(`http://localhost:8000/${found.image}`);
      }
    }
  }, [selectedColor, selectedSize, product]);

  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const addToCart = () => {
    if (!product || !currentVariant) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exist = cart.find((item) => item.variantId === currentVariant._id);

    if (exist) {
      exist.quantity += quantity;
    } else {
      cart.push({
        _id: product._id,
        variantId: currentVariant._id,
        name: product.name,
        image: currentVariant.image,
        price: currentVariant.price,
        quantity,
        color: selectedColor,
        size: selectedSize,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const buyNow = () => {
    addToCart();
    setTimeout(() => navigate("/cart"), 500);
  };

  if (!product)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Đang tải sản phẩm...</p>
      </div>
    );

  const originalPrice = currentVariant?.originalPrice;
  const currentPrice = currentVariant?.price;
  const discount = currentVariant?.discount;

  return (
    <div className="product-detail-container">
      <Header />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/")}>Trang chủ</span>
        <span className="separator">/</span>
        <span onClick={() => navigate("/products")}>Sản phẩm</span>
        <span className="separator">/</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="product-detail-main">
        {/* Hình ảnh */}
        <div className="product-images-section">
          <div className="main-image-wrapper">
            <img
              src={mainImage}
              alt={product.name}
              className="main-product-image"
            />
            {discount && (
              <div className="discount-badge-large">-{discount}%</div>
            )}
          </div>
          <div className="thumbnail-list">
            {product.variants?.map((v, i) => (
              <img
                key={i}
                src={`http://localhost:8000/${v.image}`}
                alt={`variant-${i}`}
                className={
                  mainImage === `http://localhost:8000/${v.image}`
                    ? "thumbnail active"
                    : "thumbnail"
                }
                onClick={() => setMainImage(`http://localhost:8000/${v.image}`)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-actions-mini">
              <button className="icon-btn" title="Yêu thích">
                <Heart size={20} />
              </button>
              <button className="icon-btn" title="Chia sẻ">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="product-meta">
            <span className="product-category">
              <Eye size={16} />
              {product.categoryId?.name || "Chưa phân loại"}
            </span>
            <span className="product-sold">Đã bán: {product.sold || 0}</span>
          </div>

          {/* Giá */}
          <div className="product-price-section">
            {originalPrice && originalPrice > currentPrice ? (
              <>
                <span className="price-current">
                  {currentPrice?.toLocaleString("vi-VN")}₫
                </span>
                <span className="price-original">
                  {originalPrice?.toLocaleString("vi-VN")}₫
                </span>
                <span className="price-discount">
                  Tiết kiệm{" "}
                  {(originalPrice - currentPrice).toLocaleString("vi-VN")}₫
                </span>
              </>
            ) : (
              <span className="price-current">
                {currentPrice
                  ? currentPrice.toLocaleString("vi-VN") + "₫"
                  : "Liên hệ"}
              </span>
            )}
          </div>

          {/* Chọn màu */}
          <div className="product-variants">
            <label className="variant-label">Màu sắc:</label>
            <div className="variant-buttons">
              {colors.map((color, i) => (
                <button
                  key={i}
                  className={
                    selectedColor === color
                      ? "variant-btn active"
                      : "variant-btn"
                  }
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Chọn size */}
          <div className="product-variants">
            <label className="variant-label">Kích cỡ:</label>
            <div className="variant-buttons">
              {sizes.map((size, i) => (
                <button
                  key={i}
                  className={
                    selectedSize === size ? "variant-btn active" : "variant-btn"
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng */}
          <div className="product-quantity">
            <label className="quantity-label">Số lượng:</label>
            <div className="quantity-selector">
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="qty-input"
              />
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="product-actions">
            <button className="btn-add-cart" onClick={addToCart}>
              <ShoppingCart size={20} />
              <span>Thêm vào giỏ</span>
            </button>
            <button className="btn-buy-now" onClick={buyNow}>
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Mô tả */}
      <div className="product-description-section">
        <h2 className="section-title">Mô tả sản phẩm</h2>
        <div className="description-content">
          <p>{product.description || "Chưa có mô tả cho sản phẩm này."}</p>
        </div>
        {/* Tính năng */}
        <div className="product-features">
          <div className="feature-item">
            <Truck size={24} />
            <div>
              <strong>Miễn phí vận chuyển</strong>
              <p>Cho đơn hàng từ 500.000₫</p>
            </div>
          </div>
          <div className="feature-item">
            <Shield size={24} />
            <div>
              <strong>Bảo hành chính hãng</strong>
              <p>Đổi trả trong 7 ngày</p>
            </div>
          </div>
          <div className="feature-item">
            <RotateCcw size={24} />
            <div>
              <strong>Đổi trả dễ dàng</strong>
              <p>Hoàn tiền 100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sản phẩm gợi ý */}
      {related.length > 0 && (
        <div className="related-products-section">
          <h2 className="section-title">Sản phẩm tương tự</h2>

          <div className="product-grid">
            {related.map((p) => (
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
                        onClick={(e) => {
                          e.stopPropagation();
                          const cart =
                            JSON.parse(localStorage.getItem("cart")) || [];
                          const exist = cart.find((item) => item._id === p._id);
                          if (exist) {
                            exist.quantity += 1;
                          } else {
                            cart.push({
                              _id: p._id,
                              name: p.name,
                              image: p.variants?.[0]?.image,
                              price: p.variants?.[0]?.price || 0,
                              quantity: 1,
                            });
                          }
                          localStorage.setItem("cart", JSON.stringify(cart));
                          window.dispatchEvent(new Event("cartUpdated"));
                          const toast = document.createElement("div");
                          toast.className = "toast-notification";
                          toast.innerHTML = `
                      <div class="toast-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span class="toast-message">Đã thêm vào giỏ hàng!</span>
                    `;
                          document.body.appendChild(toast);
                          setTimeout(() => toast.classList.add("show"), 100);
                          setTimeout(() => {
                            toast.classList.remove("show");
                            setTimeout(() => toast.remove(), 300);
                          }, 3000);
                        }}
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
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
