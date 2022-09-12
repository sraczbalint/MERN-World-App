import { Box } from "@mui/system";
import "./register.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { Button } from "../button/button";

export default function Register({ setShowRegister }) {
  const [success, setSucces] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register ", newUser);
      setError(false);
      setSucces(true);
      setTimeout(() => {
        setShowRegister(false);
      }, 1500);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <Box className="registerContainer">
      <Box className="logo">
        <LocationOnIcon />
        TracelPin
      </Box>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <Button className="registerBtn" title="Register" />
        {success && (
          <span className="success">Succesfull. You can login in!</span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CloseIcon
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </Box>
  );
}
