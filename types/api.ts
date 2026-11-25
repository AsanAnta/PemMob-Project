import { Worker } from "../constants/workers";

export type { Worker };

/**
 * Interface generic untuk response API terstandarisasi
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Interface data statistik operasional tukang
 */
export interface WorkerStatistics {
  jobsCompleted: number;
  responseTimeMinutes: number;
  satisfactionRate: number; // Persentase kepuasan, misal 98%
}

/**
 * Interface untuk data testimoni / ulasan dari External API (DummyJSON Comments)
 * Memenuhi kriteria: "Mengambil data dari External API dan memasukkannya ke dalam Object menggunakan Interface"
 */
export interface ExternalReview {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

/**
 * Interface data gabungan profil tukang, statistik, dan ulasan eksternal
 */
export interface WorkerDetailData {
  worker: Worker;
  statistics: WorkerStatistics;
  reviews: ExternalReview[];
  loadingDurationMs: number;
  fetchMode: "Parallel (Promise.all)" | "Sequential (await satu per satu)";
}
