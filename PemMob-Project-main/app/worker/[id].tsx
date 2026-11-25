import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { useTheme } from "../../contexts/ThemeContext";
import {
  getWorkerDetailParallel,
  getWorkerDetailSequential,
} from "../../services/workerService";
import { WorkerDetailData } from "../../types/api";

export default function WorkerDetailScreen() {
  const router = useRouter();
  const { id, paket } = useLocalSearchParams<{ id: string; paket?: string }>();
  const { colors } = useTheme();

  const currentPaket = paket ?? "Harian";

  // State untuk Asynchronous Lifecycle
  const [detailData, setDetailData] = useState<WorkerDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State dari Modul 2
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoriteMessage, setFavoriteMessage] = useState<string>("");

  /**
   * Fungsi pemanggil data asynchronous
   * Mendemonstrasikan perbedaan performa antara Parallel (Promise.all) vs Sequential
   */
  const loadWorkerDetail = async (mode: "parallel" | "sequential" = "parallel") => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const targetId = id ?? "1";
      let result: WorkerDetailData;

      if (mode === "parallel") {
        // Menggunakan Promise.all() secara paralel (Cepat)
        result = await getWorkerDetailParallel(targetId);
      } else {
        // Menggunakan await satu per satu secara sequential (Berurutan)
        result = await getWorkerDetailSequential(targetId);
      }

      setDetailData(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengambil data dari server.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkerDetail("parallel");
  }, [id]);

  useEffect(() => {
    if (isFavorite && detailData) {
      setFavoriteMessage(`${detailData.worker.name} ditambahkan ke daftar favorit!`);
    } else {
      setFavoriteMessage("");
    }
  }, [isFavorite, detailData]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.container}
    >
      {/* 1. Kondisi Loading Asynchronous */}
      {isLoading && (
        <Loading message="Memuat profil tukang & mengambil testimoni dari External API..." />
      )}

      {/* 2. Kondisi Error Handling (jika Promise di-reject) */}
      {!isLoading && errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onRetry={() => loadWorkerDetail("parallel")}
        />
      )}

      {/* 3. Konten Utama setelah Data Asynchronous Berhasil Diambil */}
      {!isLoading && detailData && (
        <>
          {/* Banner Indikator Asynchronous Modul 3 */}
          <View
            style={[
              styles.benchmarkCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.benchmarkHeader}>
              <Ionicons
                name={
                  detailData.fetchMode.includes("Parallel")
                    ? "flash"
                    : "timer-outline"
                }
                size={18}
                color={colors.accent}
              />
              <Text style={[styles.benchmarkTitle, { color: colors.text }]}>
                Metode: {detailData.fetchMode}
              </Text>
            </View>

            <Text style={[styles.benchmarkDuration, { color: colors.accent }]}>
              ⏱️ Waktu Tunggu API: {detailData.loadingDurationMs} ms
            </Text>

            <View style={styles.benchmarkButtons}>
              <Pressable
                style={[
                  styles.benchmarkBtn,
                  {
                    backgroundColor: detailData.fetchMode.includes("Parallel")
                      ? colors.accent
                      : colors.search,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => loadWorkerDetail("parallel")}
              >
                <Text
                  style={[
                    styles.benchmarkBtnText,
                    {
                      color: detailData.fetchMode.includes("Parallel")
                        ? "#FFFFFF"
                        : colors.text,
                    },
                  ]}
                >
                  ⚡ Tes Paralel (Promise.all)
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.benchmarkBtn,
                  {
                    backgroundColor: detailData.fetchMode.includes("Sequential")
                      ? colors.accent
                      : colors.search,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => loadWorkerDetail("sequential")}
              >
                <Text
                  style={[
                    styles.benchmarkBtnText,
                    {
                      color: detailData.fetchMode.includes("Sequential")
                        ? "#FFFFFF"
                        : colors.text,
                    },
                  ]}
                >
                  🐢 Tes Sequential
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Profile Card */}
          <View
            style={[
              styles.profileCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>

            <Text style={[styles.name, { color: colors.text }]}>
              {detailData.worker.name}
            </Text>
            <Text style={[styles.job, { color: colors.muted }]}>
              {detailData.worker.job}
            </Text>

            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: colors.serviceBg }]}>
                <Ionicons name="star" size={15} color={colors.rating} />
                <Text style={[styles.badgeText, { color: colors.text }]}>
                  {detailData.worker.rating}
                </Text>
              </View>

              <View style={[styles.badge, { backgroundColor: colors.serviceBg }]}>
                <Ionicons
                  name="briefcase-outline"
                  size={15}
                  color={colors.accent}
                />
                <Text style={[styles.badgeText, { color: colors.text }]}>
                  {detailData.worker.experience}
                </Text>
              </View>

              <View style={[styles.badge, { backgroundColor: colors.serviceBg }]}>
                <Ionicons
                  name="location-outline"
                  size={15}
                  color={colors.accent}
                />
                <Text style={[styles.badgeText, { color: colors.text }]}>
                  {detailData.worker.location}
                </Text>
              </View>
            </View>

            {/* Favorite Toggle (useState + useEffect) */}
            <Pressable
              style={[
                styles.favoriteButton,
                {
                  backgroundColor: isFavorite ? colors.serviceBg : colors.search,
                  borderColor: isFavorite ? colors.accent : colors.border,
                },
              ]}
              onPress={() => setIsFavorite((prev) => !prev)}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={18}
                color={isFavorite ? "#EF4444" : colors.muted}
              />
              <Text style={[styles.favoriteText, { color: colors.text }]}>
                {isFavorite ? "Tukang Favorit" : "Tambah ke Favorit"}
              </Text>
            </Pressable>

            {favoriteMessage !== "" && (
              <Text style={[styles.favoriteNotice, { color: colors.accent }]}>
                {favoriteMessage}
              </Text>
            )}
          </View>

          {/* Statistik Tukang (Data Async Hasil Simulasi Delay) */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Statistik Kinerja (Async API)
            </Text>

            <View style={styles.statsGrid}>
              <View
                style={[
                  styles.statBox,
                  { backgroundColor: colors.serviceBg, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  {detailData.statistics.jobsCompleted}+
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Proyek Selesai
                </Text>
              </View>

              <View
                style={[
                  styles.statBox,
                  { backgroundColor: colors.serviceBg, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  {detailData.statistics.responseTimeMinutes} mnt
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Respon Cepat
                </Text>
              </View>

              <View
                style={[
                  styles.statBox,
                  { backgroundColor: colors.serviceBg, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  {detailData.statistics.satisfactionRate}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Kepuasan
                </Text>
              </View>
            </View>
          </View>

          {/* Testimoni Pelanggan (External API Call via fetch) */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.reviewHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Ulasan Pelanggan (External API)
              </Text>
              <View
                style={[
                  styles.apiBadge,
                  { backgroundColor: colors.serviceBg, borderColor: colors.accent },
                ]}
              >
                <Text style={[styles.apiBadgeText, { color: colors.accent }]}>
                  Live API
                </Text>
              </View>
            </View>

            <Text style={[styles.description, { color: colors.muted, marginBottom: 12 }]}>
              Data berikut diambil langsung secara asynchronous dari External API:
            </Text>

            {detailData.reviews.map((rev) => (
              <View
                key={rev.id}
                style={[
                  styles.reviewItem,
                  { backgroundColor: colors.search, borderColor: colors.border },
                ]}
              >
                <View style={styles.reviewUserRow}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={16}
                    color={colors.accent}
                  />
                  <Text style={[styles.reviewAuthor, { color: colors.text }]}>
                    {rev.user.fullName} (@{rev.user.username})
                  </Text>
                </View>
                <Text style={[styles.reviewBody, { color: colors.muted }]}>
                  "{rev.body}"
                </Text>
              </View>
            ))}
          </View>

          {/* Tentang Tukang */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Tentang Tukang
            </Text>
            <Text style={[styles.description, { color: colors.muted }]}>
              {detailData.worker.description}
            </Text>
            <Text style={[styles.priceLabel, { color: colors.text }]}>
              Tarif Mulai:{" "}
              <Text style={{ color: colors.accent, fontWeight: "bold" }}>
                {detailData.worker.price} / kunjungan
              </Text>
            </Text>
          </View>

          {/* Pilih Paket Layanan (setParams) */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Pilih Paket Layanan (setParams)
            </Text>
            <Text style={[styles.paketActive, { color: colors.muted }]}>
              Paket terpilih saat ini:{" "}
              <Text style={{ color: colors.accent, fontWeight: "bold" }}>
                {currentPaket}
              </Text>
            </Text>

            <View style={styles.paketRow}>
              {["Harian", "Borongan", "Darurat"].map((item) => {
                const active = currentPaket === item;
                return (
                  <Pressable
                    key={item}
                    style={[
                      styles.paketButton,
                      {
                        backgroundColor: active ? colors.accent : colors.search,
                        borderColor: active ? colors.accent : colors.border,
                      },
                    ]}
                    onPress={() => router.setParams({ paket: item })}
                  >
                    <Text
                      style={{
                        color: active ? "#FFFFFF" : colors.text,
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Tombol Aksi */}
          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={() =>
              router.push({
                pathname: "/booking",
                params: {
                  workerId: detailData.worker.id,
                  workerName: detailData.worker.name,
                  paket: currentPaket,
                },
              })
            }
          >
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Pesan Tukang Sekarang</Text>
          </Pressable>
        </>
      )}

      {/* Tombol Kembali */}
      <Pressable
        style={[
          styles.secondaryButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={handleBack}
      >
        <Ionicons name="arrow-back" size={20} color={colors.text} />
        <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
          Kembali
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
  benchmarkCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  benchmarkHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  benchmarkTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  benchmarkDuration: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
  },
  benchmarkButtons: {
    flexDirection: "row",
    gap: 8,
  },
  benchmarkBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  benchmarkBtnText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  profileCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  job: {
    fontSize: 14,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  favoriteText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  favoriteNotice: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  statBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  apiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  apiBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  reviewItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  reviewUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  reviewAuthor: {
    fontSize: 12,
    fontWeight: "bold",
  },
  reviewBody: {
    fontSize: 12,
    fontStyle: "italic",
    lineHeight: 18,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
  },
  paketActive: {
    fontSize: 13,
    marginBottom: 12,
  },
  paketRow: {
    flexDirection: "row",
    gap: 10,
  },
  paketButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
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
    fontSize: 16,
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
