import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { MyContextProvider } from "./context/MyContext"; // Import the provider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap your entire application with the provider */}
    <MyContextProvider>
      <App />
    </MyContextProvider>
  </React.StrictMode>
);
