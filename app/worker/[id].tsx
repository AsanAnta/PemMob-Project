import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { workers } from "../../constants/workers";
import { useTheme } from "../../contexts/ThemeContext";

export default function WorkerDetailScreen() {
  const router = useRouter();
  const { id, paket } = useLocalSearchParams<{ id: string; paket?: string }>();
  const { colors } = useTheme();

  const worker = workers.find((item) => item.id === id) ?? workers[0];
  const currentPaket = paket ?? "Harian";

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoriteMessage, setFavoriteMessage] = useState<string>("");

  useEffect(() => {
    if (isFavorite) {
      setFavoriteMessage(`${worker.name} ditambahkan ke daftar favorit!`);
    } else {
      setFavoriteMessage("");
    }
  }, [isFavorite, worker.name]);

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

        <Text style={[styles.name, { color: colors.text }]}>{worker.name}</Text>
        <Text style={[styles.job, { color: colors.muted }]}>{worker.job}</Text>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: colors.serviceBg }]}>
            <Ionicons name="star" size={15} color={colors.rating} />
            <Text style={[styles.badgeText, { color: colors.text }]}>
              {worker.rating}
            </Text>
          </View>

          <View style={[styles.badge, { backgroundColor: colors.serviceBg }]}>
            <Ionicons name="briefcase-outline" size={15} color={colors.accent} />
            <Text style={[styles.badgeText, { color: colors.text }]}>
              {worker.experience}
            </Text>
          </View>

          <View style={[styles.badge, { backgroundColor: colors.serviceBg }]}>
            <Ionicons name="location-outline" size={15} color={colors.accent} />
            <Text style={[styles.badgeText, { color: colors.text }]}>
              {worker.location}
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

      {/* Description */}
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
          {worker.description}
        </Text>
        <Text style={[styles.priceLabel, { color: colors.text }]}>
          Tarif Mulai:{" "}
          <Text style={{ color: colors.accent, fontWeight: "bold" }}>
            {worker.price} / kunjungan
          </Text>
        </Text>
      </View>

      {/* Paket Selection using router.setParams() */}
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

      {/* Action Buttons: push() to modal & back() */}
      <Pressable
        style={[styles.primaryButton, { backgroundColor: colors.accent }]}
        onPress={() =>
          router.push({
            pathname: "/booking",
            params: {
              workerId: worker.id,
              workerName: worker.name,
              paket: currentPaket,
            },
          })
        }
      >
        <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Pesan Tukang Sekarang</Text>
      </Pressable>

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
