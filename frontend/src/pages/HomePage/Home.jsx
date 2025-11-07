import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Slider from "../../components/Slider";
import CategorySection from "../../components/CategorySection";
import ProductSection from "../../components/ProductSection";
import Banner from "../../components/Banner";
import "../../styles/Home.css";
import ContactSection from "../../components/ContactSection";
import NewSection from "../../components/NewSection";
import MapLocation from "../../components/MapLocation";
import ListBrand from "../../components/ListBrand";

const Home = () => {
  return (
    <div className="home-container">
      <Header />

      <Slider />

      <ProductSection />

      <Banner />

      <MapLocation />

      <ContactSection />

      <NewSection />

      <ListBrand />

      <Footer />
    </div>
  );
};

export default Home;
