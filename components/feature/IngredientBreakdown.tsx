// IngredientBreakdown - Ingredient-level resource breakdown

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Ingredient } from '@/constants/foodData';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';

interface IngredientBreakdownProps {
  ingredients: Ingredient[];
  dominantResource?: 'water' | 'carbon' | 'land' | 'energy';
}

type ResourceKey = 'water' | 'carbon' | 'land' | 'energy';

export function IngredientBreakdown({ ingredients, dominantResource = 'water' }: IngredientBreakdownProps) {
  const { C } = useApp();
  const [selectedResource, setSelectedResource] = useState<ResourceKey>(dominantResource);

  const RESOURCE_CONFIG = {
    water: { label: 'Water', unit: 'L', color: C.water, icon: 'water' },
    carbon: { label: 'CO₂', unit: 'kg', color: C.carbon, icon: 'cloud-outline' },
    land: { label: 'Land', unit: 'm²', color: C.land, icon: 'grass' },
    energy: { label: 'Energy', unit: 'kWh', color: C.energy, icon: 'lightning-bolt' },
  } as const;

  const sorted = [...ingredients].sort((a, b) => b[selectedResource] - a[selectedResource]);
  const maxVal = Math.max(...sorted.map(i => i[selectedResource]), 0.001);

  return (
    <View style={[styles.container, { backgroundColor: C.surfaceElevated, borderColor: C.border }]}>
      <Text style={[styles.sectionTitle, { color: C.text }]}>Ingredient Breakdown</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
        style={styles.tabs}
      >
        {(Object.keys(RESOURCE_CONFIG) as ResourceKey[]).map(key => {
          const config = RESOURCE_CONFIG[key];
          const isSelected = selectedResource === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setSelectedResource(key)}
              style={[
                styles.tab,
                { backgroundColor: C.card, borderColor: C.border },
                isSelected && { backgroundColor: config.color + '22', borderColor: config.color },
              ]}
            >
              <MaterialCommunityIcons
                name={config.icon as any}
                size={14}
                color={isSelected ? config.color : C.textMuted}
              />
              <Text style={[styles.tabText, { color: C.textMuted }, isSelected && { color: config.color }]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.list}>
        {sorted.map((ingredient, index) => {
          const barAnim = useRef(new Animated.Value(0)).current;
          const cfg = RESOURCE_CONFIG[selectedResource];
          const percentage = ingredient[selectedResource] / maxVal;
          const value = ingredient[selectedResource];

          useEffect(() => {
            Animated.timing(barAnim, {
              toValue: percentage,
              duration: 600,
              delay: index * 80,
              useNativeDriver: false,
            }).start();
          }, [selectedResource]);

          const barWidth = barAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', `${Math.max(percentage * 100, 4)}%`],
          });

          return (
            <View key={ingredient.name} style={styles.ingredientRow}>
              <View style={styles.ingredientHeader}>
                <View style={styles.ingredientLeft}>
                  <Text style={styles.ingredientIcon}>{ingredient.icon}</Text>
                  <View>
                    <Text style={[styles.ingredientName, { color: C.text }]}>{ingredient.name}</Text>
                    <Text style={[styles.ingredientPortion, { color: C.textMuted }]}>{ingredient.portion}</Text>
                  </View>
                </View>
                <Text style={[styles.ingredientValue, { color: cfg.color }]}>
                  {value < 1 ? value.toFixed(2) : value.toFixed(0)} {cfg.unit}
                </Text>
              </View>
              <View style={[styles.barBg, { backgroundColor: C.border }]}>
                <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: cfg.color }]} />
              </View>
              {ingredient.note ? (
                <Text style={[styles.note, { color: C.textMuted }]}>{ingredient.note}</Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.md },
  tabs: { marginBottom: Spacing.md },
  tabsContent: { gap: Spacing.sm, paddingRight: Spacing.md },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: Spacing.md, paddingVertical: 7, borderRadius: BorderRadius.full, borderWidth: 1 },
  tabText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  list: { gap: Spacing.md },
  ingredientRow: { gap: 6 },
  ingredientHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ingredientLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  ingredientIcon: { fontSize: 20 },
  ingredientName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  ingredientPortion: { fontSize: FontSize.xs },
  ingredientValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  barBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  note: { fontSize: FontSize.xs, fontStyle: 'italic', paddingLeft: 32 },
});
