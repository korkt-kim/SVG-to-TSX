import * as ReactDOM from "react-dom/client";
import App from "./components/App";
import "../assets/style.css";

// DOM이 준비될 때까지 기다림
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReact);
} else {
  initReact();
}

function initReact() {
  const container = document.querySelector("#react-page");
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  } else {
    console.error("react-page element not found");
  }
}
