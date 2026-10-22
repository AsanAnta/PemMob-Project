import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface Service {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Worker {
  name: string;
  job: string;
  rating: number;
  price: string;
}

const services: Service[] = [
  {
    name: "Listrik",
    icon: "flash-outline",
  },
  {
    name: "Ledeng",
    icon: "water-outline",
  },
  {
    name: "Bangunan",
    icon: "hammer-outline",
  },
  {
    name: "Kayu",
    icon: "construct-outline",
  },
];

const workers: Worker[] = [
  {
    name: "Budi Santoso",
    job: "Tukang Listrik",
    rating: 4.8,
    price: "Rp50.000",
  },
  {
    name: "Andi Pratama",
    job: "Tukang Bangunan",
    rating: 4.7,
    price: "Rp75.000",
  },
];

export default function Index() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.locationLabel}>Lokasi Anda</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#FF5722" />

            <Text style={styles.locationText}>Jakarta Selatan</Text>
          </View>
        </View>

        <Pressable style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={23} color="#222222" />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#777777" />

        <TextInput
          placeholder="Cari layanan atau keahlian..."
          placeholderTextColor="#888888"
          style={styles.searchInput}
        />
      </View>

      {/* Services */}
      <Text style={styles.sectionTitle}>Layanan Kami</Text>

      <View style={styles.serviceGrid}>
        {services.map((service) => (
          <Pressable key={service.name} style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <Ionicons name={service.icon} size={28} color="#FF5722" />
            </View>

            <Text style={styles.serviceText}>{service.name}</Text>
          </Pressable>
        ))}
      </View>

      {/* Workers */}
      <View style={styles.workerHeader}>
        <Text style={styles.sectionTitle}>Tukang Rekomendasi</Text>

        <Pressable>
          <Text style={styles.seeAll}>Lihat Semua</Text>
        </Pressable>
      </View>

      {workers.map((worker) => (
        <Pressable key={worker.name} style={styles.workerCard}>
          <View style={styles.workerAvatar}>
            <Ionicons name="person" size={28} color="white" />
          </View>

          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>{worker.name}</Text>

            <Text style={styles.workerJob}>{worker.job}</Text>

            <View style={styles.workerBottom}>
              <View style={styles.rating}>
                <Ionicons name="star" size={15} color="#F59E0B" />

                <Text style={styles.ratingText}>{worker.rating}</Text>
              </View>

              <Text style={styles.price}>{worker.price}</Text>
            </View>
          </View>
        </Pressable>
      ))}

      {/* Demo button */}
      <Pressable style={styles.mainButton}>
        <Ionicons name="search" size={20} color="white" />

        <Text style={styles.mainButtonText}>Cari Tukang</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  locationLabel: {
    fontSize: 12,
    color: "#777777",
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
    color: "#222222",
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F9FB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  searchContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 15,
    marginBottom: 28,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#222222",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#222222",
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
    backgroundColor: "#FFF3EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  serviceText: {
    fontSize: 12,
    color: "#333333",
    textAlign: "center",
  },

  workerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  seeAll: {
    color: "#FF5722",
    fontWeight: "bold",
    fontSize: 13,
  },

  workerCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },

  workerAvatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#FF5722",
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
    color: "#222222",
    marginBottom: 3,
  },

  workerJob: {
    fontSize: 13,
    color: "#777777",
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
    color: "#555555",
  },

  price: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FF5722",
  },

  mainButton: {
    height: 50,
    backgroundColor: "#FF5722",
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
});
