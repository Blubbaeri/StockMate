// ─────────────────────────────────────────────
//  StockMate — Dashboard Screen
//  Home screen with overview stats & recent items
// ─────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { supabase } from '../lib/supabase';
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ──────────────────────────────────────────────────

interface DashboardStats {
  totalItems: number;
  totalCategories: number;
  totalLocations: number;
  conditionGood: number;
  conditionBroken: number;
  conditionNeedsFix: number;
  totalValue: number;
}

interface RecentItem {
  id: string;
  name: string;
  quantity: number;
  condition: string;
  purchase_price: number | null;
  created_at: string;
  category: { name: string; icon: string; color: string } | null;
  location: { name: string } | null;
}

interface CategorySummary {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

// ─── Main Screen ──────────────────────────────────────────────

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalCategories: 0,
    totalLocations: 0,
    conditionGood: 0,
    conditionBroken: 0,
    conditionNeedsFix: 0,
    totalValue: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);

  // ── Fetch dashboard data ──────────────────────
  const fetchDashboardData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user display name
      const email = user.email || '';
      setUserName(email.split('@')[0]);

      // Fetch all items
      const { data: items, error: itemsErr } = await supabase
        .from('sm_items')
        .select('id, name, quantity, condition, purchase_price, created_at, category_id, location_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (itemsErr) throw itemsErr;

      // Fetch categories
      const { data: cats, error: catsErr } = await supabase
        .from('sm_categories')
        .select('id, name, icon, color')
        .eq('user_id', user.id);

      if (catsErr) throw catsErr;

      // Fetch locations
      const { data: locs, error: locsErr } = await supabase
        .from('sm_locations')
        .select('id, name')
        .eq('user_id', user.id);

      if (locsErr) throw locsErr;

      const allItems = items || [];
      const allCats = cats || [];
      const allLocs = locs || [];

      // Calculate stats
      const totalValue = allItems.reduce((sum, item) => {
        return sum + ((item.purchase_price || 0) * (item.quantity || 1));
      }, 0);

      setStats({
        totalItems: allItems.length,
        totalCategories: allCats.length,
        totalLocations: allLocs.length,
        conditionGood: allItems.filter(i => i.condition === 'Baik').length,
        conditionBroken: allItems.filter(i => i.condition === 'Rusak').length,
        conditionNeedsFix: allItems.filter(i => i.condition === 'Perlu Perbaikan').length,
        totalValue,
      });

      // Build category summary with item count
      const catSummary: CategorySummary[] = allCats.map(cat => ({
        ...cat,
        count: allItems.filter(item => item.category_id === cat.id).length,
      }));
      setCategories(catSummary);

      // Build recent items (top 5) with joined data
      const catMap = new Map(allCats.map(c => [c.id, c]));
      const locMap = new Map(allLocs.map(l => [l.id, l]));

      const recent: RecentItem[] = allItems.slice(0, 5).map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        condition: item.condition,
        purchase_price: item.purchase_price,
        created_at: item.created_at,
        category: item.category_id ? catMap.get(item.category_id) || null : null,
        location: item.location_id ? locMap.get(item.location_id) || null : null,
      }));
      setRecentItems(recent);

    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ── Helpers ──────────────────────────────────
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 17) return 'Selamat Siang';
    if (hour < 20) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(1)}rb`;
    return `Rp ${value}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Baik': return Colors.inStock;
      case 'Rusak': return Colors.outOfStock;
      case 'Perlu Perbaikan': return Colors.lowStock;
      default: return Colors.textTertiary;
    }
  };

  const getConditionBg = (condition: string) => {
    switch (condition) {
      case 'Baik': return Colors.inStockBg;
      case 'Rusak': return Colors.outOfStockBg;
      case 'Perlu Perbaikan': return Colors.lowStockBg;
      default: return Colors.background;
    }
  };

  // ── Loading state ──────────────────────────────
  if (loading) {
    return (
      <View style={[styles.root, styles.loadingContainer]}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Memuat dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
      >
        {/* ── Hero Header ────────────────────────── */}
        <LinearGradient
          colors={['#007AFF', '#0055D4', '#003EA1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroGradient, { paddingTop: insets.top + 16 }]}
        >
          {/* Decorative circles */}
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <View style={styles.heroCircle3} />

          <Animated.View entering={FadeInDown.duration(500)} style={styles.heroContent}>
            {/* Top row: greeting + avatar */}
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.heroGreeting}>{getGreeting()} 👋</Text>
                <Text style={styles.heroName}>{userName || 'User'}</Text>
              </View>
              <View style={styles.heroAvatar}>
                <Text style={styles.heroAvatarText}>
                  {(userName || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Total value card */}
            <View style={styles.heroValueCard}>
              <View style={styles.heroValueRow}>
                <View>
                  <Text style={styles.heroValueLabel}>Total Nilai Aset</Text>
                  <Text style={styles.heroValueAmount}>
                    {formatCurrency(stats.totalValue)}
                  </Text>
                </View>
                <View style={styles.heroValueIcon}>
                  <Ionicons name="wallet-outline" size={24} color="rgba(255,255,255,0.9)" />
                </View>
              </View>
              <View style={styles.heroValueDivider} />
              <View style={styles.heroValueMeta}>
                <View style={styles.heroValueMetaItem}>
                  <Text style={styles.heroValueMetaNumber}>{stats.totalItems}</Text>
                  <Text style={styles.heroValueMetaLabel}>Barang</Text>
                </View>
                <View style={styles.heroMetaDot} />
                <View style={styles.heroValueMetaItem}>
                  <Text style={styles.heroValueMetaNumber}>{stats.totalCategories}</Text>
                  <Text style={styles.heroValueMetaLabel}>Kategori</Text>
                </View>
                <View style={styles.heroMetaDot} />
                <View style={styles.heroValueMetaItem}>
                  <Text style={styles.heroValueMetaNumber}>{stats.totalLocations}</Text>
                  <Text style={styles.heroValueMetaLabel}>Lokasi</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* ── Condition Summary Cards ────────────── */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Kondisi Barang</Text>
          <View style={styles.conditionRow}>
            <ConditionCard
              icon="checkmark-circle"
              label="Baik"
              count={stats.conditionGood}
              color={Colors.inStock}
              bg={Colors.inStockBg}
            />
            <ConditionCard
              icon="alert-circle"
              label="Perlu Perbaikan"
              count={stats.conditionNeedsFix}
              color={Colors.lowStock}
              bg={Colors.lowStockBg}
            />
            <ConditionCard
              icon="close-circle"
              label="Rusak"
              count={stats.conditionBroken}
              color={Colors.outOfStock}
              bg={Colors.outOfStockBg}
            />
          </View>
        </Animated.View>

        {/* ── Categories Overview ────────────────── */}
        {categories.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kategori</Text>
              <Text style={styles.sectionCount}>{categories.length} kategori</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((cat, index) => (
                <Animated.View key={cat.id} entering={FadeInRight.delay(index * 80).duration(400)}>
                  <View style={styles.categoryCard}>
                    <View style={[styles.categoryIcon, { backgroundColor: cat.color + '18' }]}>
                      <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                    </View>
                    <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                    <Text style={styles.categoryCount}>{cat.count} item</Text>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── Recent Items ──────────────────────── */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Barang Terbaru</Text>
            {recentItems.length > 0 && (
              <Text style={styles.sectionCount}>{stats.totalItems} total</Text>
            )}
          </View>

          {recentItems.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="cube-outline" size={48} color={Colors.textTertiary} />
              </View>
              <Text style={styles.emptyTitle}>Belum ada barang</Text>
              <Text style={styles.emptySubtitle}>
                Mulai catat barang-barang milikmu{'\n'}dengan menambahkan item baru.
              </Text>
            </View>
          ) : (
            <View style={styles.recentList}>
              {recentItems.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.delay(350 + index * 60).duration(400)}
                >
                  <TouchableOpacity style={styles.recentCard} activeOpacity={0.7}>
                    <View style={styles.recentCardLeft}>
                      {/* Category icon */}
                      <View style={[
                        styles.recentItemIcon,
                        { backgroundColor: (item.category?.color || Colors.accent) + '18' }
                      ]}>
                        <Text style={{ fontSize: 20 }}>
                          {item.category?.icon || '📦'}
                        </Text>
                      </View>
                      {/* Item info */}
                      <View style={styles.recentItemInfo}>
                        <Text style={styles.recentItemName} numberOfLines={1}>{item.name}</Text>
                        <View style={styles.recentItemMeta}>
                          {item.category && (
                            <Text style={styles.recentItemCategory}>{item.category.name}</Text>
                          )}
                          {item.location && (
                            <>
                              <Text style={styles.recentMetaDot}>·</Text>
                              <Text style={styles.recentItemLocation}>
                                <Ionicons name="location-outline" size={10} color={Colors.textTertiary} />
                                {' '}{item.location.name}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>
                    </View>

                    <View style={styles.recentCardRight}>
                      {/* Condition badge */}
                      <View style={[
                        styles.conditionBadge,
                        { backgroundColor: getConditionBg(item.condition) }
                      ]}>
                        <View style={[
                          styles.conditionDot,
                          { backgroundColor: getConditionColor(item.condition) }
                        ]} />
                        <Text style={[
                          styles.conditionBadgeText,
                          { color: getConditionColor(item.condition) }
                        ]}>
                          {item.condition}
                        </Text>
                      </View>
                      {/* Date */}
                      <Text style={styles.recentItemDate}>{formatDate(item.created_at)}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ─── Condition Card Component ──────────────────────────────────

function ConditionCard({ icon, label, count, color, bg }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  count: number;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.conditionCard, { borderColor: color + '20' }]}>
      <View style={[styles.conditionCardIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.conditionCardValue, { color }]}>{count}</Text>
      <Text style={styles.conditionCardLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.caption1,
    marginTop: Spacing.md,
  },

  // ── Hero ──
  heroGradient: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -40,
  },
  heroCircle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -30,
    left: -30,
  },
  heroCircle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 80,
    left: 60,
  },
  heroContent: {
    zIndex: 1,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroGreeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  heroAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  // Hero value card
  heroValueCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroValueLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroValueAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: 4,
  },
  heroValueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroValueDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 16,
  },
  heroValueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  heroValueMetaItem: {
    alignItems: 'center',
  },
  heroValueMetaNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  heroValueMetaLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  heroMetaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // ── Section ──
  section: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionCount: {
    ...Typography.caption1,
    color: Colors.textTertiary,
  },

  // ── Condition Cards ──
  conditionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  conditionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadow.card,
  },
  conditionCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  conditionCardValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  conditionCardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  // ── Category Scroll ──
  categoryScroll: {
    gap: 10,
    paddingRight: 16,
  },
  categoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    alignItems: 'center',
    width: 100,
    ...Shadow.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textTertiary,
  },

  // ── Recent Items ──
  recentList: {
    gap: 8,
  },
  recentCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadow.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  recentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  recentItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentItemInfo: {
    flex: 1,
  },
  recentItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  recentItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItemCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  recentMetaDot: {
    color: Colors.textTertiary,
    fontSize: 12,
    marginHorizontal: 5,
  },
  recentItemLocation: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '400',
  },
  recentCardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  conditionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  conditionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  recentItemDate: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: '400',
  },

  // ── Empty State ──
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
