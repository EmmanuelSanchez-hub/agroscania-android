/**
 * AgroScanIA - Aplicacion Principal
 * Identificacion de plantas y deteccion de enfermedades agricolas con IA
 */

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as NavigationBar from 'expo-navigation-bar';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { COLORS } from './src/config/theme';

// Necesario para completar la sesion OAuth cuando el navegador externo redirige a la app
WebBrowser.maybeCompleteAuthSession();

const AppContent = () => {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Ocultar y fijar la barra para que no ocupe espacio en pantalla
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, [isLoggedIn]);

  return <AppNavigator isLoggedIn={isLoggedIn} />;
};

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={COLORS.primaryDark} />
        <AppContent />
        <Toast position="bottom" bottomOffset={80} />
      </SafeAreaProvider>
    </AuthProvider>
  );
}