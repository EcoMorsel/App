// FoodFootprint - Processing / Scanning Animation Page

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

export default function ProcessingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentScan, isProcessing, C } = useApp();

  const STEPS = [
    { icon: 'magnify-scan', label: 'Identifying food item...', color: C.primary },
    { icon: 'water-outline', label: 'Calculating water footprint...', color: C.water },
    { icon: 'cloud-outline', label: 'Estimating CO₂ emissions...', color: C.carbon },
    { icon: 'grass', label: 'Measuring land use...', color: C.land },
    { icon: 'lightning-bolt', label: 'Summing energy usage...', color: C.energy },
    { icon: 'check-circle-outline', label: 'Preparing your report...', color: C.primary },
  ];

  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const stepAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.loop(Animated.timing(spinAnim, { toValue: 1, duration: 2000, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ])).start();
    Animated.stagger(380, STEPS.map((_, i) =>
      Animated.timing(stepAnims[i], { toValue: 1, duration: 300, delay: i * 380, useNativeDriver: true })
    )).start();
  }, []);

  useEffect(() => {
    if (!isProcessing && currentScan) {
      const timeout = setTimeout(() => { router.replace('/results'); }, 2600);
      return () => clearTimeout(timeout);
    }
  }, [isProcessing, currentScan]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={[styles.root, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <View style={styles.orbContainer}>
        <Animated.View style={[styles.orbRing, styles.orbRing3, { borderColor: C.primary, transform: [{ rotate: spin }] }]} />
        <Animated.View style={[styles.orbRing, styles.orbRing2, { borderColor: C.primaryLight }]} />
        <Animated.View style={[styles.orbCore, { backgroundColor: C.primaryMuted, borderColor: C.primary, transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.orbEmoji}>{currentScan?.food?.emoji || '🌿'}</Text>
        </Animated.View>
      </View>

      <Text style={[styles.title, { color: C.text }]}>Analyzing Footprint</Text>
      <Text style={[styles.subtitle, { color: C.primary }]}>{currentScan?.food?.name || 'Your food item'}</Text>

      <View style={styles.steps}>
        {STEPS.map((step, i) => (
          <Animated.View
            key={i}
            style={[
              styles.step,
              { backgroundColor: C.card, borderColor: C.border },
              { opacity: stepAnims[i], transform: [{ translateX: stepAnims[i].interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] },
            ]}
          >
            <View style={[styles.stepIcon, { backgroundColor: step.color + '20' }]}>
              <MaterialCommunityIcons name={step.icon as any} size={16} color={step.color} />
            </View>
            <Text style={[styles.stepLabel, { color: C.textSecondary }]}>{step.label}</Text>
            <Animated.View style={{ opacity: stepAnims[Math.min(i + 1, STEPS.length - 1)] }}>
              <Ionicons name="checkmark-circle" size={16} color={C.primary} />
            </Animated.View>
          </Animated.View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={12} color={C.textMuted} />
        <Text style={[styles.disclaimerText, { color: C.textMuted }]}>Values are estimates based on average production data</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  orbContainer: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl },
  orbRing: { position: 'absolute', borderRadius: 999, borderWidth: 2 },
  orbRing3: { width: 110, height: 110, borderStyle: 'dashed', opacity: 0.5 },
  orbRing2: { width: 85, height: 85, opacity: 0.3 },
  orbCore: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  orbEmoji: { fontSize: 28 },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, marginBottom: Spacing.xs, textAlign: 'center' },
  subtitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, marginBottom: Spacing.xl, textAlign: 'center' },
  steps: { width: '100%', gap: Spacing.sm, marginBottom: Spacing.xl },
  step: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  stepIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  stepLabel: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  disclaimer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  disclaimerText: { fontSize: FontSize.xs },
});
