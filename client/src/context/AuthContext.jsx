import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // true mientras verificamos si hay sesión activa en el server
  const [loading, setLoading] = useState(true);

  // Al montar, consulta /profile para ver si la cookie sigue válida
  useEffect(() => {
    api.get("/users/profile")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Login: el server ya setea las cookies httpOnly.
   * El body de respuesta trae { user: { id, name, email, role } }.
   */
  const login = async (email, password) => {
    const res = await api.post("/users/login", { email, password });
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (e) {
      // ignorar error de red en logout
    }
    setUser(null);
  };

  const value = {
    user,      // { id, name, email, role } | null
    loading,   // true mientras se verifica la sesión inicial
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
