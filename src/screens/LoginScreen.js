/**
 * LoginScreen - Pantalla de inicio de sesion
 * Email/Password + Google Sign-In
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS } from '../config/theme';
import { loginWithEmail, loginWithGoogle } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Campos requeridos', text2: 'Ingresa email y contrasena' });
      return;
    }
    setLoading(true);
    const result = await loginWithEmail(email, password);
    if (result.success) {
      Toast.show({ type: 'success', text1: 'Inicio de sesion exitoso' });
      login(result.user);
    } else {
      Toast.show({ type: 'error', text1: 'Error', text2: result.error });
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    if (result.success) {
      Toast.show({ type: 'success', text1: 'Inicio de sesion con Google exitoso' });
      login(result.user);
    } else {
      Toast.show({ type: 'error', text1: 'Error', text2: result.error });
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={60} color={COLORS.white} />
          </View>
          <Text style={styles.appName}>AgroScanIA</Text>
          <Text style={styles.tagline}>Identifica plantas y enfermedades con IA</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesion</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
            <TextInput style={styles.input} placeholder="Correo electronico" placeholderTextColor={COLORS.disabled} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
            <TextInput style={styles.input} placeholder="Contrasena" placeholderTextColor={COLORS.disabled} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.loginButton, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginButtonText}>{loading ? 'Iniciando...' : 'Iniciar Sesion'}</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} disabled={loading}>
            <Ionicons name="logo-google" size={20} color={COLORS.text} />
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>No tienes cuenta? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Registrate</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primaryDark, justifyContent: 'center', alignItems: 'center', marginBottom: 16, ...SHADOWS.button },
  appName: { fontSize: 32, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 },
  tagline: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  formContainer: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.large, padding: 24, ...SHADOWS.card },
  formTitle: { ...FONTS.title, marginBottom: 24, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.medium, paddingHorizontal: 16, marginBottom: 16, height: 52, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.text },
  loginButton: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.medium, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 8, ...SHADOWS.button },
  loginButtonText: { ...FONTS.button },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { marginHorizontal: 16, color: COLORS.textSecondary, fontSize: 14 },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.medium, height: 52, borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 },
  googleButtonText: { marginLeft: 12, fontSize: 16, color: COLORS.text, fontWeight: '600' },
  registerLink: { alignItems: 'center' },
  registerText: { fontSize: 14, color: COLORS.textSecondary },
});

export default LoginScreen;