// LandEnergyCards - Land use and energy visualization cards

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

interface LandCardProps { squareMeters: number }
interface EnergyCardProps { kwh: number }
interface PackagingCardProps { grams: number }

export function LandCard({ squareMeters }: LandCardProps) {
  const { C } = useApp();
  const fieldCount = Math.min(Math.max(1, Math.round(squareMeters * 4)), 40);
  const anims = useRef(Array.from({ length: fieldCount }, () => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(40, anims.map(anim =>
      Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true })
    )).start();
  }, []);

  return (
    <View style={[styles.card, { backgroundColor: C.landMuted, borderColor: C.land + '33' }]}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="grass" size={18} color={C.land} />
        <Text style={[styles.cardTitle, { color: C.textSecondary }]}>Land Use</Text>
      </View>
      <Text style={[styles.cardValue, { color: C.landLight }]}>
        {squareMeters.toFixed(1)}
        <Text style={[styles.cardUnit, { color: C.textMuted }]}> m²</Text>
      </Text>
      <View style={styles.fieldGrid}>
        {anims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[styles.fieldTile, { backgroundColor: C.land + '1A', opacity: anim, transform: [{ scale: anim }] }]}
          >
            <MaterialCommunityIcons name="tree" size={10} color={C.land} />
          </Animated.View>
        ))}
      </View>
      <Text style={[styles.cardNote, { color: C.textMuted }]}>
        {squareMeters < 1
          ? 'Smaller than a desk'
          : squareMeters < 5
          ? `About ${squareMeters.toFixed(1)} bathtubs of land`
          : `That is ${squareMeters.toFixed(0)} m² of farm`}
      </Text>
    </View>
  );
}

export function EnergyCard({ kwh }: EnergyCardProps) {
  const { C } = useApp();
  const batteryCount = Math.min(Math.max(1, Math.round(kwh * 5)), 20);
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, { toValue: 1, duration: 1000, useNativeDriver: false }).start();
  }, []);

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${Math.min(100, (kwh / 3) * 100)}%`],
  });

  const fillColor = kwh > 2 ? C.high : kwh > 0.5 ? C.medium : C.low;

  return (
    <View style={[styles.card, { backgroundColor: C.energyMuted, borderColor: C.energy + '33' }]}>
      <View style={styles.cardHeader}>
        <Ionicons name="flash" size={18} color={C.energy} />
        <Text style={[styles.cardTitle, { color: C.textSecondary }]}>Energy</Text>
      </View>
      <Text style={[styles.cardValue, { color: C.energyLight }]}>
        {kwh.toFixed(2)}
        <Text style={[styles.cardUnit, { color: C.textMuted }]}> kWh</Text>
      </Text>
      <View style={styles.batteryOuter}>
        <View style={[styles.batteryTip, { backgroundColor: C.textMuted }]} />
        <View style={[styles.batteryBody, { borderColor: C.textMuted }]}>
          <Animated.View style={[styles.batteryFill, { width: fillWidth, backgroundColor: fillColor }]} />
        </View>
      </View>
      <View style={styles.boltRow}>
        {Array.from({ length: batteryCount }).map((_, i) => (
          <Ionicons key={i} name="flash" size={12} color={C.energy} style={{ opacity: 0.6 + i * 0.02 }} />
        ))}
      </View>
      <Text style={[styles.cardNote, { color: C.textMuted }]}>
        {kwh < 0.5 ? 'Charges your phone once' : `Powers a light bulb for ${Math.round(kwh * 10)}h`}
      </Text>
    </View>
  );
}

export function PackagingCard({ grams }: PackagingCardProps) {
  const { C } = useApp();
  return (
    <View style={[styles.packagingCard, { backgroundColor: C.packagingMuted, borderColor: C.packaging + '33' }]}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="package-variant" size={18} color={C.packaging} />
        <Text style={[styles.cardTitle, { color: C.textSecondary }]}>Packaging</Text>
      </View>
      <Text style={[styles.cardValue, { color: C.packaging }]}>
        {grams}
        <Text style={[styles.cardUnit, { color: C.textMuted }]}> g</Text>
      </Text>
      <View style={styles.boxRow}>
        {Array.from({ length: Math.min(Math.round(grams / 20), 10) }).map((_, i) => (
          <MaterialCommunityIcons key={i} name="cube-outline" size={16} color={C.packaging} style={{ opacity: 0.5 + i * 0.05 }} />
        ))}
      </View>
      <Text style={[styles.cardNote, { color: C.textMuted }]}>
        {grams < 50 ? 'Minimal packaging' : grams < 100 ? 'Moderate packaging' : 'Heavy packaging — worth recycling'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    minHeight: 160,
  },
  packagingCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.xs },
  cardTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.6 },
  cardValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, marginBottom: Spacing.sm },
  cardUnit: { fontSize: FontSize.md, fontWeight: FontWeight.regular, opacity: 0.7 },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginBottom: Spacing.sm },
  fieldTile: { width: 16, height: 16, borderRadius: 2, justifyContent: 'center', alignItems: 'center' },
  batteryOuter: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  batteryTip: { width: 4, height: 12, borderRadius: 2, marginLeft: -1 },
  batteryBody: { flex: 1, height: 20, borderWidth: 2, borderRadius: 4, overflow: 'hidden', marginRight: 4 },
  batteryFill: { height: '100%', borderRadius: 2 },
  boltRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginBottom: Spacing.xs },
  boxRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: Spacing.sm },
  cardNote: { fontSize: FontSize.xs, lineHeight: 16, marginTop: 'auto' },
});
