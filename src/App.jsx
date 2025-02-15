import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MyFiles from "./pages/MyFiles";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { showLogin, setShowLogin } = useContext(AuthContext); // ✅ Get modal state

  return (
    <div className="bg-black w-full h-screen text-white">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myfiles" element={<MyFiles />} />
        </Routes>
      </Router>

      {showLogin && <LoginModal closeModal={() => setShowLogin(false)} />}
    </div>
  );
};

export default App;
