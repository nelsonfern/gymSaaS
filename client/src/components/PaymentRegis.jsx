import { useState, useEffect } from "react";
import { CreditCard, Building2, Banknote, HandCoins, Tag } from "lucide-react";
import { usePaymentStore } from "../store/usePaymentStore";
import { useClientStore } from "../store/useClientStore";
import { usePlansStore } from "../store/usePlansStore";
import api from "../api/axios";

const methods = [
  {
    value: "tarjeta",
    label: "Crédito / Débito",
    icon: <CreditCard size={24} />,
  },
  {
    value: "transferencia",
    label: "Transferencia",
    icon: <Building2 size={24} />,
  },
  { value: "efectivo", label: "Efectivo", icon: <Banknote size={24} /> },
];

export function PaymentRegis() {
  const [method, setMethod] = useState("efectivo");
  const [dni, setDni] = useState("");
  const [foundClient, setFoundClient] = useState(null);
  const [searching, setSearching] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [note, setNote] = useState("");

  const plans = usePlansStore((state) => state.plans);
  const fetchPlans = usePlansStore((state) => state.fetchPlans);

  const selectedPlanData = plans.find((p) => p._id === selectedPlan);
  const planPrice = selectedPlanData?.price ?? 0;
  const parsedAmount = parseFloat(customAmount) || 0;
  const discount = planPrice > 0 && parsedAmount > 0 ? planPrice - parsedAmount : 0;
  const hasDiscount = discount > 0;
  const isOverPrice = parsedAmount > planPrice && planPrice > 0;

  useEffect(() => {
    fetchPlans();
  }, []);

  // Cuando cambia el plan, inicializa el monto con el precio del plan
  useEffect(() => {
    if (selectedPlanData) {
      setCustomAmount(String(selectedPlanData.price));
    } else {
      setCustomAmount("");
    }
  }, [selectedPlan]);

  // Busca cliente con debounce
  useEffect(() => {
    if (dni.length < 7) {
      setFoundClient(null);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(`/clients/byDni/${dni}`);
        setFoundClient(res.data || null);
      } catch {
        setFoundClient(null);
      } finally {
        setSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [dni]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foundClient || !selectedPlan || !customAmount || isOverPrice) return;

    const payment = {
      client: foundClient._id,
      plan: selectedPlan,
      amount: parsedAmount,
      method,
      note: note.trim(),
    };

    usePaymentStore.getState().createPayment(payment);
    // Reset
    setDni("");
    setFoundClient(null);
    setSelectedPlan("");
    setCustomAmount("");
    setNote("");
    setMethod("efectivo");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs p-6 mt-6">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-100 rounded-lg p-2">
          <HandCoins className="text-indigo-600" size={32} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800">Agregar Pago</h2>
          <p className="text-xs text-gray-400 font-normal">
            Ingrese los datos del pago
          </p>
        </div>
      </div>
      <div className="flex flex-col pb-6 border-b border-gray-200 mb-6" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 min-h-0 mt-6 overflow-y-auto"
      >
        {/* DNI */}
        <div className="mb-7">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Busque el cliente por DNI
          </label>
          <input
            type="text"
            className="px-4 py-3 text-gray-500 w-full rounded-lg bg-gray-200/50 focus:border"
            required
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
          {searching && (
            <p className="text-xs text-gray-400 mt-1">Buscando...</p>
          )}
          {foundClient && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">
                Cliente encontrado: {foundClient.name} {foundClient.lastName}
              </p>
              <p className="text-green-600 text-sm">DNI: {foundClient.dni}</p>
            </div>
          )}
          {!foundClient && dni.length >= 7 && !searching && (
            <p className="mt-2 text-red-500 text-sm">
              No se encontró ningún cliente con ese DNI.
            </p>
          )}
        </div>

        {/* PLAN */}
        <div className="mb-7">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Seleccione el plan
          </label>
          <select
            className="w-full px-4 py-3 bg-gray-200/50 rounded-lg focus:border"
            required
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            disabled={!foundClient}
          >
            <option value="">Seleccione un plan</option>
            {plans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name} - ${plan.price}
              </option>
            ))}
          </select>
        </div>

        {/* MONTO EDITABLE + DESCUENTO */}
        <div className="mb-7">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Monto cobrado
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              $
            </span>
            <input
              type="number"
              min="1"
              step="any"
              className={`text-gray-700 font-semibold w-full pl-7 pr-4 py-3 rounded-lg bg-gray-200/50 focus:outline-none focus:ring-2 transition-all
                ${isOverPrice ? "ring-2 ring-red-400 bg-red-50" : hasDiscount ? "ring-2 ring-amber-400 bg-amber-50" : ""}`}
              required
              disabled={!selectedPlan}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
          </div>

          {/* Precio original del plan */}
          {selectedPlanData && (
            <p className="text-xs text-gray-400 mt-1">
              Precio del plan:{" "}
              <span className="font-medium">${planPrice}</span>
            </p>
          )}

          {/* Mensaje de error si supera el precio */}
          {isOverPrice && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              ⚠ El monto no puede superar el precio del plan (${planPrice})
            </p>
          )}

          {/* Badge de descuento */}
          {hasDiscount && !isOverPrice && (
            <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2">
              <Tag size={14} className="shrink-0" />
              <span className="text-xs font-medium">
                Descuento de{" "}
                <span className="font-bold">${discount.toFixed(2)}</span>{" "}
                ({Math.round((discount / planPrice) * 100)}% del plan)
              </span>
            </div>
          )}
        </div>

        {/* NOTA (solo si hay descuento) */}
        {hasDiscount && !isOverPrice && (
          <div className="mb-7">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Motivo del descuento{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              className="px-4 py-3 text-gray-500 w-full rounded-lg bg-gray-200/50 focus:border"
              placeholder="Ej: Socio antiguo, promoción de cortesía..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}

        {/* MÉTODO DE PAGO */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Método de pago
          </label>
          {methods.map((m) => (
            <label
              key={m.value}
              className={`mb-2 flex items-center justify-between px-4 py-4 rounded-xl cursor-pointer transition-all
                ${method === m.value
                  ? "border-indigo-500 bg-gray-400/50"
                  : "border-gray-200 bg-gray-200/50 hover:border-gray-700"
                }`}
            >
              <div className="flex items-center gap-3 text-gray-600">
                {m.icon}
                <span className="text-sm font-medium">{m.label}</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${method === m.value ? "border-indigo-500" : "border-gray-300"}`}
              >
                {method === m.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                )}
              </div>
              <input
                type="radio"
                name="method"
                value={m.value}
                className="hidden"
                onChange={() => setMethod(m.value)}
              />
            </label>
          ))}
        </div>

        {/* RESUMEN ANTES DE GUARDAR */}
        {selectedPlanData && parsedAmount > 0 && !isOverPrice && (
          <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm">
            <p className="font-semibold text-indigo-700 mb-2">Resumen del pago</p>
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Plan</span>
              <span className="font-medium">{selectedPlanData.name}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Precio original</span>
              <span>${planPrice}</span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between text-amber-600 mb-1">
                <span>Descuento</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-indigo-700 border-t border-indigo-200 pt-2 mt-1">
              <span>Total a cobrar</span>
              <span>${parsedAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-row items-center justify-between gap-2 mt-auto pb-6 pt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-lg w-full"
            onClick={() => {
              setDni("");
              setFoundClient(null);
              setSelectedPlan("");
              setCustomAmount("");
              setNote("");
              setMethod("efectivo");
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!foundClient || !selectedPlan || isOverPrice || parsedAmount <= 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
