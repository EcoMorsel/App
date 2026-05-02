// ResourceBadge - Small colored badge for resource types

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize, Spacing } from '@/constants/theme';

interface ResourceBadgeProps {
  label: string;
  color: string;
  bgColor: string;
}

export function ResourceBadge({ label, color, bgColor }: ResourceBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
