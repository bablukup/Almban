// import React from "react";
// import "./App.css";

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import AuthPage from "./components/Auth";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/auth" element={<AuthPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthPage, HomePage } from "./routes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
