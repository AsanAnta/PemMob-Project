import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.serviceBg,
          borderColor: "#EF4444",
        },
      ]}
    >
      <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
      <Text style={[styles.title, { color: colors.text }]}>Terjadi Kesalahan</Text>
      <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>

      {onRetry && (
        <Pressable
          style={[styles.retryButton, { backgroundColor: colors.accent }]}
          onPress={onRetry}
        >
          <Ionicons name="refresh" size={16} color="#FFFFFF" />
          <Text style={styles.retryText}>Coba Lagi</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
});
