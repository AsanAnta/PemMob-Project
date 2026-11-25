import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

export default function BookingModalScreen() {
  const router = useRouter();
  const { workerId, workerName, paket } = useLocalSearchParams<{
    workerId?: string;
    workerName?: string;
    paket?: string;
  }>();
  const { colors } = useTheme();
  const { user } = useAuth();

  const [address, setAddress] = useState<string>("Jl. Sudirman No. 10, Jakarta Selatan");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleConfirm = async () => {
    if (!address.trim()) {
      showAlert("Alamat Kosong", "Mohon masukkan alamat lengkap pengerjaan.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Simpan pesanan ke cloud database PostgreSQL (Supabase) dengan perlindungan RLS
      const { error } = await supabase.from("bookings").insert([
        {
          user_id: user?.id,
          worker_id: workerId || "1",
          worker_name: workerName || "Budi Santoso",
          paket: paket || "Harian",
          address: address.trim(),
          notes: notes.trim() || null,
          status: "pending",
        },
      ]);

      if (error) {
        if (error.code === "PGRST205" || error.message.includes("does not exist")) {
          showAlert(
            "Tabel Belum Dibuat",
            "Tabel 'bookings' belum dibuat di Supabase! Jalankan file 'schema_modul4.sql' di SQL Editor Supabase."
          );
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      showAlert("Gagal Membuat Pesanan", err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.container}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Konfirmasi Pemesanan
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Tukang:{" "}
          <Text style={{ color: colors.text, fontWeight: "bold" }}>
            {workerName ?? "Budi Santoso"}
          </Text>
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Paket Layanan:{" "}
          <Text style={{ color: colors.accent, fontWeight: "bold" }}>
            {paket ?? "Harian"}
          </Text>
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Pemesan:{" "}
          <Text style={{ color: colors.text, fontWeight: "600" }}>
            {user?.user_metadata?.full_name || user?.email}
          </Text>
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>
          Alamat Pengerjaan
        </Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Masukkan alamat lengkap..."
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            {
              backgroundColor: colors.search,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Catatan Keluhan / Pekerjaan
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Contoh: Lampu ruang tamu mati total..."
          placeholderTextColor={colors.muted}
          multiline
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: colors.search,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />

        {submitted && (
          <View
            style={[
              styles.successBanner,
              { backgroundColor: colors.serviceBg, borderColor: colors.accent },
            ]}
          >
            <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.successTitle, { color: colors.text }]}>
                Pesanan Berhasil Disimpan ke Cloud! 🎉
              </Text>
              <Text style={[styles.successText, { color: colors.muted }]}>
                Data tersimpan di Supabase dan dilindungi Row Level Security (RLS).
              </Text>
            </View>
          </View>
        )}
      </View>

      {!submitted ? (
        <Pressable
          style={[
            styles.primaryButton,
            { backgroundColor: colors.accent },
            isSubmitting && { opacity: 0.7 },
          ]}
          onPress={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Simpan Pesanan ke Cloud</Text>
            </>
          )}
        </Pressable>
      ) : (
        <>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={() => router.replace("/my-bookings" as any)}
          >
            <Ionicons name="receipt-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Lihat Daftar Pesanan Saya</Text>
          </Pressable>

          <Pressable
            style={[
              styles.secondaryButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="home-outline" size={20} color={colors.text} />
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Kembali ke Beranda
            </Text>
          </Pressable>
        </>
      )}

      <Pressable
        style={[
          styles.secondaryButton,
          { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 8 },
        ]}
        onPress={() => router.dismiss()}
      >
        <Ionicons name="close-outline" size={20} color={colors.text} />
        <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
          Tutup Modal
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  successBanner: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  successText: {
    fontSize: 12,
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  secondaryButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
