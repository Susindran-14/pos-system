import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pos_user');
    return saved ? JSON.parse(saved) : { username: 'admin', name: 'Store Administrator', role: 'ADMIN' };
  });
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginWithPin = async (pin) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authApi.login(pin);
      setCurrentUser(user);
      localStorage.setItem('pos_user', JSON.stringify(user));
      setIsLocked(false);
      return true;
    } catch (err) {
      setError(err.message || 'Invalid PIN code');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const lockWorkstation = () => {
    setIsLocked(true);
  };

  const unlockWorkstation = () => {
    setIsLocked(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLocked,
        loading,
        error,
        loginWithPin,
        lockWorkstation,
        unlockWorkstation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
