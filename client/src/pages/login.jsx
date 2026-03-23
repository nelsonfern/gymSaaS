import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/users/login", { email, password });
      login(response.data.token);
      navigate("/");
    } catch (error) {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Error inesperado al iniciar sesión");
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 z-10 bg-linear-to-t from-gray-200 to-transparent">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="NefGym"
            src="/dumbbell-gym-svgrepo-com.svg"
            className="mx-auto h-20 w-auto "
          />
          <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            NefGym App
          </h2>
          <p className="mt-2 text-center text-sm/6 text-gray-500">
            Panel de Administración
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border border-solid border-gray-200 rounded-lg p-5 bg-white shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Correo Electronico
              </label>
              <div className="mt-2 relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Contraseña
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>
              <div className="mt-2 relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-md shadow-indigo-500/50 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Ingresar
              </button>
            </div>
            <div className="h-px bg-gray-200 my-6"></div>
            <div className="text-center">
              <p>
                ¿No tienes acceso aún?{" "}
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Contacta a soporte
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <img
        src="/ambitious-studio-rick-barrett-wZlsHihO2g4-unsplash.jpg"
        alt="gym"
        className="absolute inset-0 w-full h-full object-cover opacity-15 z-[-1] blur-xs "
      />
    </>
  );
}
