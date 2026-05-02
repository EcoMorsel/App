// ImpactMeter - Visual impact level indicator

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';

interface ImpactMeterProps {
  level: 'low' | 'medium' | 'high';
  score?: number; // 0-100
}

const LEVEL_CONFIG = {
  low: { color: Colors.low, label: 'Low Impact', bars: 1, description: 'Better than 80% of foods' },
  medium: { color: Colors.medium, label: 'Medium Impact', bars: 2, description: 'Average environmental cost' },
  high: { color: Colors.high, label: 'High Impact', bars: 3, description: 'Consider eating less often' },
};

export function ImpactMeter({ level, score }: ImpactMeterProps) {
  const config = LEVEL_CONFIG[level];
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.bar, i < config.bars ? { backgroundColor: config.color } : styles.barEmpty]} />
        ))}
      </View>
      <View style={styles.info}>
        <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
        <Text style={styles.description}>{config.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bars: {
    flexDirection: 'row',
    gap: 4,
  },
  bar: {
    width: 20,
    height: 8,
    borderRadius: 4,
  },
  barEmpty: {
    backgroundColor: Colors.border,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  description: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
});
