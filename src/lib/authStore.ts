import { create } from "zustand";
import { api } from "./api";
import { User, Registration } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  registrations: Registration[];
  
  initialize: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (fields: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  fetchRegistrations: () => Promise<void>;
  registerForEvent: (eventId: string) => Promise<{ success: boolean; message?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  registrations: [],

  initialize: () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("macfiesta_token");
      const storedUser = localStorage.getItem("macfiesta_user");
      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: JSON.parse(storedUser),
        });
        // Background updates
        get().fetchProfile();
        get().fetchRegistrations();
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("macfiesta_token", token);
        localStorage.setItem("macfiesta_user", JSON.stringify(user));
      }

      set({ token, user, isLoading: false });
      
      // Fetch registrations
      await get().fetchRegistrations();
      
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to log in. Check credentials.";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  registerUser: async (fields) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/register", fields);
      const { token, user } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("macfiesta_token", token);
        localStorage.setItem("macfiesta_user", JSON.stringify(user));
      }

      set({ token, user, isLoading: false });
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed. Try again.";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("macfiesta_token");
      localStorage.removeItem("macfiesta_user");
    }
    set({ token: null, user: null, registrations: [] });
  },

  fetchProfile: async () => {
    try {
      const response = await api.get("/auth/me");
      const { user } = response.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("macfiesta_user", JSON.stringify(user));
      }
      set({ user });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  },

  fetchRegistrations: async () => {
    try {
      const response = await api.get("/registrations/my");
      set({ registrations: response.data.registrations });
    } catch (err) {
      console.error("Failed to fetch user registrations", err);
    }
  },

  registerForEvent: async (eventId) => {
    try {
      const response = await api.post("/registrations", { eventId });
      if (response.data.success) {
        await get().fetchRegistrations();
        await get().fetchProfile(); // update XP points & badges
        return { success: true };
      }
      return { success: false, message: response.data.message || "Failed to register" };
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration error. Try again.";
      return { success: false, message };
    }
  },
}));
