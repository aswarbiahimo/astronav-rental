import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, MapPin, BadgePercent } from "lucide-react";
import "../styles/Features.css"; // Pastikan path import benar!

const featuresData = [
  {
    id: 1,
    icon: <Zap size={28} />,
    title: "Proses Cepat",
    description:
      "Booking kurang dari 5 menit. Cukup KTP dan SIM, motor langsung bisa dibawa jalan.",
  },
  {
    id: 2,
    icon: <ShieldCheck size={28} />,
    title: "Aman & Terawat",
    description:
      "Semua unit rutin diservis di bengkel resmi. Gratis helm SNI bersih & jas hujan.",
  },
  {
    id: 3,
    icon: <MapPin size={28} />,
    title: "Antar Jemput",
    description:
      "Mager ambil unit? Kami antar motor ke hotel, stasiun, atau lokasi Anda gratis.",
  },
  {
    id: 4,
    icon: <BadgePercent size={28} />,
    title: "Harga Jujur",
    description:
      "Transparan tanpa biaya tersembunyi. Sewa makin lama, harga makin murah.",
  },
];

const Features = () => {
  return (
    <section id="features" className="features-section">
      {/* Header Section */}
      <div className="features-header">
        <motion.span
          className="features-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          WHY CHOOSE US
        </motion.span>
        <motion.h2
          className="features-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Pengalaman Sewa Motor <br /> Tanpa Ribet
        </motion.h2>
      </div>

      {/* Grid Kartu */}
      <div className="features-grid">
        {featuresData.map((item, index) => (
          <motion.div
            key={item.id}
            className="feature-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="feature-icon-wrapper">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
