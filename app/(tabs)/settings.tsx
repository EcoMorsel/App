// FoodFootprint - Settings / Info Page

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';

const ESTIMATION_SOURCES = [
  { label: 'Water footprint', source: 'Hoekstra & Chapagain (2008), Water Footprint Network' },
  { label: 'Carbon emissions', source: 'Poore & Nemecek (2018), Science — "Reducing food environmental impacts"' },
  { label: 'Land use data', source: 'Our World in Data, global agricultural land use statistics' },
  { label: 'Energy factors', source: 'USDA ERS food supply chain energy estimates' },
  { label: 'Packaging data', source: 'Ellen MacArthur Foundation packaging lifecycle reports' },
];

const IMPACT_TIPS = [
  { emoji: '🥩', tip: 'Replace 1 beef meal/week with chicken → save ~2,000L water & 2.5kg CO₂' },
  { emoji: '🚜', tip: 'Buying local reduces transport emissions by 30-50%' },
  { emoji: '🌱', tip: 'One plant-based day per week can cut your food footprint by 15%' },
  { emoji: '♻️', tip: 'Composting food waste cuts methane emissions from landfill' },
  { emoji: '🛍️', tip: 'Bringing reusable bags saves ~60g of plastic per shopping trip' },
  { emoji: '🥦', tip: 'Seasonal vegetables have 50% lower water footprint than out-of-season' },
];

const RESOURCE_GUIDE = [
  {
    resource: 'Water Footprint',
    icon: 'water',
    color: Colors.water,
    desc: 'Total freshwater used in producing a food item, including field irrigation, processing, and cleaning. Expressed in liters per serving.',
  },
  {
    resource: 'Carbon Footprint',
    icon: 'cloud-outline',
    color: Colors.carbon,
    desc: 'Greenhouse gas emissions measured in kg CO₂-equivalent, including methane from livestock, N₂O from fertilizers, and transport fuel.',
  },
  {
    resource: 'Land Use',
    icon: 'grass',
    color: Colors.land,
    desc: 'Total land area required to grow ingredients and raise animals, measured in square meters. Includes farmland, pasture, and feed crops.',
  },
  {
    resource: 'Energy Use',
    icon: 'lightning-bolt',
    color: Colors.energy,
    desc: 'Total energy consumed in production, processing, refrigeration, transport, and cooking. Measured in kilowatt-hours (kWh).',
  },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { history, clearHistory } = useApp();
  const { showAlert } = useAlert();

  const handleClearData = () => {
    showAlert('Clear All Data?', 'This will delete your scan history. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About & Info</Text>
        <Text style={styles.headerSub}>How FoodFootprint works</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App intro */}
        <View style={styles.introCard}>
          <Text style={styles.introEmoji}>🌿</Text>
          <Text style={styles.introTitle}>FoodFootprint</Text>
          <Text style={styles.introText}>
            Every food item has a hidden cost — water pulled from rivers, land cleared for farms, carbon released into the atmosphere. FoodFootprint makes the invisible visible so you can make informed, planet-friendly choices.
          </Text>
          <View style={styles.introBadge}>
            <Text style={styles.introBadgeText}>Educational • Non-commercial • Estimate-based</Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning-outline" size={18} color={Colors.amber} />
            <Text style={[styles.sectionTitle, { color: Colors.amber }]}>Important Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            All values shown in FoodFootprint are <Text style={styles.bold}>estimates</Text> based on average global data for typical production methods. Actual environmental impact varies significantly based on:
          </Text>
          <View style={styles.disclaimerList}>
            {[
              'Geographic region and farming practices',
              'Organic vs conventional production',
              'Season and local climate conditions',
              'Transport distance and mode',
              'Consumer preparation methods',
            ].map((item, i) => (
              <View key={i} style={styles.disclaimerItem}>
                <View style={styles.bullet} />
                <Text style={styles.disclaimerItemText}>{item}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.disclaimerFooter}>
            When data is unavailable, we use category-level averages and clearly mark values as estimates.
          </Text>
        </View>

        {/* Resource Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Each Metric Means</Text>
          <View style={styles.resourceList}>
            {RESOURCE_GUIDE.map(item => (
              <View key={item.resource} style={styles.resourceItem}>
                <View style={[styles.resourceIcon, { backgroundColor: item.color + '20' }]}>
                  <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.resourceInfo}>
                  <Text style={[styles.resourceTitle, { color: item.color }]}>{item.resource}</Text>
                  <Text style={styles.resourceDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Data Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sources</Text>
          <View style={styles.sourcesList}>
            {ESTIMATION_SOURCES.map((s, i) => (
              <View key={i} style={styles.sourceItem}>
                <Text style={styles.sourceLabel}>{s.label}</Text>
                <Text style={styles.sourceText}>{s.source}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reduce Your Footprint</Text>
          <View style={styles.tipsList}>
            {IMPACT_TIPS.map((tip, i) => (
              <View key={i} style={styles.tipItem}>
                <Text style={styles.tipEmoji}>{tip.emoji}</Text>
                <Text style={styles.tipText}>{tip.tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your App Stats</Text>
          <View style={styles.appStats}>
            <View style={styles.appStatItem}>
              <Text style={[styles.appStatValue, { color: Colors.primary }]}>{history.length}</Text>
              <Text style={styles.appStatLabel}>Foods Scanned</Text>
            </View>
            <View style={styles.appStatItem}>
              <Text style={[styles.appStatValue, { color: Colors.water }]}>
                {history.reduce((s, h) => s + h.food.resources.water, 0).toLocaleString()}L
              </Text>
              <Text style={styles.appStatLabel}>Water Tracked</Text>
            </View>
            <View style={styles.appStatItem}>
              <Text style={[styles.appStatValue, { color: Colors.carbon }]}>
                {history.reduce((s, h) => s + h.food.resources.carbon, 0).toFixed(1)}kg
              </Text>
              <Text style={styles.appStatLabel}>CO₂ Tracked</Text>
            </View>
          </View>
        </View>

        {/* Clear data */}
        {history.length > 0 ? (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearData}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.error} />
            <Text style={styles.clearBtnText}>Clear All Scan History</Text>
          </TouchableOpacity>
        ) : null}

        {/* Version */}
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>FoodFootprint v1.0</Text>
          <Text style={styles.versionSub}>For educational purposes only</Text>
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
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
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
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  introCard: {
    backgroundColor: Colors.primaryMuted,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
  },
  introEmoji: {
    fontSize: 40,
  },
  introTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: Colors.text,
  },
  introText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  introBadge: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  introBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  disclaimerCard: {
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  bold: {
    fontWeight: FontWeight.bold,
    color: Colors.amber,
  },
  disclaimerList: {
    gap: Spacing.sm,
  },
  disclaimerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.amber,
  },
  disclaimerItemText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  disclaimerFooter: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  section: {
    gap: Spacing.md,
  },
  resourceList: {
    gap: Spacing.md,
  },
  resourceItem: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  resourceDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  sourcesList: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sourceItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sourceLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  sourceText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  tipsList: {
    gap: Spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  tipEmoji: {
    fontSize: 20,
  },
  tipText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  appStats: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  appStatItem: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  appStatValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.heavy,
  },
  appStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    padding: Spacing.md,
  },
  clearBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
  versionRow: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.md,
  },
  versionText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  versionSub: {
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
  },
});
