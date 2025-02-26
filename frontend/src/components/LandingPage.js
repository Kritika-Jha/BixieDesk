import React from "react";
import "../styles/landingPage.css";
import heroVideo from "../assets/videos/bgVid.mp4";
import aboutImage from "../assets/images/img2.jpg";
import feature1 from "../assets/images/img3.jpg";
import feature2 from "../assets/images/img4.png";
import feature3 from "../assets/images/img.jpeg";

const LandingPage = () => {
    return (
      <div className="landing-container">
        
        <section className="hero">
          <video autoPlay loop muted className="hero-video">
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="hero-content">
          <h1>Welcome to BixieDesk</h1>
            <h2>Revolutionizing Sales Management</h2>
            <p>AI-driven insights for a smarter business world.</p>
          </div>
        </section>

        
        <section className="about">
          <div className="about-text">
            <h2>About BixieDesk</h2>
            <p>
            BixieDesk is an AI-powered enterprise assistant designed to automate business operations, streamline database queries, predict sales trends, and enhance financial processing. It integrates a chatbot that interacts with MySQL databases, allowing users to extract and update records effortlessly. Additionally, it incorporates machine learning for sales forecasting and OCR-based invoice processing to minimize manual effort and improve accuracy.

With BixieDesk, businesses can optimize workflows, reduce errors, and gain real-time insights into financial data, enabling smarter decision-making and increased efficiency.
            </p>
          </div>
          <div className="about-image">
            <img src={aboutImage} alt="About Us" />
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
  <h2 className="features-heading">Features</h2>

  <div className="feature">
    <div className="feature-image">
      <img src={feature2} alt="Ask Bixie" />
    </div>
    <div className="feature-text">
      <h2>Ask Bixie</h2>
      <p>Transform the way you interact with data. Instead of manually writing SQL queries, simply ask Bixie in natural language. Get instant insights, fetch reports, and update records—all without touching a single line of code.</p>
    </div>
  </div>

  <div className="feature">
    <div className="feature-image">
      <img src={feature1} alt="Predict IT" />
    </div>
    <div className="feature-text">
      <h2>Predict IT</h2>
      <p>Unlock the power of data-driven decision-making. Bixie’s AI-powered analytics predict future sales trends based on historical data, allowing businesses to optimize inventory, forecast revenue, and stay ahead of market shifts.</p>
    </div>
  </div>

  
  <div className="feature">
    <div className="feature-image">
      <img src={feature3} alt="Real-Time Analytics" />
    </div>
    <div className="feature-text">
      <h2>Real-Time Analytics</h2>
      <p>Gain instant visibility into key business metrics. Track sales performance, customer trends, and financial data through interactive dashboards and AI-powered insights—ensuring smarter, data-backed decisions.</p>
    </div>
  </div>

  <div className="feature">
    <div className="feature-image">
      <img src={feature3} alt="Automated Invoice Processing" />
    </div>
    <div className="feature-text">
      <h2>Automated Invoice Processing</h2>
      <p>Eliminate manual invoice entry and reduce errors. Bixie’s OCR technology extracts key details from invoices, updates your database automatically, and generates structured invoices—ensuring seamless financial management.</p>
    </div>
  </div>

  <div className="feature">
    <div className="feature-image">
      <img src={feature3} alt="Intelligent Data Management" />
    </div>
    <div className="feature-text">
      <h2>Intelligent Data Management</h2>
      <p>Handle large-scale enterprise data with precision. From cleaning and organizing datasets to identifying trends, Bixie ensures structured, secure, and insightful data management for improved business efficiency.</p>
    </div>
  </div>

</section>

      </div>
      
    );
};

export default LandingPage;
