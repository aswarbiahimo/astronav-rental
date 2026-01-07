import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import "../styles/Contact.css";

const Contact = () => {
  return (
    // ID "contact" ini WAJIB sama dengan href di Navbar (#contact)
    <section id="contact" className="contact-section">
      <motion.div
        className="contact-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Kolom Kiri: Informasi */}
        <div className="contact-info">
          <h2>Hubungi Kami</h2>
          <p className="contact-desc">
            Siap untuk petualangan berikutnya? Jika Anda memiliki pertanyaan
            tentang unit atau ketersediaan, jangan ragu untuk bertanya.
          </p>

          <div className="info-item">
            <div className="icon-box">
              <MapPin size={24} />
            </div>
            <span>Jl. Prof. Dr. H. Mansoer Pateda</span>
          </div>
          <div className="info-item">
            <div className="icon-box">
              <Phone size={24} />
            </div>
            <span>+62 897-1515-902</span>
          </div>
          <div className="info-item">
            <div className="icon-box">
              <Mail size={24} />
            </div>
            <span>rent@astronav.com</span>
          </div>
        </div>

        {/* Kolom Kanan: Form */}
        <form className="contact-form">
          <div className="form-group">
            <input type="text" placeholder="Nama Lengkap" />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Alamat Email" />
          </div>
          <div className="form-group">
            <textarea placeholder="Pesan atau Pertanyaan Anda..."></textarea>
          </div>
          <button
            type="button"
            className="btn-submit flex items-center justify-center gap-2"
          >
            Kirim Pesan <Send size={18} />
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Contact;
