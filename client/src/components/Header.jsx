import { useAuth } from "../context/AuthContext";
import { Link } from "./Link";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function Header() {
  const [searchParams] = useSearchParams();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (input) {
      params.set("search", encodeURIComponent(input)); // Codificar correctamente el valor
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    navigate(`/clients?${params.toString()}`);
  };

  return (
    <header className="bg-white shadow-xs shadow-gray-200/50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <form onSubmit={handleSubmit} className="flex items-center">
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
          <div className="flex items-center">
            <Link to="#" className="text-gray-500 hover:text-gray-900">
              <Settings size={18} />
            </Link>
            <button
              onClick={handleLogout}
              className=" hover:shadow-lg hover:shadow-indigo-600/50 ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
