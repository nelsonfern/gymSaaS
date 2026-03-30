import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { AddClientSlideOver } from "../components/SlideClient";
import { EditClientSlideOver } from "../components/editClients";
import { useClientStore } from "../store/useClientStore";

export function Layout({ children }) {
  const slideMode = useClientStore((state) => state.slideMode);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
      {slideMode === "add" && <AddClientSlideOver />}
      {slideMode === "edit" && <EditClientSlideOver />}
    </div>
  );
}
