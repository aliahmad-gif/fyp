import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  subscribeAuthState,
  signIn as firebaseSignIn,
  signUp as firebaseSignUp,
  signOut as firebaseSignOut,
  sendPasswordReset as firebaseSendPasswordReset,
  getFirebaseConnected,
  saveUserToFirestore,
} from '../database-firebase-postgresql';
import type { FirebaseAuthUser } from '../database-firebase-postgresql';

const DJANGO_API_BASE = 'http://localhost:8000';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isFirebaseConnected: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUser(u: FirebaseAuthUser | null): User | null {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name ?? '',
    email: u.email ?? '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const isFirebaseConnected = getFirebaseConnected();

  // Django JWT: if access_token in localStorage, fetch profile and set user (so login from external app is recognized)
  useEffect(() => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return;
    fetch(`${DJANGO_API_BASE}/api/auth/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Invalid token'))))
      .then((data) => {
        setUser({
          id: String(data.id ?? ''),
          name: data.name ?? '',
          email: data.email ?? '',
        });
      })
      .catch(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      });
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeAuthState((fbUser) => {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('access_token')) return;
      setUser(toUser(fbUser));
      setAuthError(null);
      if (fbUser) {
        saveUserToFirestore({
          uid: fbUser.id,
          email: fbUser.email,
          displayName: fbUser.name,
          role: 'user',
        }).catch((e) => console.warn('saveUserToFirestore:', e));
      }
    });
    return unsubscribe;
  }, []);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    setAuthError(null);
    try {
      await firebaseSignIn(email, password);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Login failed';
      setAuthError(message);
      throw e;
    }
  };

  const logout = async () => {
    setAuthError(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    try {
      await firebaseSignOut();
    } catch (e) {
      setAuthError('Logout failed');
    }
    setUser(null);
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    setAuthError(null);
    try {
      const fbUser = await firebaseSignUp(email, password, displayName);
      await saveUserToFirestore({
        uid: fbUser.id,
        email: fbUser.email,
        displayName: fbUser.name,
        role: 'user',
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Sign up failed';
      setAuthError(message);
      throw e;
    }
  };

  const forgotPassword = async (email: string) => {
    setAuthError(null);
    try {
      await firebaseSendPasswordReset(email);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to send reset email';
      setAuthError(message);
      throw e;
    }
  };

  const refreshProfile = async () => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return;
    try {
      const res = await fetch(`${DJANGO_API_BASE}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUser({
        id: String(data.id ?? ''),
        name: data.name ?? '',
        email: data.email ?? '',
      });
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        signup,
        forgotPassword,
        refreshProfile,
        isFirebaseConnected,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
