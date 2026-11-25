import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();
  const { user, signOut } = useAuth();
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    setStatusMessage(
      isDark
        ? "Mode Gelap aktif — nyaman di mata pada malam hari."
        : "Mode Terang aktif — tampilan cerah standar."
    );
  }, [isDark]);

  const handleSignOut = async () => {
    const doLogout = async () => {
      setIsLoggingOut(true);
      try {
        await signOut();
        // Navigasi otomatis dikawal oleh Route Guard di _layout.tsx
      } catch (err: any) {
        if (Platform.OS === "web") {
          window.alert(`Gagal Keluar: ${err.message}`);
        } else {
          Alert.alert("Gagal Keluar", err.message);
        }
      } finally {
        setIsLoggingOut(false);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Apakah Anda yakin ingin keluar dari akun ini?")) {
        await doLogout();
      }
    } else {
      Alert.alert(
        "Konfirmasi Keluar",
        "Apakah Anda yakin ingin keluar dari akun ini?",
        [
          { text: "Batal", style: "cancel" },
          { text: "Keluar", style: "destructive", onPress: doLogout },
        ]
      );
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      {/* 1. INFORMASI AKUN PENGGUNA TEROTENTIKASI (MODUL 4) */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.profileHeader}>
          <View style={[styles.avatarBox, { backgroundColor: colors.serviceBg }]}>
            <Ionicons name="person" size={28} color={colors.accent} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.user_metadata?.full_name || "Pelanggan Terdaftar"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.muted }]}>
              {user?.email}
            </Text>
            <View style={styles.verifiedRow}>
              <View style={styles.greenDot} />
              <Text style={styles.verifiedText}>Terotentikasi Supabase</Text>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.muted }]}>Nomor HP:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {user?.user_metadata?.phone || "-"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.muted }]}>User ID:</Text>
          <Text
            style={[
              styles.detailValue,
              {
                color: colors.muted,
                fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                fontSize: 11,
              },
            ]}
            numberOfLines={1}
          >
            {user?.id}
          </Text>
        </View>
      </View>

      {/* 2. PENGATURAN TEMA (MODUL 2) */}
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
                size={22}
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

      {/* 3. MENU NAVIGASI CEPAT */}
      <Pressable
        style={[
          styles.menuButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() => router.push("/my-bookings" as any)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="receipt-outline" size={20} color={colors.accent} />
          <Text style={[styles.menuButtonText, { color: colors.text }]}>
            Lihat Pesanan Saya di Cloud
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </Pressable>

      {/* 4. TOMBOL SIGN OUT (MODUL 4 ROUTE GUARD) */}
      <Pressable
        style={[
          styles.signOutBtn,
          isLoggingOut && { opacity: 0.6 },
        ]}
        onPress={handleSignOut}
        disabled={isLoggingOut}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.signOutBtnText}>
          {isLoggingOut ? "Mengeluarkan Sesi..." : "Keluar dari Akun (Sign Out)"}
        </Text>
      </Pressable>

      {/* 5. KEMBALI KE BERANDA */}
      <Pressable
        style={[
          styles.backButton,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
        onPress={() => router.replace("/")}
      >
        <Ionicons name="arrow-back" size={20} color={colors.text} />
        <Text style={[styles.backButtonText, { color: colors.text }]}>
          Kembali ke Beranda
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#10B981",
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
  menuButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  signOutBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  signOutBtnText: {
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
