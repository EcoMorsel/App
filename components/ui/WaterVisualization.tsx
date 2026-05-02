// WaterVisualization - Animated water glasses stacking effect

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface WaterVisualizationProps {
  liters: number;
  comparison: string;
}

const GLASS_ML = 200; // each glass = 200ml = 0.2L

export function WaterVisualization({ liters, comparison }: WaterVisualizationProps) {
  const glasses = Math.min(Math.round(liters / 0.2), 60); // max 60 glasses displayed
  const displayGlasses = Math.round(liters / 0.2);
  const animValue = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(countAnim, {
        toValue: liters,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [liters]);

  const animatedLiters = countAnim.interpolate({
    inputRange: [0, liters],
    outputRange: [0, liters],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="water" size={20} color={Colors.water} />
          <Text style={styles.title}>Water Used</Text>
        </View>
        <View style={styles.numberRow}>
          <Animated.Text style={styles.bigNumber}>
            {liters.toLocaleString()}
          </Animated.Text>
          <Text style={styles.unit}>L</Text>
        </View>
        <Text style={styles.comparison}>= {comparison}</Text>
      </View>

      <View style={styles.glassGrid}>
        {Array.from({ length: glasses }).map((_, i) => {
          const delay = Math.min(i * 30, 800);
          const anim = useRef(new Animated.Value(0)).current;
          
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
                {
                  opacity: anim,
                  transform: [{ scale: anim }],
                },
              ]}
            >
              <MaterialCommunityIcons name="cup-water" size={18} color={Colors.waterLight} />
            </Animated.View>
          );
        })}
        {displayGlasses > 60 && (
          <View style={styles.moreGlasses}>
            <Text style={styles.moreText}>+{displayGlasses - 60} more</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: Colors.water }]} />
          <Text style={styles.statText}>1 glass = 200ml of water</Text>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: Colors.waterLight }]} />
          <Text style={styles.statText}>Daily need: ~8 glasses (1.6L)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.waterMuted,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
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
    color: Colors.textSecondary,
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
    fontSize: FontSize.hero,
    fontWeight: FontWeight.heavy,
    color: Colors.waterLight,
    lineHeight: 48,
  },
  unit: {
    fontSize: FontSize.xxl,
    color: Colors.water,
    fontWeight: FontWeight.bold,
    marginBottom: 6,
  },
  comparison: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
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
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderRadius: 6,
  },
  moreGlasses: {
    width: 56,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderRadius: 6,
  },
  moreText: {
    fontSize: FontSize.xs,
    color: Colors.water,
    fontWeight: FontWeight.semibold,
  },
  footer: {
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,130,246,0.15)',
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
