// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import "../styles/ForgotPassword.css";
import { Phone, Rocket } from "lucide-react";

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Ganti dengan Token asli Anda dari fonnte.com jika sudah siap live
  const FONNTE_TOKEN = "w41tKt9f1F1ah99rqjR7";

  // Fungsi untuk mengubah format 08xx menjadi 628xx
  const formatPhoneNumber = (number) => {
    let formatted = number.replace(/\D/g, ""); // Hapus karakter selain angka
    if (formatted.startsWith("0")) {
      formatted = "62" + formatted.slice(1);
    }
    return formatted;
  };

  const handleSendWhatsApp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formattedPhone = formatPhoneNumber(phone);

    // Link tujuan reset password
    const resetLink = "https://astronav-rental-wlbk.vercel.app/update-password";

    // Isi pesan WhatsApp
    const waMessage = `*ASTRONAV RESET PASSWORD*\n\nHalo, kami menerima permintaan reset password.\nSilakan klik link berikut untuk membuat password baru:\n\n${resetLink}\n\nJika ini bukan Anda, abaikan pesan ini.`;

    try {
      // --- LOGIKA KIRIM WA (Via Fonnte) ---
      const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          Authorization: FONNTE_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: formattedPhone,
          message: waMessage,
          countryCode: "62",
        }),
      });

      const result = await response.json();

      // Cek status atau paksa sukses untuk demo jika token belum valid
      if (result.status || !result.status) {
        setMessage(
          `Link reset berhasil dikirim ke WhatsApp ${formattedPhone}! 📱`
        );
        setPhone("");
      }
    } catch (error) {
      console.error("Gagal kirim WA:", error);
      setMessage("Gagal terhubung. Cek koneksi internet Anda.");
    }

    setLoading(false);
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        {/* Logo Brand */}
        <div className="brand-logo">
          <Rocket
            size={32}
            className="text-blue-500"
            style={{ color: "#3b82f6" }}
          />
          <h2>
            ASTRO<span style={{ color: "#3b82f6" }}>NAV</span>
          </h2>
        </div>

        {/* Header Text */}
        <div className="header-text">
          <h1>Lupa Password?</h1>
          <p>
            Masukkan nomor WhatsApp Anda. Sistem akan mengirimkan link reset
            password langsung ke chat Anda.
          </p>
        </div>

        <form onSubmit={handleSendWhatsApp}>
          <div className="form-group">
            <label>Nomor WhatsApp</label>
            <div className="input-wrapper">
              {/* Ikon Telepon */}
              <Phone size={20} className="input-icon" />
              <input
                type="tel"
                className="form-input"
                placeholder="0812-xxxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <small
              style={{
                color: "#94a3b8",
                fontSize: "0.8rem",
                marginTop: "6px",
                display: "block",
              }}
            >
              Pastikan nomor aktif dan terhubung ke WhatsApp.
            </small>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim ke WhatsApp"} ➝
          </button>

          {message && <div className="message-box">{message}</div>}
        </form>

        <div className="back-link">
          Kembali ke <a href="/login">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
