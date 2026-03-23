import { CheckCircle, XCircle, User } from "lucide-react";
import { motion } from "framer-motion";

export function CheckinBox({ data, result }) {
  const isSuccess = result?.success;
  // Estado: cliente no encontrado (no hay data)
  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 bg-white rounded-2xl shadow-sm p-6 border-l-4 border-red-400"
      >
        <div className="flex items-center gap-4">
          <div className="bg-red-100 rounded-full p-3">
            <XCircle size={32} className="text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">
              Cliente no encontrado
            </p>
            <p className="text-sm text-gray-400">
              No existe ningún cliente con ese DNI
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Texto descriptivo del vencimiento
  const expiryText = () => {
    if (data.daysLeft === null) return "Sin membresía asignada";
    if (data.daysLeft < 0)
      return `Venció hace ${Math.abs(data.daysLeft)} día${Math.abs(data.daysLeft) !== 1 ? "s" : ""}`;
    if (data.daysLeft === 0) return "Vence hoy";
    if (data.daysLeft <= 3)
      return `⚠️ Vence en ${data.daysLeft} día${data.daysLeft !== 1 ? "s" : ""}`;
    return `Quedan ${data.daysLeft} días`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 bg-white rounded-2xl shadow-sm p-6 border-l-4 ${
        isSuccess ? "border-green-400" : "border-red-400"
      }`}
    >
      {/* Header: avatar + nombre */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className={`rounded-full p-3 ${isSuccess ? "bg-green-100" : "bg-red-100"}`}
        >
          <User
            size={28}
            className={isSuccess ? "text-green-600" : "text-red-500"}
          />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-800">
            {data.name} {data.lastName}
          </p>
          <p className="text-sm text-gray-400">DNI {data.dni}</p>
        </div>

        {/* Ícono de estado (derecha) */}
        <div className="ml-auto">
          {isSuccess ? (
            <CheckCircle size={36} className="text-green-500" />
          ) : (
            <XCircle size={36} className="text-red-400" />
          )}
        </div>
      </div>

      {/* Mensaje del resultado */}
      <div
        className={`rounded-xl px-4 py-3 mb-4 ${isSuccess ? "bg-green-50" : "bg-red-50"}`}
      >
        <p
          className={`font-semibold text-sm ${isSuccess ? "text-green-700" : "text-red-600"}`}
        >
          {result?.message}
        </p>
      </div>

      {/* Info de membresía */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-0.5">
            Plan
          </p>
          <p className="font-medium text-gray-700">
            {data.plan?.name ?? "Sin plan"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-0.5">
            {data.daysLeft !== null && data.daysLeft >= 0
              ? "Vencimiento"
              : "Estado"}
          </p>
          <p
            className={`font-medium ${
              data.daysLeft !== null && data.daysLeft > 3
                ? "text-gray-700"
                : "text-red-500"
            }`}
          >
            {expiryText()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
