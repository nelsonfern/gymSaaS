import { useState } from "react";
import { CreditCard, Building2, Banknote, HandCoins } from "lucide-react";
import { usePaymentStore } from "../store/usePaymentStore";
import { useEffect } from "react";
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
  const plans = usePlansStore((state) => state.plans);
  const fetchPlans = usePlansStore((state) => state.fetchPlans);
  const [selectedPlan, setSelectedPlan] = useState("");
  useEffect(() => {
    fetchPlans();
    if (dni.length < 7) {
      setFoundClient(null);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(`/clients/byDni/${dni}`);
        const exact = res.data;
        setFoundClient(exact || null);
      } catch {
        setFoundClient(null);
      } finally {
        setSearching(false);
      }
    }, 500); // espera 500ms después de que deje de tipear
    return () => clearTimeout(timer);
  }, [dni]);
  const handleSumbit = (e) => {
    e.preventDefault();
    if (!foundClient || !selectedPlan) return;

    const price = plans.find((plan) => plan._id === selectedPlan)?.price;
    if (!price) return;

    const payment = {
      client: foundClient._id, // el backend espera "client"
      plan: selectedPlan, // el backend espera "plan"
      amount: price, // el backend espera "amount"
      method,
    };
    usePaymentStore.getState().createPayment(payment);
    setDni("");
    setFoundClient(null);
    setSelectedPlan("");
    setMethod("efectivo");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs p-6 mt-6">
      <div className="flex items-center gap-2 ">
        <div className="bg-indigo-100  rounded-lg p-2">
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
        onSubmit={handleSumbit}
        className="flex flex-col flex-1 min-h-0 mt-6 overflow-y-auto"
      >
        <div className="mb-7">
          <label
            className="block text-sm font-medium text-gray-500 mb-2"
            htmlFor="name"
          >
            Busque el cliente por DNI
          </label>
          <input
            type="text"
            name="name"
            className="px-4 py-3 text-gray-500 w-full   rounded-lg bg-gray-200/50  focus:border "
            required
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
          {searching && <p>Buscando...</p>}
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
        <div className="mb-7">
          <label
            className="block text-sm font-medium text-gray-500 mb-2"
            htmlFor="plan"
          >
            Seleccione el plan
          </label>
          <select
            name="plan"
            className="w-full px-4 py-3 bg-gray-200/50 rounded-lg focus:border "
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

        <div className="mb-7">
          <label
            className="block text-sm font-medium text-gray-500 mb-2"
            htmlFor="price"
          >
            Precio
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              disabled
              type="number"
              name="price"
              className="text-gray-500 w-full px-4 py-3  rounded-lg bg-gray-200/50  focus:border "
              required
              style={{
                paddingLeft: "2rem",
              }}
              value={
                plans.find((plan) => plan._id === selectedPlan)?.price || ""
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="block text-sm font-medium text-gray-500 mb-2"
            htmlFor="method"
          >
            Método de pago
          </label>
          {methods.map((m) => (
            <label
              key={m.value}
              className={` mb-2 flex items-center justify-between px-4 py-4 rounded-xl cursor-pointer transition-all
        ${
          method === m.value
            ? "border-indigo-500 bg-gray-400/50"
            : "border-gray-200 bg-gray-200/50 hover:border-gray-700"
        }`}
            >
              {/* Lado izquierdo: ícono + label */}
              <div className="flex items-center gap-3 text-gray-600">
                {m.icon}
                <span className="text-sm font-medium">{m.label}</span>
              </div>
              {/* Radio custom */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${method === m.value ? "border-indigo-500" : "border-gray-300"}`}
              >
                {method === m.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                )}
              </div>
              {/* Input real oculto */}
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

        <div className="flex flex-row items-center justify-between gap-2 mt-auto pb-6 pt-4">
          <button type="button" className="px-4 py-2 border rounded-lg w-full">
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
