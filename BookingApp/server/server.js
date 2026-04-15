const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "110307",
  database: "bookingDB"
});

db.connect(err => {
  if (err) {
    console.log("Lỗi:", err);
  } else {
    console.log("Kết nối MySQL thành công");
  }
});
app.delete("/appointments/:id",(req,res)=>{
  const id=req.params.id;
  const sql="DELETE FROM  appointments WHERE id = ?";
  db.query(sql,[id],(err,result)=>{
    if(err)return res.json(err);
    res.json("Xoá thành công");
  });
});

app.post("/appointments", (req, res) => {
  const { name, date, time } = req.body;

  const sql = "INSERT INTO appointments (name, date, time, status) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, date, time, "pending"], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json("OK");
  });
});
  app.post("/payment",(req,res)=>{
    const {amount, id}= req.body;
    const url = `https://sandbox.vnpayment.vn/pay?id=${id}&amount=${amount}`;
    res.json({ url });
  });
app.get("/appointments", (req, res) => {
  db.query("SELECT * FROM appointments", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});
app.put("/appointments/:id",(req,res)=>{
  const id=req.params.id;
  const {name, date, time }=req.body;
  const sql = "UPDATE appointments SET name=?, date=?, time=? WHERE id=?";
  db.query(sql, [name, date, time, id],(err,result)=>{
    if(err)return res.json(err);
    res.json("Cập nhật thành công");
  })
})
app.listen(5000, () => {
  console.log("Server chạy tại http://localhost:5000");
});