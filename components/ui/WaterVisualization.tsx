// WaterVisualization - Animated water glasses stacking effect

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

interface WaterVisualizationProps {
  liters: number;
  comparison: string;
}

export function WaterVisualization({ liters, comparison }: WaterVisualizationProps) {
  const { C } = useApp();
  const glasses = Math.min(Math.round(liters / 0.2), 60);
  const displayGlasses = Math.round(liters / 0.2);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [liters]);

  return (
    <View style={[styles.container, {
      backgroundColor: C.waterMuted,
      borderColor: C.water + '33',
    }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="water" size={20} color={C.water} />
          <Text style={[styles.title, { color: C.textSecondary }]}>Water Used</Text>
        </View>
        <View style={styles.numberRow}>
          <Text style={[styles.bigNumber, { color: C.waterLight }]}>
            {liters.toLocaleString()}
          </Text>
          <Text style={[styles.unit, { color: C.water }]}>L</Text>
        </View>
        <Text style={[styles.comparison, { color: C.textSecondary }]}>= {comparison}</Text>
      </View>

      <View style={styles.glassGrid}>
        {Array.from({ length: glasses }).map((_, i) => {
          const anim = useRef(new Animated.Value(0)).current;
          const delay = Math.min(i * 30, 800);
          useEffect(() => {
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              delay,
              useNativeDriver: true,
            }).start();
          }, []);

          return (
            <Animated.View
              key={i}
              style={[
                styles.glass,
                { backgroundColor: C.water + '26', opacity: anim, transform: [{ scale: anim }] },
              ]}
            >
              <MaterialCommunityIcons name="cup-water" size={18} color={C.waterLight} />
            </Animated.View>
          );
        })}
        {displayGlasses > 60 ? (
          <View style={[styles.moreGlasses, { backgroundColor: C.water + '1A' }]}>
            <Text style={[styles.moreText, { color: C.water }]}>+{displayGlasses - 60} more</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.footer, { borderTopColor: C.water + '26' }]}>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: C.water }]} />
          <Text style={[styles.statText, { color: C.textMuted }]}>1 glass = 200ml of water</Text>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: C.waterLight }]} />
          <Text style={[styles.statText, { color: C.textMuted }]}>Daily need: ~8 glasses (1.6L)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    overflow: 'hidden',
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
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bigNumber: {
    fontSize: 42,
    fontWeight: FontWeight.heavy,
    lineHeight: 48,
  },
  unit: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: 6,
  },
  comparison: {
    fontSize: FontSize.md,
    marginTop: 2,
  },
  glassGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: Spacing.md,
  },
  glass: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  moreGlasses: {
    width: 56,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  moreText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  footer: {
    gap: 4,
    borderTopWidth: 1,
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
  },
});
