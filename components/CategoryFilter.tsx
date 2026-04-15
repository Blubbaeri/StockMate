// ─────────────────────────────────────────────
//  StockMate — CategoryFilter Component
//  Horizontal scrollable category chips
// ─────────────────────────────────────────────

import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';
import { CATEGORIES } from '../data/inventory';

interface CategoryFilterProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(cat.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  label: {
    ...Typography.caption1,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  labelActive: {
    color: '#FFFFFF',
  },
});