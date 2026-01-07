import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Smartphone,
  User,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import "../styles/PaymentPage.css";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bike, plan } = state || {};

  // State Data Pemesan
  const [formData, setFormData] = useState({
    fullName: "",
    whatsapp: "",
    email: "",
  });

  const [activeSection, setActiveSection] = useState("va");
  const [selectedBank, setSelectedBank] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  useEffect(() => {
    if (!state) navigate("/armada");
    window.scrollTo(0, 0);
  }, [state, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePay = async () => {
    // 1. Validasi
    if (!formData.fullName || !formData.whatsapp || !formData.email) {
      alert("Lengkapi data pemesan!");
      return;
    }
    if (!selectedBank) {
      alert("Pilih metode pembayaran!");
      return;
    }

    setPaymentStatus("processing");

    try {
      // 2. Insert ke Supabase
      const { error } = await supabase.from("orders").insert([
        {
          customer_name: formData.fullName,
          customer_wa: formData.whatsapp,
          bike_name: bike.name,
          plan_name: plan.name,
          total_price: plan.price,
          status: "pending",
          start_date: new Date(),
        },
      ]);

      if (error) throw error;

      // 3. Kirim WA Otomatis (User menerima notif Order)
      const messageToUser = `*ASTRO-NAV RENTAL* 🚀
_Pesanan Baru Diterima_

Halo Kak *${formData.fullName}*,
Terima kasih sudah melakukan pemesanan! Order kakak sedang kami verifikasi.

--------------------------------
🧾 *RINGKASAN ORDER*
--------------------------------
🏍️ Motor   : ${bike.name}
📅 Durasi  : 1 Hari (${plan.name})
💵 Tagihan : *${plan.price}*
--------------------------------

Mohon tunggu notifikasi selanjutnya dari Admin ya! ⏳`;

      // Request ke Fonnte
      await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          Authorization: "w41tKt9f1F1ah99rqjR7", // <--- GANTI TOKEN DI SINI
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: formData.whatsapp,
          message: messageToUser,
          countryCode: "62",
        }),
      });

      // 4. Sukses
      setTimeout(() => setPaymentStatus("success"), 1000);
    } catch (err) {
      alert("Gagal memproses: " + err.message);
      setPaymentStatus("pending");
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className="payment-success-overlay">
        <div className="success-modal">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
          <h2>Pesanan Berhasil!</h2>
          <p>
            Terima kasih, <strong>{formData.fullName}</strong>.
          </p>
          <p>Notifikasi WhatsApp telah dikirim ke nomor Anda.</p>
          <button onClick={() => navigate("/")} className="btn-finish">
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  if (!bike || !plan) return null;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button onClick={() => navigate(-1)} className="back-link">
            <ChevronLeft size={20} /> Kembali
          </button>
          <h1>Checkout & Pembayaran</h1>
        </div>
        <div className="checkout-grid">
          {/* Form Kiri */}
          <div className="left-column">
            <div className="section-card">
              <h3 className="section-title">
                <User size={20} /> Data Pemesan
              </h3>
              <div className="form-grid">
                <div className="input-group">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Budi Santoso"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>WhatsApp</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="0812..."
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group full">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@contoh.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            {/* Metode Bayar */}
            <div className="section-card">
              <h3 className="section-title">
                <CreditCard size={20} /> Metode Pembayaran
              </h3>
              <div
                className={`payment-accordion ${
                  activeSection === "va" ? "open" : ""
                }`}
              >
                <div
                  className="accordion-header"
                  onClick={() => setActiveSection("va")}
                >
                  <div className="flex items-center gap-3">
                    <span>Virtual Account</span>
                  </div>
                  {activeSection === "va" ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
                {activeSection === "va" && (
                  <div className="accordion-body">
                    {["BCA", "Mandiri", "BNI", "BRI"].map((bank) => (
                      <div
                        key={bank}
                        className={`payment-option ${
                          selectedBank === bank ? "selected" : ""
                        }`}
                        onClick={() => setSelectedBank(bank)}
                      >
                        <span>{bank} Virtual Account</span>
                        <div className="radio-outer">
                          {selectedBank === bank && (
                            <div className="radio-inner"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Kanan Ringkasan */}
          <div className="right-column">
            <div className="summary-card sticky-card">
              <h3>Ringkasan Pesanan</h3>
              <div className="bike-preview">
                <img src={bike.image} alt={bike.name} />
                <div>
                  <h4>{bike.name}</h4>
                  <p>{bike.type}</p>
                </div>
              </div>
              <div className="price-breakdown">
                <div className="row">
                  <span>Paket</span>
                  <span>{plan.name}</span>
                </div>
                <div className="row total">
                  <span>Total</span>
                  <span className="total-price">{plan.price}</span>
                </div>
              </div>
              <button
                className="btn-pay-now"
                onClick={handlePay}
                disabled={paymentStatus === "processing"}
              >
                {paymentStatus === "processing"
                  ? "Memproses..."
                  : "Bayar Sekarang"}
              </button>
              <div className="secure-info">
                <ShieldCheck size={16} /> Transaksi Aman 100%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
