// CarbonVisualization - CO2 cloud icons and emission meter

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

interface CarbonVisualizationProps {
  kg: number;
  comparison: string;
}

export function CarbonVisualization({ kg, comparison }: CarbonVisualizationProps) {
  const { C } = useApp();
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
      Animated.timing(anim, { toValue: 1, duration: 500, delay: i * 120, useNativeDriver: true })
    );
    Animated.stagger(80, animations).start();
  }, [kg]);

  const meterColor = kg > 3 ? C.high : kg > 1 ? C.medium : C.low;

  return (
    <View style={[styles.container, { backgroundColor: C.carbonMuted, borderColor: C.carbon + '33' }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="cloud-outline" size={20} color={C.carbon} />
          <Text style={[styles.title, { color: C.textSecondary }]}>CO₂ Emissions</Text>
        </View>
        <View style={styles.numberRow}>
          <Text style={[styles.bigNumber, { color: meterColor }]}>{kg.toFixed(2)}</Text>
          <Text style={[styles.unit, { color: C.textSecondary }]}>kg CO₂e</Text>
        </View>
        <Text style={[styles.comparison, { color: C.textSecondary }]}>{comparison} of car driving</Text>
      </View>

      <View style={[styles.meterBg, { backgroundColor: C.carbon + '26' }]}>
        <Animated.View style={[styles.meterFill, { width: '100%', backgroundColor: meterColor }]} />
      </View>

      <View style={styles.cloudGrid}>
        {cloudAnims.map((anim, i) => (
          <Animated.View key={i} style={[styles.cloud, { opacity: anim, transform: [{ scale: anim }] }]}>
            <MaterialCommunityIcons
              name="cloud"
              size={22}
              color={meterColor}
              style={{ opacity: 0.7 + (i / cloudCount) * 0.3 }}
            />
          </Animated.View>
        ))}
      </View>

      <View style={[styles.footer, { borderTopColor: C.carbon + '26' }]}>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: C.carbon }]} />
          <Text style={[styles.statText, { color: C.textMuted }]}>Average EU meal: ~2.0 kg CO₂e</Text>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: C.carbonDark }]} />
          <Text style={[styles.statText, { color: C.textMuted }]}>Plant-based average: ~0.3 kg CO₂e</Text>
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
  },
  header: { marginBottom: Spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.xs },
  title: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, textTransform: 'uppercase', letterSpacing: 0.8 },
  numberRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  bigNumber: { fontSize: 38, fontWeight: FontWeight.heavy, lineHeight: 44 },
  unit: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, marginBottom: 6 },
  comparison: { fontSize: FontSize.md, marginTop: 2 },
  meterBg: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: Spacing.md },
  meterFill: { height: '100%', borderRadius: 4 },
  cloudGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: Spacing.md },
  cloud: { width: 32, height: 28, justifyContent: 'center', alignItems: 'center' },
  footer: { gap: 4, borderTopWidth: 1, paddingTop: Spacing.sm },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  dot: { width: 5, height: 5, borderRadius: 3 },
  statText: { fontSize: FontSize.xs },
});
