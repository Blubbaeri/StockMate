// ─────────────────────────────────────────────
//  StockMate — SummaryCards Component
//  Quick stats row at top of inventory screen
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { InventoryItemType } from '../data/inventory';

interface SummaryCardsProps {
  inventory: InventoryItemType[];
}

export default function SummaryCards({ inventory }: SummaryCardsProps) {
  const total     = inventory.length;
  const inStock   = inventory.filter(i => i.status === 'in_stock').length;
  const lowStock  = inventory.filter(i => i.status === 'low_stock').length;
  const outStock  = inventory.filter(i => i.status === 'out_of_stock').length;

  const cards: Array<{
    label: string,
    value: number,
    icon: React.ComponentProps<typeof Ionicons>['name'],
    color: string,
    bg: string
  }> = [
    { label: 'Total Barang', value: total,    icon: 'cube-outline',    color: Colors.accent,      bg: Colors.accentLight },
    { label: 'Tersedia',     value: inStock,  icon: 'checkmark-circle-outline', color: Colors.inStock,  bg: Colors.inStockBg },
    { label: 'Hampir Habis', value: lowStock, icon: 'alert-circle-outline',     color: Colors.lowStock, bg: Colors.lowStockBg },
    { label: 'Habis',        value: outStock, icon: 'close-circle-outline',     color: Colors.outOfStock, bg: Colors.outOfStockBg },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {cards.map((card) => (
        <View key={card.label} style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: card.bg }]}>
            <Ionicons name={card.icon} size={18} color={card.color} />
          </View>
          <Text style={[styles.value, { color: card.color }]}>{card.value}</Text>
          <Text style={styles.label}>{card.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    flexDirection: 'row',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'flex-start',
    minWidth: 110,
    ...Shadow.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    letterSpacing: 0.1,
  },
});