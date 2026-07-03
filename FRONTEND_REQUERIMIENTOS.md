# Requerimientos del Frontend - AgroScanIA

[![React](https://img.shields.io/badge/react-18+-61DAFB.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/react%20native-0.70+-61DAFB.svg?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![JavaScript](https://img.shields.io/badge/javascript-ES6+-F7DF1E.svg?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/)
[![Firebase](https://img.shields.io/badge/firebase-9+-FFCA28.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

## Tecnologías del Frontend

### React Native 0.70+

[![React Native](https://img.shields.io/badge/react%20native-0.70+-61DAFB.svg?style=for-the-badge&logo=react)](https://reactnative.dev/)

Framework para desarrollo móvil multiplataforma:
- Desarrollo para Android e iOS
- Componentes nativos
- Navegación entre pantallas
- Acceso a cámara y galería

**Instalación:**
```bash
npm install -g react-native-cli
```

### JavaScript ES6+

[![JavaScript](https://img.shields.io/badge/javascript-ES6+-F7DF1E.svg?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/)

Lenguaje de programación del frontend:
- Async/Await para peticiones
- Destructuring
- Arrow functions
- Promises

### Firebase 9+

[![Firebase](https://img.shields.io/badge/firebase-9+-FFCA28.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

Servicios de Firebase:
- **Firebase Auth**: Autenticación de usuarios (gratis)
- **Firebase Storage**: Almacenamiento de imágenes (5GB gratis)
- **Cloud Messaging**: Notificaciones push (gratis)

**Instalación:**
```bash
npm install firebase
```

## Requerimientos (package.json)

```json
{
  "name": "agroscania-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.70.0",
    "react-navigation": "^6.0.0",
    "firebase": "^9.0.0",
    "axios": "^1.0.0",
    "react-native-image-picker": "^4.0.0",
    "react-native-maps": "^0.30.0",
    "react-native-toast-message": "^2.0.0"
  }
}
```

## Estructura de Archivos del Frontend

```
Frontend/
├── src/
│   ├── components/
│   │   ├── CameraComponent.js      # Captura de imágenes
│   │   ├── PredictionResult.js      # Resultado del diagnóstico
│   │   └── PlantCard.js             # Tarjeta de planta
│   ├── screens/
│   │   ├── LoginScreen.js           # Pantalla de login
│   │   ├── RegisterScreen.js        # Registro de usuarios
│   │   ├── HomeScreen.js            # Pantalla principal
│   │   ├── CameraScreen.js          # Captura de foto
│   │   ├── ResultScreen.js          # Resultado del análisis
│   │   └── HistoryScreen.js         # Historial de predicciones
│   ├── services/
│   │   ├── authService.js           # Servicio de autenticación
│   │   ├── predictionService.js     # Servicio de predicción
│   │   └── weatherService.js        # Servicio de clima
│   ├── hooks/
│   │   ├── useAuth.js               # Hook de autenticación
│   │   ├── usePrediction.js         # Hook de predicción
│   │   └── useToast.js              # Hook de notificaciones
│   ├── utils/
│   │   └── helpers.js               # Utilidades
│   ├── navigation/
│   │   └── AppNavigator.js          # Navegación
│   └── App.js                       # Aplicación principal
├── package.json
└── FRONTEND_REQUERIMIENTOS.md
```

## Hooks Personalizados

### useAuth.js
```javascript
import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return { user, loading };
};
```

### usePrediction.js
```javascript
import { useState } from 'react';
import { predictPlantDisease } from '../services/predictionService';

export const usePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const predict = async (imageUri, userToken) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictPlantDisease(imageUri, userToken);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { predict, loading, result, error };
};
```

### useToast.js
```javascript
import Toast from 'react-native-toast-message';

export const useToast = () => {
  const showSuccess = (message) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom'
    });
  };

  const showError = (message) => {
    Toast.show({
      type: 'error',
      text1: message,
      position: 'bottom'
    });
  };

  return { showSuccess, showError };
};
```

## Componentes con Props

### CameraComponent.js
```javascript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const CameraComponent = ({ onImageCapture, loading }) => {
  return (
    <View>
      <Text>Captura de Imagen</Text>
      <TouchableOpacity onPress={onImageCapture} disabled={loading}>
        <Text>{loading ? 'Procesando...' : 'Tomar Foto'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraComponent;
```

### PredictionResult.js
```javascript
import React from 'react';
import { View, Text } from 'react-native';

const PredictionResult = ({ result, onRetry }) => {
  if (!result) return null;

  return (
    <View>
      <Text>Planta: {result.plant_name}</Text>
      <Text>Enfermedad: {result.disease_name}</Text>
      <Text>Confianza: {result.confidence}%</Text>
      <Text>Tratamiento: {result.treatment}</Text>
    </View>
  );
};

export default PredictionResult;
```

## Toast Messages

### Configuración
```bash
npm install react-native-toast-message
```

### Uso en pantallas
```javascript
import Toast from 'react-native-toast-message';
import { useToast } from '../hooks/useToast';

const LoginScreen = () => {
  const { showSuccess, showError } = useToast();

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      showSuccess('Login exitoso');
    } catch (error) {
      showError('Error en el login');
    }
  };

  return (
    <View>
      {/* ... componentes ... */}
      <Toast />
    </View>
  );
};
```

## Pantallas Principales

### LoginScreen
- Autenticación con Firebase
- Login con email/password
- Login con Google
- Navegación a registro
- Toast para notificaciones

### HomeScreen
- Bienvenida al usuario
- Botón para capturar imagen
- Historial de predicciones
- Información del clima
- Toast para notificaciones

### CameraScreen
- Acceso a cámara del dispositivo
- Captura de imágenes de plantas
- Preview de la imagen
- Envío al backend
- Toast para estado de carga

### ResultScreen
- Mostrar resultado de la predicción
- Nombre de la planta
- Enfermedad detectada
- Nivel de confianza
- Recomendaciones de tratamiento
- Toast para guardado exitoso

### HistoryScreen
- Lista de predicciones anteriores
- Filtro por fecha
- Detalles de cada predicción

## Servicios

### authService.js
```javascript
// Login con Firebase
import auth from '@react-native-firebase/auth';

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Login con Google
export const loginWithGoogle = async () => {
  // Implementación de Google Sign-In
};

// Logout
export const logout = async () => {
  await auth().signOut();
};
```

### predictionService.js
```javascript
// Enviar imagen al backend
import axios from 'axios';

export const predictPlantDisease = async (imageUri, userToken) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'plant_image.jpg'
  });

  const response = await axios.post(
    'https://api.agroscania.com/api/predict',
    formData,
    {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  
  return response.data;
};
```

## Navegación

```
AuthStack (No autenticado)
├── LoginScreen
└── RegisterScreen

AppStack (Autenticado)
├── HomeScreen
├── CameraScreen
├── ResultScreen
└── HistoryScreen
```

## Notas Importantes

- Desarrollo multiplataforma (Android/iOS)
- Firebase Authentication gratuito
- Firebase Storage para imágenes (5GB gratis)
- Cloud Messaging gratuito
- Compatible con dispositivos móviles modernos
- Hooks personalizados para lógica reutilizable
- Props para comunicación entre componentes
- Toast para notificaciones al usuario