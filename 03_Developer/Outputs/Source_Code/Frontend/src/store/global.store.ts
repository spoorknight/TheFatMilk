import { create } from 'zustand';

interface User {
  id: number;
  phone: string;
  role: string;
  name: string;
}

interface GlobalState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setHydrated: () => void;
  logout: () => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  token: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setHydrated: () => set({ isHydrated: true }),
  logout: () => set({ user: null, token: null }),
}));
