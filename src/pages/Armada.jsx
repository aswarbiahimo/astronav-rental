import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Search, X, Calendar, ChevronLeft } from "lucide-react"; // Hapus icon yang tidak terpakai
import "../styles/Armada.css";

const Armada = () => {
  const navigate = useNavigate();

  // State
  const [motors, setMotors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");

  // State Modal
  const [selectedBike, setSelectedBike] = useState(null);
  const [duration, setDuration] = useState(1);

  // 1. Fetch Data
  useEffect(() => {
    fetchMotors();
  }, []);

  const fetchMotors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("motors").select("*");
      if (error) throw error;
      setMotors(data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Helper Aman (Anti-Crash)
  const formatRupiah = (number) => {
    if (!number) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const getCleanPrice = (priceString) => {
    if (!priceString) return 0; // Kalau harga kosong, kembalikan 0 (JANGAN CRASH)
    // Ubah ke string dulu, baru replace
    return parseInt(String(priceString).replace(/[^0-9]/g, "")) || 0;
  };

  // 3. Logic Filter Aman
  const filteredMotors = motors.filter((motor) => {
    // Pastikan field tidak null sebelum dicek
    const type = motor.type || "";
    const name = motor.name || "";

    const matchCategory = activeCategory === "Semua" || type === activeCategory;
    const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  // 4. Modal Logic
  const openBookingModal = (motor) => {
    setSelectedBike(motor);
    setDuration(1);
  };

  const handleProceedToPay = () => {
    if (!selectedBike) return;

    const pricePerDay = getCleanPrice(selectedBike.price);
    const totalPrice = pricePerDay * duration;

    navigate("/payment", {
      state: {
        bike: selectedBike,
        plan: {
          name: `${duration} Hari`,
          price: formatRupiah(totalPrice),
          duration: duration,
          rawPrice: totalPrice,
        },
      },
    });
  };

  return (
    <div className="armada-page">
      <div className="armada-container">
        {/* TOMBOL KEMBALI */}
        <button className="btn-back-home" onClick={() => navigate("/")}>
          <ChevronLeft size={20} /> Kembali ke Home
        </button>

        {/* HEADER */}
        <div className="armada-header">
          <h1>Pilih Armada Kami</h1>
          <p>Temukan motor yang pas untuk gaya perjalananmu</p>

          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Cari nama motor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABS KATEGORI */}
        <div className="category-tabs">
          {["Semua", "Matic", "Sport", "Bebek"].map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LIST MOTOR */}
        {loading ? (
          <div
            style={{ textAlign: "center", color: "white", marginTop: "50px" }}
          >
            Loading data motor...
          </div>
        ) : (
          <div className="motor-grid">
            {filteredMotors.map((motor) => (
              <div className="motor-card" key={motor.id}>
                <div className="motor-image-wrapper">
                  {/* Fallback jika gambar rusak/kosong */}
                  <img
                    src={
                      motor.image ||
                      "https://via.placeholder.com/300?text=No+Image"
                    }
                    alt={motor.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300?text=Error";
                    }}
                  />
                  <span className="motor-badge">{motor.type || "Umum"}</span>
                </div>
                <div className="motor-info">
                  <h3>{motor.name || "Tanpa Nama"}</h3>
                  <p className="motor-price">
                    {/* Logic Tampilan Harga */}
                    {String(motor.price).startsWith("Rp")
                      ? motor.price
                      : formatRupiah(motor.price)}
                    <small>/hari</small>
                  </p>
                  <button
                    onClick={() => openBookingModal(motor)}
                    className="btn-pilih"
                  >
                    Sewa Sekarang
                  </button>
                </div>
              </div>
            ))}

            {!loading && filteredMotors.length === 0 && (
              <div
                className="empty-state"
                style={{
                  color: "white",
                  gridColumn: "1/-1",
                  textAlign: "center",
                }}
              >
                <p>Motor tidak ditemukan.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL POPUP */}
      {selectedBike && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop">
            <button className="btn-close" onClick={() => setSelectedBike(null)}>
              <X size={24} />
            </button>

            <h2>Atur Pesanan</h2>

            <div className="modal-bike-info">
              <img src={selectedBike.image} alt={selectedBike.name} />
              <div>
                <h4>{selectedBike.name}</h4>
                <p>{selectedBike.type}</p>
              </div>
            </div>

            <div className="duration-input-section">
              <label>
                <Calendar size={18} /> Lama Sewa (Hari)
              </label>
              <div className="counter-wrapper">
                <button onClick={() => setDuration((d) => Math.max(1, d - 1))}>
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) =>
                    setDuration(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <button onClick={() => setDuration((d) => d + 1)}>+</button>
              </div>
            </div>

            <div className="price-calculation">
              <div className="calc-row">
                <span>Harga Sewa</span>
                <span>
                  {formatRupiah(getCleanPrice(selectedBike.price))} x {duration}{" "}
                  Hari
                </span>
              </div>
              <div className="calc-row total">
                <span>Total Bayar</span>
                <span className="highlight">
                  {formatRupiah(getCleanPrice(selectedBike.price) * duration)}
                </span>
              </div>
            </div>

            <button
              className="btn-confirm-booking"
              onClick={handleProceedToPay}
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Armada;
