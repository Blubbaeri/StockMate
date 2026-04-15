// ─────────────────────────────────────────────
//  StockMate — Inventory Screen
//  Main list screen with search + filter
// ─────────────────────────────────────────────

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Header        from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import SummaryCards  from '../components/SummaryCards';
import InventoryItem from '../components/InventoryItem';
import BottomTab     from '../components/BottomTab';
import EmptyState    from '../components/EmptyState';

import { INVENTORY } from '../data/inventory';
import { Colors, Spacing } from '../constants/theme';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function InventoryScreen() {
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab]         = useState('inventory');
  const [refreshing, setRefreshing]       = useState(false);

  // ── Filter logic ──────────────────────────
  const filtered = useMemo(() => {
    return INVENTORY.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, activeCategory]);

  // ── Pull to refresh (simulated) ───────────
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  // ── Animated item entry ───────────────────
  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
        <InventoryItem
          item={item}
          onPress={() => {
            // TODO: navigate to detail screen
          }}
        />
      </Animated.View>
    );
  }, []);

  // ── List header (summary + category) ─────
  const ListHeader = useMemo(() => (
    <View>
      <SummaryCards inventory={INVENTORY} />
      <CategoryFilter selected={activeCategory} onSelect={setActiveCategory} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {activeCategory === 'all' ? 'Semua Barang' : 'Hasil Filter'}
        </Text>
        <Text style={styles.sectionCount}>{filtered.length} item</Text>
      </View>
    </View>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [activeCategory, filtered.length]);

  return (
    <SafeAreaProvider style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1, paddingBottom: 0 }} edges={['top', 'left', 'right']}>
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          itemCount={INVENTORY.length}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={<EmptyState query={searchQuery} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.accent}
            />
          }
        />

        <BottomTab activeTab={activeTab} onTabChange={setActiveTab} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 100, // accommodate bottom tab
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionCount: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
});
