import React, { useState, useEffect, useRef } from "react";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../redux/slices/cartSlice";
import { clearCurrentUser } from "../redux/slices/currentUser";
import { ProductAPI } from "../services/api";
import { BASE_URL } from "../constants";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.currentUser);
  const cart = useSelector((state) => state.cart.items);

  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowCartDropdown(false);
        setShowUserDropdown(false);
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        setShowSearchDropdown(false);
        return;
      }

      try {
        const data = await ProductAPI.search(searchTerm);
        setSearchResults(data.products || data);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleCartClick = () => setShowCartDropdown(!showCartDropdown);
  const handleRemoveItem = (id) => dispatch(removeFromCart(id));
  const handleViewCart = () => {
    setShowCartDropdown(false);
    navigate("/cart");
  };

  const handleUserClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };
  const handleUser = () => {
    setShowUserDropdown(false);
    navigate("/profile");
  };
  const handleLogout = () => {
    dispatch(clearCurrentUser());
    setShowUserDropdown(false);
    navigate("/login");
  };
  const handleLogin = () => {
    dispatch(clearCurrentUser());
    setShowUserDropdown(false);
    navigate("/login");
  };
  const handleRegister = () => {
    dispatch(clearCurrentUser());
    setShowUserDropdown(false);
    navigate("/register");
  };

  const handleMyOrders = () => {
    setShowUserDropdown(false);
    navigate("/orders");
  };
  const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const totalPrice = cart.reduce(
    (sum, i) => sum + (i.variantId?.price || 0) * (i.quantity || 0),
    0
  );

  return (
    <header className="header">
      <a href="/home" className="logo">
        <div className="logo-container">
          <div className="logo-page">
            <img src="/public/logo.jpg" alt="Logo" />
          </div>
        </div>
      </a>

      <div className="search-bars" ref={searchRef}>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm, danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="fa fa-search search-icons"></i>

        {showSearchDropdown && searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="search-result-item"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.slug}`);
                }}
              >
                <img
                  src={`${BASE_URL}${
                    product.variants?.[0]?.image
                  }`}
                  alt={product.name}
                />
                <span>{product.name}</span>
              </div>
            ))}
          </div>
        )}

        {showSearchDropdown && searchResults.length === 0 && (
          <div className="search-dropdown empty">
            <p>Không tìm thấy sản phẩm</p>
          </div>
        )}
      </div>

      <div className="header-right">
        <div className="consult">
          <i className="fa fa-headset"></i>
          <div className="consult-text">
            <span>Tư vấn mua hàng</span>
            <b>0387.873.303</b>
          </div>
        </div>

        {/* Nhóm icon cửa hàng + giỏ hàng */}
        <div className="icon-group">
          <div className="icon" onClick={() => navigate("/products")}>
            <i className="fa fa-store"></i>
          </div>

          <div className="icon cart-icon-wrapper" ref={dropdownRef}>
            <div onClick={handleCartClick} style={{ cursor: "pointer" }}>
              <i className="fa fa-shopping-bag"></i>
              {totalItems > 0 && <span className="badges">{totalItems}</span>}
            </div>

            {/* Dropdown giỏ hàng giữ nguyên */}
            {showCartDropdown && (
              <div className="cart-dropdown">
                <div className="cart-dropdown-header">
                  <h3>Giỏ hàng của bạn</h3>
                  <span className="cart-count">{totalItems} sản phẩm</span>
                </div>

                {cart.length === 0 ? (
                  <div className="cart-empty">
                    <i className="fa fa-shopping-bag empty-icon"></i>
                    <p>Giỏ hàng trống</p>
                  </div>
                ) : (
                  <>
                    <div className="cart-dropdown-items">
                      {cart.map((item) => (
                        <div key={item._id} className="cart-dropdown-item">
                          <img
                            src={`${BASE_URL}${item.variantId?.image}`}
                            alt={item.variantId?.productId?.name}
                          />
                          <div className="item-info">
                            <p className="item-name">
                              {item.variantId?.productId?.name}
                            </p>
                            <div className="item-price-qty">
                              <span className="qty">{item.quantity} x</span>
                              <span className="price">
                                {item.variantId?.price?.toLocaleString("vi-VN")}
                                ₫
                              </span>
                            </div>
                          </div>
                          <div className="item-actions">
                            <div className="item-subtotal">
                              {(
                                (item.variantId?.price || 0) *
                                (item.quantity || 0)
                              ).toLocaleString("vi-VN")}
                              ₫
                            </div>
                            <button
                              className="remove-item-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveItem(item._id);
                              }}
                              title="Xóa sản phẩm"
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cart-dropdown-footer">
                      <div className="total-row">
                        <span>Tổng cộng:</span>
                        <span className="total-price">
                          {totalPrice.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <button
                        className="view-cart-btn"
                        onClick={handleViewCart}
                      >
                        Xem giỏ hàng
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Icon người dùng */}
        <div className="user-menu" ref={userMenuRef}>
          <div className="user-icon" onClick={handleUserClick}>
            <i className="fa fa-user"></i>
          </div>
          <span className="username">
            {currentUser && currentUser.userId ? currentUser.fullname : " "}
          </span>

          {currentUser && currentUser.userId
            ? showUserDropdown && (
                <div className="user-dropdown">
                  <button onClick={handleUser}>Hồ sơ người dùng</button>
                  <button onClick={handleMyOrders}>Đơn hàng của tôi</button>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              )
            : showUserDropdown && (
                <div className="user-dropdown">
                  <button onClick={handleLogin}>Đăng nhập</button>
                  <button onClick={handleRegister}>Đăng ký</button>
                </div>
              )}
        </div>
      </div>
    </header>
  );
};

export default Header;
