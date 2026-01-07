import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Armada from "./pages/Armada";
import PaymentPage from "./pages/PaymentPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Utama (Landing Page) */}
        <Route path="/" element={<Home />} />

        {/* Halaman Armada */}
        <Route path="/armada" element={<Armada />} />

        {/* Halaman Pembayaran */}
        <Route path="/payment" element={<PaymentPage />} />

        {/* Halaman Login */}
        <Route path="/login" element={<Login />} />

        {/* Halaman Register */}
        <Route path="/register" element={<Register />} />

        {/* Halaman Admin Panel */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
