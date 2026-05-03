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
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { CompareChart } from '@/components/feature/CompareChart';
import { FOOD_DATABASE, FoodItem } from '@/constants/foodData';

const ALL_FOODS = Object.values(FOOD_DATABASE);

export default function CompareScreen() {
  const insets = useSafeAreaInsets();
  const { compareA, compareB, setCompareA, setCompareB, C } = useApp();
  const [pickerTarget, setPickerTarget] = useState<'A' | 'B' | null>(null);

  const handleSelect = (food: FoodItem) => {
    if (pickerTarget === 'A') setCompareA(food);
    else setCompareB(food);
    setPickerTarget(null);
  };

  const FoodSelector = ({ label, food, onPress }: { label: string; food: FoodItem | null; onPress: () => void }) => (
    <TouchableOpacity
      style={[
        styles.selector,
        { backgroundColor: C.card, borderColor: C.border },
        food && { borderStyle: 'solid', borderColor: C.primary, backgroundColor: C.primaryMuted },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {food ? (
        <>
          <Text style={styles.selectorEmoji}>{food.emoji}</Text>
          <View style={styles.selectorInfo}>
            <Text style={[styles.selectorName, { color: C.text }]}>{food.name}</Text>
            <Text style={[styles.selectorMeta, { color: C.textMuted }]}>{food.servingSize}</Text>
          </View>
          <MaterialCommunityIcons name="pencil-outline" size={16} color={C.textMuted} />
        </>
      ) : (
        <>
          <View style={[styles.selectorPlaceholderIcon, { backgroundColor: C.primaryMuted }]}>
            <MaterialCommunityIcons name="plus" size={24} color={C.primary} />
          </View>
          <Text style={[styles.selectorPlaceholder, { color: C.textMuted }]}>Select {label}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.root, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>Compare</Text>
        <Text style={[styles.headerSub, { color: C.textMuted }]}>Side-by-side environmental impact</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.selectors}>
          <FoodSelector label="Food A" food={compareA} onPress={() => setPickerTarget('A')} />
          <View style={[styles.vsChip, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={[styles.vsText, { color: C.primary }]}>VS</Text>
          </View>
          <FoodSelector label="Food B" food={compareB} onPress={() => setPickerTarget('B')} />
        </View>

        {compareA && compareB ? (
          <CompareChart food1={compareA} food2={compareB} />
        ) : (
          <View style={[styles.prompt, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={styles.promptEmoji}>⚖️</Text>
            <Text style={[styles.promptTitle, { color: C.text }]}>Choose two foods to compare</Text>
            <Text style={[styles.promptText, { color: C.textMuted }]}>
              See which meal has the lower environmental impact across water, CO₂, land, and energy
            </Text>
          </View>
        )}

        <View style={styles.presets}>
          <Text style={[styles.presetsTitle, { color: C.text }]}>Popular Comparisons</Text>
          {[
            { a: 'steak', b: 'salad', label: 'Beef Steak vs Garden Salad' },
            { a: 'burger', b: 'pizza', label: 'Burger vs Pizza' },
            { a: 'chicken', b: 'pasta', label: 'Chicken vs Pasta' },
            { a: 'coffee', b: 'apple', label: 'Coffee vs Apple' },
          ].map(preset => (
            <TouchableOpacity
              key={`${preset.a}-${preset.b}`}
              style={[styles.presetItem, { backgroundColor: C.card, borderColor: C.border }]}
              onPress={() => { setCompareA(FOOD_DATABASE[preset.a]); setCompareB(FOOD_DATABASE[preset.b]); }}
            >
              <Text style={styles.presetEmoji}>
                {FOOD_DATABASE[preset.a].emoji} vs {FOOD_DATABASE[preset.b].emoji}
              </Text>
              <Text style={[styles.presetLabel, { color: C.textSecondary }]}>{preset.label}</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Picker Modal */}
      <Modal visible={pickerTarget !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPickerTarget(null)}>
        <View style={[styles.modal, { backgroundColor: C.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: C.border }]}>
            <Text style={[styles.modalTitle, { color: C.text }]}>Choose Food {pickerTarget}</Text>
            <TouchableOpacity onPress={() => setPickerTarget(null)}>
              <Ionicons name="close" size={24} color={C.text} />
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
                  { backgroundColor: C.card, borderColor: C.border },
                  (pickerTarget === 'A' ? compareA?.id : compareB?.id) === item.id && { borderColor: C.primary, backgroundColor: C.primaryMuted },
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.modalItemEmoji}>{item.emoji}</Text>
                <View style={styles.modalItemInfo}>
                  <Text style={[styles.modalItemName, { color: C.text }]}>{item.name}</Text>
                  <Text style={[styles.modalItemMeta, { color: C.textMuted }]}>{item.servingSize}</Text>
                </View>
                <View style={[styles.impactBadge, {
                  backgroundColor: item.impactLevel === 'high' ? C.high + '26' : item.impactLevel === 'low' ? C.low + '26' : C.medium + '26',
                }]}>
                  <Text style={[styles.impactText, {
                    color: item.impactLevel === 'high' ? C.high : item.impactLevel === 'low' ? C.low : C.medium,
                  }]}>{item.impactLevel}</Text>
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
  root: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, borderBottomWidth: 1 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  headerSub: { fontSize: FontSize.sm, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md, gap: Spacing.md },
  selectors: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  selector: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.lg, borderWidth: 2, borderStyle: 'dashed', padding: Spacing.md, minHeight: 64 },
  selectorEmoji: { fontSize: 24 },
  selectorInfo: { flex: 1 },
  selectorName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  selectorMeta: { fontSize: FontSize.xs },
  selectorPlaceholderIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  selectorPlaceholder: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  vsChip: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  vsText: { fontSize: FontSize.xs, fontWeight: FontWeight.heavy },
  prompt: { alignItems: 'center', padding: Spacing.xl, gap: Spacing.md, borderRadius: BorderRadius.xl, borderWidth: 1 },
  promptEmoji: { fontSize: 48 },
  promptTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, textAlign: 'center' },
  promptText: { fontSize: FontSize.sm, textAlign: 'center', lineHeight: 20 },
  presets: { gap: Spacing.sm },
  presetsTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: 4 },
  presetItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  presetEmoji: { fontSize: 18 },
  presetLabel: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  modal: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1 },
  modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  modalList: { padding: Spacing.md, gap: Spacing.sm },
  modalItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  modalItemEmoji: { fontSize: 24 },
  modalItemInfo: { flex: 1 },
  modalItemName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  modalItemMeta: { fontSize: FontSize.xs },
  impactBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: BorderRadius.full },
  impactText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, textTransform: 'capitalize' },
});
