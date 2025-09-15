import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setAuth: (isAuthenticated: boolean, user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      
      setAuth: (isAuthenticated, user) => {
        set({ isAuthenticated, user });
      },
      
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        set({ isAuthenticated: false, user: null });
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
