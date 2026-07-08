/**
 * Hook personalizado para cargar fuentes de Ionicons
 * Solución para el problema de iconos que no aparecen en APK
 */

import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

// Mantener la splash screen visible mientras cargan las fuentes
SplashScreen.preventAutoHideAsync();

export const useIoniconsFonts = () => {
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return { fontsLoaded, fontError };
};

export { Ionicons };
