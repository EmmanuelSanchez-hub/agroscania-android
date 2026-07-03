/**
 * Prediction Service - Análisis de imágenes con IA
 * Envía imágenes al backend y recibe diagnóstico
 */

import { API_URL } from '../config/theme';
import { getAuthToken } from './authService';
import axios from 'axios';

const apiClient = axios.create({ baseURL: API_URL, timeout: 30000 });

/**
 * Envía una imagen al backend para predicción.
 * Usa fetch nativo porque axios en React Native no configura
 * correctamente el Content-Type multipart/form-data con boundary.
 *
 * @param {object} imageFile - Objeto de imagen con uri, type, name
 * @returns {object} Resultado de predicción
 */
export const predictPlantDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageFile.uri,
    type: imageFile.type || 'image/jpeg',
    name: imageFile.name || 'plant_image.jpg',
  });

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/api/predict`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // No establecer Content-Type: fetch lo configura automáticamente con el boundary correcto
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Error al analizar la imagen' };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || 'Error de conexión al analizar la imagen' };
  }
};

/**
 * Obtiene el historial de predicciones del usuario
 * @param {number} limit - Cantidad máxima de resultados
 */
export const getHistory = async (limit = 50) => {
  try {
    const response = await apiClient.get('/api/history', {
      params: { limit },
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Error al cargar historial', data: { predictions: [] } };
  }
};

/**
 * Obtiene estadísticas de predicciones
 */
export const getStats = async () => {
  try {
    const response = await apiClient.get('/api/history/stats', {
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Error al cargar estadísticas' };
  }
};

/**
 * Obtiene la lista de plantas soportadas
 */
export const getPlants = async () => {
  try {
    const response = await apiClient.get('/api/plants');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Error al cargar plantas', data: { plants: [] } };
  }
};

/**
 * Obtiene enfermedades asociadas a una planta
 */
export const getDiseases = async (plant) => {
  try {
    const response = await apiClient.get(`/api/diseases/${plant}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Error al cargar enfermedades' };
  }
};

/**
 * Obtiene recomendaciones con datos de clima
 */
export const getRecommendations = async (plant, lat, lng) => {
  try {
    const response = await apiClient.get(`/api/recommendations/${plant}`, {
      params: { lat, lng },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Error al cargar recomendaciones' };
  }
};