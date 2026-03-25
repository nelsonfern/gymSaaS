import { create } from "zustand";
import api from "../api/axios";
import { toast } from "sonner";

export const usePlansStore = create((set, get) => ({
  plans: [],
  plansLoaded: false,
  loading: false,
  isSlideOpen: false,
  plan: {},
  openSlide: (plan = null) => {
    if (plan && plan._id) {
      set({ isSlideOpen: true, slideMode: "edit", plan });
    } else {
      set({ isSlideOpen: true, slideMode: "add", plan: {} });
    }
  },
  closeSlide: () => set({ isSlideOpen: false, plan: {} }),
  error: null,

  fetchPlans: async (force = false) => {
    if (!force && get().plansLoaded) return;

    set({ loading: true, error: null });
    try {
      const response = await api.get("/plans");
      set({ plans: response.data, loading: false, plansLoaded: true });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addPlan: async (plan) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/plans", plan);
      set((state) => ({
        plans: [...state.plans, response.data],
        loading: false,
      }));
      toast.success("Plan agregado correctamente");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error("Error al agregar plan");
    }
  },

  updatePlan: async (id, plan) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/plans/${id}`, plan);
      set((state) => ({
        plans: state.plans.map((p) => (p._id === id ? response.data : p)),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deletePlan: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/plans/${id}`);
      set((state) => ({
        plans: state.plans.filter((p) => p._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
