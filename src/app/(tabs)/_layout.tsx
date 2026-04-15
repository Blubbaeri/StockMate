import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors, Radius } from '../../../constants/theme';

interface TabIconProps {
  focused: boolean;
  color: string;
  iconFocused: React.ComponentProps<typeof Ionicons>['name'];
  iconUnfocused: React.ComponentProps<typeof Ionicons>['name'];
}

function TabIcon({ focused, color, iconFocused, iconUnfocused }: TabIconProps) {
  return (
    <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
      {focused && <View style={styles.tabActiveGlow} />}
      <Ionicons
        name={focused ? iconFocused : iconUnfocused}
        size={22}
        color={color}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="light"
            style={styles.tabBarBlur}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          height: 70,
          marginHorizontal: 18,
          marginBottom: Platform.OS === 'ios' ? 20 : 14,
          borderRadius: 26,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              iconFocused="grid"
              iconUnfocused="grid-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              iconFocused="cube"
              iconUnfocused="cube-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              iconFocused="compass"
              iconUnfocused="compass-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBlur: {
    flex: 1,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  tabIconWrap: {
    width: 42,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  tabIconWrapActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  tabActiveGlow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    top: -6,
    left: -3,
  },
});
