import { useState } from "react";
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
      await login(email, password);
      navigate("/");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error inesperado al iniciar sesión";
      toast.error(msg);
    }
  };
  return (
    <>
      <div className="flex flex-row w-200 h-120 bg-white  items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg shadow-gray-400/30 border- border-gray-200">
        <div className="bg-blue-800 w-1/2 h-full rounded-l-lg relative">
          <img
            src="/brett-jordan-U2q73PfHFpM-unsplash.jpg"
            alt="gym"
            className="w-full h-full opacity-50 grayscale-25 rounded-l-lg"
          />
          <div className="absolute bottom-0 left-0 m-5">
            <h1 className="text-white text-4xl font-bold italic">NEFGYM APP</h1>
            <p className="text-gray-300 text-md font-normal tracking-wider italic">
              Panel de Administración
            </p>
          </div>
        </div>
        <div className="w-2/3 m-10 p-10 h-full bg-white flex flex-col justify-center items-center">
          <div className="mb-5">
            <h2 className="mt-2  text-3xl font-bold tracking-tight text-gray-900">
              Bienvenido de nuevo.
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Inicia sesión para acceder al panel de Administración
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
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
                <div className="text-xs">
                  <a
                    href="#"
                    className=" font-semibold text-indigo-600 hover:text-indigo-500"
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
            <div className="text-center text-sm ">
              <p className="">
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
    </>
  );
}
