import { create } from "zustand";
import { toast } from "sonner";
import api from "../api/axios";

export const useClientStore = create((set, get) => ({
  isSlideOpen: false,
  slideMode: "add",
  client: {},
  openSlide: (client = null) => {
    if (client && client._id) {
      set({ isSlideOpen: true, slideMode: "edit", client });
    } else {
      set({ isSlideOpen: true, slideMode: "add", client: {} });
    }
  },
  closeSlide: () => set({ isSlideOpen: false, client: {} }),

  clients: [],
  totalClients: 0,
  activeClients: 0,
  expiredClients: 0,
  expiringSoonClients: 0,
  newsThisMonthClients: 0,
  search: "",
  page: 1,
  limit: 10,
  totalPages: 1,
  filters: {
    status: "",
    plan: "",
  },
  isLoading: false,
  error: null,
  statsLoaded: false,
  lastFetchedParams: {
    page: null,
    search: "",
    filters: { status: "", plan: "" },
  },

  fetchClients: async (force = false) => {
    const { page, limit, search, filters, lastFetchedParams } = get();

    // evitar refetch innecesario
    if (
      !force &&
      lastFetchedParams?.page === page &&
      lastFetchedParams?.search === search &&
      lastFetchedParams?.filters?.status === filters.status &&
      lastFetchedParams?.filters?.plan === filters.plan
    ) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const res = await api.get(`/clients`, {
        params: {
          page,
          limit,
          search,
          status: filters.status,
          plan: filters.plan,
        },
      });

      set({
        clients: res.data.data || [],
        totalPages: res.data.totalPages || 1,
        lastFetchedParams: {
          page,
          search,
          filters: { ...filters },
        },
      });
    } catch (error) {
      console.error("Error fetching clients:", error);
      set({ error: "No se pudo cargar la lista de clientes. Intenta de nuevo." });
    } finally {
      set({ isLoading: false });
    }
  },

  setPage: (newPage) => {
    set({ page: newPage });
    get().fetchClients();
  },
  setSearch: (search) => {
    set({ search });
    get().fetchClients();
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      page: 1, // 👈 resetear página al filtrar
    })),

  refetchClients: async () => {
    await Promise.all([get().fetchClients(true), get().fetchStats(true)]);
  },
  getClientById: async (id) => {
    const res = await api.get(`/clients/${id}`);
    return res.data;
  },
  getClientByDni: async (dni) => {
    const res = await api.get(`/clients/byDni/${dni}`);
    return res.data;
  },
  createClient: async (data, onSuccess) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/clients", data);
      if (res.status === 201 || res.status === 200) {
        toast.success("¡Cliente agregado exitosamente!");
        await get().refetchClients();
        if (onSuccess) onSuccess();
        return true;
      }
    } catch (error) {
      console.error("Error guardando cliente:", error);
      if (error.response?.status === 409) {
        toast.error("Error: El cliente ya existe (DNI duplicado)");
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("Ocurrió un error inesperado al guardar el cliente.");
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateClient: async (id, data, onSuccess) => {
    set({ isLoading: true });
    try {
      const res = await api.put(`/clients/${id}`, data);
      if (res.status === 200) {
        toast.success("¡Cliente actualizado exitosamente!");
        await get().refetchClients();
        if (onSuccess) onSuccess();
        return true;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al actualizar el cliente",
      );
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true });
    try {
      const res = await api.delete(`/clients/${id}`);
      if (res.status === 200) {
        toast.success("¡Cliente eliminado!");
        await get().refetchClients();
        return true;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al eliminar el cliente",
      );
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  fetchStats: async (force = false) => {
    if (!force && get().statsLoaded) return;

    const res = await api.get("/clients/stats");
    set({
      totalClients: res.data.totalClients || 0,
      activeClients: res.data.activeClients || 0,
      expiredClients: res.data.expiredClients || 0,
      expiringSoonClients: res.data.expiringSoonClients || 0,
      newsThisMonthClients: res.data.newsThisMonthClients || 0,
      statsLoaded: true,
    });
  },
}));
