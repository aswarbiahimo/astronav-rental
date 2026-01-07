import React from "react";
import {
  Rocket,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
} from "lucide-react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Bagian Atas: Grid 4 Kolom */}
        <div className="footer-content">
          {/* Kolom 1: Brand */}
          <div className="footer-brand">
            <h3>
              <Rocket className="text-blue-500" />
              ASTRO<span className="text-blue-500">NAV</span>
            </h3>
            <p className="footer-desc">
              Penyedia layanan sewa motor terbaik untuk menemani petualangan
              Anda menjelajahi keindahan kota. Aman, Cepat, dan Terpercaya.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-icon">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-icon">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-icon">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Kolom 2: Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Newsletter */}
          <div className="footer-col">
            <h4>Stay Updated</h4>
            <p className="text-sm mb-4">
              Dapatkan info promo terbaru langsung ke inbox Anda.
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Email Anda"
                className="newsletter-input"
              />
              <button
                type="button"
                className="btn-primary flex justify-center items-center gap-2"
              >
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bagian Bawah: Copyright */}
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} AstroNav Rental. All rights
            reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
