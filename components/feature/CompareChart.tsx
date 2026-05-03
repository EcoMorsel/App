// CompareChart - Side-by-side resource comparison

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FoodItem, FoodResource } from '@/constants/foodData';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';

interface CompareChartProps {
  food1: FoodItem;
  food2: FoodItem;
}

type ResourceKey = keyof FoodResource;

export function CompareChart({ food1, food2 }: CompareChartProps) {
  const { C } = useApp();

  const RESOURCES: { key: ResourceKey; label: string; unit: string; icon: string; color: string }[] = [
    { key: 'water', label: 'Water', unit: 'L', icon: 'water', color: C.water },
    { key: 'carbon', label: 'CO₂', unit: 'kg', icon: 'cloud-outline', color: C.carbon },
    { key: 'land', label: 'Land', unit: 'm²', icon: 'grass', color: C.land },
    { key: 'energy', label: 'Energy', unit: 'kWh', icon: 'lightning-bolt', color: C.energy },
  ];

  return (
    <View style={[styles.container, { backgroundColor: C.surfaceElevated, borderColor: C.border }]}>
      <View style={styles.header}>
        <View style={styles.foodLabel}>
          <Text style={styles.foodEmoji}>{food1.emoji}</Text>
          <Text style={[styles.foodName, { color: C.text }]} numberOfLines={2}>{food1.name}</Text>
        </View>
        <View style={[styles.vsContainer, { backgroundColor: C.primaryMuted }]}>
          <Text style={[styles.vsText, { color: C.primary }]}>VS</Text>
        </View>
        <View style={[styles.foodLabel, styles.foodLabelRight]}>
          <Text style={styles.foodEmoji}>{food2.emoji}</Text>
          <Text style={[styles.foodName, { color: C.text, textAlign: 'right' }]} numberOfLines={2}>{food2.name}</Text>
        </View>
      </View>

      <View style={styles.rows}>
        {RESOURCES.map(res => {
          const v1 = food1.resources[res.key];
          const v2 = food2.resources[res.key];
          const total = v1 + v2;
          const p1 = total > 0 ? (v1 / total) * 100 : 50;
          const p2 = 100 - p1;
          const winner = v1 <= v2 ? 'food1' : 'food2';

          const bar1Anim = useRef(new Animated.Value(0)).current;
          const bar2Anim = useRef(new Animated.Value(0)).current;

          useEffect(() => {
            Animated.parallel([
              Animated.timing(bar1Anim, { toValue: p1, duration: 800, useNativeDriver: false }),
              Animated.timing(bar2Anim, { toValue: p2, duration: 800, useNativeDriver: false }),
            ]).start();
          }, [food1.id, food2.id]);

          return (
            <View key={res.key} style={styles.resourceRow}>
              <View style={styles.resourceLabel}>
                <MaterialCommunityIcons name={res.icon as any} size={14} color={res.color} />
                <Text style={[styles.resourceName, { color: res.color }]}>{res.label}</Text>
              </View>
              <View style={styles.barSection}>
                <View style={styles.barLeft}>
                  <Text style={[styles.barValue, { color: C.textMuted }, winner === 'food1' && { color: C.primary, fontWeight: FontWeight.bold }]}>
                    {v1 < 1 ? v1.toFixed(2) : v1.toFixed(0)}{res.unit}
                  </Text>
                  <View style={[styles.bar1Bg, { backgroundColor: C.border }]}>
                    <Animated.View style={[styles.barFill, {
                      width: bar1Anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                      backgroundColor: res.color,
                      opacity: winner === 'food1' ? 1 : 0.4,
                    }]} />
                  </View>
                </View>
                <View style={[styles.centerLine, { backgroundColor: C.border }]} />
                <View style={styles.barRight}>
                  <View style={[styles.bar2Bg, { backgroundColor: C.border }]}>
                    <Animated.View style={[styles.barFill2, {
                      width: bar2Anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                      backgroundColor: res.color,
                      opacity: winner === 'food2' ? 1 : 0.4,
                    }]} />
                  </View>
                  <Text style={[styles.barValue, { color: C.textMuted }, winner === 'food2' && { color: C.primary, fontWeight: FontWeight.bold }]}>
                    {v2 < 1 ? v2.toFixed(2) : v2.toFixed(0)}{res.unit}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={[styles.summary, { borderTopColor: C.border }]}>
        {(() => {
          const score1 = RESOURCES.filter(r => food1.resources[r.key] <= food2.resources[r.key]).length;
          const score2 = RESOURCES.length - score1;
          const winner = score1 >= score2 ? food1 : food2;
          return (
            <View style={[styles.summaryContent, { backgroundColor: C.primaryMuted }]}>
              <Text style={styles.summaryEmoji}>{winner.emoji}</Text>
              <View>
                <Text style={[styles.summaryTitle, { color: C.primary }]}>{winner.name} wins!</Text>
                <Text style={[styles.summaryText, { color: C.textSecondary }]}>Lower impact in {Math.max(score1, score2)}/{RESOURCES.length} categories</Text>
              </View>
              <MaterialCommunityIcons name="trophy" size={20} color={C.amber} />
            </View>
          );
        })()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg, gap: Spacing.sm },
  foodLabel: { flex: 1, alignItems: 'center', gap: 4 },
  foodLabelRight: { alignItems: 'center' },
  foodEmoji: { fontSize: 28 },
  foodName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, textAlign: 'center' },
  vsContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  vsText: { fontSize: FontSize.xs, fontWeight: FontWeight.heavy },
  rows: { gap: Spacing.md, marginBottom: Spacing.md },
  resourceRow: { gap: Spacing.sm },
  resourceLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center' },
  resourceName: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
  barSection: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  barLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: Spacing.xs },
  barRight: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  barValue: { fontSize: FontSize.xs, width: 45, textAlign: 'right' },
  bar1Bg: { flex: 1, height: 10, borderRadius: 5, overflow: 'hidden', flexDirection: 'row', justifyContent: 'flex-end' },
  bar2Bg: { flex: 1, height: 10, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5, position: 'absolute', right: 0 },
  barFill2: { height: '100%', borderRadius: 5 },
  centerLine: { width: 2, height: 20 },
  summary: { borderTopWidth: 1, paddingTop: Spacing.md },
  summaryContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: BorderRadius.md, padding: Spacing.md },
  summaryEmoji: { fontSize: 24 },
  summaryTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  summaryText: { fontSize: FontSize.xs },
});
