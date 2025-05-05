// store/userAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
  setHasHydrated: (val: boolean) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      setLoading: (val) => set({ loading: val }),
      setError: (err) => set({ error: err }),
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
