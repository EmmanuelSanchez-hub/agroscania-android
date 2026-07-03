import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS } from '../config/theme';
import { predictPlantDisease } from '../services/predictionService';

const CameraScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progressText, setProgressText] = useState('');

  const pickImage = async (fromCamera = false) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso para tomar fotos de tus plantas.');
      return;
    }

    const options = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    };

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0]);
      analyzeImage(result.assets[0]);
    }
  };

  const analyzeImage = async (imageAsset) => {
    setAnalyzing(true);
    setProgressText('Analizando imagen con IA...');

    const result = await predictPlantDisease({
      uri: imageAsset.uri,
      type: 'image/jpeg',
      name: 'plant_image.jpg',
    });

    setAnalyzing(false);

    if (result.success) {
      navigation.replace('Result', {
        result: result.data,
        imageUri: imageAsset.uri,
      });
    } else {
      Toast.show({ type: 'error', text1: 'Error', text2: result.error });
    }
  };

  if (analyzing) {
    return (
      <View style={styles.loadingContainer}>
        {image && <Image source={{ uri: image.uri }} style={styles.previewImage} />}
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.white} />
          <Text style={styles.loadingText}>{progressText}</Text>
          <Text style={styles.loadingSubtext}>Esto tomará solo unos segundos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Preview */}
      {image ? (
        <Image source={{ uri: image.uri }} style={styles.previewImage} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="leaf-outline" size={80} color={COLORS.primaryLight} />
          <Text style={styles.placeholderText}>Toma una foto de la hoja{'\n'}de tu planta</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(true)}>
          <View style={styles.actionIcon}>
            <Ionicons name="camera" size={28} color={COLORS.white} />
          </View>
          <Text style={styles.actionText}>Tomar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(false)}>
          <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryDark }]}>
            <Ionicons name="images" size={28} color={COLORS.white} />
          </View>
          <Text style={styles.actionText}>Galería</Text>
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.tipsCard}>
        <Ionicons name="bulb-outline" size={20} color={COLORS.accent} />
        <Text style={styles.tipsText}>
          Asegúrate de que la hoja esté bien iluminada y enfocada para mejores resultados.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, backgroundColor: '#000' },
  previewImage: { width: '100%', height: '100%', position: 'absolute' },
  loadingOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center',
  },
  loadingText: { color: COLORS.white, fontSize: 20, fontWeight: 'bold', marginTop: 16 },
  loadingSubtext: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 8 },
  placeholder: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.white, margin: 16, borderRadius: BORDER_RADIUS.large,
  },
  placeholderText: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginTop: 16 },
  actions: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 20, paddingHorizontal: 40, backgroundColor: COLORS.white,
  },
  actionButton: { alignItems: 'center' },
  actionIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: 8, ...SHADOWS.button,
  },
  actionText: { fontSize: 14, color: COLORS.text, fontWeight: '600' },
  tipsCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, margin: 16,
    padding: 16, borderRadius: BORDER_RADIUS.medium, ...SHADOWS.card,
  },
  tipsText: { flex: 1, marginLeft: 12, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
});

export default CameraScreen;