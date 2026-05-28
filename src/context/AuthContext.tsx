import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getPortalLoginPath } from '../utils/tenantRedirect';

// ======================================
// Types
// ======================================

export interface Institute {
  id: string;
  name: string;
  email: string;
  logo?: string | null;
  tenantDomain?: string | null;
  status?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'INSTITUTE_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  instituteId?: string | null;
  institute?: Institute | null;
  photo?: string | null;
  phone?: string | null;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  institute: Institute | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  setAuthSession: (data: { token: string; user: User; institute?: Institute | null; tenantDomain?: string | null }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

function normalizeRole(role?: string | null): User['role'] | null {
  if (!role) return null;
  const normalized = role.toUpperCase().replace(/[-\s]+/g, '_');
  switch (normalized) {
    case 'SUPER_ADMIN':
      return 'SUPER_ADMIN';
    case 'INSTITUTE_ADMIN':
    case 'ADMIN':
      return 'INSTITUTE_ADMIN';
    case 'TEACHER':
      return 'TEACHER';
    case 'STUDENT':
      return 'STUDENT';
    case 'PARENT':
      return 'PARENT';
    default:
      return null;
  }
}

function normalizeUser(user: any): User {
  const normalizedRole = normalizeRole(user?.role) || 'STUDENT';
  return {
    id: user?.id,
    name: user?.name || user?.fullName || '',
    email: user?.email || '',
    role: normalizedRole,
    instituteId: user?.instituteId ?? user?.tenantId ?? null,
    institute: user?.institute ?? null,
    photo: user?.photo ?? user?.profilePictureUrl ?? null,
    phone: user?.phone ?? user?.phoneNumber ?? null,
    isActive: user?.isActive ?? user?.status === 'active',
  };
}

function normalizeLoginResponse(payload: any) {
  const data = payload?.data?.data ?? payload?.data ?? payload ?? {};
  const token = data?.token ?? data?.accessToken ?? payload?.data?.token ?? payload?.data?.accessToken ?? '';
  const refreshToken = data?.refreshToken ?? payload?.data?.refreshToken ?? '';
  const user = normalizeUser(data?.user ?? data);
  const institute = data?.institute ?? null;
  const tenantDomain = data?.tenantDomain ?? null;

  return { token, refreshToken, user, institute, tenantDomain, raw: data };
}

// ======================================
// Storage helpers
// ======================================

function saveSession({
  token,
  user,
  institute,
  tenantDomain,
}: {
  token: string;
  user: User;
  institute?: Institute | null;
  tenantDomain?: string | null;
}) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  if (institute) localStorage.setItem('institute', JSON.stringify(institute));
  if (tenantDomain) localStorage.setItem('tenantDomain', tenantDomain);
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('institute');
  localStorage.removeItem('tenantDomain');
}

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStoredInstitute(): Institute | null {
  try {
    const raw = localStorage.getItem('institute');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isTenantHost(): boolean {
  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1' && host.includes('.');
}

// ======================================
// Context
// ======================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [institute, setInstitute] = useState<Institute | null>(getStoredInstitute());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token is still valid by calling /auth/me
          const res = await api.get('/auth/me');
          const userData: User = normalizeUser(res.data.data.user || res.data.data);
          setUser(userData);
          if (userData.institute) setInstitute(userData.institute);
          // Re-save updated user data
          localStorage.setItem('user', JSON.stringify(userData));
        } catch {
          // Token is invalid or expired
          clearSession();
          setUser(null);
          setInstitute(null);
        }
      } else {
        setUser(null);
        setInstitute(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const setAuthSession = ({
    token,
    user: userData,
    institute: instData,
    tenantDomain,
  }: {
    token: string;
    user: User;
    institute?: Institute | null;
    tenantDomain?: string | null;
  }) => {
    const normalizedUser = normalizeUser(userData);
    saveSession({ token, user: normalizedUser, institute: instData, tenantDomain });
    setUser(normalizedUser);
    setInstitute(instData || null);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: userData, institute: instData, tenantDomain } = normalizeLoginResponse(res);

      // Multi-tenant redirect: if INSTITUTE_ADMIN and not already on tenant subdomain
      const onTenantHost = isTenantHost();
      if (userData?.role === 'INSTITUTE_ADMIN' && !onTenantHost && tenantDomain) {
        saveSession({ token, user: userData, institute: instData, tenantDomain });
      } else {
        setAuthSession({ token, user: userData, institute: instData, tenantDomain });
      }

      return { token, user: userData, institute: instData, tenantDomain };
    } catch (err) {
      throw err;
    }
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setInstitute(null);
    // Call backend logout to clear cookie
    api.get('/auth/logout').catch(() => {});
    window.location.replace(getPortalLoginPath());
  };

  const value: AuthContextType = {
    user,
    institute,
    loading,
    login,
    register,
    setAuthSession,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
