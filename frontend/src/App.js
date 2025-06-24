import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { About } from "./components/About";
import { Products } from "./components/Products";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Products />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;