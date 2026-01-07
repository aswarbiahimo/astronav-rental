// src/pages/UpdatePassword.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setMessage("Gagal update: " + error.message);
    } else {
      setMessage("Password berhasil diperbarui! Silakan login.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleUpdate} className="login-form">
        <h2>Setel Password Baru</h2>
        <input
          type="password"
          placeholder="Password Baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default UpdatePassword;
