import { create } from "zustand";
import api from "../api/axios";

export const useCheckinStore = create((set, get) => ({
  todayCheckins: [],
  checkins: [],

  checkinsLoaded: false,
  isLoading: false,
  addCheckin: async (dni) => {
    try {
      const res = await api.post("/checkins", { dni });

      const newCheckin = res.data.checkin;

      if (newCheckin) {
        set((state) => ({
          todayCheckins: [newCheckin, ...state.todayCheckins],
        }));

        localStorage.setItem("newCheckin", JSON.stringify(newCheckin));
      }

      return {
        success: true,
        message: res.data.message,
      };
    } catch (error) {
      const newCheckin = error.response?.data?.checkin;

      if (newCheckin) {
        set((state) => ({
          todayCheckins: [
            newCheckin,
            ...state.todayCheckins.filter((c) => c._id !== newCheckin._id),
          ],
        }));

        localStorage.setItem("newCheckin", JSON.stringify(newCheckin));
      }

      return {
        success: false,
        message:
          error.response?.data?.message || "Error al registrar el ingreso",
      };
    }
  },
  fetchTodayCheckins: async (force = false) => {
    const now = Date.now();

    if (
      !force &&
      get().lastFetch &&
      now - get().lastFetch < 10000 // 10 segundos
    ) {
      return;
    }

    set({ isLoading: true });

    try {
      const res = await api.get("/checkins/today");

      set({
        todayCheckins: res.data || [],
        checkinsLoaded: true,
        lastFetch: now,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCheckins: async () => {
    try {
      const res = await api.get("/checkins");

      set({
        checkins: Array.isArray(res.data) ? res.data : res.data.checkins || [],
      });
    } catch (error) {
      console.error(error);
    }
  },
}));
