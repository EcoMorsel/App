// FoodFootprint - History Page

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { FoodScanCard } from '@/components/feature/FoodScanCard';
import { ScanResult } from '@/services/foodEstimationService';
import { useAlert } from '@/template';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { history, clearHistory, removeFromHistory, setCurrentScan, setCompareA } = useApp();
  const { showAlert } = useAlert();
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filtered = filter === 'all' ? history : history.filter(s => s.food.impactLevel === filter);

  // Summary stats
  const totalWater = history.reduce((sum, s) => sum + s.food.resources.water, 0);
  const totalCarbon = history.reduce((sum, s) => sum + s.food.resources.carbon, 0);

  const handleClear = () => {
    showAlert('Clear History?', 'This will delete all your scan history. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearHistory },
    ]);
  };

  const handleItemPress = (scan: ScanResult) => {
    setCurrentScan(scan);
    router.push('/results');
  };

  const handleCompare = (scan: ScanResult) => {
    setCompareA(scan.food);
    router.push('/compare');
  };

  const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'low', label: '🟢 Low' },
    { key: 'medium', label: '🟡 Medium' },
    { key: 'high', label: '🔴 High' },
  ] as const;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>History</Text>
          <Text style={styles.headerSub}>{history.length} scans recorded</Text>
        </View>
        {history.length > 0 ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.error} />
          </TouchableOpacity>
        ) : null}
      </View>

      {history.length > 0 ? (
        <>
          {/* Stats summary */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="water" size={16} color={Colors.water} />
              <Text style={[styles.statValue, { color: Colors.water }]}>{totalWater.toLocaleString()}L</Text>
              <Text style={styles.statLabel}>Total water</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="cloud-outline" size={16} color={Colors.carbon} />
              <Text style={[styles.statValue, { color: Colors.carbon }]}>{totalCarbon.toFixed(1)}kg</Text>
              <Text style={styles.statLabel}>Total CO₂</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="history" size={16} color={Colors.primary} />
              <Text style={[styles.statValue, { color: Colors.primary }]}>{history.length}</Text>
              <Text style={styles.statLabel}>Total scans</Text>
            </View>
          </View>

          {/* Filter chips */}
          <View style={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
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
                  onPress={() => handleItemPress(item)}
                  onCompare={() => handleCompare(item)}
                />
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removeFromHistory(item.scanId)}
                >
                  <Ionicons name="close-circle-outline" size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyFilter}>
                <Text style={styles.emptyFilterText}>No {filter}-impact foods in history</Text>
              </View>
            }
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>No scans yet</Text>
          <Text style={styles.emptyText}>
            Start scanning food items to build your footprint history
          </Text>
          <TouchableOpacity
            style={styles.scanBtn}
            onPress={() => router.push('/scan')}
          >
            <MaterialCommunityIcons name="camera-outline" size={18} color={Colors.black} />
            <Text style={styles.scanBtnText}>Scan a Food</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  clearBtn: {
    padding: Spacing.xs,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.heavy,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  filterTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  list: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  emptyFilter: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyFilterText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  scanBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.black,
  },
});
