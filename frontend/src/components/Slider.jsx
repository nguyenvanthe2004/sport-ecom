import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/Slider.css"

const images = [
  "/public/slider_2.avif",
  "/public/slider_1.jpg",
  "/public/slider_3.webp",
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((prev) => (prev + 1) % images.length);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((prev) => (prev - 1 + images.length) % images.length);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const goToSlide = (index) => {
    if (!isAnimating && index !== current) {
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <>

      <section className="slider-section">
        {images.map((img, index) => (
          <div
            key={index}
            className={`slide ${index === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="slider-overlay">
              <h1>SPORTWEB</h1>
              <p>Thời trang & dụng cụ thể thao chính hãng</p>
              <button className="btn-primary">Mua ngay</button>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="slider-nav prev" onClick={prevSlide}>
          <ChevronLeft size={24} />
        </div>
        <div className="slider-nav next" onClick={nextSlide}>
          <ChevronRight size={24} />
        </div>

        {/* Dots */}
        <div className="slider-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === current ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="slider-progress">
          <div key={current} className="slider-progress-bar"></div>
        </div>
      </section>

      <div style={{ padding: '3rem 2rem', background: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '1rem' }}>
          Sản Phẩm Nổi Bật
        </h2>
        <p style={{ textAlign: 'center', color: '#666' }}>
          Khám phá các sản phẩm thể thao chất lượng cao
        </p>
      </div>
    </>
  );
};

export default Slider;