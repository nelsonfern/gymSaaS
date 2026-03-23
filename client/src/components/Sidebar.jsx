import { Link } from "./Link";
import { useClientStore } from "../store/useClientStore";
import {
  LayoutDashboard,
  Users,
  NotepadText,
  Wallet,
  DoorOpen,
} from "lucide-react";

export function Sidebar() {
  const openSlide = useClientStore((state) => state.openSlide);
  return (
    <aside className="relative flex flex-col shrink-0 bg-white shadow-xs shadow-gray-200/50 border-r border-gray-200 h-screen p-4 w-48">
      <div className="flex items-center mb-6">
        <img
          src="/dumbbell-gym-svgrepo-com.svg"
          alt=""
          className="h-12 w-auto mr-2"
        />
        <Link to="/" className="flex flex-col">
          <h2 className="font-bold text-2xl text-gray-700">NefGym </h2>
          <span className="text-gray-500 text-xs font-light">
            Nombre del gimnasio
          </span>
        </Link>
      </div>

      <nav className="mt-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <LayoutDashboard color="var(--color-gray-500)" size={18} />{" "}
          <span className="text-gray-500 text-sm font-normal">Dashboard</span>
        </Link>
        <Link
          to="/clients"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <Users color="var(--color-gray-500)" size={18} />{" "}
          <span className="text-gray-500 text-sm font-normal">Clientes</span>
        </Link>
        <Link
          to="/plans"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <NotepadText color="var(--color-gray-500)" size={18} />{" "}
          <span className="text-gray-500 text-sm font-normal">Planes</span>
        </Link>
        <Link
          to="/payments"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <Wallet color="var(--color-gray-500)" size={18} />{" "}
          <span className="text-gray-500 text-sm font-normal">Pagos</span>
        </Link>
        <Link
          to="/checkin"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          target="_blank"
        >
          <DoorOpen color="var(--color-gray-500)" size={18} />{" "}
          <span className="text-gray-500 text-sm font-normal">Check-in</span>
        </Link>
      </nav>
      <div className="mt-auto p-2">
        <button
          className="inline-flex items-center justify-center
                px-4 py-2 border border-transparent 
                rounded-md shadow-sm text-white 
                bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 size-full"
          onClick={openSlide}
        >
          <span className="text-xs font-semibold"> Agregar Cliente</span>
        </button>
      </div>
    </aside>
  );
}
