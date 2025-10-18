import React, { useEffect, useState } from "react";
import { CategoryAPI, ProductAPI } from "../../services/api"; // import API của bạn
import "../../styles/ProductsPage.css";
import { ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await CategoryAPI.getAll();
      const prodRes = await ProductAPI.getAll();
      setCategories(catRes.categories || catRes);
      setProducts(prodRes.products || prodRes);
      setFiltered(prodRes.products || prodRes);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...products];
    if (selectedCat)
      data = data.filter((p) => p.category?.name === selectedCat);

    if (priceFilter) {
      switch (priceFilter) {
        case "under500":
          data = data.filter((p) => p.variants?.[0]?.price < 500000);
          break;
        case "500to1000":
          data = data.filter(
            (p) =>
              p.variants?.[0]?.price >= 500000 &&
              p.variants?.[0]?.price < 1000000
          );
          break;
        case "1000to2000":
          data = data.filter(
            (p) =>
              p.variants?.[0]?.price >= 1000000 &&
              p.variants?.[0]?.price < 2000000
          );
          break;
        case "over2000":
          data = data.filter((p) => p.variants?.[0]?.price >= 2000000);
          break;
        default:
          break;
      }
    }

    setFiltered(data);
  }, [selectedCat, priceFilter, products]);
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

    // Toast notification thay vì alert
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

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };
  return (
    <>
      <Header />
      <div class="breadcrumb-nav">
        <span onClick={() => navigate("/")}>Trang chủ</span>
        <span class="separator">/</span>
        <span>Products</span>
      </div>
      <div className="products-page">
        {/* Sidebar bên trái */}
        <aside className="sidebar">
          <h3>Danh mục sản phẩm</h3>
          <ul>
            {categories.map((cat) => (
              <li key={cat._id}>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCat === cat.name}
                    onChange={() => setSelectedCat(cat.name)}
                  />
                  {cat.name}
                </label>
              </li>
            ))}
            <li>
              <button
                className="clear-btn"
                onClick={() => setSelectedCat(null)}
              >
                Bỏ chọn
              </button>
            </li>
          </ul>

          <h3>Mức giá</h3>
          <ul>
            <li>
              <label>
                <input
                  type="radio"
                  name="price"
                  value="under500"
                  checked={priceFilter === "under500"}
                  onChange={(e) => setPriceFilter(e.target.value)}
                />
                Dưới 500.000đ
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="price"
                  value="500to1000"
                  checked={priceFilter === "500to1000"}
                  onChange={(e) => setPriceFilter(e.target.value)}
                />
                500.000đ - 1.000.000đ
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="price"
                  value="1000to2000"
                  checked={priceFilter === "1000to2000"}
                  onChange={(e) => setPriceFilter(e.target.value)}
                />
                1.000.000đ - 2.000.000đ
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="price"
                  value="over2000"
                  checked={priceFilter === "over2000"}
                  onChange={(e) => setPriceFilter(e.target.value)}
                />
                Trên 2.000.000đ
              </label>
            </li>
          </ul>

          <button className="clear-btn" onClick={() => setPriceFilter("")}>
            Xóa lọc giá
          </button>
        </aside>

        {/* Danh sách sản phẩm */}
        <section className="products-section">
          <h2>{selectedCat ? selectedCat : "Danh Sách Sản Phẩm"}</h2>

          <div className="product-grid">
            {filtered.length > 0 ? (
              filtered.map((p) => (
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
                    <div className="product-overlay-1">
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
                  <div className="product-info">
                    <h3 className="product-name">{p.name}</h3>
                    <span className="product-price">
                      {p.variants?.[0]?.price
                        ? p.variants[0].price.toLocaleString("vi-VN") + "đ"
                        : "Liên hệ"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm nào phù hợp</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
