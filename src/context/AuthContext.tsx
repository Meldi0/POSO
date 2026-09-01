import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isStaff: boolean; // operator, upt, or admin
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = apiService.getStoredUser();
      const storedToken = apiService.getStoredToken();
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiService.login({ email, password });
      if (res.status === 'success' && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        setIsLoading(false);
        return { success: true, role: res.data.user.role };
      }
      setIsLoading(false);
      return { success: false, message: res.message || 'Login gagal. Periksa kembali email dan password Anda.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Gagal menghubungi server autentikasi.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiService.register({ name, email, password });
      if (res.status === 'success' && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: res.message || 'Registrasi gagal.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Terjadi kesalahan sistem.' };
    }
  };

  const logout = () => {
    apiService.setStoredUser(null);
    setUser(null);
    setToken(null);
  };

  const isStaff = Boolean(user && (user.role === 'operator' || user.role === 'upt' || user.role === 'admin'));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isStaff,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
