import React from "react";
import "../styles/ContactSection.css";

const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2>LIÊN HỆ VỚI CHÚNG TÔI</h2>
        <p>
          Để lại thông tin của bạn, chúng tôi sẽ liên hệ trong thời gian sớm nhất.
        </p>

        <div className="contact-content">
          {/* Form bên trái */}
          <form className="contact-form">
            <input type="text" placeholder="Họ và tên" required />
            <input type="email" placeholder="Email của bạn" required />
            <textarea placeholder="Nội dung liên hệ" required></textarea>
            <button type="submit">Gửi ngay</button>
          </form>

          {/* Thông tin bên phải */}
          <div className="contact-info">
            <div>
              <h4>Địa chỉ</h4>
              <p>Ngã 3 Lãm Trại, Nam Sơn, TP. Bắc Ninh</p>
            </div>
            <div>
              <h4>Điện thoại</h4>
              <p>Hotline: 0387873303</p>
            </div>
            <div>
              <h4>Email</h4>
              <p>support@thenguyensport.vn</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
