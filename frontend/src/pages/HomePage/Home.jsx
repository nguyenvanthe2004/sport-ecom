import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  return (
    <div>
      <Header />
      <h1>Welcome to the {currentUser.email}</h1>
      <button onClick={handleSubmit}>Login</button>
      <Footer />
    </div>
  );
};

export default Home;
