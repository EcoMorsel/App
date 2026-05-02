// FoodScanCard - Compact card for history and compare selection

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FoodItem } from '@/constants/foodData';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FoodScanCardProps {
  food: FoodItem;
  timestamp?: number;
  onPress?: () => void;
  onCompare?: () => void;
  compact?: boolean;
  selected?: boolean;
}

const IMPACT_COLOR = {
  low: Colors.low,
  medium: Colors.medium,
  high: Colors.high,
};

export function FoodScanCard({ food, timestamp, onPress, onCompare, compact, selected }: FoodScanCardProps) {
  const timeAgo = timestamp ? formatTimeAgo(timestamp) : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        compact && styles.compact,
        selected && styles.selected,
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Text style={styles.emoji}>{food.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{food.name}</Text>
          <Text style={styles.meta}>{food.servingSize}</Text>
          {timeAgo ? <Text style={styles.time}>{timeAgo}</Text> : null}
        </View>
      </View>
      
      <View style={styles.right}>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="water" size={12} color={Colors.water} />
            <Text style={[styles.statValue, { color: Colors.water }]}>
              {food.resources.water}L
            </Text>
          </View>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="cloud-outline" size={12} color={Colors.carbon} />
            <Text style={[styles.statValue, { color: Colors.carbon }]}>
              {food.resources.carbon}kg
            </Text>
          </View>
        </View>
        <View style={[styles.impactDot, { backgroundColor: IMPACT_COLOR[food.impactLevel] }]} />
        {onCompare ? (
          <TouchableOpacity onPress={onCompare} style={styles.compareBtn}>
            <MaterialCommunityIcons name="scale-balance" size={16} color={Colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
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

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  compact: {
    padding: Spacing.sm,
  },
  selected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  meta: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stats: {
    alignItems: 'flex-end',
    gap: 3,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  impactDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compareBtn: {
    padding: 4,
  },
});
