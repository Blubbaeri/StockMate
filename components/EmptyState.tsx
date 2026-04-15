// ─────────────────────────────────────────────
//  StockMate — EmptyState Component
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../constants/theme';

interface EmptyStateProps {
  query: string;
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="search-outline" size={40} color={Colors.textTertiary} />
      </View>
      <Text style={styles.title}>Tidak ditemukan</Text>
      <Text style={styles.desc}>
        Barang dengan nama "{query}" tidak ada{'\n'}dalam daftar inventaris.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.title1,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  desc: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
});