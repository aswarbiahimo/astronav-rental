import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import "../styles/Pricing.css";

const pricingPlans = [
  {
    id: 1,
    name: "Harian",
    price: "75k",
    period: "/hari",
    features: [
      "Motor Matic 110cc",
      "2 Helm SNI",
      "Jas Hujan",
      "Support 24 Jam",
      "Asuransi Standar",
    ],
    isPopular: false,
  },
  {
    id: 2,
    name: "Mingguan",
    price: "800k",
    period: "/minggu",
    features: [
      "Motor Matic 125cc / 150cc",
      "2 Helm SNI Bersih",
      "Jas Hujan Premium",
      "Antar Jemput Gratis",
      "Support 24 Jam",
      "Asuransi Full Cover",
    ],
    isPopular: true, // Ini yang akan ditonjolkan
  },
  {
    id: 3,
    name: "Sport / Moge",
    price: "350k",
    period: "/hari",
    features: [
      "Motor Sport 250cc+",
      "Helm Full Face",
      "Gloves & Jacket",
      "Action Camera (GoPro)",
      "Asuransi Premium",
    ],
    isPopular: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate(); // 2. Inisialisasi hook

  const handleSelectPackage = (plan) => {
    // 3. Pindah ke halaman armada sambil bawa data 'plan' (state)
    navigate("/armada", { state: { selectedPlan: plan } });
  };

  return (
    // ID "pricing" agar tombol Navbar berfungsi scroll kesini
    <section id="pricing" className="pricing-section">
      <div className="pricing-header">
        <motion.span
          className="pricing-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          BEST PRICE
        </motion.span>
        <motion.h2
          className="pricing-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Pilih Paket Sesuai <br /> Kebutuhan Anda
        </motion.h2>
      </div>

      <div className="pricing-grid">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            className={`pricing-card ${plan.isPopular ? "popular" : ""}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            {plan.isPopular && (
              <div className="popular-badge">Paling Laris</div>
            )}

            <h3 className="plan-name">{plan.name}</h3>
            <div className="plan-price">
              {plan.price} <span className="plan-period">{plan.period}</span>
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="feature-item">
                  <Check size={18} className="check-icon" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className="btn-pricing"
              onClick={() => handleSelectPackage(plan)}
            >
              Pilih Paket
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
