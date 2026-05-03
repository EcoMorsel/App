// ImpactMeter - Visual impact level indicator

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

interface ImpactMeterProps {
  level: 'low' | 'medium' | 'high';
}

export function ImpactMeter({ level }: ImpactMeterProps) {
  const { C } = useApp();

  const LEVEL_CONFIG = {
    low: { color: C.low, label: 'Low Impact', bars: 1, description: 'Better than 80% of foods' },
    medium: { color: C.medium, label: 'Medium Impact', bars: 2, description: 'Average environmental cost' },
    high: { color: C.high, label: 'High Impact', bars: 3, description: 'Consider eating less often' },
  };

  const config = LEVEL_CONFIG[level];

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[
              styles.bar,
              i < config.bars ? { backgroundColor: config.color } : { backgroundColor: C.border },
            ]}
          />
        ))}
      </View>
      <View style={styles.info}>
        <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
        <Text style={[styles.description, { color: C.textMuted }]}>{config.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  bars: { flexDirection: 'row', gap: 4 },
  bar: { width: 20, height: 8, borderRadius: 4 },
  info: { flex: 1 },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  description: { fontSize: FontSize.xs, marginTop: 1 },
});
