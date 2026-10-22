import { Ionicons } from "@expo/vector-icons";

export interface Service {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface Worker {
  id: string;
  name: string;
  job: string;
  category: string;
  rating: number;
  price: string;
  experience: string;
  location: string;
  description: string;
}

export const services: Service[] = [
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

export const workers: Worker[] = [
  {
    id: "1",
    name: "Budi Santoso",
    job: "Tukang Listrik",
    category: "Listrik",
    rating: 4.8,
    price: "Rp50.000",
    experience: "5 Tahun",
    location: "Jakarta Selatan",
    description:
      "Ahli instalasi listrik rumah tangga, perbaikan korsleting, pemasangan lampu, dan panel MCB.",
  },
  {
    id: "2",
    name: "Andi Pratama",
    job: "Tukang Bangunan",
    category: "Bangunan",
    rating: 4.7,
    price: "Rp75.000",
    experience: "7 Tahun",
    location: "Jakarta Selatan",
    description:
      "Berpengalaman dalam renovasi rumah, pemasangan keramik, plester dinding, dan perbaikan atap bocor.",
  },
  {
    id: "3",
    name: "Slamet Riyadi",
    job: "Tukang Ledeng",
    category: "Ledeng",
    rating: 4.9,
    price: "Rp60.000",
    experience: "6 Tahun",
    location: "Jakarta Selatan",
    description:
      "Spesialis perbaikan pipa bocor, saluran air mampet, instalasi keran, dan pemasangan pompa air.",
  },
  {
    id: "4",
    name: "Hendra Wijaya",
    job: "Tukang Kayu",
    category: "Kayu",
    rating: 4.6,
    price: "Rp70.000",
    experience: "4 Tahun",
    location: "Jakarta Selatan",
    description:
      "Mengerjakan perbaikan pintu, kusen jendela, pembuatan lemari custom, dan finishing furnitur kayu.",
  },
];
