// FoodFootprint - History Page

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { FoodScanCard } from '@/components/feature/FoodScanCard';
import { ScanResult } from '@/services/foodEstimationService';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { history, clearHistory, removeFromHistory, setCurrentScan, setCompareA, C } = useApp();
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filtered = filter === 'all' ? history : history.filter(s => s.food.impactLevel === filter);

  const totalWater = history.reduce((sum, s) => sum + s.food.resources.water, 0);
  const totalCarbon = history.reduce((sum, s) => sum + s.food.resources.carbon, 0);

  const handleClear = () => {
    Alert.alert('Clear History?', 'This will delete all your scan history. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearHistory },
    ]);
  };

  const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'low', label: '🟢 Low' },
    { key: 'medium', label: '🟡 Medium' },
    { key: 'high', label: '🔴 High' },
  ] as const;

  return (
    <View style={[styles.root, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: C.text }]}>History</Text>
          <Text style={[styles.headerSub, { color: C.textMuted }]}>{history.length} scans recorded</Text>
        </View>
        {history.length > 0 ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={C.error} />
          </TouchableOpacity>
        ) : null}
      </View>

      {history.length > 0 ? (
        <>
          <View style={styles.statsRow}>
            {[
              { icon: 'water', color: C.water, value: `${totalWater.toLocaleString()}L`, label: 'Total water' },
              { icon: 'cloud-outline', color: C.carbon, value: `${totalCarbon.toFixed(1)}kg`, label: 'Total CO₂' },
              { icon: 'history', color: C.primary, value: `${history.length}`, label: 'Total scans' },
            ].map((s, i) => (
              <View key={i} style={[styles.statCard, { backgroundColor: C.card, borderColor: C.border }]}>
                <MaterialCommunityIcons name={s.icon as any} size={16} color={s.color} />
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: C.textMuted }]}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[
                  styles.filterChip,
                  { backgroundColor: C.card, borderColor: C.border },
                  filter === f.key && { backgroundColor: C.primaryMuted, borderColor: C.primary },
                ]}
              >
                <Text style={[
                  styles.filterText,
                  { color: C.textMuted },
                  filter === f.key && { color: C.primary, fontWeight: FontWeight.bold },
                ]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filtered}
            keyExtractor={item => item.scanId}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.itemWrapper}>
                <FoodScanCard
                  food={item.food}
                  timestamp={item.timestamp}
                  onPress={() => { setCurrentScan(item); router.push('/results'); }}
                  onCompare={() => { setCompareA(item.food); router.push('/compare'); }}
                />
                <TouchableOpacity style={styles.deleteBtn} onPress={() => removeFromHistory(item.scanId)}>
                  <Ionicons name="close-circle-outline" size={20} color={C.textMuted} />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyFilter}>
                <Text style={[styles.emptyFilterText, { color: C.textMuted }]}>No {filter}-impact foods in history</Text>
              </View>
            }
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={[styles.emptyTitle, { color: C.text }]}>No scans yet</Text>
          <Text style={[styles.emptyText, { color: C.textMuted }]}>
            Start scanning food items to build your footprint history
          </Text>
          <TouchableOpacity style={[styles.scanBtn, { backgroundColor: C.primary }]} onPress={() => router.push('/scan')}>
            <MaterialCommunityIcons name="camera-outline" size={18} color={C.black} />
            <Text style={[styles.scanBtnText, { color: C.black }]}>Scan a Food</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, borderBottomWidth: 1 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  headerSub: { fontSize: FontSize.sm, marginTop: 2 },
  clearBtn: { padding: Spacing.xs, marginTop: 4 },
  statsRow: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.sm },
  statCard: { flex: 1, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md, alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize.lg, fontWeight: FontWeight.heavy },
  statLabel: { fontSize: FontSize.xs, textAlign: 'center' },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.sm, marginBottom: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.md, paddingVertical: 7, borderRadius: BorderRadius.full, borderWidth: 1 },
  filterText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  list: { padding: Spacing.md, gap: Spacing.sm },
  itemWrapper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  deleteBtn: { padding: Spacing.xs },
  emptyFilter: { padding: Spacing.xl, alignItems: 'center' },
  emptyFilterText: { fontSize: FontSize.md },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, gap: Spacing.md },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  emptyText: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 24 },
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, marginTop: Spacing.md },
  scanBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
