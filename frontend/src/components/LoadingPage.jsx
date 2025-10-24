// LoadingPage.jsx
import React from "react";
import { Loader2 } from "lucide-react";
import "../styles/LoadingPage.css";

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        {/* Main Spinner */}
        <div className="spinners-wrapper">
          <Loader2 className="spinners" size={48} />
        </div>

        {/* Text */}
        <h2 className="loading-title">Đang tải dữ liệu</h2>
        <p className="loading-subtitle">Vui lòng chờ trong giây lát...</p>

        {/* Progress Dots */}
        <div className="dots-wrapper">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;