import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer class="footer">
      <div class="container grid">
        <div class="footer-box">
          <img src="./public/logo.jpg" alt="" />
          <h3>GIỚI THIỆU</h3>
          <p>
            Shop thời trang thể thao, cam kết mang đến những sản phẩm "Đẹp -
            Chất - Giá hợp lý". Với chính sách bán hàng lấy khách hàng làm trung
            tâm, uy tín là tôn chỉ hoạt động của shop. Hy vọng khách hàng sẽ cảm
            thấy hài lòng và có những trải nghiệm tốt nhất!
          </p>
        </div>

        <div class="footer-box">
          <h3>HỖ TRỢ KHÁCH HÀNG</h3>
          <ul>
            <li>
              <a href="#">Trang chủ</a>
            </li>
            <li>
              <a href="#">Cửa hàng</a>
            </li>
            <li>
              <a href="#">Tin tức</a>
            </li>
            <li>
              <a href="#">Giới thiệu</a>
            </li>
            <li>
              <a href="#">Liên hệ</a>
            </li>
          </ul>
        </div>

        <div class="footer-box">
          <h3>Liên Kết Xã Hội</h3>
          <div class="footer-icon">
            <div class="icon">
              <i class="fa-brands fa-facebook"></i>
            </div>
            <div class="icon">
              <i class="fa-brands fa-tiktok"></i>
            </div>
            <div class="icon">
              <i class="fa-brands fa-instagram"></i>
            </div>
            <div class="icon">
              <i class="fa-brands fa-youtube"></i>
            </div>
          </div>
          <div class="more">
            <a href="https://zalo.me/0387873303" class="btn-zalo">
              <i class="fa fa-comment-dots"></i>
              CHAT ZALO
            </a>

            <div class="phone">
              <i class="fa fa-phone"></i>
              <span>0387873303</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
