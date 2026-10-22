import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { services, workers } from "../constants/workers";
import { useTheme } from "../contexts/ThemeContext";

export default function Index() {
  const router = useRouter();
  const { isDark, colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [filterInfo, setFilterInfo] = useState<string>(
    "Menampilkan semua tukang rekomendasi"
  );

  const searchInputRef = useRef<TextInput>(null);

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const matchesCategory =
        selectedCategory === "Semua" || worker.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        query === "" ||
        worker.name.toLowerCase().includes(query) ||
        worker.job.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (selectedCategory === "Semua" && searchQuery.trim() === "") {
      setFilterInfo("Menampilkan semua tukang rekomendasi");
    } else {
      setFilterInfo(
        `Ditemukan ${filteredWorkers.length} tukang (Kategori: ${selectedCategory})`
      );
    }
  }, [selectedCategory, searchQuery, filteredWorkers.length]);

  const handleSelectService = (serviceName: string) => {
    setSelectedCategory((prev) =>
      prev === serviceName ? "Semua" : serviceName
    );
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.locationLabel, { color: colors.muted }]}>
            Lokasi Anda
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color={colors.accent} />

            <Text style={[styles.locationText, { color: colors.text }]}>
              Jakarta Selatan
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={[
              styles.notificationButton,
              {
                backgroundColor: colors.search,
                borderColor: colors.border,
              },
            ]}
            onPress={() => router.push("/settings")}
          >
            <Ionicons
              name={isDark ? "moon" : "sunny-outline"}
              size={21}
              color={colors.accent}
            />
          </Pressable>
        </View>
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.search,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons name="search-outline" size={20} color={colors.muted} />

        <TextInput
          ref={searchInputRef}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Cari layanan atau keahlian..."
          placeholderTextColor={colors.muted}
          style={[styles.searchInput, { color: colors.text }]}
        />

        {searchQuery !== "" && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {/* Services */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Layanan Kami
      </Text>

      <View style={styles.serviceGrid}>
        {services.map((service) => {
          const isSelected = selectedCategory === service.name;
          return (
            <Pressable
              key={service.name}
              style={styles.serviceItem}
              onPress={() => handleSelectService(service.name)}
            >
              <View
                style={[
                  styles.serviceIcon,
                  {
                    backgroundColor: isSelected
                      ? colors.accent
                      : colors.serviceBg,
                  },
                ]}
              >
                <Ionicons
                  name={service.icon}
                  size={28}
                  color={isSelected ? "#FFFFFF" : colors.accent}
                />
              </View>

              <Text
                style={[
                  styles.serviceText,
                  {
                    color: isSelected ? colors.accent : colors.text,
                    fontWeight: isSelected ? "bold" : "normal",
                  },
                ]}
              >
                {service.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Workers */}
      <View style={styles.workerHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Tukang Rekomendasi
        </Text>

        <Pressable
          onPress={() => {
            setSelectedCategory("Semua");
            setSearchQuery("");
          }}
        >
          <Text style={[styles.seeAll, { color: colors.accent }]}>
            Lihat Semua
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.filterInfoText, { color: colors.muted }]}>
        {filterInfo}
      </Text>

      {filteredWorkers.map((worker) => (
        <Pressable
          key={worker.id}
          style={[
            styles.workerCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() =>
            router.push({
              pathname: "/worker/[id]",
              params: { id: worker.id },
            })
          }
        >
          <View
            style={[styles.workerAvatar, { backgroundColor: colors.accent }]}
          >
            <Ionicons name="person" size={28} color="white" />
          </View>

          <View style={styles.workerInfo}>
            <Text style={[styles.workerName, { color: colors.text }]}>
              {worker.name}
            </Text>

            <Text style={[styles.workerJob, { color: colors.muted }]}>
              {worker.job}
            </Text>

            <View style={styles.workerBottom}>
              <View style={styles.rating}>
                <Ionicons name="star" size={15} color={colors.rating} />

                <Text style={[styles.ratingText, { color: colors.muted }]}>
                  {worker.rating}
                </Text>
              </View>

              <Text style={[styles.price, { color: colors.accent }]}>
                {worker.price}
              </Text>
            </View>
          </View>
        </Pressable>
      ))}

      {/* Demo button */}
      <Pressable
        style={[styles.mainButton, { backgroundColor: colors.accent }]}
        onPress={() => {
          if (filteredWorkers.length > 0) {
            router.push({
              pathname: "/worker/[id]",
              params: { id: filteredWorkers[0].id },
            });
          } else {
            searchInputRef.current?.focus();
          }
        }}
      >
        <Ionicons name="search" size={20} color="white" />

        <Text style={styles.mainButtonText}>Cari Tukang</Text>
      </Pressable>

      {/* Link Navigation */}
      <Link
        href="/settings"
        style={[styles.settingsLink, { color: colors.muted }]}
      >
        Buka Pengaturan Tema ({isDark ? "Mode Gelap" : "Mode Terang"})
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  locationLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  locationText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  searchContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 28,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 16,
  },

  serviceGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  serviceItem: {
    alignItems: "center",
    width: "23%",
  },

  serviceIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  serviceText: {
    fontSize: 12,
    textAlign: "center",
  },

  workerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  seeAll: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 16,
  },

  filterInfoText: {
    fontSize: 12,
    marginBottom: 12,
  },

  workerCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },

  workerAvatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  workerInfo: {
    flex: 1,
  },

  workerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },

  workerJob: {
    fontSize: 13,
    marginBottom: 8,
  },

  workerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ratingText: {
    fontSize: 13,
  },

  price: {
    fontSize: 13,
    fontWeight: "bold",
  },

  mainButton: {
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },

  mainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  settingsLink: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
