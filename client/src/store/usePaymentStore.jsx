import { create } from "zustand";
import api from "../api/axios";
import { toast } from "sonner";
import { useClientStore } from "./useClientStore";

export const usePaymentStore = create((set, get) => ({
  payments: [],
  totalIncome: 0,
  paymentsLoaded: false,
  isLoading: false,
  page: 1,
  totalPages: 1,
  limit: 7,
  search: "",
  createPayment: async (data) => {
    try {
      const res = await api.post("/payments", data);
      if (res.status === 201) {
        toast.success("¡Pago registrado!");
        set({ paymentsLoaded: false });
        await Promise.all([
          get().fetchPaymentsData(),
          useClientStore.getState().refetchClients(), // refresca lista + stats de clientes
        ]);
        return true;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al registrar el pago",
      );
      return false;
    }
  },
  fetchPaymentsData: async (force = false) => {
    const { page, limit, search } = get();
    if (!force && get().paymentsLoaded) return;

    set({ isLoading: true });
    try {
      const { page, limit, search } = get();
      const [totalIncomeRes, paymentsRes] = await Promise.all([
        api.get("/payments/total"),
        api.get(`/payments?page=${page}&limit=${limit}&search=${search}`),
      ]);

      const incomeObj = totalIncomeRes.data.totalMonth;
      const value = incomeObj.reduce((acc, item) => acc + item.total, 0);

      set({
        totalIncome: value || 0,
        payments: paymentsRes.data.data || [],
        totalPages: paymentsRes.data.totalPages || 1,
        paymentsLoaded: true,
      });
    } catch (error) {
      console.error("Error cargando pagos:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
