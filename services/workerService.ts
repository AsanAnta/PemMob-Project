import { WorkerDetailData, Worker } from "../types/api";
import {
  fetchExternalReviews,
  fetchWorkerById,
  fetchWorkerStatistics,
} from "./api";

/**
 * ==============================================================================
 * KONSEP 1: SEQUENTIAL REQUEST (Asynchronous Berurutan)
 * Data diambil satu per satu secara berurutan menggunakan await.
 * Total waktu = waktu request 1 + waktu request 2 + waktu request 3.
 * (Lebih lambat karena antre bergantian).
 * ==============================================================================
 */
export async function getWorkerDetailSequential(id: string): Promise<WorkerDetailData> {
  const startTime = Date.now();

  // 1. Ambil data tukang (tunggu selesai dulu)
  const worker = await fetchWorkerById(id);

  // 2. Ambil data statistik (baru jalan setelah langkah 1 selesai)
  const statistics = await fetchWorkerStatistics(id);

  // 3. Ambil ulasan dari External API (baru jalan setelah langkah 2 selesai)
  const reviews = await fetchExternalReviews(2);

  const duration = Date.now() - startTime;

  return {
    worker,
    statistics,
    reviews,
    loadingDurationMs: duration,
    fetchMode: "Sequential (await satu per satu)",
  };
}

/**
 * ==============================================================================
 * KONSEP 2: PARALLEL REQUEST (Promise.all)
 * Mengambil worker profil terlebih dahulu, lalu mengambil statistik dan ulasan
 * secara BERSAMAAN di background melalui Promise.all().
 * Waktu tunggu menjadi jauh lebih singkat!
 * ==============================================================================
 */
export async function getWorkerDetailParallel(id: string): Promise<WorkerDetailData> {
  const startTime = Date.now();

  // Ambil profil dasar tukang
  const worker = await fetchWorkerById(id);

  // Jalankan request statistik dan ulasan external secara paralel/bersamaan
  const [statistics, reviews] = await Promise.all([
    fetchWorkerStatistics(id),
    fetchExternalReviews(2),
  ]);

  const duration = Date.now() - startTime;

  return {
    worker,
    statistics,
    reviews,
    loadingDurationMs: duration,
    fetchMode: "Parallel (Promise.all)",
  };
}

/**
 * ==============================================================================
 * KONSEP 3: PROMISE CHAIN (.then, .catch, .finally)
 * Menerapkan Promise chaining klasik tanpa kata kunci async/await
 * untuk mendemonstrasikan penanganan Promise berantai.
 * ==============================================================================
 */
export function getWorkerWithPromiseChain(
  id: string,
  onSuccess: (worker: Worker) => void,
  onError: (err: Error) => void,
  onFinally?: () => void
): void {
  fetchWorkerById(id)
    .then((worker) => {
      onSuccess(worker);
      return worker;
    })
    .catch((error) => {
      onError(error instanceof Error ? error : new Error(String(error)));
    })
    .finally(() => {
      if (onFinally) {
        onFinally();
      }
    });
}
