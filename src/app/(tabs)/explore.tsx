import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, Spacing } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="compass-outline" size={100} color={Colors.textTertiary} />
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.description}>
        This screen will host exploration features in the future, just like in Taskly.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    ...Typography.largeTitle,
    marginTop: Spacing.lg,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
