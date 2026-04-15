// ─────────────────────────────────────────────
//  StockMate — InventoryItem Component
//  Premium card for each inventory entry
// ─────────────────────────────────────────────

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme';
import { formatCurrency, getStatusMeta, getCategoryMeta, InventoryItemType, InventoryStatus } from '../data/inventory';

interface InventoryItemProps {
  item: InventoryItemType;
  onPress: () => void;
}

export default function InventoryItem({ item, onPress }: InventoryItemProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const statusMeta = getStatusMeta(item.status);
  const catMeta = getCategoryMeta(item.category);

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* ── Icon area ── */}
        <View style={[styles.iconContainer, { backgroundColor: catMeta.bg }]}>
          <Ionicons name={item.icon} size={24} color={catMeta.color} />
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>
          {/* Top row: name + chevron */}
          <View style={styles.topRow}>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
          </View>

          {/* SKU */}
          <Text style={styles.sku}>{item.sku}</Text>

          {/* Bottom row: badges + price */}
          <View style={styles.bottomRow}>
            <View style={styles.badges}>
              {/* Category badge */}
              <View style={[styles.badge, { backgroundColor: catMeta.bg }]}>
                <Text style={[styles.badgeText, { color: catMeta.color }]}>
                  {catMeta.label}
                </Text>
              </View>

              {/* Status badge */}
              <View style={[styles.badge, { backgroundColor: statusMeta.bg }]}>
                <View style={[styles.dot, { backgroundColor: statusMeta.color }]} />
                <Text style={[styles.badgeText, { color: statusMeta.color }]}>
                  {statusMeta.label}
                </Text>
              </View>
            </View>

            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          </View>

          {/* Stock bar */}
          <View style={styles.stockRow}>
            <Text style={styles.stockLabel}>Stok: {item.stock} {item.unit}</Text>
            <StockBar stock={item.stock} minStock={item.minStock} status={item.status} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Mini stock bar ─────────────────────────────
interface StockBarProps {
  stock: number;
  minStock: number;
  status: InventoryStatus;
}

function StockBar({ stock, minStock, status }: StockBarProps) {
  const maxDisplay = Math.max(stock, minStock * 2, 1);
  const ratio = Math.min(stock / maxDisplay, 1);
  const statusMeta = getStatusMeta(status);

  return (
    <View style={stockBar.track}>
      <View
        style={[
          stockBar.fill,
          { width: `${ratio * 100}%`, backgroundColor: statusMeta.color },
        ]}
      />
    </View>
  );
}

const stockBar = StyleSheet.create({
  track: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginLeft: Spacing.sm,
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});

// ── Main styles ────────────────────────────────
const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm + 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    padding: Spacing.md,
    alignItems: 'flex-start',
    ...Shadow.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },

  // ── Icon ──
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    flexShrink: 0,
  },

  // ── Content ──
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemName: {
    ...Typography.title2,
    fontSize: 15,
    flex: 1,
    marginRight: Spacing.xs,
  },
  sku: {
    ...Typography.caption2,
    marginBottom: Spacing.sm,
  },

  // ── Bottom ──
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  price: {
    ...Typography.body,
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.accent,
  },

  // ── Stock row ──
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockLabel: {
    ...Typography.caption2,
    fontSize: 11,
    minWidth: 80,
  },
});