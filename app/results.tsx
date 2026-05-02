// FoodFootprint - Results Page

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
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { WaterVisualization } from '@/components/ui/WaterVisualization';
import { CarbonVisualization } from '@/components/ui/CarbonVisualization';
import { LandCard, EnergyCard, PackagingCard } from '@/components/ui/LandEnergyCards';
import { IngredientBreakdown } from '@/components/feature/IngredientBreakdown';
import { ImpactMeter } from '@/components/ui/ImpactMeter';

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentScan, setCompareA, favorites, toggleFavorite } = useApp();

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    if (currentScan) {
      setIsFav(favorites.includes(currentScan.food.id));
    }
  }, [currentScan?.food.id]);

  if (!currentScan) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Text style={styles.emptyEmoji}>🍽️</Text>
        <Text style={styles.emptyText}>No food scanned yet</Text>
        <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/scan')}>
          <Text style={styles.emptyBtnText}>Scan a Food</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { food } = currentScan;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌿 FoodFootprint Report\n\n${food.emoji} ${food.name} (${food.servingSize})\n\n💧 Water: ${food.resources.water.toLocaleString()}L (${food.waterComparison})\n☁️ CO₂: ${food.resources.carbon}kg (${food.carbonComparison})\n🌾 Land: ${food.resources.land}m²\n⚡ Energy: ${food.resources.energy}kWh\n\nImpact: ${food.impactLevel.toUpperCase()}\n\n"${food.funFacts[0]}"\n\nGenerated with FoodFootprint`,
      });
    } catch (err) {
      // Share cancelled
    }
  };

  const handleCompare = () => {
    setCompareA(food);
    router.push('/compare');
  };

  const handleFavorite = () => {
    toggleFavorite(food.id);
    setIsFav(prev => !prev);
  };

  const IMPACT_COLOR = {
    low: Colors.low,
    medium: Colors.medium,
    high: Colors.high,
  }[food.impactLevel];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }],
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Footprint Report</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleFavorite} style={styles.actionBtn}>
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={20}
              color={isFav ? Colors.error : Colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
            <Ionicons name="share-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Food Identity Card */}
        <Animated.View
          style={[
            styles.foodCard,
            {
              opacity: headerAnim,
              borderColor: IMPACT_COLOR + '40',
            },
          ]}
        >
          <View style={styles.foodCardTop}>
            <View style={styles.foodEmojiWrap}>
              <Text style={styles.foodEmoji}>{food.emoji}</Text>
            </View>
            <View style={styles.foodMeta}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodCategory}>{food.category}</Text>
              <Text style={styles.foodServing}>{food.servingSize}</Text>
            </View>
            <View style={[styles.confidenceBadge, { backgroundColor: Colors.primaryMuted }]}>
              <Text style={styles.confidenceText}>
                {Math.round(food.confidenceScore * 100)}%
              </Text>
              <Text style={styles.confidenceLabel}>match</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <ImpactMeter level={food.impactLevel} />
        </Animated.View>

        {/* Resource Summary Row */}
        <Animated.View
          style={[
            styles.summaryRow,
            { opacity: contentAnim },
          ]}
        >
          {[
            { label: 'Water', value: food.resources.water.toLocaleString(), unit: 'L', icon: 'water', color: Colors.water },
            { label: 'CO₂', value: food.resources.carbon.toFixed(1), unit: 'kg', icon: 'cloud-outline', color: Colors.carbon },
            { label: 'Land', value: food.resources.land.toFixed(1), unit: 'm²', icon: 'grass', color: Colors.land },
            { label: 'Energy', value: food.resources.energy.toFixed(1), unit: 'kWh', icon: 'lightning-bolt', color: Colors.energy },
          ].map((item, i) => (
            <View key={i} style={styles.summaryItem}>
              <MaterialCommunityIcons name={item.icon as any} size={16} color={item.color} />
              <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
              <Text style={styles.summaryUnit}>{item.unit}</Text>
              <Text style={styles.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Water Visualization */}
        <Animated.View style={{ opacity: contentAnim }}>
          <WaterVisualization
            liters={food.resources.water}
            comparison={food.waterComparison}
          />
        </Animated.View>

        {/* Carbon Visualization */}
        <CarbonVisualization
          kg={food.resources.carbon}
          comparison={food.carbonComparison}
        />

        {/* Land + Energy cards */}
        <View style={styles.cardRow}>
          <LandCard squareMeters={food.resources.land} />
          <EnergyCard kwh={food.resources.energy} />
        </View>

        {/* Packaging Card */}
        <PackagingCard grams={food.resources.packaging} />

        {/* Ingredient Breakdown */}
        {food.ingredients.length > 1 ? (
          <IngredientBreakdown
            ingredients={food.ingredients}
            dominantResource="water"
          />
        ) : null}

        {/* Fun Facts */}
        <View style={styles.factsCard}>
          <View style={styles.factsHeader}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={Colors.amber} />
            <Text style={styles.factsTitle}>Did You Know?</Text>
          </View>
          {food.funFacts.map((fact, i) => (
            <View key={i} style={styles.factRow}>
              <View style={[styles.factDot, { backgroundColor: Colors.amber }]} />
              <Text style={styles.factText}>{fact}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.compareBtn} onPress={handleCompare} activeOpacity={0.8}>
            <MaterialCommunityIcons name="scale-balance" size={18} color={Colors.primary} />
            <Text style={styles.compareBtnText}>Compare with another food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
            <Ionicons name="share-social-outline" size={18} color={Colors.black} />
            <Text style={styles.shareBtnText}>Share Results</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            These values are estimates based on typical ingredients, serving sizes, and average production methods. Actual figures vary by region, season, and farming practice.
          </Text>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  empty: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  emptyBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    padding: Spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  foodCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    ...Shadow.md,
  },
  foodCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  foodEmojiWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodEmoji: {
    fontSize: 30,
  },
  foodMeta: {
    flex: 1,
  },
  foodName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.heavy,
    color: Colors.text,
  },
  foodCategory: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  foodServing: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  confidenceBadge: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.heavy,
    color: Colors.primary,
  },
  confidenceLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  summaryValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.heavy,
    textAlign: 'center',
  },
  summaryUnit: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  summaryLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: FontWeight.semibold,
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  factsCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  factsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  factsTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  factDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  factText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    gap: Spacing.sm,
  },
  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryMuted,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  compareBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
  },
  shareBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.black,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disclaimerText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
