import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useClientStore } from "../store/useClientStore";
import { CheckinBox } from "../components/CheckinBox";
import { useCheckinStore } from "../store/useCheckinStore";

import { RecentCheckins } from "../components/CheckinList";

export default function Checkin() {
  const { getClientByDni } = useClientStore();
  const addCheckin = useCheckinStore((state) => state.addCheckin);

  const checkins = useCheckinStore((state) => state.checkins);
  const fetchCheckins = useCheckinStore((state) => state.fetchCheckins);

  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [checkinResult, setCheckinResult] = useState(null); // { success, message }
  const [showBox, setShowBox] = useState(false);
  const [dni, setDni] = useState("");
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    fetchCheckins();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dni.trim()) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    setIsLoading(true);
    setShowBox(false);

    // 1. Buscar cliente por DNI
    const client = await getClientByDni(dni).catch(() => null);

    if (client) {
      // 2. Intentar registrar el check-in
      const result = await addCheckin(dni);
      fetchCheckins();
      // 3. Siempre mostrar el box con los datos del cliente + resultado
      setClientData(client);
      setCheckinResult(result);
      setShowBox(true);

      // 4. Auto-ocultar después del tiempo configurado
      timerRef.current = setTimeout(() => {
        setShowBox(false);
        setClientData(null);
        setCheckinResult(null);
        setIsLoading(false);
      }, 5000);
    } else {
      // Cliente no encontrado: mostrar estado de error sin box
      setCheckinResult({ success: false, message: "Cliente no encontrado" });
      setClientData(null);
      setShowBox(true);

      timerRef.current = setTimeout(() => {
        setShowBox(false);
        setCheckinResult(null);
        setIsLoading(false);
      }, 4000);
    }

    setDni("");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      inputRef.current?.focus();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row items-center ">
      <div className="h-screen w-1/2 flex flex-col items-center justify-center p-2 ml-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-gray-700 mb-2">Check-in</h1>
            <p className="text-gray-400 text-sm">
              Ingresá tu DNI para registrar tu entrada
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-sm"
          >
            <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase">
              Identificación
            </h3>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Ingresá tu DNI"
                value={dni}
                ref={inputRef}
                onChange={(e) => setDni(e.target.value)}
                className="bg-gray-100 rounded-xl px-5 py-4 w-full font-semibold text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg"
              >
                <Search size={18} />
              </motion.button>
            </div>

            {!isLoading && (
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-gray-300" />
                <span className="text-gray-300 text-xs font-medium">
                  Esperando DNI...
                </span>
              </div>
            )}
          </form>

          {showBox && <CheckinBox data={clientData} result={checkinResult} />}
        </div>
      </div>
      <div className="h-screen w-1/2 flex flex-col items-center justify-center p-2">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-black text-gray-700 mb-2">
            Check-ins recientes
          </h2>
          <RecentCheckins data={checkins.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}
