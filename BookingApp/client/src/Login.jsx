import { useState } from "react";
import axios from "axios";
import "./App.css";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ===== LOGIN =====
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

    } catch (err) {
      alert(err.response?.data || "Sai tài khoản hoặc mật khẩu!");
    }
  };

  // ===== REGISTER + AUTO LOGIN =====
  const handleRegister = async () => {
    try {
      // 1. Register
      await axios.post("http://localhost:5000/register", {
        username,
        password
      });

      // 2. Auto login ngay sau đó
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password
      });

      // 3. Lưu token
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      alert("Đăng ký + đăng nhập thành công 🎉");

    } catch (err) {
      alert(err.response?.data || "User đã tồn tại!");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h2>Booking App</h2>

        <input
          className="login-input"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

       <button className="login-btn" onClick={handleLogin}>
  🔐 Log In
</button>

        <div className="divider"></div>

        <button className="register-btn" onClick={handleRegister}>
  ➕ Register
</button>

      </div>
    </div>
  );
}

export default Login;