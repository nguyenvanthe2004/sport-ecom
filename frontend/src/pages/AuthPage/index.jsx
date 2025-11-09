import React, { useState } from "react";
import Login from "../../components/Login";
import Register from "../../components/Register";
import "../styles/AuthPage.css";

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

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
                Bạn chưa có tài khoản?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLogin(false);
                  }}
                  className="link-a"
                >
                  Đăng ký!
                </a>
              </p>
            ) : (
              <p>
                Bạn đã có tài khoản?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLogin(true);
                  }}
                  className="link-a"
                >
                  Đăng nhập!
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
