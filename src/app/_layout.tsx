import { Stack, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { View, Alert, AppState, AppStateStatus } from 'react-native';
import { supabase } from '../../lib/supabase';
import { SESSION_TIMEOUT } from '../../lib/auth';
import 'react-native-reanimated';

export default function RootLayout() {
  const lastActivityRef = useRef<number>(Date.now());
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Reset timer on any touch interaction
  const handleResetInactivity = () => {
    lastActivityRef.current = Date.now();
  };

  const performAutoLogout = async (reason: 'inactivity' | 'timeout') => {
    await supabase.auth.signOut();
    const message = reason === 'inactivity'
      ? "Your session has expired due to inactivity for 1 hour."
      : "Your login session has expired for security reasons.";

    Alert.alert(
      "Session Expired",
      message,
      [{ text: "Login Again", onPress: () => router.replace('/(auth)/login') }]
    );
  };

  const checkInactivity = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const now = Date.now();
      const inactiveTime = now - lastActivityRef.current;

      if (inactiveTime >= SESSION_TIMEOUT) {
        await performAutoLogout('inactivity');
      }
    } catch (e) {
      // silent fail
    }
  };

  useEffect(() => {
    // Global auth listener for SIGNED_OUT events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/(auth)/login');
      }
    });

    // Background / Foreground check
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        checkInactivity();
      }
      appStateRef.current = nextAppState;
    });

    // Periodic check every 30 seconds while app is active
    const inactivityInterval = setInterval(() => {
      if (appStateRef.current === 'active') {
        checkInactivity();
      }
    }, 30000);

    return () => {
      subscription.unsubscribe();
      appStateSubscription.remove();
      clearInterval(inactivityInterval);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View
          style={{ flex: 1 }}
          onStartShouldSetResponderCapture={() => {
            handleResetInactivity();
            return false;
          }}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="dark" />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
