import { useAnalyticsStore } from "../store/useAnalyticsStore";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../components/StatCard";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Wallet,
  TrendingDown,
  Percent,
} from "lucide-react";

// Paleta de colores Premium
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const formatCurrency = (value) => `$${value.toLocaleString("es-AR")}`;
const formatDate = (dateString) => {
  const date = new Date(dateString + "T00:00:00"); // evitamos corrimientos de zona horaria
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
};
const formatName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export default function Reports() {
  const { fetchAnalytics, analytics, isLoading, error } = useAnalyticsStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role === "staff") {
      navigate("/"); // fallback si es staff
      return;
    }
    fetchAnalytics();
  }, [fetchAnalytics, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-xl text-red-600 border border-red-200">
        <span className="font-bold">Error:</span> {error}
      </div>
    );
  }

  if (!analytics) return null;

  const { kpis, revenueByDay, revenueByMethod, revenueByPlan } = analytics;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Financiero
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Análisis de ingresos, métodos de pago y rendimiento de planes de los
          últimos 30 días.
        </p>
      </div>

      {/* Tarjetas Superiores (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Ingresos"
          value={formatCurrency(kpis.totalIncome)}
          icon={<Wallet size={20} absoluteStrokeWidth={true} />}
          color="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          title="Ingresos del Mes"
          value={formatCurrency(kpis.totalThisMonth)}
          icon={<DollarSign size={20} absoluteStrokeWidth={true} />}
          color="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          title="Mes Anterior"
          value={formatCurrency(kpis.totalLastMonth)}
          icon={<Calendar size={20} absoluteStrokeWidth={true} />}
          color="text-gray-500 bg-gray-100"
        />
        <StatCard
          title="Crecimiento"
          value={`${kpis.growthPercentage > 0 ? "+" : ""}${kpis.growthPercentage}%`}
          icon={
            kpis.growthPercentage >= 0 ? (
              <TrendingUp size={20} absoluteStrokeWidth={true} />
            ) : (
              <TrendingDown size={20} absoluteStrokeWidth={true} />
            )
          }
          color={
            kpis.growthPercentage >= 0
              ? "text-emerald-500 bg-emerald-50"
              : "text-rose-500 bg-rose-50"
          }
          textColor={
            kpis.growthPercentage >= 0 ? "text-emerald-600" : "text-rose-600"
          }
        />
        <StatCard
          title="Descuentos Aplicados"
          value={formatCurrency(kpis.discountsThisMonth)}
          icon={<Percent size={20} absoluteStrokeWidth={true} />}
          color="text-amber-500 bg-amber-50"
        />
      </div>

      {/* Fila Principal de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Evolución Diaria (Ocupa 2/3 de la pantalla en Desktop) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Evolución de Ingresos
            </h3>
            <p className="text-xs text-gray-400">
              Total facturado por día (Últimos 30 días)
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueByDay}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  tickFormatter={(val) => `$${val / 1000}k`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Suma Total"]}
                  labelFormatter={formatDate}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Dona: Distribución por Planes */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 flex flex-col">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-gray-800">Ventas por Plan</h3>
            <p className="text-xs text-gray-400">Distribución de ganancia</p>
          </div>
          <div className="h-[250px] min-h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByPlan}
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="name"
                  stroke="none"
                >
                  {revenueByPlan.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fila Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras: Métodos de pago */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Métodos de Pago Preferidos
            </h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByMethod}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#E5E7EB"
                />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickFormatter={formatName}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#6B7280",
                    fontSize: 13,
                    textTransform: "capitalize",
                  }}
                  width={100}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Monto"]}
                  cursor={{ fill: "#F3F4F6" }}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={30}>
                  {revenueByMethod.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[(index + 1) % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
