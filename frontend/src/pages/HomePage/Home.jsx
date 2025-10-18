import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Slider from "../../components/Slider";
import CategorySection from "../../components/CategorySection";
import ProductSection from "../../components/ProductSection";
import Banner from "../../components/Banner";
import "../../styles/Home.css";
import ContactSection from "../../components/ContactSection";

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      
      <CategorySection />

      <Slider />

      <ProductSection />

      <Banner />

      <ContactSection />

      <Footer />
    </div>
  );
};

export default Home;
