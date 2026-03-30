import { useAuth } from "../context/AuthContext";
import { Link } from "./Link";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSettingsStore } from "../store/useSettingsStore";

export function Header() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const urlSearch = searchParams.get("search") || "";
  const [input, setInput] = useState(urlSearch);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setInput(urlSearch);
  }, [urlSearch]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (value) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const trimmedValue = value.trim().replace(/\s+/g, " ");

      const params = new URLSearchParams(searchParams);
      if (trimmedValue) {
        params.set("search", trimmedValue); // Usar el valor recortado y normalizado
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      navigate(`/clients?${params.toString()}`);
    }, 500);
  };

  return (
    <header className="bg-white shadow-xs shadow-gray-200/50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <form className="flex items-center">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                placeholder="Buscar clientes por nombre, apellido, etc..."
                className="pl-10 bg-gray-100 rounded-lg px-3 py-2 w-100"
                onChange={(e) => {
                  (setInput(e.target.value), handleSearch(e.target.value));
                }}
                value={input}
              />
            </div>
          </form>
          <div className="flex items-center divide-x divide-gray-400">
            <Link
              to="/settings"
              className="text-gray-500 hover:text-gray-900  pr-3"
            >
              <Settings size={18} />
            </Link>
            <div className="ml-3 flex flex-col items-end">
              <p className="text-xs text-gray-500 font-medium">
                {user.name.toUpperCase()} | {user.role.toUpperCase()}
              </p>
              <button
                onClick={handleLogout}
                className="text-xs bg-transparent text-gray-600 hover:text-indigo-600 font-medium cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
