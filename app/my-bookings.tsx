import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

interface Booking {
  id: string;
  worker_id: string;
  worker_name: string;
  paket: string;
  address: string;
  notes: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

export default function MyBookingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // 1. READ: Ambil seluruh pesanan milik user aktif (Disaring oleh RLS)
  const fetchBookings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "PGRST205" || error.message.includes("does not exist")) {
          const msg = "Tabel 'bookings' belum dibuat di Supabase! Jalankan skrip 'schema_modul4.sql' di SQL Editor.";
          setDbError(msg);
          showAlert("Database Setup Required", msg);
        } else {
          throw error;
        }
      } else {
        setDbError(null);
        setBookings(data || []);
      }
    } catch (err: any) {
      showAlert("Gagal Sinkronisasi", err.message || "Gagal mengambil data pesanan.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  // 2. UPDATE: Batalkan pesanan (Optimistic UI)
  const handleCancelBooking = async (item: Booking) => {
    if (item.status === "cancelled") return;

    // Optimistic UI update
    setBookings((prev) =>
      prev.map((b) => (b.id === item.id ? { ...b, status: "cancelled" } : b))
    );

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", item.id);

      if (error) throw error;
      showAlert("Pesanan Dibatalkan", `Pesanan jasa "${item.worker_name}" telah dibatalkan.`);
    } catch (err: any) {
      showAlert("Gagal Membatalkan", err.message);
      fetchBookings(); // Rollback ke data server
    }
  };

  // 3. DELETE: Hapus pesanan dari riwayat
  const handleDeleteBooking = async (id: string) => {
    // Optimistic UI removal
    setBookings((prev) => prev.filter((b) => b.id !== id));

    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
    } catch (err: any) {
      showAlert("Gagal Menghapus", err.message);
      fetchBookings();
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return { label: "MENUNGGU", bg: "#FEF3C7", text: "#D97706", icon: "time-outline" as const };
      case "confirmed":
        return { label: "DIKONFIRMASI", bg: "#DBEAFE", text: "#2563EB", icon: "checkmark-circle-outline" as const };
      case "completed":
        return { label: "SELESAI", bg: "#D1FAE5", text: "#059669", icon: "ribbon-outline" as const };
      case "cancelled":
        return { label: "DIBATALKAN", bg: "#FEE2E2", text: "#DC2626", icon: "close-circle-outline" as const };
    }
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const badge = getStatusBadge(item.status);
    const dateFormatted = new Date(item.created_at).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.bookingCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {/* CARD HEADER */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.workerName, { color: colors.text }]}>{item.worker_name}</Text>
            <Text style={[styles.dateText, { color: colors.muted }]}>{dateFormatted}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Ionicons name={badge.icon} size={13} color={badge.text} style={{ marginRight: 4 }} />
            <Text style={[styles.statusBadgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>

        {/* DETAILS */}
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.muted }]}>Paket:</Text>
          <Text style={[styles.infoValue, { color: colors.accent }]}>{item.paket}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.muted }]}>Alamat:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>
            {item.address}
          </Text>
        </View>

        {item.notes ? (
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.muted }]}>Catatan:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>
              {item.notes}
            </Text>
          </View>
        ) : null}

        {/* ACTION BUTTONS */}
        <View style={styles.actionRow}>
          {item.status !== "cancelled" && item.status !== "completed" && (
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: "#EF4444" }]}
              onPress={() => handleCancelBooking(item)}
            >
              <Ionicons name="close" size={14} color="#EF4444" />
              <Text style={styles.cancelBtnText}>Batalkan</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.deleteBtn, { borderColor: colors.border }]}
            onPress={() => handleDeleteBooking(item.id)}
          >
            <Ionicons name="trash-outline" size={14} color={colors.muted} />
            <Text style={[styles.deleteBtnText, { color: colors.muted }]}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      {/* HEADER SECTION */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Pesanan Cloud Saya</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {user?.email} • {bookings.length} Pesanan Terdaftar
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.newBookingBtn, { backgroundColor: colors.accent }]}
          onPress={() => router.push("/")}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.newBookingText}>Pesan Baru</Text>
        </TouchableOpacity>
      </View>

      {/* DATABASE WARNING BANNER */}
      {dbError && (
        <View style={styles.dbErrorCard}>
          <Text style={styles.dbErrorTitle}>⚠️ DATABASE SETUP REQUIRED</Text>
          <Text style={styles.dbErrorSubtitle}>{dbError}</Text>
        </View>
      )}

      {/* CONTENT LIST */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.muted }]}>
            Menghubungkan ke PostgreSQL Supabase...
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.serviceBg }]}>
                <Ionicons name="receipt-outline" size={48} color={colors.accent} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Belum Ada Pesanan Cloud
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
                Pilih tukang di beranda dan buat pesanan pertama Anda. Data akan tersimpan aman dengan Row Level Security!
              </Text>
              <TouchableOpacity
                style={[styles.browseButton, { backgroundColor: colors.accent }]}
                onPress={() => router.push("/")}
              >
                <Text style={styles.browseButtonText}>Cari Tukang Sekarang</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  newBookingBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  newBookingText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  bookingCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 12,
    width: 65,
    fontWeight: "600",
  },
  infoValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(150, 150, 150, 0.15)",
    paddingTop: 10,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  cancelBtnText: {
    color: "#EF4444",
    fontSize: 11,
    fontWeight: "bold",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 13,
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  browseButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  dbErrorCard: {
    backgroundColor: "#271212",
    borderColor: "#7F1D1D",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    margin: 16,
    marginBottom: 0,
  },
  dbErrorTitle: {
    color: "#F87171",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dbErrorSubtitle: {
    color: "#FCA5A5",
    fontSize: 11,
    lineHeight: 15,
  },
});
