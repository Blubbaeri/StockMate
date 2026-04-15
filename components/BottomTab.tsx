// ─────────────────────────────────────────────
//  StockMate — BottomTab Component
//  Native-style bottom navigation bar
// ─────────────────────────────────────────────

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants/theme';

type IonIconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  id: string;
  label: string;
  icon: IonIconName;
  iconOutline: IonIconName;
}

const TABS: TabConfig[] = [
  { id: 'inventory', label: 'Inventaris', icon: 'cube',          iconOutline: 'cube-outline' },
  { id: 'scan',      label: 'Scan',       icon: 'scan',          iconOutline: 'scan-outline' },
  { id: 'report',    label: 'Laporan',    icon: 'bar-chart',     iconOutline: 'bar-chart-outline' },
  { id: 'settings',  label: 'Pengaturan', icon: 'settings',      iconOutline: 'settings-outline' },
];

interface BottomTabProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function BottomTab({ activeTab = 'inventory', onTabChange }: BottomTabProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || Spacing.sm }]}>
      {TABS.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onPress={() => onTabChange?.(tab.id)}
        />
      ))}
    </View>
  );
}

interface TabItemProps {
  tab: TabConfig;
  isActive: boolean;
  onPress: () => void;
}

function TabItem({ tab, isActive, onPress }: TabItemProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, speed: 50, bounciness: 6 }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 50, bounciness: 6 }),
    ]).start();
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
        {isActive && <View style={styles.activePill} />}
        <Ionicons
          name={isActive ? tab.icon : tab.iconOutline}
          size={24}
          color={isActive ? Colors.tabActive : Colors.tabInactive}
        />
        <Text style={[styles.label, isActive && styles.labelActive]}>
          {tab.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs + 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: -6,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  label: {
    fontSize: 10,
    fontWeight: '500' as const,
    color: Colors.tabInactive,
    marginTop: 3,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: Colors.tabActive,
    fontWeight: '600' as const,
  },
});