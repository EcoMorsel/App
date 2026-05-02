// FoodFootprint - Scan / Input Page

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { useFoodAnalysis } from '@/hooks/useFoodAnalysis';
import { useApp } from '@/hooks/useApp';
import { FOOD_DATABASE } from '@/constants/foodData';

const EXAMPLE_FOODS = ['Pizza', 'Beef Burger', 'Avocado Toast', 'Green Salad', 'Iced Coffee', 'Salmon'];

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { analyzeFromText, analyzeFromImage, error, clearError } = useFoodAnalysis();
  const { isProcessing } = useApp();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'text'>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      clearError();
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      shake();
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      clearError();
    }
  };

  const handleAnalyze = async () => {
    if (activeTab === 'text') {
      if (!textInput.trim()) {
        shake();
        return;
      }
      const result = await analyzeFromText(textInput);
      if (result) router.push('/processing');
    } else {
      if (!selectedImage) {
        shake();
        return;
      }
      const result = await analyzeFromImage(selectedImage, activeTab);
      if (result) router.push('/processing');
    }
  };

  const TABS = [
    { key: 'text', label: 'Type Food', icon: 'text-box-outline' },
    { key: 'upload', label: 'Upload', icon: 'image-outline' },
    { key: 'camera', label: 'Camera', icon: 'camera-outline' },
  ] as const;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Scan Food</Text>
        <Text style={styles.headerSub}>Identify any food and see its environmental cost</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Input type tabs */}
        <View style={styles.tabBar}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => {
                setActiveTab(tab.key);
                setSelectedImage(null);
                clearError();
              }}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            >
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={18}
                color={activeTab === tab.key ? Colors.primary : Colors.textMuted}
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Area */}
        <Animated.View style={[styles.inputArea, { transform: [{ translateX: shakeAnim }] }]}>
          {activeTab === 'text' ? (
            <View style={styles.textSection}>
              <Text style={styles.inputLabel}>What food did you eat or want to check?</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Cheeseburger, Green Salad, Pasta..."
                placeholderTextColor={Colors.textMuted}
                value={textInput}
                onChangeText={text => { setTextInput(text); clearError(); }}
                returnKeyType="search"
                onSubmitEditing={handleAnalyze}
                multiline={false}
                maxLength={100}
              />
              <Text style={styles.exampleLabel}>Try these examples:</Text>
              <View style={styles.examplesRow}>
                {EXAMPLE_FOODS.map(food => (
                  <TouchableOpacity
                    key={food}
                    style={styles.exampleChip}
                    onPress={() => setTextInput(food)}
                  >
                    <Text style={styles.exampleText}>{food}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.imageSection}>
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.imagePreview}
                    contentFit="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeImage}
                    onPress={() => setSelectedImage(null)}
                  >
                    <Ionicons name="close-circle" size={28} color={Colors.error} />
                  </TouchableOpacity>
                  <View style={styles.imageReady}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                    <Text style={styles.imageReadyText}>Ready to analyze</Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.imagePlaceholder}
                  onPress={activeTab === 'camera' ? handleTakePhoto : handlePickImage}
                  activeOpacity={0.7}
                >
                  <View style={styles.imagePlaceholderInner}>
                    <MaterialCommunityIcons
                      name={activeTab === 'camera' ? 'camera-plus-outline' : 'image-plus'}
                      size={48}
                      color={Colors.primary}
                    />
                    <Text style={styles.imagePlaceholderTitle}>
                      {activeTab === 'camera' ? 'Take a Photo' : 'Choose from Library'}
                    </Text>
                    <Text style={styles.imagePlaceholderSub}>
                      {activeTab === 'camera'
                        ? 'Point at any food item'
                        : 'Select a food photo or nutrition label'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {activeTab === 'upload' && !selectedImage ? (
                <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="folder-image" size={18} color={Colors.primary} />
                  <Text style={styles.uploadBtnText}>Browse Photos</Text>
                </TouchableOpacity>
              ) : activeTab === 'camera' && !selectedImage ? (
                <TouchableOpacity style={styles.uploadBtn} onPress={handleTakePhoto} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="camera" size={18} color={Colors.primary} />
                  <Text style={styles.uploadBtnText}>Open Camera</Text>
                </TouchableOpacity>
              ) : null}

              <View style={styles.ocrNote}>
                <Ionicons name="scan-outline" size={14} color={Colors.primary} />
                <Text style={styles.ocrNoteText}>
                  Our AI reads nutrition labels and identifies foods from photos
                </Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="warning-outline" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Analyze Button */}
        <TouchableOpacity
          style={[styles.analyzeBtn, isProcessing && styles.analyzeBtnDisabled]}
          onPress={handleAnalyze}
          activeOpacity={0.8}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={Colors.black} />
          ) : (
            <MaterialCommunityIcons name="magnify" size={20} color={Colors.black} />
          )}
          <Text style={styles.analyzeBtnText}>
            {isProcessing ? 'Analyzing...' : 'Analyze Footprint'}
          </Text>
        </TouchableOpacity>

        {/* Quick Access Foods */}
        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>Popular Foods</Text>
          <View style={styles.quickList}>
            {Object.values(FOOD_DATABASE).map(food => (
              <TouchableOpacity
                key={food.id}
                style={styles.quickFood}
                onPress={() => setTextInput(food.name)}
              >
                <Text style={styles.quickFoodEmoji}>{food.emoji}</Text>
                <Text style={styles.quickFoodName}>{food.name}</Text>
                <View style={[styles.quickImpactBadge, {
                  backgroundColor: food.impactLevel === 'high' ? 'rgba(239,68,68,0.15)' :
                    food.impactLevel === 'low' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                }]}>
                  <Text style={[styles.quickImpactText, {
                    color: food.impactLevel === 'high' ? Colors.high :
                      food.impactLevel === 'low' ? Colors.low : Colors.medium,
                  }]}>
                    {food.impactLevel}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: Colors.text,
  },
  headerSub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 4,
    marginBottom: Spacing.lg,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  tabText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  inputArea: {
    marginBottom: Spacing.md,
  },
  textSection: {
    gap: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  textInput: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    minHeight: 52,
  },
  exampleLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  examplesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  exampleChip: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
  },
  exampleText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  imageSection: {
    gap: Spacing.md,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  imagePlaceholderInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  imagePlaceholderTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  imagePlaceholderSub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    height: 220,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImage: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  imageReady: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  imageReadyText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryMuted,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    padding: Spacing.md,
  },
  uploadBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  ocrNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ocrNoteText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    flex: 1,
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md + 2,
    marginBottom: Spacing.lg,
    ...Shadow.glow(Colors.primary),
  },
  analyzeBtnDisabled: {
    opacity: 0.6,
  },
  analyzeBtnText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.black,
  },
  quickSection: {
    gap: Spacing.md,
  },
  quickTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  quickList: {
    gap: Spacing.sm,
  },
  quickFood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  quickFoodEmoji: {
    fontSize: 22,
  },
  quickFoodName: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  quickImpactBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  quickImpactText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'capitalize',
  },
});
