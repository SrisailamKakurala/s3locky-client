import React, { useState, useContext } from "react";
import { signup, login } from "../api";
import { AuthContext } from "../context/AuthContext";

const LoginModal = ({ closeModal }) => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
  
    try {
      setLoading(true);

      console.log("Sending data:", { email, password });
  
      // Use login or signup function from api.js
      const response = isLogin
        ? await login(email, password)
        : await signup(email, password);
  
      console.log("API Response:", response); // Debugging
  
      if (response.accessToken && response.refreshToken) {
        // Store tokens in localStorage
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        
        // Set authentication state
        setIsAuthenticated(true);
        setUser(response.user);

        console.log("User:", response.user);
        localStorage.setItem("userId", response.user._id);

  
        closeModal();
      } else {
        setError("Authentication failed. No token received.");
      }
    } catch (err) {
      console.error("Login/Signup Error:", err); // Debugging
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 text-center border border-orange-500">
        <h2 className="text-xl font-semibold text-white mb-3">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-orange-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-orange-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-orange-400 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>

        <button
          className="block text-gray-400 mt-3 text-sm hover:text-gray-300 cursor-pointer"
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
