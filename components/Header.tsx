// ─────────────────────────────────────────────
//  StockMate — Header Component
//  Title + Search Bar (Apple-style)
// ─────────────────────────────────────────────

import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  itemCount: number;
}

export default function Header({ searchQuery, onSearchChange, itemCount }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
      {/* ── Title row ── */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.appName}>StockMate</Text>
          <Text style={styles.subtitle}>{itemCount} barang terdaftar</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.7}>
          <Text style={styles.avatarText}>SM</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search bar ── */}
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.85}
        onPress={() => inputRef.current?.focus()}
      >
        <Ionicons name="search" size={16} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Cari barang..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && Platform.OS !== 'ios' && (
          <TouchableOpacity onPress={() => onSearchChange('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },

  // ── Title ──
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  appName: {
    ...Typography.largeTitle,
  },
  subtitle: {
    ...Typography.caption1,
    marginTop: 2,
  },

  // ── Avatar ──
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700' as const,
    fontSize: 13,
    letterSpacing: 0.5,
  },

  // ── Search ──
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm + 2,
    height: 40,
  },
  searchIcon: {
    marginRight: Spacing.xs + 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
});