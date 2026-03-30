import { create } from "zustand";
import api from "../api/axios";

export const useStaffStore = create((set, get) => ({
  staffList: [],

  fetchStaff: async () => {
    const response = await api.get("/users/staff");
    set({ staffList: response.data });
  },
  addStaff: async (data) => {
    await api.post("/users/staff", data);
    get().fetchStaff();
  },
  updateStaff: async (id, staff) => {
    await api.put(`/users/staff/${id}`, staff);
    get().fetchStaff();
  },
  deleteStaff: async (id) => {
    await api.delete(`/users/staff/${id}`);
    get().fetchStaff();
  },
}));
