import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS } from '../config/theme';
import { registerWithEmail } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Campos requeridos', text2: 'Completa todos los campos' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Las contrasenas no coinciden' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'La contrasena debe tener al menos 6 caracteres' });
      return;
    }
    setLoading(true);
    const result = await registerWithEmail(email, password, name);
    if (result.success) {
      Toast.show({ type: 'success', text1: 'Registro exitoso' });
      login(result.user);
    } else {
      Toast.show({ type: 'error', text1: 'Error', text2: result.error });
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Crear Cuenta</Text>
          <View style={styles.inputContainer}><Ionicons name="person-outline" size={20} color={COLORS.textSecondary} /><TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor={COLORS.disabled} value={name} onChangeText={setName} /></View>
          <View style={styles.inputContainer}><Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} /><TextInput style={styles.input} placeholder="Correo electronico" placeholderTextColor={COLORS.disabled} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /></View>
          <View style={styles.inputContainer}><Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} /><TextInput style={styles.input} placeholder="Contrasena" placeholderTextColor={COLORS.disabled} value={password} onChangeText={setPassword} secureTextEntry /></View>
          <View style={styles.inputContainer}><Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} /><TextInput style={styles.input} placeholder="Confirmar contrasena" placeholderTextColor={COLORS.disabled} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry /></View>
          <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Ya tienes cuenta? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Inicia Sesion</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
  formContainer: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.large, padding: 24, ...SHADOWS.card },
  formTitle: { ...FONTS.title, marginBottom: 24, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.medium, paddingHorizontal: 16, marginBottom: 16, height: 52, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.text },
  button: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.medium, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 8, ...SHADOWS.button },
  buttonText: { ...FONTS.button },
  link: { alignItems: 'center', marginTop: 20 },
  linkText: { fontSize: 14, color: COLORS.textSecondary },
});

export default RegisterScreen;