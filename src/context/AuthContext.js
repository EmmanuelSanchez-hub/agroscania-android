import React, { createContext, useContext, useState, useEffect } from 'react';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { logout as authLogout } from '../services/authService';

// ----------------------------------------------------------------------
// Firebase Config
// ----------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyA-ozF9bI2BQloJglRJgO3TO0L2BcySKNU",
  authDomain: "agroscan-a01d1.firebaseapp.com",
  projectId: "agroscan-a01d1",
  storageBucket: "agroscan-a01d1.firebasestorage.app",
  messagingSenderId: "89440772701",
  appId: "1:89440772701:web:28f654a07ef2cd3508e3b4",
  measurementId: "G-EWB1NBTP9Q",
};

// Inicializar Firebase una sola vez
let firebaseInitialized = false;
try {
  const { initializeApp } = require('firebase/app');
  const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
  const app = initializeApp(firebaseConfig);
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  firebaseInitialized = true;
} catch (e) {
  console.log('Firebase en modo desarrollo');
}

// ----------------------------------------------------------------------
// Contexto
// ----------------------------------------------------------------------
const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (firebaseInitialized) {
      try {
        const { getAuth, onAuthStateChanged } = require('firebase/auth');
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
            });
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        });
        return () => unsubscribe();
      } catch (e) {
        console.log('Auth listener not available');
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData || { uid: 'dev-user-uid', email: 'dev@agroscania.com', name: 'Usuario Dev' });
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await authLogout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};