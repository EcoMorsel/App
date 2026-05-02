// LandEnergyCards - Land use and energy visualization cards

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface LandCardProps {
  squareMeters: number;
}

interface EnergyCardProps {
  kwh: number;
}

interface PackagingCardProps {
  grams: number;
}

export function LandCard({ squareMeters }: LandCardProps) {
  const fieldCount = Math.min(Math.max(1, Math.round(squareMeters * 4)), 40);
  const anims = useRef(Array.from({ length: fieldCount }, () => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      40,
      anims.map(anim =>
        Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true })
      )
    ).start();
  }, []);

  return (
    <View style={[styles.card, styles.landCard]}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="grass" size={18} color={Colors.land} />
        <Text style={styles.cardTitle}>Land Use</Text>
      </View>
      <Text style={[styles.cardValue, { color: Colors.landLight }]}>
        {squareMeters.toFixed(1)}
        <Text style={styles.cardUnit}> m²</Text>
      </Text>
      <View style={styles.fieldGrid}>
        {anims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.fieldTile,
              { opacity: anim, transform: [{ scale: anim }] },
            ]}
          >
            <MaterialCommunityIcons name="tree" size={10} color={Colors.land} />
          </Animated.View>
        ))}
      </View>
      <Text style={styles.cardNote}>
        {squareMeters < 1
          ? 'Smaller than a desk'
          : squareMeters < 5
          ? `About ${squareMeters.toFixed(1)} bathtubs of land`
          : `That's ${squareMeters.toFixed(0)} m² of farm`}
      </Text>
    </View>
  );
}

export function EnergyCard({ kwh }: EnergyCardProps) {
  const batteryCount = Math.min(Math.max(1, Math.round(kwh * 5)), 20);
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${Math.min(100, (kwh / 3) * 100)}%`],
  });

  return (
    <View style={[styles.card, styles.energyCard]}>
      <View style={styles.cardHeader}>
        <Ionicons name="flash" size={18} color={Colors.energy} />
        <Text style={styles.cardTitle}>Energy</Text>
      </View>
      <Text style={[styles.cardValue, { color: Colors.energyLight }]}>
        {kwh.toFixed(2)}
        <Text style={styles.cardUnit}> kWh</Text>
      </Text>
      
      {/* Battery visual */}
      <View style={styles.batteryOuter}>
        <View style={styles.batteryTip} />
        <View style={styles.batteryBody}>
          <Animated.View
            style={[
              styles.batteryFill,
              { width: fillWidth, backgroundColor: kwh > 2 ? Colors.high : kwh > 0.5 ? Colors.medium : Colors.low },
            ]}
          />
        </View>
      </View>
      
      <View style={styles.boltRow}>
        {Array.from({ length: batteryCount }).map((_, i) => (
          <Ionicons key={i} name="flash" size={12} color={Colors.energy} style={{ opacity: 0.6 + i * 0.02 }} />
        ))}
      </View>
      <Text style={styles.cardNote}>
        {kwh < 0.5 ? 'Charges your phone once' : `Powers a light bulb for ${Math.round(kwh * 10)}h`}
      </Text>
    </View>
  );
}

export function PackagingCard({ grams }: PackagingCardProps) {
  return (
    <View style={[styles.card, styles.packagingCard]}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="package-variant" size={18} color={Colors.packaging} />
        <Text style={styles.cardTitle}>Packaging</Text>
      </View>
      <Text style={[styles.cardValue, { color: '#C4B5FD' }]}>
        {grams}
        <Text style={styles.cardUnit}> g</Text>
      </Text>
      <View style={styles.boxRow}>
        {Array.from({ length: Math.min(Math.round(grams / 20), 10) }).map((_, i) => (
          <MaterialCommunityIcons key={i} name="cube-outline" size={16} color={Colors.packaging} style={{ opacity: 0.5 + i * 0.05 }} />
        ))}
      </View>
      <Text style={styles.cardNote}>
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
  landCard: {
    backgroundColor: Colors.landMuted,
    borderColor: 'rgba(217,119,6,0.2)',
  },
  energyCard: {
    backgroundColor: Colors.energyMuted,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  packagingCard: {
    backgroundColor: Colors.packagingMuted,
    borderColor: 'rgba(167,139,250,0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cardValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    marginBottom: Spacing.sm,
  },
  cardUnit: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    opacity: 0.7,
  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginBottom: Spacing.sm,
  },
  fieldTile: {
    width: 16,
    height: 16,
    backgroundColor: 'rgba(217,119,6,0.1)',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  batteryOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  batteryTip: {
    width: 4,
    height: 12,
    backgroundColor: Colors.textMuted,
    borderRadius: 2,
    marginLeft: -1,
  },
  batteryBody: {
    flex: 1,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 4,
  },
  batteryFill: {
    height: '100%',
    borderRadius: 2,
  },
  boltRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginBottom: Spacing.xs,
  },
  boxRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  cardNote: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 16,
    marginTop: 'auto',
  },
});
