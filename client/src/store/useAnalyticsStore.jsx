import { create } from "zustand";

import api from "../api/axios";

export const useAnalyticsStore = create((set) => ({
  analytics: null,
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/payments/analytics");
      set({ analytics: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al cargar estadísticas",
        loading: false,
      });
    }
  },

  clearAnalytics: () => set({ analytics: null, error: null }),
}));
