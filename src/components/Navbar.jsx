import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- PENTING
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient"; // Import Supabase
import { Menu, X, Rocket } from "lucide-react";
import { User, LogOut, ChevronDown } from "lucide-react"; // Tambah icon ini

import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null); // State untuk simpan user login

  // Logic Javascript (State)
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Logic Javascript (Effect untuk Scroll)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  // 1. CEK STATUS LOGIN SAAT COMPONENT DIBUKA
  useEffect(() => {
    // Cek sesi login
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    // Dengar perubahan login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2. FUNGSI LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
    navigate("/login");
  };
  return (
    <>
      {/* HTML Structure */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <Rocket size={28} className="logo-highlight" />
            <span>
              ASTRO<span className="logo-highlight">NAV</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="nav-menu">
            {navLinks.map((link, index) => (
              <a key={index} href={link.href} className="nav-link">
                {link.name}
              </a>
            ))}
            {/* Ganti tombol Get Started menjadi Link ke Login */}
            {/* --- GANTI BAGIAN TOMBOL MASUK DENGAN INI --- */}
            <li className="nav-item">
              {user ? (
                <div className="profile-dropdown-container">
                  <button
                    className="btn-profile"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="avatar-circle">
                      <User size={18} />
                    </div>
                    <span className="username">
                      {user.user_metadata.full_name || "User"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`chevron ${showDropdown ? "rotate" : ""}`}
                    />
                  </button>

                  {showDropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <p>{user.user_metadata.full_name}</p>
                        <small>{user.email}</small>
                      </div>
                      <hr className="dropdown-divider" />
                      <button
                        onClick={handleLogout}
                        className="dropdown-item logout"
                      >
                        <LogOut size={16} /> Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary"
                  onClick={() => setClick(false)}
                >
                  Masuk
                </Link>
              )}
            </li>
          </div>

          {/* Mobile Toggle Button */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY (YANG DIUBAH) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{
              opacity: 0,
            }} /* Ubah animasi jadi fade in saja biar halus */
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* --- TAMBAHAN BARU: TOMBOL CLOSE "X" DI DALAM OVERLAY --- */}
            <div className="mobile-close-header">
              {/* Logo kecil (opsional, biar keren) */}
              <div className="nav-logo" style={{ fontSize: "1.2rem" }}>
                <Rocket size={20} className="logo-highlight" />
                <span>
                  ASTRO<span className="logo-highlight">NAV</span>
                </span>
              </div>

              {/* Tombol X */}
              <button
                className="close-btn-overlay"
                onClick={() => setIsOpen(false)}
              >
                <X size={32} />
              </button>
            </div>

            {/* Link Menu */}
            <div className="mobile-links-container">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="mobile-link"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }} // Delay bertingkat
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <motion.button
              className="btn-primary btn-mobile-wide"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/login"
                className="btn-primary"
                onClick={() => setClick(false)}
              >
                Masuk
              </Link>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
