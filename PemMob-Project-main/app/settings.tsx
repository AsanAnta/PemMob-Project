import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    setStatusMessage(
      isDark
        ? "Mode Gelap aktif — nyaman di mata pada malam hari."
        : "Mode Terang aktif — tampilan cerah standar."
    );
  }, [isDark]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.serviceBg },
              ]}
            >
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={24}
                color={colors.accent}
              />
            </View>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>
                Mode Gelap (Dark Mode)
              </Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                {isDark ? "Aktif" : "Nonaktif"}
              </Text>
            </View>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#D1D5DB", true: colors.accent }}
            thumbColor="#FFFFFF"
          />
        </View>

        <Text style={[styles.infoText, { color: colors.muted }]}>
          {statusMessage}
        </Text>
      </View>

      <Pressable
        style={[styles.themeButton, { backgroundColor: colors.accent }]}
        onPress={toggleTheme}
      >
        <Ionicons
          name="color-palette-outline"
          size={20}
          color="#FFFFFF"
        />
        <Text style={styles.themeButtonText}>
          Ganti ke {isDark ? "Light Mode" : "Dark Mode"}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.backButton,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
        onPress={handleBack}
      >
        <Ionicons name="arrow-back" size={20} color={colors.text} />
        <Text style={[styles.backButtonText, { color: colors.text }]}>
          Kembali ke Beranda
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 19,
  },
  themeButton: {
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  themeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  backButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
