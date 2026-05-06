// EcoMorsel - Settings / Info Page

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
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
  { resource: 'Water Footprint', icon: 'water', desc: 'Total freshwater used in producing a food item, including field irrigation, processing, and cleaning. Expressed in liters per serving.', colorKey: 'water' },
  { resource: 'Carbon Footprint', icon: 'cloud-outline', desc: 'Greenhouse gas emissions measured in kg CO₂-equivalent, including methane from livestock, N₂O from fertilizers, and transport fuel.', colorKey: 'carbon' },
  { resource: 'Land Use', icon: 'grass', desc: 'Total land area required to grow ingredients and raise animals, measured in square meters. Includes farmland, pasture, and feed crops.', colorKey: 'land' },
  { resource: 'Energy Use', icon: 'lightning-bolt', desc: 'Total energy consumed in production, processing, refrigeration, transport, and cooking. Measured in kilowatt-hours (kWh).', colorKey: 'energy' },
] as const;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { history, clearHistory, themeMode, toggleTheme, C } = useApp();
  const { showAlert } = useAlert();
  const isLight = themeMode === 'light';

  const handleClearData = () => {
    showAlert('Clear All Data?', 'This will delete your scan history. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearHistory },
    ]);
  };

  const resourceColor = (key: string) => {
    const map: Record<string, string> = {
      water: C.water,
      carbon: C.carbon,
      land: C.land,
      energy: C.energy,
    };
    return map[key] ?? C.primary;
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>About & Info</Text>
        <Text style={[styles.headerSub, { color: C.textMuted }]}>How EcoMorsel works</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Theme Toggle ── */}
        <View style={[styles.themeCard, {
          backgroundColor: isLight ? C.primaryMuted : C.card,
          borderColor: C.border,
        }]}>
          <View style={styles.themeLeft}>
            <View style={[styles.themeIconWrap, { backgroundColor: isLight ? C.primary + '22' : C.surfaceElevated }]}>
              <Ionicons
                name={isLight ? 'sunny' : 'moon'}
                size={22}
                color={isLight ? C.primary : C.textSecondary}
              />
            </View>
            <View>
              <Text style={[styles.themeLabel, { color: C.text }]}>
                {isLight ? 'Light Mode' : 'Dark Mode'}
              </Text>
              <Text style={[styles.themeSub, { color: C.textMuted }]}>
                {isLight ? 'Clean, bright interface' : 'Forest-green dark interface'}
              </Text>
            </View>
          </View>
          <Switch
            value={isLight}
            onValueChange={toggleTheme}
            trackColor={{ false: C.border, true: C.primary }}
            thumbColor={isLight ? C.white : C.textSecondary}
            ios_backgroundColor={C.border}
          />
        </View>

        {/* App intro */}
        <View style={[styles.introCard, {
          backgroundColor: C.primaryMuted,
          borderColor: C.primary + '33',
        }]}>
          <Text style={styles.introEmoji}>🌿</Text>
          <Text style={[styles.introTitle, { color: C.text }]}>EcoMorsel</Text>
          <Text style={[styles.introText, { color: C.textSecondary }]}>
            See the hidden resources behind every bite. Every food item has a hidden cost — water pulled from rivers, land cleared for farms, carbon released into the atmosphere. EcoMorsel makes the invisible visible so you can make informed, planet-friendly choices.
          </Text>
          <View style={[styles.introBadge, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={[styles.introBadgeText, { color: C.textMuted }]}>Educational • Non-commercial • Estimate-based</Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={[styles.disclaimerCard, { backgroundColor: C.amberMuted, borderColor: C.amber + '33' }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning-outline" size={18} color={C.amber} />
            <Text style={[styles.sectionTitle, { color: C.amber }]}>Important Disclaimer</Text>
          </View>
          <Text style={[styles.disclaimerText, { color: C.textSecondary }]}>
            All values shown in EcoMorsel are{' '}
            <Text style={[styles.bold, { color: C.amber }]}>estimates</Text> based on average global
            data for typical production methods. Actual environmental impact varies significantly based on:
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
                <View style={[styles.bullet, { backgroundColor: C.amber }]} />
                <Text style={[styles.disclaimerItemText, { color: C.textSecondary }]}>{item}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.disclaimerFooter, { color: C.textMuted }]}>
            When data is unavailable, we use category-level averages and clearly mark values as estimates.
          </Text>
        </View>

        {/* Resource Guide */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>What Each Metric Means</Text>
          <View style={styles.resourceList}>
            {RESOURCE_GUIDE.map(item => {
              const color = resourceColor(item.colorKey);
              return (
                <View key={item.resource} style={[styles.resourceItem, { backgroundColor: C.card, borderColor: C.border }]}>
                  <View style={[styles.resourceIcon, { backgroundColor: color + '20' }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={20} color={color} />
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={[styles.resourceTitle, { color }]}>{item.resource}</Text>
                    <Text style={[styles.resourceDesc, { color: C.textMuted }]}>{item.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Data Sources */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Data Sources</Text>
          <View style={[styles.sourcesList, { backgroundColor: C.card, borderColor: C.border }]}>
            {ESTIMATION_SOURCES.map((s, i) => (
              <View
                key={i}
                style={[
                  styles.sourceItem,
                  { borderBottomColor: C.border },
                  i === ESTIMATION_SOURCES.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={[styles.sourceLabel, { color: C.text }]}>{s.label}</Text>
                <Text style={[styles.sourceText, { color: C.textMuted }]}>{s.source}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Reduce Your Footprint</Text>
          <View style={styles.tipsList}>
            {IMPACT_TIPS.map((tip, i) => (
              <View key={i} style={[styles.tipItem, { backgroundColor: C.card, borderColor: C.border }]}>
                <Text style={styles.tipEmoji}>{tip.emoji}</Text>
                <Text style={[styles.tipText, { color: C.textSecondary }]}>{tip.tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Your App Stats</Text>
          <View style={[styles.appStats, { backgroundColor: C.card, borderColor: C.border }]}>
            <View style={[styles.appStatItem, { borderRightColor: C.border }]}>
              <Text style={[styles.appStatValue, { color: C.primary }]}>{history.length}</Text>
              <Text style={[styles.appStatLabel, { color: C.textMuted }]}>Foods Scanned</Text>
            </View>
            <View style={[styles.appStatItem, { borderRightColor: C.border }]}>
              <Text style={[styles.appStatValue, { color: C.water }]}>
                {history.reduce((s, h) => s + h.food.resources.water, 0).toLocaleString()}L
              </Text>
              <Text style={[styles.appStatLabel, { color: C.textMuted }]}>Water Tracked</Text>
            </View>
            <View style={[styles.appStatItem, { borderRightColor: C.border }]}>
              <Text style={[styles.appStatValue, { color: C.carbon }]}>
                {history.reduce((s, h) => s + h.food.resources.carbon, 0).toFixed(1)}kg
              </Text>
              <Text style={[styles.appStatLabel, { color: C.textMuted }]}>CO₂ Tracked</Text>
            </View>
          </View>
        </View>

        {/* Clear data */}
        {history.length > 0 ? (
          <TouchableOpacity
            style={[styles.clearBtn, { backgroundColor: C.error + '1A', borderColor: C.error + '4D' }]}
            onPress={handleClearData}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={C.error} />
            <Text style={[styles.clearBtnText, { color: C.error }]}>Clear All Scan History</Text>
          </TouchableOpacity>
        ) : null}

        {/* Version */}
        <View style={styles.versionRow}>
          <Text style={[styles.versionText, { color: C.textMuted }]}>EcoMorsel v1.0</Text>
          <Text style={[styles.versionSub, { color: C.textDisabled }]}>For educational purposes only</Text>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, borderBottomWidth: 1 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  headerSub: { fontSize: FontSize.sm, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md, gap: Spacing.lg },

  // Theme toggle
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.md,
  },
  themeLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  themeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  themeSub: { fontSize: FontSize.xs, marginTop: 2 },

  introCard: { borderRadius: BorderRadius.xl, borderWidth: 1, padding: Spacing.lg, alignItems: 'center', gap: Spacing.md },
  introEmoji: { fontSize: 40 },
  introTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  introText: { fontSize: FontSize.md, lineHeight: 24, textAlign: 'center' },
  introBadge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: 6, borderWidth: 1 },
  introBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },

  disclaimerCard: { borderRadius: BorderRadius.xl, borderWidth: 1, padding: Spacing.md, gap: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: 4 },
  disclaimerText: { fontSize: FontSize.sm, lineHeight: 22 },
  bold: { fontWeight: FontWeight.bold },
  disclaimerList: { gap: Spacing.sm },
  disclaimerItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  bullet: { width: 5, height: 5, borderRadius: 3 },
  disclaimerItemText: { fontSize: FontSize.sm, flex: 1 },
  disclaimerFooter: { fontSize: FontSize.xs, fontStyle: 'italic', lineHeight: 18 },

  section: { gap: Spacing.md },
  resourceList: { gap: Spacing.md },
  resourceItem: { flexDirection: 'row', gap: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  resourceIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  resourceInfo: { flex: 1 },
  resourceTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, marginBottom: 4 },
  resourceDesc: { fontSize: FontSize.sm, lineHeight: 20 },

  sourcesList: { borderRadius: BorderRadius.lg, borderWidth: 1, overflow: 'hidden' },
  sourceItem: { padding: Spacing.md, borderBottomWidth: 1 },
  sourceLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: 2 },
  sourceText: { fontSize: FontSize.xs, lineHeight: 18 },

  tipsList: { gap: Spacing.sm },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  tipEmoji: { fontSize: 20 },
  tipText: { flex: 1, fontSize: FontSize.sm, lineHeight: 20 },

  appStats: { flexDirection: 'row', borderRadius: BorderRadius.lg, borderWidth: 1, overflow: 'hidden' },
  appStatItem: { flex: 1, padding: Spacing.md, alignItems: 'center', gap: 4, borderRightWidth: 1 },
  appStatValue: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy },
  appStatLabel: { fontSize: FontSize.xs, textAlign: 'center' },

  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  clearBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },

  versionRow: { alignItems: 'center', gap: 4, paddingVertical: Spacing.md },
  versionText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  versionSub: { fontSize: FontSize.xs },
});
