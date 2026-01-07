import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListOrdered,
  PlusCircle,
  LogOut,
  Trash2,
  CheckCircle,
  XCircle,
  Menu,
  X,
} from "lucide-react";
import "../styles/Admin.css";

const AdminPanel = () => {
  const navigate = useNavigate();

  // State Data
  const [orders, setOrders] = useState([]);
  const [motors, setMotors] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | orders | motors
  const [loading, setLoading] = useState(true);

  // State Form Upload
  const [newMotor, setNewMotor] = useState({
    name: "",
    type: "Matic",
    price: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // State Mobile Sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Di dalam AdminPanel.jsx

  useEffect(() => {
    const checkAdmin = async () => {
      // 1. Cek apakah ada user login?
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Kalau belum login, tendang ke login
        navigate("/login");
        return;
      }

      // 2. Cek apakah emailnya email admin?
      // (Harus sama persis dengan yang di Login.jsx)
      const adminEmail = "admin@astronav.com";

      if (session.user.email !== adminEmail) {
        // Kalau user biasa coba masuk, tendang ke Home
        alert("Akses Ditolak! Anda bukan Admin.");
        navigate("/");
      } else {
        // Kalau benar admin, baru ambil data
        fetchData();
      }
    };

    checkAdmin();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Ambil Data Orders
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    // Ambil Data Motors
    const { data: motorData } = await supabase
      .from("motors")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(orderData || []);
    setMotors(motorData || []);
    setLoading(false);
  };

  // --- LOGIC UPLOAD & UPDATE (Sama seperti sebelumnya) ---
  const handleAddMotor = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let publicUrl = "";
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `motor-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("motor-images")
          .upload(fileName, imageFile, { upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from("motor-images")
          .getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      } else {
        publicUrl = newMotor.image;
      }
      const { error } = await supabase
        .from("motors")
        .insert([{ ...newMotor, image: publicUrl }]);
      if (error) throw error;
      alert("✅ Motor berhasil ditambahkan!");
      setNewMotor({ name: "", type: "", price: "", image: "" });
      setImageFile(null);
      fetchData();
    } catch (err) {
      alert("Gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 1. TAMBAHKAN HELPER INI DI LUAR ATAU DI DALAM COMPONENT (Sebelum updateOrderStatus)
  const formatPhoneNumber = (number) => {
    // Hapus semua karakter aneh (spasi, strip, +)
    let cleaned = ("" + number).replace(/\D/g, "");

    // Kalau diawali '0', ganti jadi '62'
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.slice(1);
    }

    return cleaned;
  };

  // GANTI FUNGSI updateOrderStatus DENGAN INI
  const updateOrderStatus = async (id, status, rawPhone, customerName) => {
    // 1. Helper Format Nomor HP (Ditaruh di dalam biar aman)
    const formatPhoneNumber = (number) => {
      if (!number) return ""; // Cegah error jika null
      let cleaned = ("" + number).replace(/\D/g, ""); // Hapus selain angka
      if (cleaned.startsWith("0")) {
        cleaned = "62" + cleaned.slice(1); // Ubah 08xx jadi 628xx
      }
      return cleaned;
    };

    // 2. Proses Format & Debugging
    const phone = formatPhoneNumber(rawPhone);

    // Cek di Console Browser (Tekan F12 -> Console)
    // console.log("--- DEBUG WA ---");
    // console.log("Nama:", customerName);
    // console.log("Nomor Asli:", rawPhone);
    // console.log("Nomor Formatted:", phone);

    // 3. Update Status di Database Supabase
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Gagal update status database!");
      console.error(error);
      return;
    }

    fetchData(); // Refresh tabel

    // 4. LOGIKA KIRIM PESAN FONNTE
    if (status === "active" || status === "completed") {
      // PENCEGAHAN: Jika nomor HP kosong, jangan kirim ke Fonnte
      if (!phone || phone.length < 5) {
        alert(
          "✅ Status Update, TAPI WA TIDAK TERKIRIM karena nomor HP kosong/salah."
        );
        return;
      }

      const message =
        status === "active"
          ? `Halo ${customerName}, pesanan Anda DISETUJUI ✅. Silakan ambil unit.`
          : `Terima kasih ${customerName}, pesanan Anda SELESAI 👋.`;

      const token = "w41tKt9f1F1ah99rqjR7"; // Token Anda

      try {
        console.log("Mengirim ke Fonnte...");
        const response = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target: phone, // Pastikan ini terisi
            message: message,
            countryCode: "62",
          }),
        });

        const result = await response.json();
        console.log("Respon Fonnte:", result);

        if (result.status) {
          alert(`✅ Status Update & WA Terkirim ke ${phone}!`);
        } else {
          // Tampilkan pesan error spesifik dari Fonnte
          alert("❌ Gagal Fonnte: " + (result.reason || "Cek Console"));
        }
      } catch (err) {
        console.error("Error Network:", err);
        alert("❌ Error Koneksi Internet / Fonnte Down");
      }
    }
  };

  const deleteMotor = async (id) => {
    if (confirm("Hapus motor ini?")) {
      await supabase.from("motors").delete().eq("id", id);
      fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* 1. HEADER MOBILE (Hanya muncul di HP) */}
      <div className="mobile-header">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <h3>Admin Panel</h3>
      </div>

      {/* 2. SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>AstroAdmin</h2>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-menu">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => {
              setActiveTab("orders");
              setSidebarOpen(false);
            }}
          >
            <ListOrdered size={20} /> Pesanan
          </button>
          <button
            className={activeTab === "motors" ? "active" : ""}
            onClick={() => {
              setActiveTab("motors");
              setSidebarOpen(false);
            }}
          >
            <PlusCircle size={20} /> Manajemen Motor
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Keluar
        </button>
      </aside>

      {/* 3. OVERLAY GELAP (Untuk Mobile saat menu terbuka) */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* 4. KONTEN UTAMA */}
      <main className="main-content">
        {/* --- TAB: DASHBOARD --- */}
        {activeTab === "dashboard" && (
          <div className="dashboard-view animate-fade">
            <h1>Dashboard Ringkasan</h1>
            <div className="stats-grid">
              <div className="stat-card blue">
                <h3>Total Armada</h3>
                <p>{motors.length} Unit</p>
              </div>
              <div className="stat-card orange">
                <h3>Pesanan Pending</h3>
                <p>
                  {orders.filter((o) => o.status === "pending").length} Pesanan
                </p>
              </div>
              <div className="stat-card green">
                <h3>Sedang Disewa</h3>
                <p>{orders.filter((o) => o.status === "active").length} Unit</p>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: PESANAN (DENGAN TABEL SCROLLABLE) --- */}
        {activeTab === "orders" && (
          <div className="orders-view animate-fade">
            <h1>Daftar Pesanan Masuk</h1>
            <div className="table-responsive">
              {" "}
              {/* WRAPPER PENTING */}
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Pelanggan</th>
                    <th>Motor</th>
                    <th>Durasi</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.customer_name}</strong>
                        <br />
                        <small>{order.customer_wa}</small>
                      </td>
                      <td>{order.motor_name}</td>
                      <td>{order.duration} Hari</td>
                      <td>{order.total_price}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="action-cell">
                        {order.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              className="btn-icon green"
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  "active",
                                  order.customer_wa,
                                  order.customer_name
                                )
                              }
                              title="Terima"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              className="btn-icon red"
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  "cancelled",
                                  order.customer_wa,
                                  order.customer_name
                                )
                              }
                              title="Tolak"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        )}
                        {order.status === "active" && (
                          <button
                            className="btn-small"
                            onClick={() =>
                              updateOrderStatus(
                                order.id,
                                "completed",
                                order.customer_wa,
                                order.customer_name
                              )
                            }
                          >
                            Selesai
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB: MOTOR (DENGAN TABEL SCROLLABLE) --- */}
        {activeTab === "motors" && (
          <div className="motors-view animate-fade">
            <h1>Manajemen Armada</h1>

            {/* Form Tambah */}
            <div className="form-card">
              <h3>Tambah Motor Baru</h3>
              <form onSubmit={handleAddMotor} className="add-motor-form">
                <input
                  type="text"
                  placeholder="Nama Motor (Ex: Vario 160)"
                  required
                  value={newMotor.name}
                  onChange={(e) =>
                    setNewMotor({ ...newMotor, name: e.target.value })
                  }
                />
                <select
                  value={newMotor.type}
                  onChange={(e) =>
                    setNewMotor({ ...newMotor, type: e.target.value })
                  }
                >
                  <option value="Matic">Matic</option>
                  <option value="Sport">Sport</option>
                  <option value="Bebek">Bebek</option>
                </select>
                <input
                  type="text"
                  placeholder="Harga per Hari (Ex: 150000)"
                  required
                  value={newMotor.price}
                  onChange={(e) =>
                    setNewMotor({ ...newMotor, price: e.target.value })
                  }
                />
                <div className="file-input-group">
                  <label>Foto Motor:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
                <button type="submit" disabled={uploading}>
                  {uploading ? "Mengupload..." : "Simpan Motor"}
                </button>
              </form>
            </div>

            {/* Tabel List Motor */}
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {motors.map((motor) => (
                    <tr key={motor.id}>
                      <td>
                        <img
                          src={motor.image}
                          alt="motor"
                          className="table-img"
                        />
                      </td>
                      <td>{motor.name}</td>
                      <td>{motor.type}</td>
                      <td>{motor.price}</td>
                      <td>
                        <button
                          className="btn-icon red"
                          onClick={() => deleteMotor(motor.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
