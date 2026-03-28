import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setAuth({ token });
    }
  }, []);
  const login = async (token, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    setAuth({ token });
    const res = await api.get("/users/profile");
    setUser(res.data);
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (e) {}

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
