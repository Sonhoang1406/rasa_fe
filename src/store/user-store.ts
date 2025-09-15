import { UserProfile } from "@/lib/types/user-type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


interface UserStore {
  credentialId: string | null;
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  setId: (id: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      credentialId: null,
      user: null,
      setUser: (user) => set({ user }),
      setId: (id) => set({ credentialId: id }),
      clearUser: () => set({ user: null, credentialId: null }),
    }),
    {
      name: "user-storage", // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage), // Lưu vào localStorage
    }
  )
);
