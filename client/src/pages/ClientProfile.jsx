import { useParams, useNavigate } from "react-router-dom";
import { useClientStore } from "../store/useClientStore";
import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  Users,
  LogIn,
  LogOut,
  Pencil,
  Snowflake,
  Plus,
} from "lucide-react";
import { EditClientSlideOver } from "../components/editClients";

const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
const opcionesHora = { hour: "2-digit", minute: "2-digit" };

const methodLabel = (m) => {
  if (!m) return "—";
  return (
    {
      tarjeta: "Tarjeta",
      efectivo: "Efectivo",
      transferencia: "Transferencia",
    }[m] ?? m
  );
};

export default function ClientProfile() {
  const { dni } = useParams();
  const { getClientByDni } = useClientStore();
  const navigate = useNavigate();
  const { openSlide } = useClientStore();
  const isSlideOpen = useClientStore((state) => state.isSlideOpen);
  const [client, setClient] = useState(null);
  const [payments, setPayments] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga inicial: cliente por DNI, luego sus pagos y checkins
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientData = await getClientByDni(dni);
      setClient(clientData);
      const [paymentsRes, checkinsRes] = await Promise.all([
        api.get(`/payments/client/${clientData._id}`),
        api.get(`/checkins/${clientData._id}`),
      ]);
      setPayments(paymentsRes.data);
      setCheckins(checkinsRes.data);
    } catch (e) {
      setError(
        "No se pudo cargar el perfil del cliente. Verificá tu conexión e intentá de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dni]);

  // Cuando el slide de edición se cierra, refrescamos datos del cliente
  useEffect(() => {
    if (!isSlideOpen && client) {
      getClientByDni(dni)
        .then(setClient)
        .catch(() => {});
    }
  }, [isSlideOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActive = client?.status === "activo";

  return (
    <>
      <EditClientSlideOver />
      <button
        onClick={() => navigate("/clients")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a clientes
      </button>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mb-6">
          <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-red-400" />
          </div>
          <p className="text-red-600 font-medium mb-1">{error}</p>
          <button
            onClick={loadData}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading && (
        <div className="animate-pulse">
          <div className="bg-white rounded-2xl shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="h-6 bg-gray-200 rounded-full w-1/3" />
              <div className="h-3 bg-gray-100 rounded-full w-1/5" />
              <div className="flex gap-6">
                <div className="h-4 bg-gray-200 rounded-full w-32" />
                <div className="h-4 bg-gray-200 rounded-full w-28" />
                <div className="h-4 bg-gray-200 rounded-full w-36" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl px-6 py-4 w-48 h-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-xs p-6 h-52" />
            <div className="bg-white rounded-2xl shadow-xs p-6 h-52" />
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL — solo si no carga y no hay error */}
      {!loading && !error && (
        <>
          <div className="bg-white rounded-2xl shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div
              className={`w-20 h-20 rounded-xl ${isActive ? "bg-blue-100" : "bg-amber-100"} flex items-center justify-center shrink-0`}
            >
              <Users
                size={40}
                className={`${isActive ? "text-blue-400" : "text-amber-400"}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  {client?.name} {client?.lastName}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-orange-100 text-orange-500"
                  }`}
                >
                  {client?.status?.toUpperCase().replace("_", " ") ?? "—"}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">DNI {client?.dni}</p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                {[
                  {
                    icon: <Mail size={14} className="text-indigo-600" />,
                    label: "Email",
                    value: client?.email,
                  },
                  {
                    icon: <Phone size={14} className="text-indigo-600" />,
                    label: "Teléfono",
                    value: client?.phone,
                  },
                  {
                    icon: <Users size={14} className="text-indigo-600" />,
                    label: "Miembro desde",
                    value: client?.createdAt
                      ? new Date(client.createdAt).toLocaleDateString(
                          [],
                          opciones,
                        )
                      : "—",
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="bg-indigo-100 p-1.5 rounded-md">{icon}</div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">
                        {label}
                      </p>
                      <p>{value || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 flex gap-6 shrink-0 text-center">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide mb-1">
                    Plan actual
                  </p>
                  <p className="text-sm font-bold text-indigo-600">
                    {client?.plan?.name
                      ? `Plan: ${client.plan.name}`
                      : "Sin plan"}
                  </p>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide mb-1">
                    Vencimiento
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {client?.membershipEnd
                      ? new Date(client.membershipEnd).toLocaleDateString(
                          [],
                          opciones,
                        )
                      : "—"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 ">
                  Dias restantes: {client?.daysLeft ? client.daysLeft : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-xs p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-gray-800">
                  Historial de Pagos
                </h2>
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                  {payments.length}
                </span>
              </div>

              <div className="overflow-y-auto max-h-72">
                {payments.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Sin pagos registrados
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[10px] text-gray-400 uppercase border-b border-gray-100">
                        <th className="text-left pb-2 font-semibold">
                          Descripción
                        </th>
                        <th className="text-left pb-2 font-semibold">Fecha</th>
                        <th className="text-left pb-2 font-semibold">Método</th>
                        <th className="text-right pb-2 font-semibold">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {payments.map((p, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 text-gray-700 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                              <div>
                                <p>{p.plan?.name ?? "—"}</p>
                                {p.note && (
                                  <p className="text-xs text-gray-400 font-normal">
                                    {p.note}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-gray-400">
                            {new Date(p.createdAt).toLocaleDateString(
                              [],
                              opciones,
                            )}
                          </td>
                          <td className="py-3">
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                              {methodLabel(p.method)}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <p className="font-semibold text-gray-700">
                              ${p.amount}
                            </p>
                            {p.discount > 0 && (
                              <p className="text-xs text-amber-500 font-medium">
                                -{`$${p.discount.toFixed(2)}`} desc.
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xs p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-gray-800">
                  Historial de Check-ins
                </h2>
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                  {checkins.length}
                </span>
              </div>

              <div className="overflow-y-auto max-h-72">
                {checkins.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Sin check-ins registrados
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {checkins.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 p-1.5 rounded-md">
                            {c.status === "permitido" ? (
                              <LogIn size={14} className="text-indigo-500" />
                            ) : (
                              <LogOut size={14} className="text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(c.date).toLocaleDateString(
                                [],
                                opciones,
                              )}
                            </p>
                            <p className="text-xs text-gray-400">
                              {c.status.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(c.date).toLocaleTimeString(
                            [],
                            opcionesHora,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/payments")}
              className="flex items-center gap-4 p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm hover:shadow-indigo-300/50 hover:shadow-lg"
            >
              <div className="bg-white/20 rounded-xl p-2.5">
                <Plus size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Registrar Pago</p>
                <p className="text-xs text-indigo-200">
                  Añadir nueva transacción
                </p>
              </div>
            </button>

            <button
              onClick={() => client && openSlide(client)}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-100 transition-all shadow-sm"
            >
              <div className="bg-gray-100 rounded-xl p-2.5">
                <Pencil size={22} className="text-gray-500" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Editar Perfil</p>
                <p className="text-xs text-gray-400">
                  Modificar datos personales
                </p>
              </div>
            </button>

            <button
              disabled
              className="flex items-center gap-4 p-5 rounded-2xl bg-red-50 text-red-500 border border-red-100 transition-all shadow-sm opacity-60 cursor-not-allowed"
            >
              <div className="bg-red-100 rounded-xl p-2.5">
                <Snowflake size={22} className="text-red-400" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Congelar Cuenta</p>
                <p className="text-xs text-red-400">
                  Pausar membresía temporalmente
                </p>
              </div>
            </button>
          </div>
        </>
      )}
    </>
  );
}
