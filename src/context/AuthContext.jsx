import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false); 

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      setIsAuthenticated(true);
      axios
        .get("/api/auth/user", { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem("accessToken");
          setIsAuthenticated(false);
          setUser(null);
        });
    } else if (refreshToken) {
      axios
        .post("/api/auth/refresh", { refreshToken })
        .then((response) => {
          localStorage.setItem("accessToken", response.data.accessToken);
          setIsAuthenticated(true);
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
          setUser(null);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, setIsAuthenticated, user, setUser, 
      showLogin, setShowLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
