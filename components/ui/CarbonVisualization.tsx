// CarbonVisualization - CO2 cloud icons and emission meter

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface CarbonVisualizationProps {
  kg: number;
  comparison: string;
}

export function CarbonVisualization({ kg, comparison }: CarbonVisualizationProps) {
  const cloudCount = Math.min(Math.max(1, Math.round(kg * 2)), 20);
  const fillAnim = useRef(new Animated.Value(0)).current;
  const cloudAnims = useRef(
    Array.from({ length: cloudCount }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: kg,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    const animations = cloudAnims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: i * 120,
        useNativeDriver: true,
      })
    );
    Animated.stagger(80, animations).start();
  }, [kg]);

  const meterWidth = fillAnim.interpolate({
    inputRange: [0, Math.max(kg, 0.1)],
    outputRange: ['0%', '100%'],
  });

  const meterColor = kg > 3 ? Colors.high : kg > 1 ? Colors.medium : Colors.low;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="cloud-outline" size={20} color={Colors.carbon} />
          <Text style={styles.title}>CO₂ Emissions</Text>
        </View>
        <View style={styles.numberRow}>
          <Text style={[styles.bigNumber, { color: meterColor }]}>{kg.toFixed(2)}</Text>
          <Text style={styles.unit}>kg CO₂e</Text>
        </View>
        <Text style={styles.comparison}>{comparison} of car driving</Text>
      </View>

      {/* Meter Bar */}
      <View style={styles.meterBg}>
        <Animated.View
          style={[
            styles.meterFill,
            { width: '100%', backgroundColor: meterColor },
          ]}
        />
      </View>

      {/* Cloud icons */}
      <View style={styles.cloudGrid}>
        {cloudAnims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.cloud,
              { opacity: anim, transform: [{ scale: anim }] },
            ]}
          >
            <MaterialCommunityIcons
              name="cloud"
              size={22}
              color={meterColor}
              style={{ opacity: 0.7 + (i / cloudCount) * 0.3 }}
            />
          </Animated.View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: Colors.carbon }]} />
          <Text style={styles.statText}>Average EU meal: ~2.0 kg CO₂e</Text>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: Colors.carbonDark }]} />
          <Text style={styles.statText}>Plant-based average: ~0.3 kg CO₂e</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.carbonMuted,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(156,163,175,0.2)',
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  bigNumber: {
    fontSize: 38,
    fontWeight: FontWeight.heavy,
    lineHeight: 44,
  },
  unit: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.semibold,
    marginBottom: 6,
  },
  comparison: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  meterBg: {
    height: 8,
    backgroundColor: 'rgba(156,163,175,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  cloudGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: Spacing.md,
  },
  cloud: {
    width: 32,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(156,163,175,0.15)',
    paddingTop: Spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
