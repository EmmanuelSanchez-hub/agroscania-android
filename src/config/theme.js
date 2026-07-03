/**
 * AgroScanIA - Theme Configuration
 * Paleta de colores basada en el diseño aprobado
 */

export const COLORS = {
  primary: '#4CAF50',        // Verde principal - Naturaleza/Agricultura
  primaryDark: '#2E7D32',    // Verde oscuro - Headers
  primaryLight: '#C8E6C9',   // Verde claro - Fondos secundarios
  accent: '#FFC107',         // Amarillo - Acentos y botones
  white: '#FFFFFF',
  background: '#F5F5F5',     // Gris claro - Fondo principal
  card: '#FFFFFF',
  text: '#212121',           // Texto principal
  textSecondary: '#757575',  // Texto secundario
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00',
  border: '#E0E0E0',
  disabled: '#BDBDBD',
};

export const FONTS = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    color: COLORS.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
};

export const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  round: 50,
};

// API Configuration
// IP del backend. Cambiar si es necesario:
// - Emulador Android: http://10.0.2.2:5000
// - Dispositivo fisico: http://192.168.0.92:5000 (la IP que muestra Flask al arrancar)
export const API_URL = 'https://dragonish-elaborate-travesty.ngrok-free.dev';