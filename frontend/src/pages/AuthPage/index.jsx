import React, { useEffect, useState } from "react";
import Login from "../../components/Login";
import Register from "../../components/Register";
import "../../styles/Auth.css";
import { Link, useLocation } from "react-router-dom";
const AuthPage = () => {
  let location = useLocation();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    setShowLogin(location.pathname === "/login");
  }, [location.pathname]);

  return (
    <div className="auth-page">
      {/* bên trái ảnh */}
      <div className="auth-left">
        <img src="layout.png" alt="auth banner" />
      </div>

      {/* bên phải form */}
      <div className="auth-right">
        <div className="auth-card">
          {showLogin ? <Login /> : <Register />}

          <div className="auth-toggle-text">
            {showLogin ? (
              <p>
                Bạn chưa có tài khoản? <Link to="/register" className="link-a">Đăng ký!</Link>
              </p>
            ) : (
              <p>
                Bạn đã có tài khoản? <Link to="/login" className="link-a">Đăng nhập!</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
