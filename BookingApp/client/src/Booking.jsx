import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function Booking({ setToken }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: { Authorization: token }
  });

  const loadAppointments = () => {
    api.get("/appointments").then(res => setAppointments(res.data));
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleBooking = async () => {
    if (!name || !date || !time) return alert("Nhập đủ!");

    if (editingId) {
      await api.put(`/appointments/${editingId}`, { name, date, time });
      setEditingId(null);
    } else {
      await api.post("/appointments", { name, date, time });
    }

    setName("");
    setDate("");
    setTime("");
    loadAppointments();
  };

  const deleteAppointment = async (id) => {
    await api.delete(`/appointments/${id}`);
    loadAppointments();
  };

  const editAppointment = (item) => {
    setName(item.name);
    setDate(item.date);
    setTime(item.time);
    setEditingId(item.id);
  };

  const handlePayment = async (item) => {
    await api.post("/payment", { id: item.id });
    alert("Thanh toán OK");
    loadAppointments();
  };

  const cancelAppointment = async (id) => {
    await api.put(`/appointments/${id}/cancel`);
    loadAppointments();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="container">
      <h2>📅 Booking App</h2>

      <button onClick={logout}>Logout</button>

      <input placeholder="Tên" value={name} onChange={e => setName(e.target.value)} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="time" value={time} onChange={e => setTime(e.target.value)} />

      <button onClick={handleBooking}>
        {editingId ? "Update" : "Add"}
      </button>

      {appointments.map(item => (
        <div key={item.id}>
          {item.name} - {item.date} - {item.time} |
          {item.status === "paid" ? " ✅ Paid" :
           item.status === "cancelled" ? " ❌ Cancelled" : " ⏳ Pending"}

          <button onClick={() => editAppointment(item)}>Edit</button>
          <button onClick={() => deleteAppointment(item.id)}>Delete</button>

          {item.status === "pending" && (
            <>
              <button onClick={() => handlePayment(item)}>Pay</button>
              <button onClick={() => cancelAppointment(item.id)}>Cancel</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Booking;