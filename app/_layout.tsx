import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootNavigator() {
  const { isDark, colors } = useTheme();
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // ROUTE GUARD (CODELAB 4)
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = (segments[0] as string) === "(auth)";

    if (!session && !inAuthGroup) {
      // Pengguna belum login dialihkan ke layar Login
      router.replace("/(auth)/login" as any);
    } else if (session && inAuthGroup) {
      // Pengguna yang sudah login diarahkan ke Katalog Utama
      router.replace("/");
    }
  }, [session, isLoading, segments]);

  // Loading Splash Screen saat inisialisasi sesi dari Hardware Vault
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(auth)/login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="index"
          options={{ title: "Tukang On-Demand" }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Profil & Pengaturan" }}
        />
        <Stack.Screen
          name="worker/[id]"
          options={{ title: "Detail Tukang" }}
        />
        <Stack.Screen
          name="booking"
          options={{
            title: "Pemesanan Jasa",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="my-bookings"
          options={{ title: "Pesanan Saya" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
