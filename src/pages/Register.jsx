import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Rocket,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient"; // 1. IMPORT SUPABASE
import "../styles/Register.css"; // CSS Khusus Register

const Register = () => {
  const navigate = useNavigate();

  // State Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    // 1. Validasi Password Sederhana
    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi tidak cocok!");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. LOGIC DAFTAR KE SUPABASE
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName, // Kita simpan nama lengkap di metadata
          },
        },
      });

      if (error) throw error;

      // 3. SUKSES
      alert(
        "Registrasi Berhasil! Silakan cek email untuk verifikasi (atau langsung login jika auto-confirm aktif)."
      );
      navigate("/login");
    } catch (err) {
      setError(err.message); // Tampilkan error dari Supabase
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Background Shapes */}
      <div className="shape shape-3"></div>
      <div className="shape shape-4"></div>

      <div className="register-container">
        {/* Header */}
        <div className="register-header">
          <div className="register-logo">
            <Rocket size={32} className="text-blue-500" />
            <span>
              ASTRO<span className="text-blue-500">NAV</span>
            </span>
          </div>
          <h2>Buat Akun Baru</h2>
          <p>Bergabunglah bersama ribuan petualang lainnya.</p>
        </div>

        {/* Error Alert (Jika ada) */}
        {error && (
          <div className="error-alert">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="register-form">
          {/* Input Nama */}
          <div className="input-group">
            <label>Nama Lengkap</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input
                type="text"
                placeholder="Nama Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Input Email */}
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type="password"
                placeholder="Buat password kuat"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Input Confirm Password */}
          <div className="input-group">
            <label>Ulangi Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type="password"
                placeholder="Ketik ulang password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={
                  error && password !== confirmPassword ? "input-error" : ""
                }
              />
            </div>
          </div>

          <button type="submit" className="btn-register" disabled={isLoading}>
            {isLoading ? (
              "Memproses..."
            ) : (
              <>
                Daftar Sekarang <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Sudah punya akun?{" "}
            <Link to="/login" className="login-link">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
