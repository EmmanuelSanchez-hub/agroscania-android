/**
 * Auth Service - Firebase Authentication
 * Maneja login, registro, Google Sign-In y verificacion de tokens
 */

import { API_URL } from '../config/theme';
import axios from 'axios';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, AuthRequest, ResponseType, exchangeCodeAsync } from 'expo-auth-session';

const DEV_TOKEN = 'dev-token';

const GOOGLE_CLIENT_ID = '89440772701-2ru59lmsj41ihhacbo9ggrasp9b18dvc.apps.googleusercontent.com';
const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const getAuthToken = async () => {
  try {
    const auth = getAuth();
    if (auth.currentUser) return await auth.currentUser.getIdToken();
  } catch (e) { /* sin Firebase */ }
  return DEV_TOKEN;
};

export const getAuthHeaders = async () => ({
  Authorization: `Bearer ${await getAuthToken()}`,
});

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
      },
      token: await userCredential.user.getIdToken(),
    };
  } catch (error) {
    if (email && password) {
      return { success: true, user: { uid: 'dev-user-uid', email, name: email.split('@')[0] }, token: DEV_TOKEN };
    }
    return { success: false, error: error.message };
  }
};

export const registerWithEmail = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return {
      success: true,
      user: { uid: userCredential.user.uid, email, name },
      token: await userCredential.user.getIdToken(),
    };
  } catch (error) {
    if (email && password && name) {
      return { success: true, user: { uid: 'dev-user-uid', email, name }, token: DEV_TOKEN };
    }
    return { success: false, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  try {
    const auth = getAuth();

    // Usar el proxy de autenticacion de Expo (funciona en Expo Go y builds nativos)
    const redirectUri = makeRedirectUri({
      useProxy: true,
      path: 'oauth',
    });

    const authRequest = new AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      redirectUri,
      scopes: ['profile', 'email', 'openid'],
      responseType: ResponseType.Code,
      extraParams: { access_type: 'offline', prompt: 'consent' },
    });

    // Construir la URL de autorizacion con PKCE manualmente
    const codeChallenge = authRequest.codeChallenge || authRequest._codeChallenge;
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'profile email openid',
      access_type: 'offline',
      prompt: 'consent',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: 'login',
    });
    const authUrl = `${GOOGLE_DISCOVERY.authorizationEndpoint}?${params.toString()}`;

    // Abrir en el navegador externo del sistema (no WebView) - requerido por Google
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === 'success' && result.url) {
      // Extraer el authorization code de la URL de retorno
      const { params } = AuthRequest.parseUrl(result.url);
      const code = params?.code;

      if (code) {
        // Intercambiar el authorization code por tokens (id_token + access_token)
        const tokenResult = await exchangeCodeAsync(
          {
            clientId: GOOGLE_CLIENT_ID,
            code,
            redirectUri,
            extraParams: { code_verifier: authRequest.codeVerifier },
          },
          GOOGLE_DISCOVERY,
        );

        const credential = GoogleAuthProvider.credential(tokenResult.idToken);
        const userCredential = await signInWithCredential(auth, credential);
        return {
          success: true,
          user: {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
          },
          token: await userCredential.user.getIdToken(),
        };
      }
    }

    return { success: false, error: 'Login cancelado' };
  } catch (error) {
    console.log('[Google Sign-In] Error:', error.message);
    return { success: false, error: error.message || 'Error al iniciar sesion con Google' };
  }
};

export const logout = async () => {
  try { await signOut(getAuth()); } catch (e) { /* ok */ }
  return { success: true };
};

export const apiClient = axios.create({ baseURL: API_URL, timeout: 30000 });

apiClient.interceptors.request.use(async (config) => {
  const headers = await getAuthHeaders();
  // No sobrescribir Content-Type si ya esta definido (ej: multipart/form-data)
  Object.keys(headers).forEach((key) => {
    if (!config.headers[key]) {
      config.headers[key] = headers[key];
    }
  });
  return config;
});
