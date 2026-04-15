    import { useState, useEffect } from "react";
    import axios from "axios";
    import "./App.css";

    function Booking(){
        const [name, setName] = useState("");
        const [date, setDate] = useState("");
        const [time, setTime] = useState("");
        const [appointments,setAppointments] =useState([]);
        const loadAppointments = ()=>{
            axios.get("http://localhost:5000/appointments").then(res=>setAppointments(res.data));
        };
        useEffect(()=>{
            loadAppointments();

        },[])
        const [editingId,setEditingId] = useState(null);
        const editAppointment = (item)=>{
            setName(item.name);
            setDate(item.date);
            setTime(item.time);
            setEditingId(item.id);
        };
        const handlePayment = async (item) => {
            const res = await axios.post("http://localhost:5000/payment", { 
                amount: 100000,     
                id: item.id
            });
            alert("Thanh toán thành công!");
            loadAppointments();
        };
        const deleteAppointment=async(id)=>{
            const confirmDelete = window.confirm("Bạn có chắc muốn xoá lịch này không?");
            if(!confirmDelete) return;
            await axios.delete(`http://localhost:5000/appointments/${id}`);
            loadAppointments();
        };
        const handleBooking =async () => {
        const newAppointment ={name,date,time};
        if(!name || !date || !time){
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }
        if(editingId){
            await axios.put(`http://localhost:5000/appointments/${editingId}`,newAppointment);
            setEditingId(null);
        }
        else{
            await axios.post("http://localhost:5000/appointments",newAppointment);
        }

        setName("");
        setDate("");
        setTime("");
        loadAppointments();
        };
        return (
            <div className={"container"}>
            <h2>📅 Đặt lịch</h2>  
            
            <input 
            placeholder="Tên"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <input 
                type="date"
                value={date}
                onChange={(e)=>setDate(e.target.value)}
            />
    

            <input 
                type="time"
                value={time}
                onChange={(e)=>setTime(e.target.value)}
            />
            <button className="btn-main" onClick={handleBooking}>{editingId ? "Cập nhật" : "Đặt lịch"}</button> 
            <h3>Danh sách lịch</h3>
            {appointments.map((item, index) => (
            <div key={item.id} className="list-item">
                <span>
                {item.name} - {new Date(item.date).toLocaleDateString("vi-VN")} - {item.time}
                {" "}
                {item.status === "paid" ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}
                </span>

                <div>
                <button className="btn-edit" onClick={() => editAppointment(item)}>
                    Sửa
                </button>

                <button className="btn-delete" onClick={() => deleteAppointment(item.id)}>
                    Xoá
                </button>
                {
                    item.status !== "paid" && (
                        <button onClick={()=>handlePayment(item)}>💳 Thanh toán</button> 
                )}
                </div>
            </div>
            ))}

            </div>
        );
    }
    export default Booking;