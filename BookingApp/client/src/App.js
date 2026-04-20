import { useState } from "react";
import Login from "./Login";
import Booking from "./Booking";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return token
    ? <Booking setToken={setToken} /> 
    : <Login setToken={setToken} />;
}

export default App;