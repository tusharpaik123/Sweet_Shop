import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, email, name, role }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    try {
      const raw = localStorage.getItem('auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) setToken(parsed.token);
        if (parsed?.user) setUser(parsed.user);
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = async ({ user: u, token: t }) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('auth', JSON.stringify({ user: u, token: t }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  };

  const value = useMemo(() => ({ user, token, loading, login, logout, isAdmin: user?.role === 'admin' }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
