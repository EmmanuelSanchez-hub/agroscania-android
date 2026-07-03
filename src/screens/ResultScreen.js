import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS } from '../config/theme';

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'alta': return COLORS.error;
    case 'media': return COLORS.warning;
    case 'ninguna': return COLORS.success;
    default: return COLORS.textSecondary;
  }
};

const ResultScreen = ({ route, navigation }) => {
  const { result, imageUri } = route.params;
  const diseaseInfo = result?.disease_info || {};
  const confidencePercent = Math.round((result?.confidence || 0) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Imagen */}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          {result?.is_healthy && (
            <View style={styles.healthyBadge}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
              <Text style={styles.healthyBadgeText}>Saludable</Text>
            </View>
          )}
        </View>
      )}

      {/* Planta y Enfermedad */}
      <View style={styles.resultCard}>
        <Text style={styles.plantName}>{result?.plant_name || 'Desconocida'}</Text>
        <Text style={styles.diseaseName}>{result?.disease_name || 'No identificada'}</Text>

        {/* Barra de confianza */}
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Confianza del diagnóstico</Text>
          <View style={styles.confidenceBar}>
            <View style={[styles.confidenceFill, { width: `${confidencePercent}%` }]} />
          </View>
          <Text style={styles.confidenceValue}>{confidencePercent}%</Text>
        </View>

        {/* Severidad */}
        {diseaseInfo.severity && (
          <View style={styles.severityRow}>
            <Text style={styles.severityLabel}>Severidad: </Text>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(diseaseInfo.severity) }]}>
              <Text style={styles.severityText}>{diseaseInfo.severity.toUpperCase()}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Descripción */}
      {diseaseInfo.description && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.sectionText}>{diseaseInfo.description}</Text>
        </View>
      )}

      {/* Tratamiento */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Tratamiento Recomendado</Text>
        <Text style={styles.sectionText}>
          {diseaseInfo.treatment || result?.treatment || 'Sin recomendaciones disponibles.'}
        </Text>
      </View>

      {/* Prevención */}
      {diseaseInfo.prevention && diseaseInfo.prevention.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Medidas Preventivas</Text>
          {diseaseInfo.prevention.map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.replace('Camera')}
        >
          <Ionicons name="scan-outline" size={20} color={COLORS.white} />
          <Text style={styles.primaryButtonText}>Escanear otra hoja</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Ionicons name="home-outline" size={20} color={COLORS.primary} />
          <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  imageContainer: { borderRadius: BORDER_RADIUS.large, overflow: 'hidden', marginBottom: 16, ...SHADOWS.card },
  image: { width: '100%', height: 250, resizeMode: 'cover' },
  healthyBadge: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.success, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BORDER_RADIUS.round,
  },
  healthyBadgeText: { color: COLORS.white, fontWeight: 'bold', marginLeft: 4, fontSize: 14 },
  resultCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.large, padding: 20, marginBottom: 12, ...SHADOWS.card },
  plantName: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 },
  diseaseName: { ...FONTS.title, fontSize: 22, marginBottom: 16 },
  confidenceContainer: { marginBottom: 12 },
  confidenceLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6 },
  confidenceBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  confidenceFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  confidenceValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginTop: 4 },
  severityRow: { flexDirection: 'row', alignItems: 'center' },
  severityLabel: { fontSize: 14, color: COLORS.textSecondary },
  severityBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: BORDER_RADIUS.small },
  severityText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
  sectionCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.large, padding: 20, marginBottom: 12, ...SHADOWS.card },
  sectionTitle: { ...FONTS.subtitle, marginBottom: 8 },
  sectionText: { ...FONTS.body, lineHeight: 24, color: COLORS.textSecondary },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, paddingRight: 16 },
  bulletText: { flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  actionButtons: { marginTop: 8 },
  primaryButton: {
    flexDirection: 'row', backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium, padding: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12, ...SHADOWS.button,
  },
  primaryButtonText: { ...FONTS.button, marginLeft: 8 },
  secondaryButton: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium, padding: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.primary,
  },
  secondaryButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});

export default ResultScreen;