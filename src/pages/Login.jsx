import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Rocket,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  // State Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State Loading & Error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // Pastikan ini string kosong ""

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Proses Login ke Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // 2. LOGIKA REDIRECT KHUSUS (Ini bagian barunya)
      // Ganti "admin@astronav.com" dengan email admin yang kamu pakai di database
      const adminEmail = "admin@astronav.com";

      if (email === adminEmail) {
        // Jika Admin -> Masuk ke Dashboard
        navigate("/admin");
      } else {
        // Jika User Biasa -> Masuk ke Home
        navigate("/");
      }
    } catch (err) {
      alert("Login Gagal: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>

      <div className="login-container">
        {/* Header Logo */}
        <div className="login-header">
          <div className="login-logo">
            <Rocket size={32} className="text-blue-500" />
            <span>
              ASTRO<span className="text-blue-500">NAV</span>
            </span>
          </div>
          <h2>Welcome Back!</h2>
          <p>Masuk untuk melanjutkan sewa motor impianmu.</p>
        </div>

        {/* --- TAMPILKAN ERROR (DENGAN SAFE GUARD) --- */}
        {errorMsg && (
          <div className="error-alert-login">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn-show-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <div className="forgot-link">
              <a href="/forgot-password">Lupa password?</a>
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? (
              "Memproses..."
            ) : (
              <>
                Sign In <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Belum punya akun?{" "}
            <Link to="/register" className="register-link">
              Daftar Sekarang
            </Link>
          </p>
          <p>
            Kembali ke{" "}
            <Link to="/" className="register-link">
              Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
