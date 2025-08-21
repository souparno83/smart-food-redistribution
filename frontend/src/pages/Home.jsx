import React from "react";
import AnimatedPage from "../components/AnimatedPage";
import "./Home.css";

const Home = () => {
  return (
    <AnimatedPage>
      <div className="hero-section d-flex align-items-center justify-content-center text-center text-white">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 className="display-4 fw-bold">Welcome to Smart Surplus Food Redistribution</h1>
          <p className="lead">Connecting donors with recipients to achieve zero food waste 🍲</p>
          <a href="/signup" className="btn btn-success btn-lg me-3">Get Started</a>
          <a href="/donor" className="btn btn-outline-light btn-lg">Donate Food</a>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Home;
