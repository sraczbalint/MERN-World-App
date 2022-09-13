import { Box } from "@mui/system";
import "./login.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import { createRef, useState } from "react";
import axios from "axios";

interface LoginProps {
  setShowLogin: (value: React.SetStateAction<boolean>) => void;
  myStorage: Storage;
  setCurrentUser: React.Dispatch<React.SetStateAction<string | null>>;
}

interface newUserProps {
  username?: string;
  password?: string | number;
}

export default function Login({
  setShowLogin,
  myStorage,
  setCurrentUser,
}: LoginProps) {
  const [error, setError] = useState<boolean>(false);
  const nameRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newUser: newUserProps = {
      username: nameRef?.current?.value,
      password: passwordRef?.current?.value,
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
