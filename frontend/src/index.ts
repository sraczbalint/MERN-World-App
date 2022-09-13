import App from "./App";
import { createRoot } from "react-dom/client";
import { createElement } from "react";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(createElement(App));
