import React from "react";
import { X, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/PaymentModal.css"; // Kita buat CSS-nya nanti

const PaymentModal = ({ isOpen, onClose, bike, plan }) => {
  const navigate = useNavigate(); // Inisialisasi

  if (!isOpen) return null;

  // FUNGSI BARU: Pindah ke halaman pembayaran
  const handleProceedToPayment = () => {
    // Tutup modal
    onClose();

    // Pindah halaman sambil bawa data motor & paket
    navigate("/payment", {
      state: {
        bike: bike,
        plan: plan,
      },
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>Konfirmasi Pesanan</h2>

        <div className="order-summary">
          <div className="summary-item">
            <span>Paket Dipilih:</span>
            <strong>
              {plan.name} ({plan.price})
            </strong>
          </div>
          <div className="summary-item">
            <span>Unit Motor:</span>
            <strong>{bike.name}</strong>
          </div>
          <div className="summary-item">
            <span>Tipe:</span>
            <strong>{bike.type}</strong>
          </div>
        </div>

        <div className="payment-method">
          <p>Metode Pembayaran:</p>
          <div className="method-badge">
            <CreditCard size={16} /> QRIS / Transfer
          </div>
        </div>

        {/* Update Tombol */}
        <button className="btn-pay-now" onClick={handleProceedToPayment}>
          Lanjut ke Pembayaran
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
