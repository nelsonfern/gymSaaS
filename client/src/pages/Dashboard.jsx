import { StatCard } from "../components/StatCard";
import { Users, Wallet, AlertCircle } from "lucide-react";
import { RecentActivity } from "../components/RecentActivity";
import { RecentPayments } from "../components/RecentPayments";
import { useEffect, useState } from "react";
import { useClientStore } from "../store/useClientStore";
import { usePaymentStore } from "../store/usePaymentStore";
import { useCheckinStore } from "../store/useCheckinStore";

function StatSkeleton() {
  return (
    <div className="p-2">
      <div className="bg-white rounded-2xl shadow-xs p-4 animate-pulse">
        <div className="h-3 bg-gray-200 rounded-full w-2/3 mb-3" />
        <div className="h-7 bg-gray-200 rounded-full w-1/3 mb-2" />
        <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
      </div>
    </div>
  );
}

function ListSkeleton({ rows = 4 }) {
  return (
    <div className="bg-white rounded-2xl shadow-xs p-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded-full w-1/3 mb-6" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-gray-200 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded-full w-2/3" />
            <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const totalClients = useClientStore((state) => state.totalClients);
  const activeClients = useClientStore((state) => state.activeClients);
  const expiredClients = useClientStore((state) => state.expiredClients);
  const fetchStats = useClientStore((state) => state.fetchStats);

  const activity = usePaymentStore((state) => state.payments);
  const totalIncome = usePaymentStore((state) => state.totalIncome);
  const fetchPaymentsData = usePaymentStore((state) => state.fetchPaymentsData);

  const checkins = useCheckinStore((state) => state.todayCheckins);
  const fetchTodayCheckins = useCheckinStore(
    (state) => state.fetchTodayCheckins,
  );
  const setCheckinState = useCheckinStore.setState;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchStats(true),
        fetchPaymentsData(),
        fetchTodayCheckins(true),
      ]);
    } catch (e) {
      setError("No se pudo cargar el dashboard. Verificá tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "newCheckin") {
        try {
          const checkin = JSON.parse(e.newValue);
          if (checkin) {
            setCheckinState((state) => ({
              todayCheckins: [
                checkin,
                ...state.todayCheckins.filter((c) => c._id !== checkin._id),
              ],
            }));
          }
        } catch (err) {
          console.error("Error parsing checkin:", err);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setCheckinState]);

  return (
    <>
      <div className="mb-4 p-2">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">
          Descripción General
        </h1>
        <p className="text-gray-500 text-sm font-normal">
          Bienvenido de nuevo, aquí está lo que está pasando hoy en tu gimnasio.
        </p>
      </div>

      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-4 mb-6 mx-2">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm font-medium text-red-600 flex-1">{error}</p>
          <button
            onClick={loadAll}
            className="text-xs font-semibold text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <div className="p-2">
              <StatCard
                title="Total Clientes"
                value={totalClients}
                icon={<Users size={24} />}
                color="bg-green-100"
                subtitle="Todos los clientes"
              />
            </div>
            <div className="p-2">
              <StatCard
                title="Total Ingresos del mes"
                value={`$${totalIncome}`}
                icon={<Wallet size={24} />}
                color="bg-green-100"
                subtitle="Ingresos del mes"
              />
            </div>
            <div className="p-2">
              <StatCard
                title="Miembros Activos"
                value={activeClients}
                textColor="text-blue-500"
                icon={<Users size={24} />}
                color="bg-blue-100"
                subtitle="Miembros activos"
              />
            </div>
            <div className="p-2">
              <StatCard
                title="Miembros Inactivos"
                value={`${expiredClients}`}
                textColor="text-red-500"
                icon={<Users size={24} />}
                color="bg-red-100"
                subtitle="Miembros inactivos"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row w-full">
        <div className="p-2 w-full md:w-2/3">
          {loading ? (
            <ListSkeleton rows={5} />
          ) : (
            <RecentActivity data={checkins} />
          )}
        </div>
        <div className="p-2 w-full md:w-1/3">
          {loading ? (
            <ListSkeleton rows={4} />
          ) : (
            <RecentPayments data={activity} />
          )}
        </div>
      </div>
    </>
  );
}
