import { StatCard } from "../components/StatCard";
import { Users, Wallet } from "lucide-react";
import { RecentActivity } from "../components/RecentActivity";
import { RecentPayments } from "../components/RecentPayments";
import { useEffect } from "react";
import { useClientStore } from "../store/useClientStore";
import { usePaymentStore } from "../store/usePaymentStore";
import { useCheckinStore } from "../store/useCheckinStore";

export default function Dashboard() {
  const totalClients = useClientStore((state) => state.totalClients);
  const activeClients = useClientStore((state) => state.activeClients);
  const expiredClients = useClientStore((state) => state.expiredClients);
  const fetchStats = useClientStore((state) => state.fetchStats);

  // Pagos
  const activity = usePaymentStore((state) => state.payments);
  const totalIncome = usePaymentStore((state) => state.totalIncome);
  const fetchPaymentsData = usePaymentStore((state) => state.fetchPaymentsData);

  // Checkins
  const checkins = useCheckinStore((state) => state.todayCheckins);
  const fetchTodayCheckins = useCheckinStore(
    (state) => state.fetchTodayCheckins,
  );

  useEffect(() => {
    fetchStats();
    fetchPaymentsData();
    fetchTodayCheckins();
  }, [fetchStats, fetchPaymentsData, fetchTodayCheckins]);
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full">
        {/* grid con tantas rows como cards haya */}
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
            value={totalIncome}
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
            color="bg-blue-100 "
            subtitle="Miembros activos"
          />
        </div>
        <div className="p-2">
          <StatCard
            title="Miembros Inactivos"
            value={expiredClients}
            textColor="text-red-500"
            icon={<Users size={24} />}
            color="bg-red-100"
            subtitle="Miembros inactivos"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full">
        <div className="p-2 w-full md:w-2/3">
          <RecentActivity data={checkins} />
        </div>
        <div className="p-2 w-full md:w-1/3">
          <RecentPayments data={activity} />
        </div>
      </div>
    </>
  );
}
