import React from "react";
import "../styles/Banner.css";

const Banner = () => {
  return (
    <section className="banner-section">
      <div className="banner-main">
        {/* Ảnh banner lớn */}
        <img
          src="/public/banner_1.jpg"
          alt="Banner thể thao"
          className="banner-main-image"
        />

        {/* Phần giới thiệu */}
        <div className="banner-intro">
          <h2>Thể thao – Sức mạnh của tinh thần & thể chất</h2>
          <p>
            Thể thao không chỉ giúp rèn luyện sức khỏe mà còn kết nối con người,
            mang đến năng lượng và khát vọng chinh phục trong cuộc sống.
          </p>
        </div>

        {/* Dự án nổi bật */}
        <div className="banner-projects">
          <div className="project-item">
            <img src="/public/duan_1.avif" alt="Bóng đá" />
            <div className="project-text">Trang phục bóng đá chuyên nghiệp</div>
          </div>

          <div className="project-item">
            <img src="/public/duan_2.jfif" alt="Bóng chuyền" />
            <div className="project-text">Giải bóng chuyền quốc gia</div>
          </div>

          <div className="project-item">
            <img src="/public/duan_3.jpg" alt="Học sinh thể thao" />
            <div className="project-text">Đồng phục thể thao học đường</div>
          </div>

          <div className="project-item">
            <img src="/public/duan_4.webp" alt="Cầu lông" />
            <div className="project-text">Giải Cầu lông phong trào</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
