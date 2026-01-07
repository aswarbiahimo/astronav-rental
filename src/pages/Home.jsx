import { Link } from "react-router-dom"; // 1. Pastikan import ini ada!
import { motion } from "framer-motion";
import { Bike, Calendar, ShieldCheck } from "lucide-react"; // Ikon tambahan
import Navbar from "../components/Navbar"; // Import Navbar yang sudah dibuat sebelumnya
import Features from "../components/Features"; // Import features yang sudah dibuat sebelumnya
import Pricing from "../components/Pricing"; // Import pricing yang sudah dibuat sebelumnya
import About from "../components/About"; // Import about yang sudah dibuat sebelumnya
import Contact from "../components/Contact"; // Import contact yang sudah dibuat sebelumnya
import Footer from "../components/Footer"; // Import footer yang sudah dibuat sebelumnya
import "../styles/Home.css"; // Import CSS Home

import motorImg from "../assets/motor.png";

const Home = () => {
  return (
    <div className="page-wrapper">
      {/* 1. Navbar dipasang di paling atas */}
      <Navbar />

      {/* 2. Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-overlay"></div>

        <div className="hero-container">
          {/* KIRI: Teks & CTA */}
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">🚀 #1 Rental Motor Terpercaya</span>

            <h1 className="hero-title">
              Jelajahi Kota <br />
              Tanpa <span className="hero-highlight">Batas.</span>
            </h1>

            <p className="hero-description">
              Sewa motor matic & sport terbaru dengan harga terjangkau. Proses
              cepat, syarat mudah, dan helm gratis. Siap antar ke lokasi Anda.
            </p>

            <div className="hero-buttons">
              <a href="#pricing" className="btn-primary">
                Pesan Sekarang
              </a>
              <Link to="/armada" className="btn-secondary">
                Lihat Armada
              </Link>
            </div>

            {/* BAGIAN YANG DIPERBAIKI: Stats Kecil */}
            <div className="hero-stats">
              <div className="stat-item">
                <ShieldCheck className="stat-icon" />
                <div className="stat-info">
                  <p className="stat-bold">Asuransi</p>
                  <p className="stat-light">Termasuk</p>
                </div>
              </div>
              <div className="stat-item">
                <Bike className="stat-icon" />
                <div className="stat-info">
                  <p className="stat-bold">50+ Unit</p>
                  <p className="stat-light">Ready Stock</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KANAN: Gambar Motor */}
          <motion.div
            className="hero-image-wrapper"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Gunakan variabel import tadi di sini */}
            <img
              src={motorImg}
              alt="Motor Sport Keren"
              className="hero-bike-img"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section - Dipasang disini */}
      <Features />

      {/* Pricing Section - Dipasang disini */}
      <Pricing />

      {/* About Section - Dipasang disini */}
      <About />

      {/* Contact Section - Dipasang disini */}
      <Contact />

      {/* Footer Section - Dipasang disini */}
      <Footer />
    </div>
  );
};

export default Home;
