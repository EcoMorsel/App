// FoodFootprint - Processing / Scanning Animation Page

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

const STEPS = [
  { icon: 'magnify-scan', label: 'Identifying food item...', color: Colors.primary },
  { icon: 'water-outline', label: 'Calculating water footprint...', color: Colors.water },
  { icon: 'cloud-outline', label: 'Estimating CO₂ emissions...', color: Colors.carbon },
  { icon: 'grass', label: 'Measuring land use...', color: Colors.land },
  { icon: 'lightning-bolt', label: 'Summing energy usage...', color: Colors.energy },
  { icon: 'check-circle-outline', label: 'Preparing your report...', color: Colors.primary },
];

export default function ProcessingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentScan, isProcessing } = useApp();

  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const stepAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;
  const currentStep = useRef(0);

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Step animations
    const stepAnimations = STEPS.map((_, i) =>
      Animated.timing(stepAnims[i], {
        toValue: 1,
        duration: 300,
        delay: i * 380,
        useNativeDriver: true,
      })
    );
    Animated.stagger(380, stepAnimations).start();
  }, []);

  // Navigate to results when processing is done
  useEffect(() => {
    if (!isProcessing && currentScan) {
      const timeout = setTimeout(() => {
        router.replace('/results');
      }, 2600);
      return () => clearTimeout(timeout);
    }
  }, [isProcessing, currentScan]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Animated center orb */}
      <View style={styles.orbContainer}>
        <Animated.View style={[styles.orbRing, styles.orbRing3, { transform: [{ rotate: spin }] }]} />
        <Animated.View style={[styles.orbRing, styles.orbRing2]} />
        <Animated.View style={[styles.orbCore, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.orbEmoji}>
            {currentScan?.food?.emoji || '🌿'}
          </Text>
        </Animated.View>
      </View>

      <Text style={styles.title}>Analyzing Footprint</Text>
      <Text style={styles.subtitle}>
        {currentScan?.food?.name || 'Your food item'}
      </Text>

      {/* Steps */}
      <View style={styles.steps}>
        {STEPS.map((step, i) => (
          <Animated.View
            key={i}
            style={[
              styles.step,
              {
                opacity: stepAnims[i],
                transform: [
                  {
                    translateX: stepAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={[styles.stepIcon, { backgroundColor: step.color + '20' }]}>
              <MaterialCommunityIcons name={step.icon as any} size={16} color={step.color} />
            </View>
            <Text style={styles.stepLabel}>{step.label}</Text>
            <Animated.View style={{ opacity: stepAnims[Math.min(i + 1, STEPS.length - 1)] }}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
            </Animated.View>
          </Animated.View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={12} color={Colors.textMuted} />
        <Text style={styles.disclaimerText}>
          Values are estimates based on average production data
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  orbContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  orbRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
  },
  orbRing3: {
    width: 110,
    height: 110,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  orbRing2: {
    width: 85,
    height: 85,
    borderColor: Colors.primaryLight,
    opacity: 0.3,
  },
  orbCore: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  steps: {
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  disclaimerText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
