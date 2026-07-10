import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS } from '../config/theme';
import { getStats, getPlants, getDiseases } from '../services/predictionService';
import { useAuth } from '../context/AuthContext';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const HomeScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [plantsCount, setPlantsCount]= useState(0);
  const [diseasesCount, setDiseasesCount] = useState(0);
  const [stats, setStats] = useState({ total_predictions: 0, by_disease: [] });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    const result = await getStats();
    if (result.success) setStats(result.data);

    const plantsResult = await getPlants();
    if(plantsResult.success){
      setPlantsCount(plantsResult.data.count);
    }

    let totalDiseases = 0;
    const plantsResult2= await getPlants();
    if(plantsResult2.success){
      for(const plant of plantsResult2.data.count){
        const diseasesResult = await getDiseases(plant);
        if(diseasesResult.success){
          totalDiseases += diseasesResult.data.count;
        }
      }
    }
    setDiseasesCount(totalDiseases);
  };

  useEffect(() => { loadStats(); }, []);

  const onRefresh = async () => { setRefreshing(true); await loadStats(); setRefreshing(false); };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Bienvenido a</Text>
              <Text style={styles.appTitle}>AgroScanIA</Text>
            </View>
            <View style={styles.iconCircle}>
              <Ionicons name="leaf" size={36} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.headerDesc}>Identifica plantas y detecta enfermedades con inteligencia artificial</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="scan-outline" size={28} color={COLORS.primary} />
            <Text style={styles.statNumber}>{stats.total_predictions}</Text>
            <Text style={styles.statLabel}>Diagnósticos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="leaf-outline" size={28} color={COLORS.primary} />
            <Text style={styles.statNumber}>{plantsCount}</Text>
            <Text style={styles.statLabel}>Plantas</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="bug-outline" size={28} color={COLORS.primary} />
            <Text style={styles.statNumber}>{diseasesCount}</Text>
            <Text style={styles.statLabel}>Enfermedades</Text>
          </View>
        </View>

        {/* Scan Button */}
        <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate('Camera')}>
          <Ionicons name="scan-circle-outline" size={32} color={COLORS.white} />
          <Text style={styles.scanButtonText}>Escanear Nuevo Cultivo</Text>
        </TouchableOpacity>

        {/* Quick Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
          <Text style={styles.infoText}>1. Toma una foto de la hoja de tu planta{'\n'}2. Nuestra IA analiza la imagen{'\n'}3. Recibe diagnóstico y recomendaciones</Text>
        </View>
      </ScrollView>

      {/* Boton de cerrar sesion flotante */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={22} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  headerCard: { backgroundColor: COLORS.primaryDark, borderRadius: BORDER_RADIUS.large, padding: 24, marginBottom: 16, ...SHADOWS.card },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  appTitle: { color: COLORS.white, fontSize: 28, fontWeight: 'bold' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  headerDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.medium, padding: 16, marginHorizontal: 4, alignItems: 'center', ...SHADOWS.card },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  scanButton: { flexDirection: 'row', backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.large, padding: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16, ...SHADOWS.button },
  scanButtonText: { ...FONTS.button, fontSize: 18, marginLeft: 12 },
  infoCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.large, padding: 20, ...SHADOWS.card },
  infoTitle: { ...FONTS.subtitle, marginBottom: 8 },
  infoText: { ...FONTS.body, lineHeight: 24, color: COLORS.textSecondary },
  logoutButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.button,
  },
});

export default HomeScreen;