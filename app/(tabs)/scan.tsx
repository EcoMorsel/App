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
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { useFoodAnalysis } from '@/hooks/useFoodAnalysis';
import { useApp } from '@/hooks/useApp';
import { FOOD_DATABASE } from '@/constants/foodData';

const EXAMPLE_FOODS = ['Pizza', 'Beef Burger', 'Avocado Toast', 'Green Salad', 'Iced Coffee', 'Salmon'];

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { analyzeFromText, analyzeFromImage, error, clearError } = useFoodAnalysis();
  const { isProcessing, C } = useApp();

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
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets[0]) { setSelectedImage(result.assets[0].uri); clearError(); }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) { shake(); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets[0]) { setSelectedImage(result.assets[0].uri); clearError(); }
  };

  const handleAnalyze = async () => {
    if (activeTab === 'text') {
      if (!textInput.trim()) { shake(); return; }
      const result = await analyzeFromText(textInput);
      if (result) router.push('/processing');
    } else {
      if (!selectedImage) { shake(); return; }
      const result = await analyzeFromImage(selectedImage, activeTab === 'camera' ? 'camera' : 'image');
      if (result) router.push('/processing');
    }
  };

  const TABS = [
    { key: 'text', label: 'Type Food', icon: 'text-box-outline' },
    { key: 'upload', label: 'Upload', icon: 'image-outline' },
    { key: 'camera', label: 'Camera', icon: 'camera-outline' },
  ] as const;

  return (
    <KeyboardAvoidingView style={[styles.root, { backgroundColor: C.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.header, { borderBottomColor: C.border, paddingTop: insets.top + Spacing.md }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>Scan Food</Text>
        <Text style={[styles.headerSub, { color: C.textMuted }]}>Identify any food and see its environmental cost</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Tabs */}
        <View style={[styles.tabBar, { backgroundColor: C.surface, borderColor: C.border }]}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => { setActiveTab(tab.key); setSelectedImage(null); clearError(); }}
              style={[styles.tab, activeTab === tab.key && { backgroundColor: C.primaryMuted, borderWidth: 1, borderColor: C.primary + '4D' }]}
            >
              <MaterialCommunityIcons name={tab.icon as any} size={18} color={activeTab === tab.key ? C.primary : C.textMuted} />
              <Text style={[styles.tabText, { color: activeTab === tab.key ? C.primary : C.textMuted }]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Area */}
        <Animated.View style={[styles.inputArea, { transform: [{ translateX: shakeAnim }] }]}>
          {activeTab === 'text' ? (
            <View style={styles.textSection}>
              <Text style={[styles.inputLabel, { color: C.text }]}>What food did you eat or want to check?</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: C.card, borderColor: C.border, color: C.text }]}
                placeholder="e.g. Cheeseburger, Green Salad, Pasta..."
                placeholderTextColor={C.textMuted}
                value={textInput}
                onChangeText={text => { setTextInput(text); clearError(); }}
                returnKeyType="search"
                onSubmitEditing={handleAnalyze}
                maxLength={100}
              />
              <Text style={[styles.exampleLabel, { color: C.textMuted }]}>Try these examples:</Text>
              <View style={styles.examplesRow}>
                {EXAMPLE_FOODS.map(food => (
                  <TouchableOpacity key={food} style={[styles.exampleChip, { backgroundColor: C.card, borderColor: C.border }]} onPress={() => setTextInput(food)}>
                    <Text style={[styles.exampleText, { color: C.textSecondary }]}>{food}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.imageSection}>
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.imagePreview} contentFit="cover" />
                  <TouchableOpacity style={styles.removeImage} onPress={() => setSelectedImage(null)}>
                    <Ionicons name="close-circle" size={28} color={C.error} />
                  </TouchableOpacity>
                  <View style={[styles.imageReady, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                    <Ionicons name="checkmark-circle" size={16} color={C.primary} />
                    <Text style={[styles.imageReadyText, { color: C.primary }]}>Ready to analyze</Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity style={[styles.imagePlaceholder, { backgroundColor: C.card, borderColor: C.border }]} onPress={activeTab === 'camera' ? handleTakePhoto : handlePickImage} activeOpacity={0.7}>
                  <View style={styles.imagePlaceholderInner}>
                    <MaterialCommunityIcons name={activeTab === 'camera' ? 'camera-plus-outline' : 'image-plus'} size={48} color={C.primary} />
                    <Text style={[styles.imagePlaceholderTitle, { color: C.text }]}>{activeTab === 'camera' ? 'Take a Photo' : 'Choose from Library'}</Text>
                    <Text style={[styles.imagePlaceholderSub, { color: C.textMuted }]}>{activeTab === 'camera' ? 'Point at any food item' : 'Select a food photo or nutrition label'}</Text>
                  </View>
                </TouchableOpacity>
              )}
              {!selectedImage ? (
                <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: C.primaryMuted, borderColor: C.primary + '4D' }]} onPress={activeTab === 'camera' ? handleTakePhoto : handlePickImage} activeOpacity={0.7}>
                  <MaterialCommunityIcons name={activeTab === 'camera' ? 'camera' : 'folder-image'} size={18} color={C.primary} />
                  <Text style={[styles.uploadBtnText, { color: C.primary }]}>{activeTab === 'camera' ? 'Open Camera' : 'Browse Photos'}</Text>
                </TouchableOpacity>
              ) : null}
              <View style={[styles.ocrNote, { backgroundColor: C.surfaceElevated, borderColor: C.border }]}>
                <Ionicons name="scan-outline" size={14} color={C.primary} />
                <Text style={[styles.ocrNoteText, { color: C.textMuted }]}>Our AI reads nutrition labels and identifies foods from photos</Text>
              </View>
            </View>
          )}
        </Animated.View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: C.error + '1A', borderColor: C.error + '4D' }]}>
            <Ionicons name="warning-outline" size={16} color={C.error} />
            <Text style={[styles.errorText, { color: C.error }]}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.analyzeBtn, { backgroundColor: C.primary, ...Shadow.glow(C.primary) }, isProcessing && styles.analyzeBtnDisabled]}
          onPress={handleAnalyze}
          activeOpacity={0.8}
          disabled={isProcessing}
        >
          {isProcessing ? <ActivityIndicator size="small" color={C.black} /> : <MaterialCommunityIcons name="magnify" size={20} color={C.black} />}
          <Text style={[styles.analyzeBtnText, { color: C.black }]}>{isProcessing ? 'Analyzing...' : 'Analyze Footprint'}</Text>
        </TouchableOpacity>

        {/* Popular Foods */}
        <View style={styles.quickSection}>
          <Text style={[styles.quickTitle, { color: C.text }]}>Popular Foods</Text>
          <View style={styles.quickList}>
            {Object.values(FOOD_DATABASE).map(food => (
              <TouchableOpacity key={food.id} style={[styles.quickFood, { backgroundColor: C.card, borderColor: C.border }]} onPress={() => setTextInput(food.name)}>
                <Text style={styles.quickFoodEmoji}>{food.emoji}</Text>
                <Text style={[styles.quickFoodName, { color: C.text }]}>{food.name}</Text>
                <View style={[styles.quickImpactBadge, {
                  backgroundColor: food.impactLevel === 'high' ? C.high + '26' : food.impactLevel === 'low' ? C.low + '26' : C.medium + '26',
                }]}>
                  <Text style={[styles.quickImpactText, {
                    color: food.impactLevel === 'high' ? C.high : food.impactLevel === 'low' ? C.low : C.medium,
                  }]}>{food.impactLevel}</Text>
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
  root: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, borderBottomWidth: 1 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  headerSub: { fontSize: FontSize.sm, marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md },
  tabBar: { flexDirection: 'row', borderRadius: BorderRadius.lg, borderWidth: 1, padding: 4, marginBottom: Spacing.lg, gap: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md },
  tabText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  inputArea: { marginBottom: Spacing.md },
  textSection: { gap: Spacing.md },
  inputLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  textInput: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md, fontSize: FontSize.md, minHeight: 52 },
  exampleLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  examplesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  exampleChip: { borderRadius: BorderRadius.full, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 7 },
  exampleText: { fontSize: FontSize.sm },
  imageSection: { gap: Spacing.md },
  imagePlaceholder: { height: 200, borderRadius: BorderRadius.xl, borderWidth: 2, borderStyle: 'dashed', overflow: 'hidden' },
  imagePlaceholderInner: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.sm },
  imagePlaceholderTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  imagePlaceholderSub: { fontSize: FontSize.sm, textAlign: 'center' },
  imagePreviewContainer: { height: 220, borderRadius: BorderRadius.xl, overflow: 'hidden', position: 'relative' },
  imagePreview: { width: '100%', height: '100%' },
  removeImage: { position: 'absolute', top: Spacing.sm, right: Spacing.sm },
  imageReady: { position: 'absolute', bottom: Spacing.sm, left: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 5 },
  imageReadyText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  uploadBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  ocrNote: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, borderRadius: BorderRadius.md, padding: Spacing.sm, borderWidth: 1 },
  ocrNoteText: { flex: 1, fontSize: FontSize.xs, lineHeight: 18 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, marginBottom: Spacing.md },
  errorText: { fontSize: FontSize.sm, flex: 1 },
  analyzeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.xl, paddingVertical: Spacing.md + 2, marginBottom: Spacing.lg },
  analyzeBtnDisabled: { opacity: 0.6 },
  analyzeBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  quickSection: { gap: Spacing.md },
  quickTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  quickList: { gap: Spacing.sm },
  quickFood: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  quickFoodEmoji: { fontSize: 22 },
  quickFoodName: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  quickImpactBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: BorderRadius.full },
  quickImpactText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, textTransform: 'capitalize' },
});
