// FoodScanCard - Compact card for history and compare selection

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FoodItem } from '@/constants/foodData';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';

interface FoodScanCardProps {
  food: FoodItem;
  timestamp?: number;
  onPress?: () => void;
  onCompare?: () => void;
  compact?: boolean;
  selected?: boolean;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function FoodScanCard({ food, timestamp, onPress, onCompare, compact, selected }: FoodScanCardProps) {
  const { C } = useApp();
  const timeAgo = timestamp ? formatTimeAgo(timestamp) : null;

  const IMPACT_COLOR = { low: C.low, medium: C.medium, high: C.high };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: C.card, borderColor: C.border },
        compact && styles.compact,
        selected && { borderColor: C.primary, backgroundColor: C.primaryMuted },
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Text style={styles.emoji}>{food.emoji}</Text>
        <View style={styles.info}>
          <Text style={[styles.name, { color: C.text }]} numberOfLines={1}>{food.name}</Text>
          <Text style={[styles.meta, { color: C.textMuted }]}>{food.servingSize}</Text>
          {timeAgo ? <Text style={[styles.time, { color: C.textMuted }]}>{timeAgo}</Text> : null}
        </View>
      </View>

      <View style={styles.right}>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="water" size={12} color={C.water} />
            <Text style={[styles.statValue, { color: C.water }]}>{food.resources.water}L</Text>
          </View>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="cloud-outline" size={12} color={C.carbon} />
            <Text style={[styles.statValue, { color: C.carbon }]}>{food.resources.carbon}kg</Text>
          </View>
        </View>
        <View style={[styles.impactDot, { backgroundColor: IMPACT_COLOR[food.impactLevel] }]} />
        {onCompare ? (
          <TouchableOpacity onPress={onCompare} style={styles.compareBtn}>
            <MaterialCommunityIcons name="scale-balance" size={16} color={C.primary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  compact: { padding: Spacing.sm },
  left: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  emoji: { fontSize: 28 },
  info: { flex: 1 },
  name: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  meta: { fontSize: FontSize.xs, marginTop: 1 },
  time: { fontSize: FontSize.xs, marginTop: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  stats: { alignItems: 'flex-end', gap: 3 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statValue: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  impactDot: { width: 8, height: 8, borderRadius: 4 },
  compareBtn: { padding: 4 },
});
