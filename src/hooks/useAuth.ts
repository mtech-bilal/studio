// src/hooks/useAuth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string; // Role name, e.g., "admin", "physician", "customer"
  avatarUrl?: string;
  initials?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Initially true until auth status is checked
      login: (userData) => set({ user: userData, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

// Hook to use in components
export const useAuth = () => {
  const { user, isAuthenticated, login, logout, isLoading, setIsLoading } = useAuthStore();

  // Effect to check auth status on mount (e.g., if session is persisted)
  // This is simplified. In a real app, you might verify a token here.
  React.useEffect(() => {
    // If user is already in persisted state, no need to set loading to false again unless it was true.
    // The `persist` middleware handles rehydration.
    // We set isLoading to false initially if rehydration happened.
    if(isAuthenticated){
        setIsLoading(false);
    } else {
        // If not authenticated from persisted state, assume loading has finished.
        // For a real app, this might involve checking a session token with a server.
        setIsLoading(false);
    }
  }, [isAuthenticated, setIsLoading]);

  return { user, isAuthenticated, login, logout, isLoading, setIsLoading };
};
