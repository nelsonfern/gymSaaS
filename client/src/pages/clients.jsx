import { useClientStore } from "../store/useClientStore";
import { UserPlus } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { usePlansStore } from "../store/usePlansStore";

export default function Clients() {
  const openSlide = useClientStore((state) => state.openSlide);
  const clients = useClientStore((state) => state.clients);
  const page = useClientStore((state) => state.page);
  const totalPages = useClientStore((state) => state.totalPages);
  const fetchClients = useClientStore((state) => state.fetchClients);
  const fetchStats = useClientStore((state) => state.fetchStats);
  const deleteClient = useClientStore((state) => state.deleteClient);
  const totalClients = useClientStore((state) => state.totalClients);
  const activeClients = useClientStore((state) => state.activeClients);
  const expiredClients = useClientStore((state) => state.expiredClients);
  const expiringSoonClients = useClientStore(
    (state) => state.expiringSoonClients,
  );
  const newsThisMonthClients = useClientStore(
    (state) => state.newsThisMonthClients,
  );
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const searchParam = searchParams.get("search") || "";

    useClientStore.setState({
      page: pageParam,
      search: searchParam,
    });
    fetchClients();
  }, [searchParams]);

  useEffect(() => {
    fetchStats();
  }, []);

  const navigate = useNavigate();

  const columns = [
    {
      header: "NOMBRE Y DNI",
      csvValue: (client) => `${client.name} ${client.lastName || ""}`.trim(),
      render: (client) => (
        <div>
          <div
            onClick={() => navigate(`/clients/profile/${client.dni}`)}
            className="cursor-pointer hover:text-indigo-600"
          >
            <p className="font-medium">
              {client.name} {client.lastName || ""}
            </p>
          </div>
          <p className="text-gray-400 text-xs">DNI: {client.dni}</p>
          <p className="text-gray-400 text-xs">
            Joined{" "}
            {new Date(client.createdAt).toLocaleDateString([], {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      ),
    },
    {
      header: "CONTACTO",
      csvValue: (client) =>
        `${client.email || ""} ${client.phone || ""}`.trim(),
      render: (client) => (
        <div>
          <p>
            {client.email || <span className="text-gray-300">Sin email</span>}
          </p>
          <p className="text-gray-400 text-xs">{client.phone || ""}</p>
        </div>
      ),
    },
    {
      header: "ESTADO",
      csvValue: (client) => client.status.toUpperCase(),
      render: (client) =>
        client.status === "activo" ? (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600`}
          >
            {client.status.toUpperCase()}
          </span>
        ) : (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600`}
          >
            {client.status.toUpperCase().replace("_", " ")}
          </span>
        ),
    },
    {
      header: "FECHA DE VENCIMIENTO",
      csvValue: (client) =>
        client.membershipEnd
          ? new Date(client.membershipEnd).toLocaleDateString()
          : "Sin plan",
      render: (client) => (
        <span className="flex text-gray-600 text-xs items-center justify-center">
          {client.membershipEnd
            ? new Date(client.membershipEnd).toLocaleDateString([], {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Sin plan"}
        </span>
      ),
    },
    {
      header: "PLAN",
      csvValue: (client) => client.plan?.name || "Sin plan",
      render: (client) => (
        <span className="text-gray-600">{client.plan?.name || "Sin plan"}</span>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="mb-4 p-2">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">Clientes</h1>
          <p className="text-gray-500 text-sm font-normal">
            Aquí puedes ver todos los clientes registrados en el gimnasio.
          </p>
        </div>
        <button
          className="w-48 h-10 flex justify-center items-center align-center
                px-4 py-2 border border-transparent 
                rounded-md shadow-sm text-white 
                bg-indigo-600 hover:bg-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={openSlide}
        >
          <UserPlus size={18} className="mr-2" />
          <span className="text-xs font-semibold"> Agregar Cliente</span>
        </button>
      </div>
      <div className="flex flex-col md:flex-row w-full gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 w-full gap-2">
          <StatCard
            title="Total Clientes"
            value={totalClients}
            subtitle="Todos los clientes"
            titleColor="text-gray-600"
          />
          <StatCard
            title="Clientes Activos"
            value={activeClients}
            textColor="text-blue-500"
            titleColor="text-gray-600"
            subtitle="Clientes activos"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 w-full gap-2 bg-gray-200 p-1 rounded-lg">
          <StatCard
            title="Nuevos Clientes"
            value={newsThisMonthClients}
            titleColor="text-gray-600"
            subtitle="Nuevos clientes"
          />
          <StatCard
            title="Clientes Expirados"
            value={expiredClients}
            bgColor="bg-transparent"
            titleColor="text-red-500"
            textColor="text-red-500"
            subtitle="Clientes expirados"
          />
          <StatCard
            title="Clientes Por Expirar"
            value={expiringSoonClients}
            textColor="text-[#964900]"
            titleColor="text-[#964900]"
            bgColor="bg-transparent"
            subtitle="Clientes por expirar"
          />
        </div>
      </div>
      <DataTable
        title="Lista de Clientes"
        data={clients}
        page={page}
        totalPages={totalPages}
        onEdit={(client) => openSlide(client)}
        onDelete={(_id) => deleteClient(_id)}
        columns={columns}
        fetchAllData={async () => {
          const res = await api.get("/clients"); // sin page/limit → devuelve todos
          return res.data.data || [];
        }}
      />
    </>
  );
}
