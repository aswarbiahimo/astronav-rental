import React from "react";
import { motion } from "framer-motion";
import { Wrench, Users, History, Award } from "lucide-react";
import "../styles/About.css";

const About = () => {
  return (
    // ID "about" penting untuk Navbar Link
    <section id="about" className="about-section">
      <div className="about-container">
        {/* KOLOM KIRI: GAMBAR */}
        <motion.div
          className="about-image-wrapper"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"
            alt="Mekanik Motor Profesional"
            className="about-img"
          />

          {/* Badge Melayang */}
          <motion.div
            className="experience-badge"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="badge-number">5+</span>
            <div className="badge-text">
              <span>Tahun</span>
              Pengalaman
            </div>
          </motion.div>
        </motion.div>

        {/* KOLOM KANAN: TEKS */}
        <motion.div
          className="about-content"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="about-subtitle">TENTANG KAMI</span>
          <h2 className="about-title">
            Mitra Perjalanan Terbaik <br /> di Kota Ini
          </h2>
          <p className="about-description">
            AstroNav dimulai pada tahun 2020 dengan satu misi sederhana:
            memberikan kebebasan eksplorasi bagi para pelancong. Kami bukan
            sekadar rental motor, kami adalah teman perjalanan Anda yang
            memastikan keamanan dan kenyamanan di setiap kilometer.
          </p>

          <div className="about-features">
            <div className="about-feature-item">
              <div className="feature-icon-box">
                <Wrench size={20} />
              </div>
              <span>Mekanik Bersertifikat</span>
            </div>
            <div className="about-feature-item">
              <div className="feature-icon-box">
                <Users size={20} />
              </div>
              <span>10.000+ Klien Happy</span>
            </div>
            <div className="about-feature-item">
              <div className="feature-icon-box">
                <History size={20} />
              </div>
              <span>Layanan 24 Jam</span>
            </div>
            <div className="about-feature-item">
              <div className="feature-icon-box">
                <Award size={20} />
              </div>
              <span>Unit Tahun Muda</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
