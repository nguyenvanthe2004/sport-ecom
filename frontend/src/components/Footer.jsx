import React from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import "../styles/Footer.css";
import { FRONTEND_URL } from "../constants";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Column 1: About */}
          <div className="footer-column">
            <div className="footer-logo">
              <img src={`${FRONTEND_URL}logo.jpg`} alt="Logo" />
            </div>
            <h3 className="footer-title">Sportweb-yksu.onrender.com</h3>
            <p className="footer-description">
              Shop thời trang thể thao uy tín, chuyên cung cấp các sản phẩm chất
              lượng cao với giá cả hợp lý. Cam kết mang đến trải nghiệm mua sắm
              tốt nhất cho khách hàng.
            </p>
            <div className="footer-social">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link tiktok"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link youtube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h3 className="footer-title">LIÊN KẾT NHANH</h3>
            <ul className="footer-links">
              <li>
                <a href="/">Trang chủ</a>
              </li>
              <li>
                <a href="/products">Sản phẩm</a>
              </li>
              <li><a href="/" >Danh mục</a></li>
              <li><a href="/" >Tin tức</a></li>
              <li><a href="/" >Giới thiệu</a></li>
              <li><a href="/" >Liên hệ</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="footer-column">
            <h3 className="footer-title">CHÍNH SÁCH</h3>
            <ul className="footer-links">
              <li>Chính sách giao hàng</li>
              <li>Chính sách đổi trả</li>
              <li>Phương thức thanh toán</li>
              <li>Chính sách bảo hành</li>
              <li>Chính sách bảo mật</li>
              <li>Điều khoản sử dụng</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-column">
            <h3 className="footer-title">THÔNG TIN LIÊN HỆ</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <MapPin size={18} className="contact-icon" />
                <div>
                  <strong>Địa chỉ:</strong>
                  <p>Ngã 3 Lãm Trại, Nam Sơn, TP. Bắc Ninh</p>
                </div>
              </div>
              <div className="contact-item">
                <Phone size={18} className="contact-icon" />
                <div>
                  <strong>Hotline:</strong>
                  <p>
                    <a href="tel:0387873303">0387.873.303</a>
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={18} className="contact-icon" />
                <div>
                  <strong>Email:</strong>
                  <p>
                    <a href="mailto:support@webthethao.vn">
                      support@webthethao.vn
                    </a>
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <Clock size={18} className="contact-icon" />
                <div>
                  <strong>Giờ làm việc:</strong>
                  <p>8:00 - 22:00 (Hàng ngày)</p>
                </div>
              </div>
            </div>

            {/* Zalo Button */}
            <a
              href="https://zalo.me/0387873303"
              target="_blank"
              rel="noopener noreferrer"
              className="zalo-button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
              <span>Chat với Zalo</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; 2025 Sportweb-yksu.onrender.com - Bản quyền thuộc về Sportweb</p>
          <p className="footer-credit">
            Thiết kế bởi <span>Sportweb Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
