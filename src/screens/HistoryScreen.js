import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS } from '../config/theme';
import { getHistory } from '../services/predictionService';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'alta': return '#E53E3E';
    case 'media': return '#DD6B20';
    case 'ninguna': return '#38A169';
    default: return '#A0AEC0';
  }
};

const HistoryItem = ({ item, onPress }) => {
  const result = item?.result || {};
  const isHealthy = result?.is_healthy;
  const diseaseInfo = result?.disease_info || {};
  const severity = diseaseInfo?.severity;
  const treatment = diseaseInfo?.treatment || result?.treatment || '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardLeft}>
        <View style={[styles.statusDot, { backgroundColor: isHealthy ? COLORS.success : COLORS.error }]} />
      </View>
      <View style={styles.cardCenter}>
        <View style={styles.headerRow}>
          <Text style={styles.cardPlant}>{result?.plant_name || 'Desconocida'}</Text>
          {severity && (
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(severity) }]}>
              <Text style={styles.severityText}>{severity.toUpperCase()}</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDisease}>{diseaseInfo?.name || result?.disease_name || 'No identificada'}</Text>
        {treatment ? (
          <Text style={styles.cardTreatment} numberOfLines={1}>
            {treatment.split('\n')[0]}
          </Text>
        ) : null}
        <Text style={styles.cardDate}>{formatDate(item?.created_at)}</Text>
      </View>
      <View style={styles.cardRight}>
        <View style={[styles.confidenceMini, { backgroundColor: isHealthy ? COLORS.success + '20' : COLORS.primary + '20' }]}>
          <Text style={[styles.confidenceText, { color: isHealthy ? COLORS.success : COLORS.primary }]}>
            {Math.round((result?.confidence || 0) * 100)}%
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="leaf-outline" size={80} color={COLORS.primaryLight} />
    <Text style={styles.emptyTitle}>Sin diagnósticos aún</Text>
    <Text style={styles.emptyText}>Escanea tu primer cultivo para{'\n'}ver el historial aquí</Text>
  </View>
);

const HistoryScreen = ({ navigation }) => {
  const [predictions, setPredictions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    const result = await getHistory(50);
    if (result.success && result.data?.predictions) {
      setPredictions(result.data.predictions);
    }
    setLoading(false);
  };

  useEffect(() => { loadHistory(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleItemPress = (item) => {
    navigation.navigate('Result', {
      result: item?.result || {},
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={predictions}
        keyExtractor={(item, index) => (item?._id || item?.pred_id || String(index))}
        renderItem={({ item }) => <HistoryItem item={item} onPress={() => handleItemPress(item)} />}
        ListEmptyComponent={!loading ? EmptyState : null}
        contentContainerStyle={predictions.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, paddingBottom: 32 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.medium,
    padding: 16, marginBottom: 10, ...SHADOWS.card,
  },
  cardLeft: { marginRight: 12 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  cardCenter: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardPlant: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  cardDisease: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  cardTreatment: { fontSize: 12, color: COLORS.primary, marginTop: 4, fontStyle: 'italic' },
  cardDate: { fontSize: 12, color: COLORS.disabled, marginTop: 4 },
  severityBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10,
  },
  severityText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 10 },
  cardRight: { flexDirection: 'row', alignItems: 'center' },
  confidenceMini: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BORDER_RADIUS.small, marginRight: 8,
  },
  confidenceText: { fontSize: 13, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyTitle: { ...FONTS.subtitle, marginTop: 16, marginBottom: 8 },
  emptyText: { ...FONTS.body, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
});

export default HistoryScreen;