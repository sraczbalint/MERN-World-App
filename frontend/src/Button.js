import { Button as MuiButton } from "@mui/material";
import React from "react";

function Button(title, className) {
  return <MuiButton className={className}>{title}</MuiButton>;
}

export default Button;
