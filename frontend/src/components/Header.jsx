import React, { useState, useEffect, useRef } from 'react';
import "../styles/Header.css"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cart, setCart] = useState([]);
  const dropdownRef = useRef(null);
  
  // Load cart từ localStorage
  const loadCart = () => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  };

  useEffect(() => {
    loadCart();
    
    // Lắng nghe sự kiện cập nhật giỏ hàng
    const handleStorageChange = () => {
      loadCart();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCartDropdown(false);
      }
    };

    if (showCartDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCartDropdown]);
  
  const handleSubmit = () => {
    navigate("/login")
  };
  const handleClick = () => {
    navigate("/products")
  };
  
  const handleCartClick = () => {
    loadCart(); // Refresh cart khi mở dropdown
    setShowCartDropdown(!showCartDropdown);
  };

  const handleViewCart = () => {
    setShowCartDropdown(false);
    navigate("/cart");
  };

  const removeItem = (id) => {
    const filtered = cart.filter((item) => item._id !== id);
    setCart(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
    // Trigger event để các component khác cập nhật
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="header">
        <a href="/home" className="logo">
          <div className="logo-container">
            <div className="logo-page">
              <img src="/public/logo.jpg" alt="" />
            </div>
          </div>
        </a>

        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm sản phẩm, danh mục..." />
          <i className="fa fa-search search-icon"></i>
        </div>

        <div className="header-right">
          <div className="consult">
            <i className="fa fa-headset"></i>
            <div className="consult-text">
              <span>Tư vấn mua hàng</span>
              <b>0387.873.303</b>
            </div>
          </div>

          <div className="icons">
            <div className="user-info">
              <div className="user-icon" onClick={handleSubmit}>
                <i className="fa fa-user"></i>
              </div>
              <span className="username">{currentUser.fullname}</span>
            </div>

            <div className="icon-group">
              <div className="icon" onClick={handleClick}>
                <i className="fa fa-store"></i>
              </div>
              <div className="icon cart-icon-wrapper" ref={dropdownRef}>
                <div onClick={handleCartClick} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-shopping-bag"></i>
                  {totalItems > 0 && <span className="badge">{totalItems}</span>}
                </div>
                
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
                                src={item.image ? `http://localhost:8000/${item.image}` : "/no-image.jpg"}
                                alt={item.name}
                              />
                              <div className="item-info">
                                <p className="item-name">{item.name}</p>
                                <div className="item-price-qty">
                                  <span className="qty">{item.quantity} x</span>
                                  <span className="price">{item.price.toLocaleString("vi-VN")}₫</span>
                                </div>
                              </div>
                              <div className="item-actions">
                                <div className="item-subtotal">
                                  {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                </div>
                                <button 
                                  className="remove-item-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeItem(item._id);
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
                            <span className="total-price">{totalPrice.toLocaleString("vi-VN")}₫</span>
                          </div>
                          <button className="view-cart-btn" onClick={handleViewCart}>
                            Xem giỏ hàng
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;