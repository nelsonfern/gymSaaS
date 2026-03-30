import { create } from "zustand";
import api from "../api/axios";
import { toast } from "sonner";

export const useSettingsStore = create((set) => ({
  settings: null,
  loading: true,
  error: null,
  fetchSettings: async () => {
    try {
      const response = await api.get("/settings");
      if (response.data.success) {
        set({ settings: response.data.settings });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  updateSettings: async (settings) => {
    try {
      const response = await api.put(`/settings/${settings._id}`, settings);
      if (response.data.success) {
        set({ settings: response.data.settings });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
