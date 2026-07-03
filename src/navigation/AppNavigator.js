/**
 * AppNavigator - Navegación principal
 * Stack: Auth (Login/Register) o App (Home, Camera, Result)
 * Bottom Tabs: Home, Historial
 */

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as NavigationBar from 'expo-navigation-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../config/theme';

// Pantallas
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom Tabs: Home + Historial
 */
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Inicio') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Historial') {
          iconName = focused ? 'time' : 'time-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      headerStyle: {
        backgroundColor: COLORS.primaryDark,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Tab.Screen
      name="Inicio"
      component={HomeScreen}
      options={{
        title: 'AgroScanIA',
        headerTitleAlign: 'center',
      }}
    />
    <Tab.Screen
      name="Historial"
      component={HistoryScreen}
      options={{
        title: 'Historial',
        headerTitleAlign: 'center',
      }}
    />
  </Tab.Navigator>
);

/**
 * Navegación principal con Stack
 */
const AppNavigator = ({ isLoggedIn = false }) => {
  // Ocultar barra de navegacion Android al cambiar de pantalla
  const onStateChange = () => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
  };

  return (
    <NavigationContainer onStateChange={onStateChange}>
      <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primaryDark },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
      }}
    >
      {isLoggedIn ? (
        <>
          {/* Rutas autenticadas */}
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{
              title: 'Escanear Cultivo',
            }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              title: 'Resultado',
            }}
          />
        </>
      ) : (
        <>
          {/* Rutas de autenticación */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              title: 'Crear Cuenta',
            }}
          />
        </>
      )}
    </Stack.Navigator>
      </NavigationContainer>
  );
};

export default AppNavigator;
