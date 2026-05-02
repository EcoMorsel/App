// FoodFootprint - Home / Landing Page

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { FOOD_DATABASE } from '@/constants/foodData';
import { FoodScanCard } from '@/components/feature/FoodScanCard';

const { width } = Dimensions.get('window');

const QUICK_FOODS = [
  FOOD_DATABASE.pizza,
  FOOD_DATABASE.burger,
  FOOD_DATABASE.apple,
  FOOD_DATABASE.steak,
  FOOD_DATABASE.chicken,
  FOOD_DATABASE.salad,
];

const STAT_ROWS = [
  { icon: 'water', label: 'Avg meal uses', value: '~1,800L', sub: 'of water', color: Colors.water },
  { icon: 'cloud-outline', label: 'Food causes', value: '26%', sub: 'of global emissions', color: Colors.carbon },
  { icon: 'leaf', label: 'Going vegan saves', value: '73%', sub: 'food-related emissions', color: Colors.primary },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { history, setCurrentScan } = useApp();

  const heroAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(heroAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(statsAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleQuickScan = (food: typeof FOOD_DATABASE.pizza) => {
    setCurrentScan({
      food,
      inputType: 'text',
      rawInput: food.name,
      timestamp: Date.now(),
      scanId: 'quick-' + food.id,
    });
    router.push('/results');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.hero,
            {
              opacity: heroAnim,
              transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            },
          ]}
        >
          <Image
            source={require('@/assets/images/hero-bg.png')}
            style={styles.heroBg}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="leaf" size={12} color={Colors.primary} />
              <Text style={styles.heroBadgeText}>Food Footprint</Text>
            </View>
            <Text style={styles.heroTitle}>See the hidden{'\n'}cost of food</Text>
            <Text style={styles.heroSubtitle}>
              Every meal has an invisible price — water, carbon, land, and energy. We make it visible.
            </Text>
            <TouchableOpacity
              style={styles.heroCta}
              onPress={() => router.push('/scan')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="camera-outline" size={20} color={Colors.black} />
              <Text style={styles.heroCtaText}>Scan a Food</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats Strip */}
        <Animated.View
          style={[
            styles.statsRow,
            {
              opacity: statsAnim,
              transform: [{ translateY: statsAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
            },
          ]}
        >
          {STAT_ROWS.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <MaterialCommunityIcons name={stat.icon as any} size={18} color={stat.color} />
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Quick Explore */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Explore</Text>
          <Text style={styles.sectionSubtitle}>Tap a food to see its footprint instantly</Text>
          <View style={styles.quickGrid}>
            {QUICK_FOODS.map(food => (
              <TouchableOpacity
                key={food.id}
                style={[
                  styles.quickItem,
                  food.impactLevel === 'high' && styles.quickItemHigh,
                  food.impactLevel === 'low' && styles.quickItemLow,
                ]}
                onPress={() => handleQuickScan(food)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>{food.emoji}</Text>
                <Text style={styles.quickName} numberOfLines={1}>{food.name}</Text>
                <View style={[styles.impactPip, {
                  backgroundColor: food.impactLevel === 'high' ? Colors.high :
                    food.impactLevel === 'low' ? Colors.low : Colors.medium
                }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Scans */}
        {history.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Scans</Text>
              <TouchableOpacity onPress={() => router.push('/history')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.historyList}>
              {history.slice(0, 3).map((scan, i) => (
                <FoodScanCard
                  key={scan.scanId}
                  food={scan.food}
                  timestamp={scan.timestamp}
                  onPress={() => {
                    setCurrentScan(scan);
                    router.push('/results');
                  }}
                />
              ))}
            </View>
          </View>
        ) : null}

        {/* Impact Legend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impact Guide</Text>
          <View style={styles.legendCard}>
            {[
              { level: 'Low', color: Colors.low, desc: 'Vegetables, fruits, legumes' },
              { level: 'Medium', color: Colors.medium, desc: 'Poultry, dairy, grains' },
              { level: 'High', color: Colors.high, desc: 'Beef, lamb, imported goods' },
            ].map(item => (
              <View key={item.level} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendLevel, { color: item.color }]}>{item.level}</Text>
                <Text style={styles.legendDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            Values are estimates based on typical ingredients, serving sizes, and average production methods.
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  hero: {
    height: 360,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,15,13,0.72)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryMuted,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
    marginBottom: Spacing.md,
  },
  heroBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.heavy,
    color: Colors.text,
    lineHeight: 42,
    marginBottom: Spacing.md,
  },
  heroSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  heroCtaText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.black,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 3,
  },
  statLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.heavy,
    textAlign: 'center',
  },
  statSub: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickItem: {
    width: (width - Spacing.md * 2 - Spacing.sm * 2) / 3,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  quickItemHigh: {
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.06)',
  },
  quickItemLow: {
    borderColor: 'rgba(34,197,94,0.3)',
    backgroundColor: 'rgba(34,197,94,0.06)',
  },
  quickEmoji: {
    fontSize: 28,
  },
  quickName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  impactPip: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  historyList: {
    gap: Spacing.sm,
  },
  legendCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLevel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    width: 55,
  },
  legendDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    flex: 1,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
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
