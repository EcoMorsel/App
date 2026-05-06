// EcoMorsel - Results Page

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { WaterVisualization } from '@/components/ui/WaterVisualization';
import { CarbonVisualization } from '@/components/ui/CarbonVisualization';
import { LandCard, EnergyCard, PackagingCard } from '@/components/ui/LandEnergyCards';
import { IngredientBreakdown } from '@/components/feature/IngredientBreakdown';
import { ImpactMeter } from '@/components/ui/ImpactMeter';

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentScan, setCompareA, favorites, toggleFavorite, C } = useApp();

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
    if (currentScan) setIsFav(favorites.includes(currentScan.food.id));
  }, [currentScan?.food.id]);

  if (!currentScan) {
    return (
      <View style={[styles.empty, { backgroundColor: C.background, paddingTop: insets.top }]}>
        <Text style={styles.emptyEmoji}>🍽️</Text>
        <Text style={[styles.emptyText, { color: C.textMuted }]}>No food scanned yet</Text>
        <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: C.primary }]} onPress={() => router.push('/scan')}>
          <Text style={[styles.emptyBtnText, { color: C.black }]}>Scan a Food</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { food } = currentScan;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌿 EcoMorsel Report\n\n${food.emoji} ${food.name} (${food.servingSize})\n\n💧 Water: ${food.resources.water.toLocaleString()}L\n☁️ CO₂: ${food.resources.carbon}kg\n🌾 Land: ${food.resources.land}m²\n⚡ Energy: ${food.resources.energy}kWh\n\nImpact: ${food.impactLevel.toUpperCase()}\n\n"${food.funFacts[0]}"\n\nGenerated with EcoMorsel`,
      });
    } catch (_) {}
  };

  const handleCompare = () => { setCompareA(food); router.push('/compare'); };
  const handleFavorite = () => { toggleFavorite(food.id); setIsFav(prev => !prev); };

  const IMPACT_COLOR = { low: C.low, medium: C.medium, high: C.high }[food.impactLevel];

  return (
    <View style={[styles.root, { backgroundColor: C.background, paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View style={[styles.header, { borderBottomColor: C.border, opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }] }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>Footprint Report</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleFavorite} style={styles.actionBtn}>
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? C.error : C.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
            <Ionicons name="share-outline" size={20} color={C.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Food Identity Card */}
        <Animated.View style={[styles.foodCard, { backgroundColor: C.card, borderColor: IMPACT_COLOR + '40', opacity: headerAnim }]}>
          <View style={styles.foodCardTop}>
            <View style={[styles.foodEmojiWrap, { backgroundColor: C.surfaceElevated }]}>
              <Text style={styles.foodEmoji}>{food.emoji}</Text>
            </View>
            <View style={styles.foodMeta}>
              <Text style={[styles.foodName, { color: C.text }]}>{food.name}</Text>
              <Text style={[styles.foodCategory, { color: C.primary }]}>{food.category}</Text>
              <Text style={[styles.foodServing, { color: C.textMuted }]}>{food.servingSize}</Text>
            </View>
            <View style={[styles.confidenceBadge, { backgroundColor: C.primaryMuted }]}>
              <Text style={[styles.confidenceText, { color: C.primary }]}>{Math.round(food.confidenceScore * 100)}%</Text>
              <Text style={[styles.confidenceLabel, { color: C.textMuted }]}>match</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          <ImpactMeter level={food.impactLevel} />
        </Animated.View>

        {/* Summary Row */}
        <Animated.View style={[styles.summaryRow, { opacity: contentAnim }]}>
          {[
            { label: 'Water', value: food.resources.water.toLocaleString(), unit: 'L', icon: 'water', color: C.water },
            { label: 'CO₂', value: food.resources.carbon.toFixed(1), unit: 'kg', icon: 'cloud-outline', color: C.carbon },
            { label: 'Land', value: food.resources.land.toFixed(1), unit: 'm²', icon: 'grass', color: C.land },
            { label: 'Energy', value: food.resources.energy.toFixed(1), unit: 'kWh', icon: 'lightning-bolt', color: C.energy },
          ].map((item, i) => (
            <View key={i} style={[styles.summaryItem, { backgroundColor: C.card, borderColor: C.border }]}>
              <MaterialCommunityIcons name={item.icon as any} size={16} color={item.color} />
              <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[styles.summaryUnit, { color: C.textMuted }]}>{item.unit}</Text>
              <Text style={[styles.summaryLabel, { color: C.textMuted }]}>{item.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={{ opacity: contentAnim }}>
          <WaterVisualization liters={food.resources.water} comparison={food.waterComparison} />
        </Animated.View>

        <CarbonVisualization kg={food.resources.carbon} comparison={food.carbonComparison} />

        <View style={styles.cardRow}>
          <LandCard squareMeters={food.resources.land} />
          <EnergyCard kwh={food.resources.energy} />
        </View>

        <PackagingCard grams={food.resources.packaging} />

        {food.ingredients.length > 1 ? (
          <IngredientBreakdown ingredients={food.ingredients} dominantResource="water" />
        ) : null}

        {/* Fun Facts */}
        <View style={[styles.factsCard, { backgroundColor: C.surfaceElevated, borderColor: C.border }]}>
          <View style={styles.factsHeader}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={C.amber} />
            <Text style={[styles.factsTitle, { color: C.text }]}>Did You Know?</Text>
          </View>
          {food.funFacts.map((fact, i) => (
            <View key={i} style={styles.factRow}>
              <View style={[styles.factDot, { backgroundColor: C.amber }]} />
              <Text style={[styles.factText, { color: C.textSecondary }]}>{fact}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.compareBtn, { backgroundColor: C.primaryMuted, borderColor: C.primary + '4D' }]} onPress={handleCompare} activeOpacity={0.8}>
            <MaterialCommunityIcons name="scale-balance" size={18} color={C.primary} />
            <Text style={[styles.compareBtnText, { color: C.primary }]}>Compare with another food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: C.primary }]} onPress={handleShare} activeOpacity={0.8}>
            <Ionicons name="share-social-outline" size={18} color={C.black} />
            <Text style={[styles.shareBtnText, { color: C.black }]}>Share Results</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.disclaimer, { backgroundColor: C.surfaceElevated, borderColor: C.border }]}>
          <Ionicons name="information-circle-outline" size={14} color={C.textMuted} />
          <Text style={[styles.disclaimerText, { color: C.textMuted }]}>
            These values are estimates based on typical ingredients, serving sizes, and average production methods. Actual figures vary by region, season, and farming practice.
          </Text>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  emptyEmoji: { fontSize: 64 },
  emptyText: { fontSize: FontSize.lg },
  emptyBtn: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  emptyBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, borderBottomWidth: 1 },
  backBtn: { padding: Spacing.xs },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, flex: 1, textAlign: 'center' },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { padding: Spacing.xs },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md, gap: Spacing.md },
  foodCard: { borderRadius: BorderRadius.xl, borderWidth: 1, padding: Spacing.md, ...Shadow.md },
  foodCardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  foodEmojiWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  foodEmoji: { fontSize: 30 },
  foodMeta: { flex: 1 },
  foodName: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy },
  foodCategory: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 2 },
  foodServing: { fontSize: FontSize.sm, marginTop: 2 },
  confidenceBadge: { padding: Spacing.sm, borderRadius: BorderRadius.md, alignItems: 'center' },
  confidenceText: { fontSize: FontSize.md, fontWeight: FontWeight.heavy },
  confidenceLabel: { fontSize: FontSize.xs },
  divider: { height: 1, marginBottom: Spacing.md },
  summaryRow: { flexDirection: 'row', gap: Spacing.sm },
  summaryItem: { flex: 1, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.sm, alignItems: 'center', gap: 2 },
  summaryValue: { fontSize: FontSize.md, fontWeight: FontWeight.heavy, textAlign: 'center' },
  summaryUnit: { fontSize: FontSize.xs },
  summaryLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: FontWeight.semibold },
  cardRow: { flexDirection: 'row', gap: Spacing.sm },
  factsCard: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md, gap: Spacing.md },
  factsHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  factsTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  factRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  factDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  factText: { flex: 1, fontSize: FontSize.sm, lineHeight: 20 },
  actions: { gap: Spacing.sm },
  compareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.xl, paddingVertical: Spacing.md, borderWidth: 1 },
  compareBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.xl, paddingVertical: Spacing.md },
  shareBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  disclaimer: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1 },
  disclaimerText: { flex: 1, fontSize: FontSize.xs, lineHeight: 18 },
});
