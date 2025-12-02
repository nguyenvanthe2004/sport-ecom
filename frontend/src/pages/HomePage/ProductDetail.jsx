import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartAPI, ProductAPI } from "../../services/api";
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
import { useDispatch, useSelector } from "react-redux";
import LoadingPage from "../../components/LoadingPage";
import { addToCart, fetchCart } from "../../redux/slices/cartSlice";
import { showErrorToast, showToast } from "../../../libs/utils";
import { BASE_URL } from "../../constants";

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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [subImages, setSubImages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await ProductAPI.getbySlug(slug);
        const p = res.product;
        setProduct(p);
        setRelated(res.relatedProducts || []);

        if (p?.variants?.length > 0) {
          const defaultVariant = p.variants[0];
          setMainImage(`${BASE_URL}${defaultVariant.image}`);

          const [firstColor, firstSize] = defaultVariant.nameDetail.split("-");
          setSelectedColor(firstColor?.trim() || "");
          setSelectedSize(firstSize?.trim() || "");
          setCurrentVariant(defaultVariant);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const colors = [
    ...new Set(
      product?.variants?.map((v) => v.nameDetail.split("-")[0].trim()) || []
    ),
  ];
  const sizes = [
    ...new Set(
      product?.variants?.map((v) => v.nameDetail.split("-")[1]?.trim()) || []
    ),
  ];

  useEffect(() => {
    if (!product?.variants) return;

    const images = product.variants.reduce((acc, variant) => {
      const color = variant.nameDetail.split("-")[0].trim();
      if (!acc[color]) acc[color] = variant.image;
      return acc;
    }, {});

    setSubImages(images);
  }, [product]);

  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const found = product.variants.find((v) => {
        const [color, size] = v.nameDetail.split("-");
        return color.trim() === selectedColor && size.trim() === selectedSize;
      });
      setCurrentVariant(found || null);
      if (found) {
        setMainImage(`${BASE_URL}${found.image}`);
      }
    }
  }, [selectedColor, selectedSize, product]);

  const handleAddToCart = async (e) => {
    e?.stopPropagation?.();

    if (!currentUser || !currentUser.userId) {
      navigate("/login");
      return;
    }

    try {
      dispatch(addToCart(currentVariant, quantity));
      showToast("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Thêm vào giỏ hàng thất bại:", error);
      showErrorToast("Thêm vào giỏ hàng thất bại!");
    }
  };

  const buyNow = () => {
    if (!currentUser || !currentUser.userId) {
      navigate("/login");
      return;
    }

    if (!currentVariant) {
      showErrorToast("Vui lòng chọn màu và kích cỡ!");
      return;
    }    
    const buyNowItem = {
      _id: currentVariant._id,
      variantId: {
        _id: currentVariant._id,
        nameDetail: currentVariant.nameDetail,
        price: currentVariant.price,
        image: currentVariant.image,
        stock: currentVariant.stock,
        productId: {
          _id: product._id,
          name: product.name,
        },
      },
      quantity,
    };
    navigate("/checkout", {
      state: {
        buyNowItem,
      },
    });
  };

  if (loading) return <LoadingPage />;
  if (!product)
    return (
      <div className="error-container">
        <p className="error-text">Không tìm thấy sản phẩm.</p>
      </div>
    );

  const originalPrice = currentVariant?.originalPrice;
  const currentPrice = currentVariant?.price;
  const discount = currentVariant?.discount;

  return (
    <div className="product-detail-container">
      <Header />

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
            {Object.entries(subImages).map(([color, image]) => (
              <img
                key={color}
                src={`${BASE_URL}${image}`}
                alt={color}
                width={100}
                className={
                  mainImage === `${BASE_URL}${image}`
                    ? "thumbnail active"
                    : "thumbnail"
                }
                onClick={() => setMainImage(`${BASE_URL}${image}`)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin */}
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
                  className={`variant-btn ${
                    selectedColor === color ? "active" : ""
                  }`}
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
                  className={`variant-btn ${
                    selectedSize === size ? "active" : ""
                  }`}
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
            <button
              className="btn-add-cart"
              onClick={(e) => handleAddToCart(product, e)}
            >
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
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
