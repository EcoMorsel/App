// EcoMorsel - Home / Landing Page

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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { FOOD_DATABASE } from '@/constants/foodData';
import { FoodScanCard } from '@/components/feature/FoodScanCard';

const { width } = Dimensions.get('window');

const QUICK_FOODS = [
  FOOD_DATABASE.salad,
  FOOD_DATABASE.pizza,
  FOOD_DATABASE.chicken,
  FOOD_DATABASE.burger,
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { history, setCurrentScan, C } = useApp();

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

  const STAT_ROWS = [
    { icon: 'water', label: 'Avg meal uses', value: '~1,800L', sub: 'of water', color: C.water },
    { icon: 'leaf', label: 'Going vegan saves', value: '73%', sub: 'food-related emissions', color: C.primary },
  ];

  return (
    <View style={[styles.root, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero */}
        <Animated.View style={[styles.hero, { opacity: heroAnim, transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Image source={require('@/assets/images/hero-bg.png')} style={styles.heroBg} contentFit="cover" />
          <LinearGradient
            colors={['rgba(10,15,13,0.2)', C.background]}
            locations={[0.4, 4]}
            style={styles.heroOverlay}
          />
          <View style={styles.heroContent}>
            <View style={[styles.heroBadge, { backgroundColor: 'transparent', borderColor: C.primary, borderWidth: 1 }]}>
              <Ionicons name="leaf" size={12} color={C.primary} />
              <Text style={[styles.heroBadgeText, { color: C.primary }]}>EcoMorsel</Text>
            </View>
            <Text style={styles.heroTitle}>See the hidden{'\n'}resources behind{' \n'}every bite.</Text>
            <Text style={styles.heroSubtitle}>
              Every meal has an invisible price
              {'\n'}We make it visible.
            </Text>
            <TouchableOpacity style={[styles.heroCta, { backgroundColor: C.primary, borderBottomWidth: 4, borderBottomColor: C.primaryDark }]} onPress={() => router.push('/scan')} activeOpacity={0.8}>
              <MaterialCommunityIcons name="camera-outline" size={20} color={C.black} />
              <Text style={[styles.heroCtaText, { color: C.black }]}>Scan a Food</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Quick Explore */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Quick Explore</Text>
          <Text style={[styles.sectionSubtitle, { color: C.textMuted }]}>Tap a food to see its footprint instantly</Text>
          <View style={styles.quickGrid}>
            {QUICK_FOODS.map(food => (
              <TouchableOpacity
                key={food.id}
                style={[
                  styles.quickItem,
                  { backgroundColor: C.card, borderColor: C.border },
                  food.impactLevel === 'high' && { borderColor: C.high + '4D', backgroundColor: C.high + '0F' },
                  food.impactLevel === 'low' && { borderColor: C.low + '4D', backgroundColor: C.low + '0F' },
                ]}
                onPress={() => handleQuickScan(food)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>{food.emoji}</Text>
                <Text style={[styles.quickName, { color: C.textSecondary }]} numberOfLines={1}>{food.name}</Text>
                <View style={[styles.impactPip, {
                  backgroundColor: food.impactLevel === 'high' ? C.high : food.impactLevel === 'low' ? C.low : C.medium,
                }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Scans */}
        {history.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Recent Scans</Text>
              <TouchableOpacity onPress={() => router.push('/history')}>
                <Text style={[styles.seeAll, { color: C.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.historyList}>
              {history.slice(0, 3).map(scan => (
                <FoodScanCard
                  key={scan.scanId}
                  food={scan.food}
                  timestamp={scan.timestamp}
                  onPress={() => { setCurrentScan(scan); router.push('/results'); }}
                />
              ))}
            </View>
          </View>
        ) : null}

        {/* Impact Legend */}
        <View style={[styles.section, { marginBottom: 14, marginTop: 10 }]}>
          <Text style={[styles.sectionTitle, { color: C.text, marginBottom: 20 }]}>Impact Guide</Text>
          <View style={[styles.legendCard, { backgroundColor: C.card, borderColor: C.border }]}>
            {[
              { level: 'Low', color: C.low, desc: 'Vegetables, fruits, legumes' },
              { level: 'Medium', color: C.medium, desc: 'Poultry, dairy, grains' },
              { level: 'High', color: C.high, desc: 'Beef, lamb, imported goods' },
            ].map(item => (
              <View key={item.level} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendLevel, { color: item.color }]}>{item.level}</Text>
                <Text style={[styles.legendDesc, { color: C.textMuted }]}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Strip */}
        <Animated.View style={[styles.statsRow, { opacity: statsAnim, transform: [{ translateY: statsAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
          {STAT_ROWS.map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: C.card, borderColor: C.border }]}>
              <MaterialCommunityIcons name={stat.icon as any} size={24} color={stat.color} />
              <Text style={[styles.statLabel, { color: C.textMuted }]}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.statSub, { color: C.textMuted }]}>{stat.sub}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xl },
  hero: { height: 360, overflow: 'hidden', marginBottom: 22 },
  heroBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  heroContent: { flex: 1, justifyContent: 'flex-end', padding: Spacing.lg, paddingBottom: Spacing.xl },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1, marginBottom: Spacing.md },
  heroBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 0.8, textTransform: 'uppercase' },
  heroTitle: { fontSize: FontSize.display, fontWeight: FontWeight.heavy, color: '#F0FFF4', lineHeight: 42, marginBottom: Spacing.md },
  heroSubtitle: { fontSize: FontSize.md, color: '#A3C4A8', lineHeight: 24, marginBottom: Spacing.lg },
  heroCta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, alignSelf: 'flex-start', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.full },
  heroCtaText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: 14 },
  statCard: { flex: 1, borderRadius: BorderRadius.lg, borderWidth: 1, padding: 12, alignItems: 'center', gap: 6 },
  statLabel: { fontSize: 11, textAlign: 'center', marginTop: 2 },
  statValue: { fontSize: 20, fontWeight: FontWeight.bold, textAlign: 'center' },
  statSub: { fontSize: 11, textAlign: 'center' },
  section: { paddingHorizontal: Spacing.md, marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: Spacing.xs },
  sectionSubtitle: { fontSize: FontSize.sm, marginBottom: Spacing.md },
  seeAll: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 16 },
  quickItem: { width: (width - Spacing.md * 2 - 14) / 2, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.lg, alignItems: 'center', gap: 10 },
  quickEmoji: { fontSize: 28 },
  quickName: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textAlign: 'center' },
  impactPip: { width: 6, height: 6, borderRadius: 3 },
  historyList: { gap: Spacing.sm },
  legendCard: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md, gap: Spacing.md },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLevel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, width: 55 },
  legendDesc: { fontSize: FontSize.sm, flex: 1 },
});
