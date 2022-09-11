import { Box } from "@mui/system";
import "./login.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login ", newUser);
      setError(false);
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <Box className="loginContainer">
      <Box className="logo">
        <LocationOnIcon />
        BrewPin
      </Box>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="registerBtn">Login</button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CloseIcon
        className="registerCancel"
        onClick={() => setShowLogin(false)}
      />
    </Box>
  );
}
