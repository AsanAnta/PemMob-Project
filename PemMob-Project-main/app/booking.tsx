import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function BookingModalScreen() {
  const router = useRouter();
  const { workerName, paket } = useLocalSearchParams<{
    workerId?: string;
    workerName?: string;
    paket?: string;
  }>();
  const { colors } = useTheme();

  const [address, setAddress] = useState<string>("Jl. Sudirman No. 10, Jakarta Selatan");
  const [notes, setNotes] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleConfirm = () => {
    setSubmitted(true);
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
          placeholder="Contoh: Lampu ruang tamu mati..."
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
            <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
            <Text style={[styles.successText, { color: colors.text }]}>
              Pesanan berhasil dibuat! Gunakan tombol di bawah untuk kembali ke
              Beranda.
            </Text>
          </View>
        )}
      </View>

      {!submitted ? (
        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.accent }]}
          onPress={handleConfirm}
        >
          <Ionicons name="checkmark-done-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Kirim Pesanan</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.accent }]}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="home-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>
            Selesai & Kembali ke Beranda (replace)
          </Text>
        </Pressable>
      )}

      <Pressable
        style={[
          styles.secondaryButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() => router.dismiss()}
      >
        <Ionicons name="close-outline" size={20} color={colors.text} />
        <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
          Tutup Modal (dismiss)
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
    gap: 8,
  },
  successText: {
    flex: 1,
    fontSize: 13,
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
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
