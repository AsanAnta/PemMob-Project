import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Memuat data dari server..." }: LoadingProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={[styles.text, { color: colors.muted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
