import { workers, Worker } from "../constants/workers";
import { ExternalReview, WorkerStatistics } from "../types/api";
import { delay } from "../utils/delay";

/**
 * ==============================================================================
 * 1. MOCK DATABASE API DENGAN OBJEK PROMISE & .resolve() / .reject()
 * Memenuhi kriteria: "Menggunakan fungsi .then(), .resolve(), dan .reject()"
 * ==============================================================================
 */
export function fetchWorkerById(id: string): Promise<Worker> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = workers.find((w) => w.id === id);
      if (found) {
        // Operasi berhasil: kirim data melalui resolve()
        resolve(found);
      } else {
        // Operasi gagal: kirim pesan error melalui reject()
        reject(new Error(`Tukang dengan ID "${id}" tidak ditemukan di database server.`));
      }
    }, 600); // Simulasi delay jaringan 600 ms
  });
}

/**
 * ==============================================================================
 * 2. ASYNC FUNCTION DENGAN SIMULASI DELAY (Custom Async Function)
 * Memenuhi kriteria: "Menggunakan Custom & Pre-built Async Function"
 * ==============================================================================
 */
export async function fetchWorkerStatistics(workerId: string): Promise<WorkerStatistics> {
  // Menggunakan helper delay berbasis Promise
  await delay(700);

  const num = parseInt(workerId, 10) || 1;
  return {
    jobsCompleted: 35 + num * 14,
    responseTimeMinutes: Math.max(5, 25 - num * 3),
    satisfactionRate: 95 + (num % 5),
  };
}

/**
 * ==============================================================================
 * 3. REAL EXTERNAL API CALL (HTTP Fetch Request)
 * Memenuhi kriteria: "Mengambil data dari External API dan memasukkannya ke
 * dalam Object menggunakan Interface"
 * ==============================================================================
 */
export async function fetchExternalReviews(limit: number = 3): Promise<ExternalReview[]> {
  try {
    // Memanggil API publik eksternal (DummyJSON Comments Endpoint)
    const response = await fetch(`https://dummyjson.com/comments?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`External API Error: Status HTTP ${response.status}`);
    }

    // Mengurai respons JSON menjadi Object yang sesuai Interface ExternalReview
    const jsonResult = await response.json();
    const reviews: ExternalReview[] = jsonResult.comments;

    return reviews;
  } catch (error) {
    console.warn("Koneksi ke External API publik terkendala. Mengaktifkan fallback lokal:", error);

    // Fallback data simulasi jika di lab praktikum koneksi internet offline/terbatas
    await delay(300);
    return [
      {
        id: 201,
        body: "Kerjanya sangat profesional dan rapi! Datang tepat waktu dan biaya sesuai estimasi.",
        postId: 1,
        user: { id: 81, username: "ahmad_fauzi", fullName: "Ahmad Fauzi" },
      },
      {
        id: 202,
        body: "Peralatan lengkap dan ramah banget saat pengerjaan instalasi. Rekomendasi!",
        postId: 2,
        user: { id: 82, username: "dian_permata", fullName: "Dian Permata" },
      },
      {
        id: 203,
        body: "Sangat puas dengan hasilnya, keluhan pipa bocor langsung tuntas sekali servis.",
        postId: 3,
        user: { id: 83, username: "rizki_pratama", fullName: "Rizki Pratama" },
      },
    ].slice(0, limit);
  }
}

/**
 * ==============================================================================
 * 4. PENGAMBILAN SEMUA DATA TUKANG SECARA ASYNCHRONOUS (Untuk Beranda)
 * ==============================================================================
 */
export async function fetchAllWorkersApi(): Promise<Worker[]> {
  // Mensimulasikan jeda waktu pengambilan seluruh data dari server
  await delay(800);
  return [...workers];
}
