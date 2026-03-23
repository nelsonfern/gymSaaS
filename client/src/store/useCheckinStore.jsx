import { create } from 'zustand'
import api from '../api/axios'

export const useCheckinStore = create((set, get) => ({
    todayCheckins: [],
    checkinsLoaded: false,
    isLoading: false,

    fetchTodayCheckins: async (force = false) => {
        if (!force && get().checkinsLoaded) return;

        set({ isLoading: true });
        try {
            const checkinsRes = await api.get("/checkins/today");

            set({
                todayCheckins: checkinsRes.data || [],
                checkinsLoaded: true
            });
        } catch (error) {
            console.error("Error cargando checkins:", error);
        } finally {
            set({ isLoading: false });
        }
    }
}))
