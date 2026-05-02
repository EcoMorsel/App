// FoodFootprint - Compare Page

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { CompareChart } from '@/components/feature/CompareChart';
import { FOOD_DATABASE, FoodItem } from '@/constants/foodData';

const ALL_FOODS = Object.values(FOOD_DATABASE);

export default function CompareScreen() {
  const insets = useSafeAreaInsets();
  const { compareA, compareB, setCompareA, setCompareB } = useApp();
  const [pickerTarget, setPickerTarget] = useState<'A' | 'B' | null>(null);

  const handleSelect = (food: FoodItem) => {
    if (pickerTarget === 'A') setCompareA(food);
    else setCompareB(food);
    setPickerTarget(null);
  };

  const FoodSelector = ({ label, food, onPress }: { label: string; food: FoodItem | null; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.selector, food && styles.selectorFilled]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {food ? (
        <>
          <Text style={styles.selectorEmoji}>{food.emoji}</Text>
          <View style={styles.selectorInfo}>
            <Text style={styles.selectorName}>{food.name}</Text>
            <Text style={styles.selectorMeta}>{food.servingSize}</Text>
          </View>
          <MaterialCommunityIcons name="pencil-outline" size={16} color={Colors.textMuted} />
        </>
      ) : (
        <>
          <View style={styles.selectorPlaceholderIcon}>
            <MaterialCommunityIcons name="plus" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.selectorPlaceholder}>Select {label}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Compare</Text>
        <Text style={styles.headerSub}>Side-by-side environmental impact</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Food selectors */}
        <View style={styles.selectors}>
          <FoodSelector
            label="Food A"
            food={compareA}
            onPress={() => setPickerTarget('A')}
          />
          <View style={styles.vsChip}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <FoodSelector
            label="Food B"
            food={compareB}
            onPress={() => setPickerTarget('B')}
          />
        </View>

        {compareA && compareB ? (
          <CompareChart food1={compareA} food2={compareB} />
        ) : (
          <View style={styles.prompt}>
            <Text style={styles.promptEmoji}>⚖️</Text>
            <Text style={styles.promptTitle}>Choose two foods to compare</Text>
            <Text style={styles.promptText}>
              See which meal has the lower environmental impact across water, CO₂, land, and energy
            </Text>
          </View>
        )}

        {/* Preset comparisons */}
        <View style={styles.presets}>
          <Text style={styles.presetsTitle}>Popular Comparisons</Text>
          {[
            { a: 'steak', b: 'salad', label: 'Beef Steak vs Garden Salad' },
            { a: 'burger', b: 'pizza', label: 'Burger vs Pizza' },
            { a: 'chicken', b: 'pasta', label: 'Chicken vs Pasta' },
            { a: 'coffee', b: 'apple', label: 'Coffee vs Apple' },
          ].map(preset => (
            <TouchableOpacity
              key={`${preset.a}-${preset.b}`}
              style={styles.presetItem}
              onPress={() => {
                setCompareA(FOOD_DATABASE[preset.a]);
                setCompareB(FOOD_DATABASE[preset.b]);
              }}
            >
              <Text style={styles.presetEmoji}>
                {FOOD_DATABASE[preset.a].emoji} vs {FOOD_DATABASE[preset.b].emoji}
              </Text>
              <Text style={styles.presetLabel}>{preset.label}</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Food Picker Modal */}
      <Modal
        visible={pickerTarget !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPickerTarget(null)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Food {pickerTarget}</Text>
            <TouchableOpacity onPress={() => setPickerTarget(null)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={ALL_FOODS}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.modalList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  (pickerTarget === 'A' ? compareA?.id : compareB?.id) === item.id && styles.modalItemSelected,
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.modalItemEmoji}>{item.emoji}</Text>
                <View style={styles.modalItemInfo}>
                  <Text style={styles.modalItemName}>{item.name}</Text>
                  <Text style={styles.modalItemMeta}>{item.servingSize}</Text>
                </View>
                <View style={[styles.impactBadge, {
                  backgroundColor: item.impactLevel === 'high' ? 'rgba(239,68,68,0.15)' :
                    item.impactLevel === 'low' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                }]}>
                  <Text style={[styles.impactText, {
                    color: item.impactLevel === 'high' ? Colors.high :
                      item.impactLevel === 'low' ? Colors.low : Colors.medium,
                  }]}>
                    {item.impactLevel}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: Colors.text,
  },
  headerSub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  selectors: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  selector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    padding: Spacing.md,
    minHeight: 64,
  },
  selectorFilled: {
    borderStyle: 'solid',
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  selectorEmoji: {
    fontSize: 24,
  },
  selectorInfo: {
    flex: 1,
  },
  selectorName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    numberOfLines: 1,
  },
  selectorMeta: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  selectorPlaceholderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorPlaceholder: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  vsChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.heavy,
    color: Colors.primary,
  },
  prompt: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promptEmoji: {
    fontSize: 48,
  },
  promptTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  promptText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  presets: {
    gap: Spacing.sm,
  },
  presetsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  presetEmoji: {
    fontSize: 18,
  },
  presetLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  modal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  modalList: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  modalItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  modalItemEmoji: {
    fontSize: 24,
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  modalItemMeta: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  impactBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  impactText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'capitalize',
  },
});
