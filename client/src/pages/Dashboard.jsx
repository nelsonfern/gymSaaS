import { StatCard } from "../components/StatCard";
import { Users, Wallet, AlertCircle } from "lucide-react";
import { RecentActivity } from "../components/RecentActivity";
import { RecentPayments } from "../components/RecentPayments";
import { useEffect, useState } from "react";
import { useClientStore } from "../store/useClientStore";
import { usePaymentStore } from "../store/usePaymentStore";
import { useCheckinStore } from "../store/useCheckinStore";
import { useAnalyticsStore } from "../store/useAnalyticsStore";
import { TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";

// Formato moneda simple
const formatCurrency = (value) => `$${Number(value).toLocaleString("es-AR")}`;

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
  const fetchPaymentsData = usePaymentStore((state) => state.fetchPaymentsData);

  const fetchAnalytics = useAnalyticsStore((state) => state.fetchAnalytics);
  const analytics = useAnalyticsStore((state) => state.analytics);

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
        fetchAnalytics(),
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full mb-4">
        {loading || !analytics ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            {/* Tarjetas Financieras */}
            <div className="p-2">
              <StatCard
                title="Total Ingresos Historico"
                value={formatCurrency(analytics.kpis.totalIncome)}
                icon={<Wallet size={20} absoluteStrokeWidth={true} />}
                color="bg-emerald-50 text-emerald-600"
                subtitle="Desde el inicio"
              />
            </div>
            <div className="p-2">
              <StatCard
                title="Ingresos Este Año"
                value={formatCurrency(analytics.kpis.totalIncomeYear)}
                icon={<Calendar size={20} absoluteStrokeWidth={true}/>}
                color="bg-teal-50 text-teal-600"
                subtitle="Acumulado del año"
              />
            </div>
            <div className="p-2">
              <StatCard
                title="Ingresos Este Mes"
                value={formatCurrency(analytics.kpis.totalThisMonth)}
                icon={
                  analytics.kpis.growthPercentage >= 0 
                  ? <TrendingUp size={20} absoluteStrokeWidth={true} /> 
                  : <TrendingDown size={20} absoluteStrokeWidth={true} />
                }
                color={analytics.kpis.growthPercentage >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}
                subtitle={
                  <span className={analytics.kpis.growthPercentage >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                    {analytics.kpis.growthPercentage >= 0 ? "+" : ""}{analytics.kpis.growthPercentage}% vs mes pasado
                  </span>
                }
              />
            </div>

            {/* Tarjetas de Clientes */}
            <div className="p-2">
              <StatCard
                title="Total Clientes"
                value={totalClients}
                icon={<Users size={20} absoluteStrokeWidth={true} />}
                color="bg-indigo-50 text-indigo-600"
                subtitle="En la base de datos"
              />
            </div>
            <div className="p-2">
              <StatCard
                title="Miembros Activos"
                value={activeClients}
                textColor="text-cyan-600"
                icon={<Users size={20} absoluteStrokeWidth={true} />}
                color="bg-cyan-50 text-cyan-500"
                subtitle="Tienen plan vigente"
              />
            </div>
            <div className="p-2">
              <StatCard
                title="Miembros Inactivos"
                value={`${expiredClients}`}
                textColor="text-rose-600"
                icon={<AlertCircle size={20} absoluteStrokeWidth={true} />}
                color="bg-rose-50 text-rose-500"
                subtitle="Plan expirado o sin plan"
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
